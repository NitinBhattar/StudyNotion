// Import
const mongoose = require("mongoose");
const RatingAndReviewModel = require("../models/RatingAndReviewModel.js");
const UserModel = require("../models/UserModel.js");
const CourseModel = require("../models/CourseModel.js");

// Create Rating
const createRating = async (req, res) => {
    try {
        // Fetching data
        const {courseId, rating, review} = req.body;
        const userId = req.user.id;

        // Feild are missing
        if(!courseId || rating === undefined || !review) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Validation
        if(!userId) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "User Id is missing"
            });            
        }

        // Ratings below or above range
        if(rating < 1 || rating > 5) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });              
        }

        // Check if user is enrolled or not
        if( !await CourseModel.exists({_id: courseId, studentsEnrolled: userId}) ) {
            // 403 is Forbidden
            return res.status(403).json({
                success: false,
                message: "You must enroll in the course to review it"
            });              
        }

        // Check id user posted any review eariler
        if( await RatingAndReviewModel.exists({user: userId, course: courseId}) ) {
            // 409 is Conflict
            return res.status(409).json({
                success: false,
                message: "You have already reviewed this course"
            });             
        }

        // Create Rating and Review
        const newRatingAndReview = await RatingAndReviewModel.create({
            user: userId,
            course: courseId,
            rating,
            review
        });

        // MongoDB fail check
        if(!newRatingAndReview) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });            
        }

        // Update in Course
        const updatedCourse = await CourseModel.findByIdAndUpdate(courseId, {$addToSet: {ratingAndReview: newRatingAndReview._id}}, {new: true});

        // MongoDB fail check
        if(!updatedCourse) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });            
        }

        // 201 is success for new resource allocation
        return res.status(201).json({
            success: true,
            message: "Review created successfully"
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Failed to create rating"
        });
    }
};

// Get Average Rating
const getAverageRating = async (req, res) => {
    try {
        // Fetching courseId
        const courseId = req.body.courseId;

        // Validation
        if(!courseId) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "Course Id is missing"
            });            
        }        

        // Calculate average rating, aggregate function returns an array
        const result = await RatingAndReviewModel.aggregate([
            {
                // $match will match courseId
                // mongoose.Types.ObjectId converts string to mongoose object id
                $match: { course: new mongoose.Types.ObjectId(courseId) }
            },
            {   
                // $group will combine all the review corresponding to courseId
                $group: {
                    // all _ids will be clubed due to null
                    _id: null,
                    averageRating: { $avg: "$rating"}
                }
            }
        ]);

        let averageRating = 0;

        // Reviews aren't avaiable
        if(result.length > 0) {
            averageRating = result[0].averageRating;
        }

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "Average rating fetched successfully",
            averageRating
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Failed to fetch average rating"
        });
    }
};

// Get all Reviews for a course
const getCourseReviews = async (req, res) => {
    try {
        // Fetching courseId
        const courseId = req.body.courseId;

        // Validation
        if(!courseId) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "Course Id is missing"
            });            
        }        

        const courseReviews = await RatingAndReviewModel.find({course: courseId})
                                                     .sort({rating: "desc"})
                                                     .populate([
                                                        {
                                                            path: "user",
                                                            select: "firstName lastName imageUrl"
                                                        },
                                                        {
                                                            path: "course",
                                                            select: "courseName"
                                                        }
                                                     ])
                                                     .lean().exec();

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "All reviews for course fetched successfully",
            data: courseReviews
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Failed to fetch all reviews for the course"
        });
    }
};

// Get all Reviews for a course
const getAllReviews = async (req, res) => {
    try {
        const allReviews = await RatingAndReviewModel.find({})
                                                     .sort({rating: -1})
                                                     .populate([
                                                        {
                                                            path: "user",
                                                            select: "firstName lastName imageUrl"
                                                        },
                                                        {
                                                            path: "course",
                                                            select: "courseName"
                                                        }
                                                     ])
                                                     .lean().exec();

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Failed to fetch all reviews"
        });
    }
};

// Export
module.exports = {createRating, getAverageRating, getCourseReviews, getAllReviews};
