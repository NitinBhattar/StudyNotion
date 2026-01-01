// Import
const express = require("express");
const router = express.Router();

// Controllers
const {sendotp, signup, login, changePassword} = require("../controllers/Auth.js");
const {resetPasswordToken, resetPassword} = require("../controllers/ResetPassword.js");

// Middleware
const {authMiddleware} = require("../middlewares/AuthMiddleWare.js");

// Authentication
router.post("/sendotp", sendotp);
router.post("/signup", signup);
router.post("/login", login);
router.put("/changepassword", authMiddleware, changePassword);

// Reset Password
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

// Export
module.exports = router
