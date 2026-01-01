// Import
const CourseModel = require("../models/CourseModel.js");
const CategoryModel = require("../models/CategoryModel.js");
const UserModel = require("../models/UserModel.js");
const sectionDeleteById = require("../services/sectionDeleteById.js")
const cloudinaryUploader = require("../utils/cloudinaryUploader.js");
require("dotenv").config();

// Create Course
const createCourse = async (req, res) => {
    try {
        // Fetching data & files
        const { 
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            category,
            tags
            } = req.body;

        const thumbnail = req?.files?.thumbnailImage;

        // Fields are missing
        if(!courseName || !courseDescription || !whatYouWillLearn || price === undefined || !category || !thumbnail) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Valid Instructor
        const userId = req.user.id;
        const userDetails = await UserModel.findById(userId);

        if(!userDetails) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "Instructor not found"
            });
        }

        if(userDetails.accountType !== "Instructor") {
            // 403 is Forbidden
            return res.status(403).json({
                success: false,
                message: "Only Instructors can create course"
            });
        }

        // Valid Category, Category is an id
        const categoryDetails = await CategoryModel.findById(category);

        if(!categoryDetails) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });            
        }

        // Uplaod image to Cloudinary
        const thumbnailDetails = await cloudinaryUploader(thumbnail, process.env.CLOUDINARY_COURSE_THUMBNAIL_FOLDER, 80);

        // Create course entry in DB
        const newCourse = await CourseModel.create(
            {
                courseName,
                courseDescription,
                instructor: userId,
                whatYouWillLearn,
                price: Number(price),
                thumbnailUrl: thumbnailDetails.secure_url,
                thumbnailId: thumbnailDetails.public_id,
                category,
                tags
            }
        );

        // Create course entry in category as well, $push / $addToSet(no duplicacy) and $pull for array in MongoDB
        const updatedCategory = await CategoryModel.findByIdAndUpdate(category, {$addToSet : {courses: newCourse._id}}, {new: true});

        // MongoDB fail check
        if(!updatedCategory) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Create course entry in instructor as well
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {$push : {courses: newCourse._id}}, {new: true});

        // MongoDB fail check
        if(!updatedUser) {
            // 404 is Not fFund
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // 201 is success for new resource allocation
        return res.status(201).json({
            success: true,
            message: "New course created successfully",
            data: newCourse
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating course"
        });
    }
};

// Get Course Details
const getCourseDetails = async (req, res) => {
    try {
        // Fetching data
        const {courseId} = req.body;

        // Vaildation
        if(!courseId) {
            // 400 is Bad request
            return res.status(400).json({
                success: false,
                message: "Course Id is missing"
            });
        }

        const courseDetails = await CourseModel.findById(courseId)
                                                .populate([
                                                    {
                                                        path: "instructor",
                                                        select : "firstName lastName additionalDetails imageUrl",
                                                        populate: {
                                                            path: "additionalDetails"
                                                        }
                                                    },
                                                    {
                                                        path: "category"
                                                    },
                                                    {
                                                        path: "courseContent",
                                                        populate: {
                                                            path: "subSections"
                                                        }                                                        
                                                    },
                                                    {
                                                        path: "ratingAndReview"
                                                    }
                                                ]).lean().exec();

        // MongoDB fail check
        if(!courseDetails) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });            
        }

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "Course fetched successfully",
            data: courseDetails
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching course"
        });        
    }
};

// Get all courses
const getAllCourses = async (req, res) => {
    try {
        // Fetching data, getting only selected data i.e marked true
        // Instructor's only firstName and lastName will be taken not all details including password
        const allCourses = await CourseModel.find({}, {
                                                        courseName: true,
                                                        instructor: true,
                                                        ratingAndReview: true,
                                                        price: true,
                                                        thumbnailUrl: true,
                                                        studentsEnrolled: true
                                                      })
                                                      .populate("instructor", "firstName lastName")
                                                      .lean().exec();

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "All courses fetched successfully",
            data: allCourses
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching courses"
        });
    }
};

// Delete Course
const deleteCourse = async (req, res) => {
    try {
        // Fetch Data
        const {courseId} = req.body;

        // Validation
        if(!courseId) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "Course Id is missing"
            });
        }

        // Fetching Details
        const courseDetails = await CourseModel.findById(courseId);

        // MongoDB fail check
        if(!courseDetails) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Deleting all Sections, Promise will throw error in catch
        await Promise.all(
            courseDetails.courseContent.map(sectionId =>
                sectionDeleteById(sectionId)
            )
        );

        // Remove from Instructor
        const instructorDetails = await UserModel.findByIdAndUpdate(courseDetails.instructor, {$pull: {courses: courseId}}, {new: true});

        // MongoDB fail check
        if(!instructorDetails) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "Instructor not found"
            });
        }

        // Delete Course
        await CourseModel.findByIdAndDelete(courseId);

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting course"
        });        
    }
};

// Export
module.exports = {createCourse, getCourseDetails, getAllCourses, deleteCourse};
