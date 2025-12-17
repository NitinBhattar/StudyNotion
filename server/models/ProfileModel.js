// Import
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    gender: {
        type: String,
        enum: ["Male", "Female", "Others"]
    },
    dateOfBirth: {
        type: String
    },
    about: {
        type: String,
        trim: true,
        maxLength: 200
    },
    contact: {
        type: Number
    }
});

// Export
module.exports = mongoose.model("ProfileModel", profileSchema);
