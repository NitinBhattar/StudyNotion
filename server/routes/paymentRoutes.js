// Import
const express = require("express");
const router = express.Router();

// Controllers
const {
    capturePayment,
    verifyPayment,
    sendPaymentSuccessEmail
} = require("../controllers/Payments.js");

// Middleswares
const {
    authMiddleware,
    AuthStudent
} = require("../middlewares/AuthMiddleWare.js");

// Routes
router.post("/capturePayment", authMiddleware, AuthStudent, capturePayment);
router.post("/verifyPayment", authMiddleware, AuthStudent, verifyPayment);
router.post("/sendPaymentSuccessEmail", authMiddleware, AuthStudent, sendPaymentSuccessEmail);

// Export
module.exports = router;
