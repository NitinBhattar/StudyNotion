// Import
const mongoose = require("mongoose");

const courseProgressSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseModel"
    },
    // Array
    completedVideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSectionModel"
        }
    ]
});

// Export
module.exports = mongoose.model("CourseProgressModel", courseProgressSchema);
