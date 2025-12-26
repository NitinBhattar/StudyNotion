// Import
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel.js");
require("dotenv").config();

// Token Verification
const authMiddleware = async (req, res, next) => {
    try {
        // Extract token
        // Authorization: Bearer is the key: value pair
        // Replace Bearer' ' (space) with empty
        const authHeader = req.header("Authorization");
        // Optional chaining will not let it execute if the objecy is undefined
        const token = ( authHeader?.startsWith("Bearer ") ) ? ( authHeader?.replace("Bearer ", "") ) :
                        req.cookies?.token || req.body?.token;


        // Token is missing
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            });
        }

        // Verify token, decrypt rest of things given in token, user's id, email, accountType
        try {
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        }
        catch(error) {
            // 401 is Unauthorized
            return res.status(401).json({
                success: false,
                message: "Token is invalid"
            });
        }

        next();
    }
    catch(error) {
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Internal server error while validating token"
        });
    }
};

// Students route
const AuthStudent = async(req, res, next) => {
    try {
        // Fetching data
        const userDetails = await UserModel.findById(req.user.id);

        if(userDetails.accountType !== "Student") {
            // 403 is forbidden
            return res.status(403).json({
                success: false,
                message: "This is a protected route for Students only"
            });
        }

        next();
    }
    catch(error) {
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "User role cant be verified. Please try again later"
        });
    }
};

const AuthInstructor = async(req, res, next) => {
    try {
        // Fetching data
        const userDetails = await UserModel.findById(req.user.id);

        if(userDetails.accountType !== "Instructor") {
            // 403 is forbidden
            return res.status(403).json({
                success: false,
                message: "This is a protected route for Instructors only"
            });
        }

        next();
    }
    catch(error) {
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "User role cant be verified. Please try again later"
        });
    }
};

const AuthAdmin = async(req, res, next) => {
    try {
        // Fetching data
        const userDetails = await UserModel.findById(req.user.id);
        
        if(userDetails.accountType !== "Admin") {
            // 403 is forbidden
            return res.status(403).json({
                success: false,
                message: "Admmin access required"
            });
        }

        next();
    }
    catch(error) {
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "User role cant be verified. Please try again later"
        });
    }
};

// Export
module.exports = {authMiddleware, AuthStudent, AuthInstructor, AuthAdmin}
