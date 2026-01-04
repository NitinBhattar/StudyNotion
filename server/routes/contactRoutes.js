// Import
const express = require("express");
const router = express.Router();

// Controllers
const contactUsController = require("../controllers/ContactUs.js");

// Route
router.post("/contact", contactUsController);

// Export
module.exports = router;
