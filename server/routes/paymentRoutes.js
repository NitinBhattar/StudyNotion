// Import
const express = require("express");
const router = express.Router();

// Controllers
const {
    capturePayment,
    verifyPayment
} = require("../controllers/Payments.js");

// Middleswares
const {
    authMiddleware,
    AuthStudent
} = require("../middlewares/AuthMiddleWare.js");

// Routes
router.post("/capturePayment", authMiddleware, AuthStudent, capturePayment);
// Razorpay webhook, express.json() breaks webhook, and not to use middleware, its from RazorPay's side
router.post(
  "/verifyPayment",
  express.raw({ type: "application/json" }),
  verifyPayment
);

// Export
module.exports = router
