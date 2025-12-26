// Import
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const UserModel = require("../models/UserModel.js");
const ProfileModel = require("../models/ProfileModel.js");
const OtpModel = require("../models/OtpModel.js");
const mailSender = require("../utils/mailSender.js")
require("dotenv").config();

const generateOtp = async () => {
    let attempt = 0;
    const maxAttempt = 5
    let otp;
    let unique = true;
    
    while(unique && attempt < maxAttempt) {
        otp = otpGenerator.generate(6, {
            upperCaseAlphabets: true,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        // Error
        if(!otp || otp.length !== 6) {
            throw new Error("Failed to generate otp.")
        }
        
        unique = await OtpModel.findOne({otp});
        attempt++;
    }

    // Last check after generation
    if(unique) {
        throw new Error("Failed to generate otp");
    }

    return otp;
};

// Send otp
const sendOtp = async(req, res) => {
    try {
        // Fetching data
        const {email} = req.body;

        // Check if user already exists
        const exisitingUser = await UserModel.findOne({email});

        // User already exists
        if(exisitingUser) {
            // 409 is conflict
            return res.status(409).json({
                success: false,
                message: "User is already registered"
            });
        }

        // Generate otp
        const otp = await generateOtp();

        // Hash otp
        const hashedOtp = await bcrypt.hash(otp, 10);

        // Create entry in DB
        const otpEntry = await OtpModel.create({
            email,
            otp: hashedOtp
        });

        // Cleanup
        console.log(otpEntry);

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "OTP generate successfully"
        });
    }
    catch(error) {
        // 500 is internal server error
        return res.status(500).json({
            success: false,
            message: "Failed to generate OTP"
        });
    }
};

// Signup
const signup = async (req, res) => {
    try {
        // Fetching data
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        // Fields are missing, accountType will be selected, contactNumber isn't necessary
        if( !firstName || !lastName || !email ||
            !password || !confirmPassword || !otp ) 
        {
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

        // Check if user already exists
        const exisitingUser = await UserModel.findOne({email});

        // User already exists
        if(exisitingUser) {
            // 409 is Conflict
            return res.status(409).json({
                success: false,
                message: "User is already registered"
            });
        }

        // Most recent otp
        // -1 means descending & limit(1) means 1 response only
        // find function returns an array
        const recentOtp  = await OtpModel.findOne({email}).sort({createdAt: -1});

        // Check if recentOtp exists or not
        if(!recentOtp) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });
        }

        // Compare both otps
        const otpMatch = await bcrypt.compare(otp, recentOtp.otp);

        if(!otpMatch) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Hashing password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create DB enteries in for UserModel and ProfileModel
        const newProfile = await ProfileModel.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contact: contactNumber
        });

        const newUser = await UserModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            additionalDetails: newProfile._id,
            imageUrl: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${firstName} ${lastName}`
        });

        // 201 is success for new resource allocation
        return res.status(201).json({
            success: true,
            message: "User created successfully"
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "User can't be registered, please try again later"
        });        
    }
};

// Login
const login = async (req, res) => {
    try {
        // Fetching data
        const {email, password} = req.body;

        // Fields are missing
        if(!email || !password) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });            
        }

        // Check if user already exists, lean so that JWT could use it as normal object
        const user = await UserModel.findOne({email}).lean();

        // User doesn't exist
        if(!user) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "User doesn't exist"
            });
        }

        // Comparing passwords & generating JWT
        if( await bcrypt.compare(password, user.password) ) {
            const payload = {
                id: user._id,
                email: user.email
            };

            // Create token
            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '2h'});

            // Adding token to user object (via lean) & removing password for security purpose
            user.token = token;
            delete user.password;

            // Create cookie, 200 is OK
            const options = {
                // 3 days
                expires: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)),
                httpOnly: true
            };

            res.cookie("token", token, options).status(200).json({
                success: true,
                user,
                message: "Login successfully"
            });
        }
        else {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "Password don't match"
            });            
        }
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Log in failed, please try again later"
        });           
    }
};

// Change Password
const changePassword = async (req, res) => {
    try {
        // Fetching data from cookie and body
        const email = req.user.email;
        const {oldPassword, newPassword, confirmNewPassword} = req.body;

        // All fields are entered
        if(!oldPassword || !newPassword || !confirmNewPassword) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });            
        }

        // Fetching user from database
        const user = await UserModel.findOne({email});

        // If user is deleted by admin, just a safety check
        if (!user) {
            // 401 is Unauthorized
            return res.status(401).json({
                success: false,
                message: "User session is invalid. Please log in again."
            });
        }

        // Check if oldPassword & dbPassword don't matches
        if( !(await bcrypt.compare(oldPassword, user.password)) ) {
            // 401 is Unauthorized
            return res.status(401).json({
                success: false,
                message: "Your current password is incorrect. Please try again."
            });
        }

        // Check if newPassword & confirmNewPassword matches
        if(newPassword !== confirmNewPassword) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "New password and confirm password do not match. Please try again."
            });
        }

        // Hashing password
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        // Update in DB
        const updatedUser = await UserModel.findByIdAndUpdate(user._id, {password: newHashedPassword}, {new:true});

        // Sending mail
        mailSender(email, "Password changed", "Password updated successfully");

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "Password changed successfully."
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Failed to change password. Please try again later"
        });
    }
};

// Export
module.exports = {sendOtp, signup, login, changePassword};
