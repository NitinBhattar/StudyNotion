// Import
const express = require("express");
const router = express.Router();

// Controllers
const {showUserDetails, getEnrolledCourses, instructorDashboard, updateProfile, deleteProfile} = require("../controllers/Profile.js");

// Middleswares
const {authMiddleware, AuthInstructor} = require("../middlewares/AuthMiddleWare.js");

// Routes
router.get("/getUserDetails", authMiddleware, showUserDetails);
router.get("/getEnrolledCourses", authMiddleware, getEnrolledCourses);
router.get("/instructorDashboard", authMiddleware, AuthInstructor, instructorDashboard);
router.put("/updateProfile", authMiddleware, updateProfile);
router.delete("/deleteProfile", authMiddleware, deleteProfile);

// Export
module.exports = router;
