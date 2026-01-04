// Import
const express = require("express");
const router = express.Router();

// Controllers
const {updateProfile, deleteProfile, showUserDetails} = require("../controllers/Profile.js");

// Middleswares
const {authMiddleware, AuthInstructor} = require("../middlewares/AuthMiddleWare.js");

// Routes
router.get("/getUserDetails", authMiddleware, showUserDetails);
router.put("/updateProfile", authMiddleware, updateProfile);
router.delete("/deleteProfile", authMiddleware, deleteProfile);

// Export
module.exports = router;
