// Import
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
        trim: true
    },
    courseDescription: {
        type: String,
        required: true,
        trim: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true
    },
    whatYouWillLearn: {
        type: String,
        required: true
    },
    // Array
    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SectionModel"
        }
    ],
    // Array
    ratingAndReview: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReviewModel"
        }        
    ],
    price: {
        type: Number,
        required: true
    },
    thumbnailUrl: {
        type: String
    },
    thumbnailId: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CategoryModel"
    },
    // Array
    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserModel"
        }    
    ]
});

// Export
module.exports = mongoose.model("CourseModel", courseSchema);
