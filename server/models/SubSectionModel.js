// Import
const mongoose = require("mongoose");

const subSectionSchema = new mongoose.Schema({
    title: {
        type: String
    },
    timeDuration: {
        type: String
    },
    description: {
        type: String
    },
    videoUrl: {
        type: String
    },
    // Cloudinary public_id
    videoId: {
        type: String
    }
});

// Export
module.exports = mongoose.model("SubSectionModel", subSectionSchema);
