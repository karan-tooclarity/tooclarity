// const { Client } = require('@elastic/elasticsearch');
// const Course = require('../models/Course');
// const ELASTICSEARCH_NODE = process.env.ELASTICSEARCH_NODE;
// console.log(ELASTICSEARCH_NODE);

// const esClient = new Client({
//   node: ELASTICSEARCH_NODE,
//   auth: {
//     apiKey: process.env.ELASTICSEARCH_API_KEY,
//   },
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// const INDEX_NAME = 'courses_index';

// async function initializeElasticsearch() {
//   try {
//     const { acknowledged } = await esClient.indices.exists({ index: INDEX_NAME });
//     if (!acknowledged) {
//       await esClient.indices.create({
//         index: INDEX_NAME,
//         mappings: {
//           properties: {
//             id: { type: 'keyword' },
//             courseName: { type: 'text' },
//             selectBranch: { type: 'text' },
//           },
//         },
//       });
//       console.log(`🆕 Created index: ${INDEX_NAME}`);
//     }

//     const { count } = await esClient.count({ index: INDEX_NAME });
//     if (count > 0) {
//       console.log(`✅ Elasticsearch already contains ${count} documents. Skipping sync.`);
//       return;
//     }

//     const courses = await Course.find({ status: 'Active' }).select('courseName selectBranch');
//     if (!courses.length) {
//       console.log('ℹ️ No active courses found to sync.');
//       return;
//     }

//     const body = courses.flatMap(doc => [
//       { index: { _index: INDEX_NAME, _id: doc._id.toString() } },
//       {
//         id: doc._id.toString(),
//         courseName: doc.courseName || null,
//         selectBranch: doc.selectBranch || null,
//       },
//     ]);

//     const { errors } = await esClient.bulk({ refresh: true, body });

//     if (errors) {
//       console.error('❌ Some errors occurred during initial ES sync.');
//     } else {
//       console.log(`🚀 Indexed ${courses.length} active courses into Elasticsearch`);
//     }

//   } catch (err) {
//     console.error('❌ Error initializing Elasticsearch:', err.message);
//   }
// }

// module.exports = { initializeElasticsearch };


const { Client } = require("@elastic/elasticsearch");
// const { ES_INDEXES } = require("../config/elasticsearch");
const COURSE_MODEL_MAP = require("../utils/CourseMap");
const { Institution } = require("../models/Institution");

const ELASTICSEARCH_NODE = process.env.ELASTICSEARCH_NODE;

const esClient = new Client({
  node: ELASTICSEARCH_NODE,
  auth: process.env.ELASTICSEARCH_API_KEY
    ? { apiKey: process.env.ELASTICSEARCH_API_KEY }
    : undefined,
  ssl: {
    rejectUnauthorized: false,
  },
});

const INDEX_NAME = "courses_index";

function getCourseName(doc) {
  return (
    doc.courseName ||
    doc.intermediateName ||
    doc.schoolName ||
    doc.consultancyName ||
    doc.tutionCenterName ||
    null
  );
}

function getCourseImage(doc) {
  return (
    doc.imageUrl ||
    doc.centerImageUrl ||
    doc.schoolImageUrl ||
    doc.kindergartenImageUrl ||
    null
  );
}

async function initializeElasticsearch() {
  try {
    const exists = await esClient.indices.exists({ index: INDEX_NAME });

    if (!exists) {
      await esClient.indices.create({
        index: INDEX_NAME,
        mappings: {
          properties: {
            id: { type: "keyword" },
            name: { type: "text" },
            courseName: { type: "text" },
            selectBranch: { type: "text" },
            instituteName: { type: "text" },
            institutionId: { type: "keyword" },
            priceOfCourse: { type: "float" },
            courseDuration: { type: "keyword" },
            imageUrl: { type: "keyword", index: false },
            modelType: { type: "keyword" },
            searchText: { type: "text" },
          },
        },
      });

      console.log(`🆕 Created index: ${INDEX_NAME}`);
    }

    const { count } = await esClient.count({ index: INDEX_NAME });

    if (count > 0) {
      console.log(
        `✅ Elasticsearch already contains ${count} documents. Skipping sync.`
      );
      return;
    }

    let allCourses = [];

    // Fetch from all models
    for (const [type, Model] of Object.entries(COURSE_MODEL_MAP)) {
      const courses = await Model.find({ status: "Active" }).lean();

      const coursesWithType = courses.map((course) => ({
        ...course,
        modelType: type,
      }));

      allCourses.push(...coursesWithType);
    }

    if (!allCourses.length) {
      console.log("ℹ️ No active courses found to sync.");
      return;
    }

    // Fetch institutions
    const institutionIds = [
      ...new Set(allCourses.map((c) => c.institution?.toString())),
    ];

    const institutions = await Institution.find({
      _id: { $in: institutionIds },
    }).lean();

    const institutionMap = {};
    institutions.forEach((inst) => {
      institutionMap[inst._id.toString()] = inst;
    });

    const body = allCourses.flatMap((doc) => {
      const institution = institutionMap[doc.institution?.toString()];

      const name = getCourseName(doc);
      const image = getCourseImage(doc);

      return [
        {
          index: {
            _index: INDEX_NAME,
            _id: doc._id.toString(),
          },
        },
        {
          id: doc._id.toString(),
          name,
          modelType: doc.modelType,

          courseName: doc.courseName || null,
          selectBranch: doc.selectBranch || null,
          priceOfCourse: doc.priceOfCourse || null,
          courseDuration: doc.courseDuration || null,
          imageUrl: image,

          institutionId: institution?._id?.toString() || null,
          instituteName: institution?.instituteName || null,
          instituteLogo: institution?.logoUrl || null,
          locationURL: institution?.locationURL || null,

          searchText: [
            name,
            doc.selectBranch,
            institution?.instituteName,
          ]
            .filter(Boolean)
            .join(" "),
        },
      ];
    });

    const { errors } = await esClient.bulk({
      refresh: true,
      body,
    });

    if (errors) {
      console.error("❌ Some errors occurred during ES sync.");
    } else {
      console.log(
        `🚀 Indexed ${allCourses.length} courses from ${Object.keys(
          COURSE_MODEL_MAP
        ).length} models`
      );
    }
  } catch (err) {
    console.error("❌ Error initializing Elasticsearch:", err.message);
  }
}

module.exports = { initializeElasticsearch };