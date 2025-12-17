// Import
const mongoose = require("mongoose");

// Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    accountType: {
        type: String,
        enum: ["Admin", "Instructor", "Student"],
        default: "Student",
        required: true
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "ProfileModel"
    },
    imageUrl: {
        type: String
    },
    resetPassToken: {
        type: String
    },
    resetPassTokenExp: {
        type: Date
    },
    // Array
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseModel"
        }
    ],
    // Array
    courseProgress: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseProgressModel"            
        }
    ]
});

// Export
module.exports = mongoose.model("UserModel", userSchema);
