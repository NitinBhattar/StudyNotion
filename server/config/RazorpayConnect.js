// Import
const Razorpay = require("razorpay");
require("dotenv").config();

// Logic
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Export
module.exports = instance;
