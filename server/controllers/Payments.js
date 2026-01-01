// Import
const crypto = require("crypto");
const instance = require("../config/RazorpayConnect.js");
const CourseModel = require("../models/CourseModel.js");
const UserModel = require("../models/UserModel.js");
const mailSender = require("../utils/mailSender.js");
const courseEnrollmentTemplate = require("../templates/courseEnrollmentTemplate.js");
require("dotenv").config();

// Initiate Razorpay order & Capture payment
const capturePayment = async (req, res) => {
    try {
        // Fetching data
        const {courseId} = req.body;
        const userId = req.user.id;

        // Fields are missing
        if(!userId || !courseId) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "Something went wrong, User Id or Course Id is missing"
            });
        }

        // Course exists or not
        const courseDetails = await CourseModel.findById(courseId);

        // If course doesn't exist
        if(!courseDetails) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });            
        }

        // If user has already bought the course
        if( await UserModel.exists({_id: userId, courses: courseId}) ) {
            // 409 is Conflict
            return res.status(409).json({
                success: false,
                message: "Student already enrolled in Course"
            });             
        }

        // If course is free, direct enrollment
            if(courseDetails.price === 0) {
            // Enroll student in course
            const updatedCourse = await CourseModel.findByIdAndUpdate(courseId, {$addToSet: {studentsEnrolled: userId}}, {new: true});
            const updatedUser = await UserModel.findByIdAndUpdate(userId, {$addToSet: {courses: courseId}}, {new: true});

            // MongoDB fail check
            if(!updatedCourse || !updatedUser) {
                // 500 is Internal Server Error
                return res.status(500).json({
                    success: false,
                    message: "Failed enrolling student, please contact customer care"
                });
            }

            // Send enrollment mail
            await mailSender(updatedUser.email,
                            `Congratulations, you have successfully enrolled in the ${updatedCourse.courseName}`,
                            courseEnrollmentEmail(updatedCourse.courseName, updatedUser.firstName));

            // 200 is OK
            return res.status(200).json({
                success: true,
                message: "Student enrolled successfully"
            });            
        }

        // Create Order
        const options = {
            amount: courseDetails.price * 100,
            currency: "INR",
            receipt: `${Date.now()}_${userId}`,
            // To enroll student in course after payment verification
            notes: {
                courseId,
                userId
            }
        }

        try {
            // instantiate payment
            const paymentResponse = await instance.orders.create(options);

            if(!paymentResponse) {
                // 502 is Bad gateway
                return res.status(502).json({
                    success: false,
                    message: "Could not instantiate order, please try again later"
                });
            }

            return res.status(200).json({
                success: true,
                CourseName: courseDetails.courseName,
                CourseDescription: courseDetails.courseDescription,
                CourseThumbnail: courseDetails.thumbnailUrl,
                orderId: paymentResponse.id,
                currency: paymentResponse.currency,
                amount: paymentResponse.amount
            });
        }
        catch(error) {
            console.error(error);
            throw error;
        }
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Failed capturing payment, please try again later"
        });
    }
};

// Payment Verification and Enrollment
const verifyPayment = async (req, res) => {
    try {
        // Fetching data
        const webHookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const signature = req?.headers["x-razorpay-signature"];

        // Validation
        if(!webHookSecret || !signature) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "Couldn't load verification data"
            });
        }

        // Hashing webHookSecrect, Hmac requires hashing algo, secret
        // Hmac => Hash based message authentication code, similar to SHA
        const shasum = crypto.createHmac("sha256" ,webHookSecret);

        // Req.body contains paymentResponse, Razorpay signs this
        shasum.update(req.body);

        // Convert cryptic-text to hexa-decimal string
        const digest = shasum.digest("hex");

        // Verification fails
        if(signature !== digest) {
            // 400 is Bad request
            return res.status(400).json({
                success: false,
                message: "Payment couldn't be verified"
            });
        }

        // Enroll student in course
        const {courseId, userId} = req.body.payload.payment.entity.notes;

        const updatedCourse = await CourseModel.findByIdAndUpdate(courseId, {$addToSet: {studentsEnrolled: userId}}, {new: true});
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {$addToSet: {courses: courseId}}, {new: true});

        // MongoDB fail check
        if(!updatedCourse || !updatedUser) {
            // 500 is Internal Server Error
            return res.status(500).json({
                success: false,
                message: "Failed enrolling student, please contact customer care"
            });
        }

        // Send enrollment mail
        await mailSender(updatedUser.email,
                        `Congratulations, you have successfully enrolled in the ${updatedCourse.courseName}`,
                        courseEnrollmentTemplate(updatedCourse.courseName, updatedUser.firstName));

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "Payment verified and student enrolled successfully"
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Failed verifying payment, please try again later"
        });        
    }
};

// Export
module.exports = {capturePayment, verifyPayment};
