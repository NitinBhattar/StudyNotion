// Import
const CourseModel = require("../models/CourseModel.js");
const TagModel = require("../models/TagModel.js");
const UserModel = require("../models/UserModel.js");
const imageUploader = require("../utils/imageUploader.js");
require("dotenv").config();

// Create Course
const createCourse = async (req, res) => {
    try {
        // Fetching data
        const { 
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag
            } = req.body;

        const thumbnail = req?.files?.thumbnailImage;

        // Fields are missing
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail) {
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

        // Valid Tag, tag is an id
        const tagDetails = await TagModel.findById(tag);

        if(!tagDetails) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "Tag not found"
            });            
        }

        // Uplaod image to Cloudinary
        const thumbnailDetails = await imageUploader(thumbnail, process.env.CLOUDINARY_COURSE_THUMBNAIL_FOLDER, 80);

        // Create course entry in DB
        const newCourse = await CourseModel.create(
            {
                courseName,
                courseDescription,
                instructor: userId,
                whatYouWillLearn,
                price: Number(price),
                thumbnailUrl: thumbnailDetails.secure_url,
                tag
            }
        );

        // Create course entry in tag as well, $push / $addToSet(no duplicacy) and $pull for array in MongoDB
        const updatedTag = await TagModel.findByIdAndUpdate(tag, {$addToSet : {courses: newCourse._id}}, {new: true});

        // Create course entry in instructor as well
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {$addToSet : {courses: newCourse._id}}, {new: true});

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

// Show all courses
const showAllCourses = async (req, res) => {
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
                                                      }).populate("instructor", "firstName lastName")
                                                        .exec();

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

// Export
module.exports = {createCourse, showAllCourses};
