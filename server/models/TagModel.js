// Import
const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // Array
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseModel"
        }
    ]
});

// Export
module.exports = mongoose.model("TagModel", tagSchema);
