// Import
const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender.js");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60
    }
});

// Sends verification mail
async function sendVerificationMail(email, otp) {
    try {
        const mailResponse = await mailSender(email, "Verification mail from StudyNotion", otp);

        // Cleanup
        console.log("Email sent successfully: ", mailResponse);
    }
    catch(error) {
        console.error("Error occured while sending mail: ", error);
        throw error;
    }
}

// Pre-Middleware, ES6 functions cant use this. keyword
otpSchema.pre("Save", async function(next) {
    await sendVerificationMail(this.email, this.otp);
    next();
});

// Export
module.exports = mongoose.model("OtpModel", otpSchema);
