// Import
const nodemailer = require("nodemailer");
require("dotenv").config();

// mailSender
const mailSender = async (email, title, body) => {
    try {
        // Transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_ID,
                pass: process.env.MAIL_PASS
            }
        });

        let info = await transporter.sendMail({
            from: "StudyNotion",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        });

        // Cleanup
        console.log(info);
    }
    catch(error) {
        console.error(error)
    }
};

// Export
module.exports = mailSender;
