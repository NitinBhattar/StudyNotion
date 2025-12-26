// Import
const UserModel = require("../models/UserModel.js");
const ProfileModel = require("../models/ProfileModel.js");
const CourseModel = require("../models/CourseModel.js");

// Update Profile
const updateProfile = async (req, res) => {
    try {
        // Fetching data
        const {dateOfBirth, about, gender, contact} = req.body;
        const userId = req.user.id;

        // Fields are missing
        if(!dateOfBirth && !about && !gender && !contact) {
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

        // Profile details not found
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

        // Deleting profile & user
        await ProfileModel.findByIdAndDelete(userDetails.additionalDetails);
        
        // Courses
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
module.exports = {updateProfile, deleteProfile};
