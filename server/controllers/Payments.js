// Import
const crypto = require("crypto");
const instance = require("../config/RazorpayConnect.js");
const CourseModel = require("../models/CourseModel.js");
const UserModel = require("../models/UserModel.js");
const CourseProgressModel = require("../models/CourseProgressModel.js");
const mailSender = require("../utils/mailSender.js");
const courseEnrollmentTemplate = require("../templates/courseEnrollmentTemplate.js");
const paymentSuccessTemplate = require("../templates/paymentSuccessTemplate.js");
require("dotenv").config();

// Initiate Razorpay order & Capture payment
const capturePayment = async (req, res) => {
    try {
        // Fetching data
        const {courses} = req.body;
        const userId = req.user.id;

        // Fields are missing
        if(!courses || courses.length === 0) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "Course Ids is missing"
            });
        }
        
        let totalAmount = 0;
        const courseDocs = await CourseModel.find({ _id: { $in: courses } });

        // MongoDb fail check
        if(courseDocs.length === 0) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "Courses not found"
            });
        }

        for(const courseDetails of courseDocs) {
            try {
                // If user is already enrolled in the course
                const isEnrolled = courseDetails.studentsEnrolled.some(
                    id => id.toString() === userId
                );

                if (isEnrolled) {
                    // 409 is Conflict
                    return res.status(409).json({
                        success: false,
                        message: `Student is already enorlled in ${courseDetails.courseName}`
                    });                
                }
                // Add the price of the course to the total amount
                totalAmount += courseDetails.price;
            }
            catch(error) {
                console.error(error);
                throw error;
            }
        }

        // No need for RazorPay
        if (totalAmount === 0) {
            try {
                await enrollStudents(courses, userId);

                // 200 is OK
                return res.status(200).json({
                    success: true,
                    message: "Student enrolled in courses successfully"
                });
            }
            catch(error) {
                console.error(error);
                // 400 is Bad Request & 500 is Internal Server Error
                return res.status(error.statusCode || 500).json({
                    success: false,
                    message: error.message
                });
            }
        }

        // Create Order
        const options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: `${Date.now()}_${userId}`
        }

        try {
            // instantiate payment
            const paymentResponse = await instance.orders.create(options);

            // If payment fails
            if(!paymentResponse) {
                // 502 is Bad gateway
                return res.status(502).json({
                    success: false,
                    message: "Could not instantiate order, please try again later"
                });
            }

            return res.status(200).json({
                success: true,
                paymentResponse
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
        const razorpay_order_id = req.body?.razorpay_order_id;
        const razorpay_payment_id = req.body?.razorpay_payment_id;
        const razorpay_signature = req.body?.razorpay_signature;
        const courses = req.body?.courses;
        const userId = req.user.id;

        // Validation
        if(!razorpay_order_id || !razorpay_payment_id|| !razorpay_signature || !courses) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "Couldn't load verification data"
            });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        // Hashing key scret, Hmac requires hashing algo, secret
        // Hmac => Hash based message authentication code, similar to SHA
        // Convert cryptic-text to hexa-decimal string
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest("hex");

        // Verification fails
        if(expectedSignature !== razorpay_signature) {
            // 400 is Bad request
            return res.status(400).json({
                success: false,
                message: "Payment couldn't be verified"
            });
        }

        // Enroll students
        try {
            await enrollStudents(courses, userId);
        }
        catch(error) {
            console.error(error);
            // 400 is Bad Request & 500 is Internal Server Error
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message
            });
        }

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

// Enroll students
const enrollStudents = async (courses, userId) => {
    // Fields are missing
    if(!courses || courses.length === 0 || !userId) {
        // 400 is Bad Request
        const error = new Error("User Id or Course Ids are missing");
        error.statusCode = 400;
        throw error;            
    }

    for(const courseId of courses) {
        const updatedCourse = await CourseModel.findByIdAndUpdate(courseId, {$addToSet: {studentsEnrolled: userId}}, {new: true});
        const courseProgress = await CourseProgressModel.create({courseId: courseId, userId: userId, completedVideos: []});
        const enrolledStudent = await UserModel.findByIdAndUpdate(userId, {$addToSet: {courses: courseId, courseProgress: courseProgress._id}}, { new: true });

            // MongoDB fail check
            if(!updatedCourse || !courseProgress || !enrolledStudent) {
                // 500 is Internal Server Error
                const error = new Error("Failed enrolling student, please contact customer care");
                error.statusCode = 500;
                throw error;
            }

        // Send enrollment mail
        await mailSender(enrolledStudent.email,
                        `Congratulations, you have successfully enrolled in the ${updatedCourse.courseName}`,
                        courseEnrollmentTemplate(updatedCourse.courseName, enrolledStudent.firstName));
    }

    return true;
};

// Payment success mail
const sendPaymentSuccessEmail = async (req, res) => {
    try {
        // Fetching data
        const { orderId, paymentId, amount } = req.body
        const userId = req.user.id;

        // Fields are missing
        if (!orderId || !paymentId || !amount) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "Fields are missing"
            });
        }

        // Fetch student data
        const studentDetails = await UserModel.findById(userId);

        // MongoDB fail check
        if(!studentDetails) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "Student Not Found"
            });            
        }

        await mailSender(studentDetails.email, "Payment received successfully",
                        paymentSuccessTemplate(
                            `${studentDetails.firstName} ${studentDetails.lastName}`,
                            Number(amount) / 100,
                            orderId,
                            paymentId
                        )
        );

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "Mail for payment success sent"
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending mail for successful payment"
        });
    }
};

// Export
module.exports = {capturePayment, verifyPayment, enrollStudents, sendPaymentSuccessEmail};
