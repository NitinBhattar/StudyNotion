// Import
const UserModel = require("../models/UserModel.js");
const ProfileModel = require("../models/ProfileModel.js");
const CourseModel = require("../models/CourseModel.js");
const CourseProgressModel = require("../models/CourseProgressModel.js");
const cloudinaryUploader = require("../utils/cloudinaryUploader.js");
const cloudinaryRemover = require("../utils/cloudinaryRemover.js");
const courseDeleteById = require("../services/courseDeleteById.js");
const convertSecondsToDuration = require("../utils/secToDuration.js");
require("dotenv").config();

// Get user details
const showUserDetails = async (req, res) => {
    try {
        // Fetching data
        const userId = req.user.id;

        // Failed fetching user
        if(!userId) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "User Id is missing"
            });
        }

        // Fetching user details, without password
        const userDetails = await UserModel.findById(userId).select("-password").populate("additionalDetails").lean().exec();

        // User details not found
        if(!userDetails) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            user: userDetails
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching profiles"
        });        
    }
};

// Get enrolled courses and progress of a student
const getEnrolledCourses = async (req, res) => {
    try {
        // Fetching data
        const userId = req.user.id;

        // Fetch user details
        const userDetails = await UserModel.findById(userId).populate({
                                                                        path: "courses",
                                                                        populate: {
                                                                            path: "courseContent",
                                                                            populate: {
                                                                                path: "subSections"
                                                                            }
                                                                        }
                                                                    })
                                                                    .lean().exec();
        
        // MongoDB fail check
        if (!userDetails) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        for (const course of userDetails.courses) {
            let totalDurationInSeconds = 0;
            let subSectionLength = 0;

            for (const section of course.courseContent) {
                // Total duration, reduce((accumulator, currentItem) => {}, initialValue)
                totalDurationInSeconds += section.subSections.reduce(
                    (sum, sub) => sum + Number(sub.timeDuration || 0), 0);

                // Total subsections
                subSectionLength += section.subSections.length;
            }

            // Add new field
            course.totalDuration = convertSecondsToDuration(totalDurationInSeconds);

            // Fetch progress and calculate percentage accordingly
            const courseProgress = await CourseProgressModel.findOne({courseId: course._id, userId: userId});
            const completedCount = courseProgress?.completedVideos?.length || 0;

            // Calculate percentage completed
            course.progressPercentage = subSectionLength === 0 ? 100 : Math.round((completedCount / subSectionLength) * 10000) / 100;
        }


        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "Enrolled courses by student fetched successfully",
            courses: userDetails.courses
        });
    } 
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching enrolled courses for student"
        });
    }
};

// Instructor Dashboard
const instructorDashboard = async (req, res) => {
    try {
        // Fetching data
        const instructorId = req.user.id;

        // Fetch all courses by instructor
        const courseDetails = await CourseModel.find({instructor: instructorId});

        // Add additional details
        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnrolled?.length || 0;
            const totalAmountGenerated = totalStudentsEnrolled * course.price;

            // Create a new object with the additional fields
            const courseDataWithStats = {
                id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                // Include other course properties as needed
                totalStudentsEnrolled,
                totalAmountGenerated
            };

            return courseDataWithStats;
        });

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "Courses for Instructor's dashboard fetched successfully",
            courses: courseData 
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Something went wrong while getting details for Instructor" 
        });
    }
};

// Update Profile
const updateProfile = async (req, res) => {
    try {
        // Fetching data
        // || {} prevents destructuring errors when req.body is undefined
        const {dateOfBirth, about, gender, contact} = req.body || {};
        const pfp = req?.files?.profileImage;
        const userId = req.user.id;

        // Fields are missing
        if(!dateOfBirth && !about && !gender && !contact && !pfp) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "At least one field is required"
            });
        }

        // Failed fetching user
        if(!userId) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "User Id is missing"
            });
        }

        // Fetching user details
        const userDetails = await UserModel.findById(userId);

        // User details not found
        if(!userDetails) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Fetching profile details
        const profileDetails = await ProfileModel.findById(userDetails.additionalDetails);

        // MongoDB fail check
        if(!profileDetails) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        // Field by field update
        if(dateOfBirth) {
            profileDetails.dateOfBirth = dateOfBirth;
        }
        if(about) {
            profileDetails.about = about;
        }
        if(gender) {
            profileDetails.gender = gender;
        }
        if(contact) {
            profileDetails.contact = contact;
        }
        if(pfp) {
            // Remove old pfp
            if(userDetails.imageId) {
                await cloudinaryRemover(userDetails.imageId, "image");
            }
            
            // Uplaod new pfp to Cloudinary
            const pfpDetails = await cloudinaryUploader(pfp, process.env.CLOUDINARY_USER_PROFILE, 80);
            userDetails.imageUrl = pfpDetails.secure_url;
            userDetails.imageId = pfpDetails.public_id;

            // Save in DB
            await userDetails.save();
        }

        // Save in DB
        await profileDetails.save();

        // Fetching user details, without password
        const updatedUser = await UserModel.findById(userId).select("-password").populate({path: "additionalDetails"}).lean().exec();

        // MongoDB fail check
        if(!updatedUser) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Failed updating profile"
        });
    }
};

// Delete Profile
const deleteProfile = async (req, res) => {
    try {
        // Fetching data
        const userId = req.user.id;

        // Failed fetching user
        if(!userId) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "User Id is missing"
            });
        }

        // Fetching user details
        const userDetails = await UserModel.findById(userId);

        // User details not found
        if(!userDetails) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Deleting profile
        await ProfileModel.findByIdAndDelete(userDetails.additionalDetails);
        
        // If user is a instructor, it will remove all its created courses
        if(userDetails.accountType === "Instructor") {
            await Promise.all(
                userDetails.courses.map(courseId =>
                    courseDeleteById(courseId)
                )
            );
        }

        // If user is a student, it will remove all its enrolled courses
        if(userDetails.accountType === "Student") {
            await Promise.all(
                userDetails.courses.map(courseId =>
                    CourseModel.findByIdAndUpdate(courseId, {$pull: {studentsEnrolled: userId}})
                )
            );
        }

        // Deleting User
        await UserModel.findByIdAndDelete(userId);

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Failed deleting profile"
        });        
    }
};

// Export
module.exports = {showUserDetails, getEnrolledCourses, instructorDashboard, updateProfile, deleteProfile};
