const { Client } = require("@elastic/elasticsearch");

class ElasticsearchService {
  constructor() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
    });

    this.index = "courses_index";
  }

  // choose correct course name
  getCourseName(doc) {
    return (
      doc.courseName ||
      doc.intermediateName ||
      doc.schoolName ||
      doc.consultancyName ||
      doc.tutionCenterName ||
      null
    );
  }

  // choose correct image
  getCourseImage(doc) {
    return (
      doc.imageUrl ||
      doc.schoolImageUrl ||
      doc.kindergartenImageUrl ||
      null
    );
  }

  // prepare ES document
  prepareDocument(doc, institution = null) {
    const name = this.getCourseName(doc);
    const image = this.getCourseImage(doc);

    return {
      id: doc._id.toString(),
      name,
      courseId: doc._id.toString(),

      priceOfCourse: doc.priceOfCourse || null,
      imageUrl: image,

      selectBranch: doc.selectBranch || null,

      // institution info
      institutionId: institution?._id?.toString() || doc.institution,
      instituteName: institution?.instituteName || null,
      instituteLogo: institution?.logoUrl || null,
      locationURL: institution?.locationURL || null,

      // searchable fields
      courseName: doc.courseName || null,
      intermediateName: doc.intermediateName || null,
      schoolName: doc.schoolName || null,
      consultancyName: doc.consultancyName || null,
      tutionCenterName: doc.tutionCenterName || null,

      searchText: [
        doc.courseName,
        doc.intermediateName,
        doc.schoolName,
        doc.consultancyName,
        doc.tutionCenterName,
        doc.selectBranch,
        institution?.instituteName,
      ]
        .filter(Boolean)
        .join(" "),

      status: doc.status,
      state: doc.state,
      district: doc.district,
      town: doc.town,
    };
  }

  // index or update
  async indexCourse(doc, institution = null) {
    if (doc.status !== "Active") {
      return this.removeCourse(doc._id);
    }

    const document = this.prepareDocument(doc, institution);

    await this.client.index({
      index: this.index,
      id: doc._id.toString(),
      document,
    });
  }

  // remove course
  async removeCourse(id) {
    try {
      await this.client.delete({
        index: this.index,
        id: id.toString(),
      });
    } catch (err) {}
  }

  // search
  async searchCourses(query, from, size) {
    const esQuery = query
      ? {
          multi_match: {
            query,
            fields: [
              "name^4",
              "courseName^3",
              "intermediateName^3",
              "schoolName^3",
              "consultancyName^3",
              "tutionCenterName^3",
              "selectBranch^2",
              "instituteName^2",
              "searchText",
            ],
            fuzziness: "AUTO",
          },
        }
      : { match_all: {} };

    return this.client.search({
      index: this.index,
      from,
      size,
      query: esQuery,
    });
  }
}

module.exports = new ElasticsearchService();