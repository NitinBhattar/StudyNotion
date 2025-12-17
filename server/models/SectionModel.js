// Import
const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
    sectionName: {
        type: String,
        required: true,
        trim: true
    },
    // Array
    subSections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSectionModel"
        }
    ]
});

// Export
module.exports = mongoose.model("SectionModel", sectionSchema);
