// Import
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const UserModel = require("../models/UserModel.js");
const mailSender = require("../utils/mailSender.js");

// Reset Password Token
const resetPasswordToken = async (req, res) => {
    try {
        // Fetching data
        const {email} = req.body;

        // Checking if user exists
        const user = await UserModel.findOne({email});

        // User doesn't exist
        if(!user) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "User isn't registered with us"
            });
        }

        // Generate token for FrontEnd & backEnd, for verification
        // crypto is in-built node module
        const token = crypto.randomUUID();

        // Add token to user & expiration time
        const updatedUser = await UserModel.findByIdAndUpdate( user._id, 
                                                                {
                                                                    resetPassToken: token,
                                                                    resetPassTokenExp: Date.now() + (5*60*1000)
                                                                }, {new: true} );

        // Create link for reset password, Front-End URL @PORT = 3000
        const url = `https://localhost:3000/reset-password/${token}`;

        // Send mail
        await mailSender(email,
                        "Reset Password",
                        `Password Reset Link: ${url}`);

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "Email for Resetting Password sent successfully"
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting password"
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        // Fetching data, frontend will send token to body
        const {password, confirmPassword, token} = req.body;

        // Fields are missing
        if(!password || !confirmPassword) {
           // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Password not matching
        if(password !== confirmPassword) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password don't match"
            });            
        }

        // Find user details using token
        const user = await UserModel.findOne({resetPassToken: token});

        // No user found, token is invalid
        if(!user) {
            // 403 is Forbidden
            return res.status(403).json({
                success: false,
                message: "Link is invalid"
            });
        }

        // Check token expiry time
        if(Date.now() > user.resetPassTokenExp) {
            // 403 is Forbidden
            return res.status(403).json({
                success: false,
                message: "Link expired"
            });
        }

        // Hasing password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update new password in DB
        const updatedUser = await UserModel.findByIdAndUpdate(user._id, 
                                                                {
                                                                    password: hashedPassword,
                                                                    resetPassToken: undefined,
                                                                    resetPassTokenExp: undefined
                                                                }, {new: true});

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting password"
        });
    }
};

// Export
module.exports = {resetPasswordToken, resetPassword};