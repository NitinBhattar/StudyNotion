// Import
const express = require("express");
const router = express.Router();

// Controllers
// Course
const {
    createCourse,
    getCourseDetails,
    getAllCourses,
    deleteCourse
} = require("../controllers/Course.js");

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
    getCourseReviews,
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
// Get details for a specific course
router.get("/getCourseDetails", getCourseDetails);
// Get all registered courses
router.get("/getAllCourses", getAllCourses);
// Delete a Course
router.delete("/deleteCourse", authMiddleware, AuthInstructor,  deleteCourse);

// Section
// Add a section to a course
router.post("/addSection", authMiddleware, AuthInstructor, createSection);
// Update a section to a course
router.put("/updateSection", authMiddleware, AuthInstructor, updateSection);
// Delete a section to a course
router.delete("/deleteSection", authMiddleware, AuthInstructor, deleteSection);

// Subsection
// Add a subsection to a Section
router.post("/addSubSection", authMiddleware, AuthInstructor, createSubSection);
// Edit subsection to a Section
router.put("/updateSubSection", authMiddleware, AuthInstructor, updateSubSection);
// Delete subsection to a Section
router.delete("/deleteSubSection", authMiddleware, AuthInstructor, deleteSubSection);

// Rating and Review
router.post("/createRating", authMiddleware, AuthStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getCourseReviews", getCourseReviews);
router.get("/getAllReviews", getAllReviews);

// Categories
// Only For Admins
router.post("/createCategory", authMiddleware, AuthAdmin, createCategory);
router.get("/getCategoryPageDetails", categoryPageDetails);
router.get("/showAllCategories", showAllCategories);

// Export
module.exports = router
