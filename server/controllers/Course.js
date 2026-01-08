// Import
const CourseModel = require("../models/CourseModel.js");
const CategoryModel = require("../models/CategoryModel.js");
const UserModel = require("../models/UserModel.js");
const CourseProgress = require("../models/CourseProgressModel.js");
const sectionDeleteById = require("../services/sectionDeleteById.js");
const cloudinaryUploader = require("../utils/cloudinaryUploader.js");
const cloudinaryRemover = require("../utils/cloudinaryRemover.js");
const convertSecondsToDuration = require("../utils/secToDuration")
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
            status,
            tags: _tag,
            instructions: _instructions
        } = req.body;

        const thumbnail = req?.files?.thumbnailImage;

        // Convert the tag and instructions from stringified Array to Array
        const tags = JSON.parse(_tag);
        const instructions = JSON.parse(_instructions);

        // Fields are missing
        if(!courseName || !courseDescription || !whatYouWillLearn || price === undefined || !category || !tags.length || !instructions.length || !thumbnail) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // If no status is available mark it as draft
        if (!status || status === undefined) {
            status = "Draft";
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
                tags,
                instructions,
                status: status
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
            course: newCourse
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

// Edit Course
const editCourse = async (req, res) => {
    try {
        // Fetching data
        const userId = req.user.id;
        const {courseId} = req.body;
        const updates = req.body;

        // Fields are missing
        if(!courseId) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "Course Id is missing"
            });
        }

        // Validation
        const courseDetails = await CourseModel.findById(courseId);

        if(!courseDetails) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });            
        }

        // Instructor Validation
        if(userId !== courseDetails.instructor.toString()) {
            // 403 is Forbidden
            return res.status(403).json({
                success: false,
                message: "Update course task forbidden, only for valid instructor"
            });             
        }

        // If Thumbnail Image is found, update it
        if (req?.files?.thumbnailImage) {
            const thumbnail = req.files.thumbnailImage;

            // Remove old thumbnail
            if(courseDetails.thumbnailId) {
                await cloudinaryRemover(courseDetails.thumbnailId, "image");
            }
            
            // Uplaod new thumbnail to Cloudinary
            const thumbnailDetails = await cloudinaryUploader(thumbnail, process.env.CLOUDINARY_COURSE_THUMBNAIL_FOLDER, 80);
            courseDetails.thumbnailUrl = thumbnailDetails.secure_url;
            courseDetails.thumbnailId = thumbnailDetails.public_id;
        }

        // Update only the fields that are present in the request body, check for allowed fields as well
        const allowedFields = [
            "courseName",
            "courseDescription",
            "whatYouWillLearn",
            "price",
            "tags",
            "instructions",
            "category",
            "status"
        ];

        for (const key of allowedFields) {
            if (updates[key] !== undefined) {
                if (key === "tags" || key === "instructions") {
                    courseDetails[key] = Array.isArray(updates[key]) ? updates[key] : JSON.parse(updates[key]);
                }
                else {
                    courseDetails[key] = updates[key];
                }
            }
        }

        // Save in DB
        await courseDetails.save();

        const updatedCourse = await CourseModel.findById(courseId).populate([
                                                                        {
                                                                            path: "instructor",
                                                                            populate: {
                                                                                path: "additionalDetails",
                                                                            }
                                                                        },
                                                                        {
                                                                            path: "category"
                                                                        },
                                                                        {
                                                                            path: "ratingAndReview"
                                                                        },
                                                                        {
                                                                            path: "courseContent",
                                                                            populate: {
                                                                                path: "subSections",
                                                                            }
                                                                        }
                                                                  ])
                                                                  .lean().exec();

        // MongoDB Fail Check
        if(!updatedCourse) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "Updated course not found"
            });            
        }

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course: updatedCourse
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Something went wrong while editing course"
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
                                                            path: "subSections",
                                                            select: "-videoUrl -videoId"
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

        let totalDurationInSeconds = 0;

        for (const content of courseDetails.courseContent) {
            for (const subSection of content.subSections) {
                // 10 for radix issue in JS
                totalDurationInSeconds += Number(subSection.timeDuration) || 0;
            }
        }

        courseDetails.totalDuration = convertSecondsToDuration(totalDurationInSeconds);

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "Course fetched successfully",
            course: courseDetails
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

