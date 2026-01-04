// Import
const contactUsTemplate = require("../templates/contactUsTemplate.js");
const mailSender = require("../utils/mailSender.js");

const contactUsController = async (req, res) => {
    try {
        // Fetching data
        const { email, firstname, lastname, message, phoneNo, countrycode } = req.body;

        // Fields are missing
        if(!email || !firstname || !message || phoneNo === undefined || !countrycode) {
          // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Sending mail
        const emailRes = await mailSender( email, "Your data has been sent successfully",
            contactUsTemplate(email, firstname, lastname, message, phoneNo, countrycode) );

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "Response mail sent successfully"
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending response mail"
        });
    }
};

// Export
module.exports = contactUsController;
