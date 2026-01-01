// Import
const UserModel = require("../models/UserModel.js");
const ProfileModel = require("../models/ProfileModel.js");
const CourseModel = require("../models/CourseModel.js");
const cloudinaryUploader = require("../utils/cloudinaryUploader.js");
const cloudinaryRemover = require("../utils/cloudinaryRemover.js");
const courseDeleteById = require("../services/courseDeleteById.js");
require("dotenv").config();

// Update Profile
const updateProfile = async (req, res) => {
    try {
        // Fetching data
        // || {} means null if any of the fields are absent
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
            if(pfpDetails.public_id) {
                await cloudinaryRemover(pfpDetails.public_id, "image");
            }
            
            // Uplaod image to Cloudinary
            const pfpDetails = await cloudinaryUploader(pfp, process.env.CLOUDINARY_USER_PROFILE, 80);
            userDetails.imageUrl = pfpDetails.secure_url;
            userDetails.imageId = pfpDetails.public_id;

            // Save in DB
            await userDetails.save();
        }

        // Save in DB
        await profileDetails.save();

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully"
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

        // Fetching user details
        const userDetails = await UserModel.findById(userId).populate("additionalDetails").lean().exec();

        // User details not found
        if(!userDetails) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Remove password
        delete userDetails.password;

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            data: userDetails
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

// Export
module.exports = {updateProfile, deleteProfile, showUserDetails};