// Get full course details
const getFullCourseDetails = async (req, res) => {
    try {
        // Fetching data
        const {courseId} = req.body;
        const userId = req.user.id;

        // Validation
        if(!courseId) {
            // 400 is Bad request
            return res.status(400).json({
                success: false,
                message: "Course Id is missing"
            });
        }

        // Get course details
        const courseDetails = await CourseModel.findById(courseId).populate([
                                                                        {
                                                                            path: "instructor",
                                                                            populate: {
                                                                                path: "additionalDetails",
                                                                            }
                                                                        },
                                                                        {
                                                                            path: "category"
                                                                        },
                                                                        {
                                                                            path: "ratingAndReview"
                                                                        },
                                                                        {
                                                                            path: "courseContent",
                                                                            populate: {
                                                                                path: "subSections",
                                                                            }
                                                                        }
                                                                  ])
                                                                  .lean().exec();

        // MongoDB fail check
        if (!courseDetails) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // No need for Mongo fail check, initially CoureProgress would be zero
        const courseProgressCount = await CourseProgress.findOne({courseId: courseId, userId: userId});
        const completedVideos = courseProgressCount?.completedVideos ? courseProgressCount.completedVideos : [];

        // Count seconds
        let totalDurationInSeconds = 0;

        for(const section of courseDetails.courseContent) {
            for(const subSection of section.subSections) {
                totalDurationInSeconds += Number(subSection.timeDuration) || 0;
            }
        }

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "Fetched all course details successfully",
            data: {
                course: courseDetails,
                totalDuration,
                completedVideos
            }
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching course details"
        });
    }
};

// Get a list of Course for a given Instructor
const getInstructorCourses = async (req, res) => {
    try {
        // Fetching data
        const instructorId = req.user.id;

        // Find all courses belonging to the instructor
        const instructorCourses = await CourseModel.find({instructor: instructorId}).sort({ createdAt: -1 }).populate([
                                                                                                                    {
                                                                                                                        path: "instructor",
                                                                                                                        populate: {
                                                                                                                            path: "additionalDetails",
                                                                                                                        }
                                                                                                                    },
                                                                                                                    {
                                                                                                                        path: "category"
                                                                                                                    },
                                                                                                                    {
                                                                                                                        path: "ratingAndReview"
                                                                                                                    },
                                                                                                                    {
                                                                                                                        path: "courseContent",
                                                                                                                        populate: {
                                                                                                                            path: "subSections",
                                                                                                                        }
                                                                                                                    }
                                                                                                            ])
                                                                                                            .lean().exec();


        for(const courseDetails of instructorCourses) {
            let totalDurationInSeconds = 0;

            for (const content of courseDetails.courseContent) {
                for (const subSection of content.subSections) {
                    // 10 for radix issue in JS
                    totalDurationInSeconds += Number(subSection.timeDuration) || 0;
                }
            }

            courseDetails.totalDuration = convertSecondsToDuration(totalDurationInSeconds);
        }

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "All courses by the Instructor fetched successfully",
            courses: instructorCourses
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching Instructor's courses"
        });
    }
};

// Get all courses
const getAllCourses = async (req, res) => {
    try {
        // Fetching data, getting only selected data i.e marked true
        // Instructor's only firstName and lastName will be taken not all details including password
        const allCourses = await CourseModel.find({status: "Published" }, {
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
            allCourses
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
module.exports = {createCourse, editCourse, getCourseDetails, getFullCourseDetails, getInstructorCourses, getAllCourses, deleteCourse};
