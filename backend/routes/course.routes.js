const express = require('express');
const courseController = require('../controllers/course.controller');
const { validateCourseCreation, validateCourseUpdate } = require('../middleware/validators');
const { uploadCourseFiles } = require('../middleware/fileUpload.middleware'); 

const router = express.Router({ mergeParams: true });

router.route('/')
    .post(
        uploadCourseFiles, // 1. Handle file uploads first
        // validateCourseCreation, // 2. Then validate the rest of the body
        courseController.createCourse
    )
    .get(courseController.getAllCoursesForInstitution);

router.route('/:courseId')
    .get(courseController.getCourseById)
    .put(
        uploadCourseFiles,
        validateCourseUpdate,
        courseController.updateCourse
    )
    .delete(courseController.deleteCourse);

// Unified metric increment (views | comparisons)
router.post('/:courseId/metrics', courseController.incrementMetricUnified);

// InstitutionAdmin-level course metrics
router.get('/summary/metrics/institution-admin', courseController.getInstitutionAdminMetricSummaryUnified);
router.get('/summary/metrics/institution-admin/range', courseController.getInstitutionAdminMetricByRangeUnified);
router.get('/summary/metrics/institution-admin/series', courseController.getInstitutionAdminMetricSeriesUnified);

// router.post('/:courseId/request-call', courseController.requestCallBack);

module.exports = router;