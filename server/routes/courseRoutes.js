// Import
const express = require("express");
const router = express.Router();

// Controllers
// Course
const {
    createCourse,
    editCourse,
    getCourseDetails,
    getFullCourseDetails,
    getInstructorCourses,
    getAllCourses,
    deleteCourse
} = require("../controllers/Course.js");

// Course Progress
const updateCourseProgress = require("../controllers/CourseProgress.js")

// Category
const {
    createCategory,
    categoryPageDetails,
    showAllCategories
} = require("../controllers/Category.js");

// Section
const {
    createSection,
    updateSection,
    deleteSection
} = require("../controllers/Section.js");

// Subsection
const {
    createSubSection,
    updateSubSection,
    deleteSubSection
} = require("../controllers/SubSection.js");

// Rating
const {
    createRating,
    getAverageRating,
    getAllReviews
} = require("../controllers/RatingAndReview.js");

// Middleswares
const {
    authMiddleware,
    AuthStudent,
    AuthInstructor,
    AuthAdmin
} = require("../middlewares/AuthMiddleWare.js");

// Course
// Create a course
router.post("/createCourse", authMiddleware, AuthInstructor, createCourse);
// Edit a course
router.put("/editCourse", authMiddleware, AuthInstructor, editCourse);
// Get details for a specific course
router.post("/getCourseDetails", getCourseDetails);
// Get details for a course for an enrolled student
router.post("/getFullCourseDetails", authMiddleware, getFullCourseDetails);
// Get all courses under a apecific instructor
router.get("/getInstructorCourses", authMiddleware, AuthInstructor, getInstructorCourses);
// Get all registered courses
router.get("/getAllCourses", getAllCourses);
// To update course progress of a course for an enrolled student
router.put("/updateCourseProgress", authMiddleware, AuthStudent, updateCourseProgress);
// Delete a Course
router.delete("/deleteCourse", authMiddleware, AuthInstructor,  deleteCourse);

// Section
// Add a section to a course
router.post("/addSection", authMiddleware, AuthInstructor, createSection);
// Update a section to a course
router.put("/updateSection", authMiddleware, AuthInstructor, updateSection);
// Delete a section to a course
router.post("/deleteSection", authMiddleware, AuthInstructor, deleteSection);

// Subsection
// Add a subsection to a Section
router.post("/addSubSection", authMiddleware, AuthInstructor, createSubSection);
// Edit subsection to a Section
router.put("/updateSubSection", authMiddleware, AuthInstructor, updateSubSection);
// Delete subsection to a Section
router.post("/deleteSubSection", authMiddleware, AuthInstructor, deleteSubSection);

// Rating and Review
router.post("/createRating", authMiddleware, AuthStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllReviews);

// Categories
// Only For Admins
router.post("/createCategory", authMiddleware, AuthAdmin, createCategory);
router.post("/getCategoryPageDetails", categoryPageDetails);
router.get("/showAllCategories", showAllCategories);

// Export
module.exports = router;
