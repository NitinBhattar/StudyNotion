// Import
const SibApiV3Sdk = require("sib-api-v3-sdk");
require("dotenv").config();

// Configure Brevo
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const mailSender = async (email, title, body) => {
    try {
        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        const sendSmtpEmail = {
            sender: {
                name: "StudyNotion",
                email: process.env.BREVO_SENDER_EMAIL
            },
            to: [
                {
                    email: email
                }
            ],
            subject: title,
            htmlContent: body
        };

        await apiInstance.sendTransacEmail(sendSmtpEmail);
    }
    catch(error) {
        console.error("Brevo Email Error:", error);
    }
};

// Export
module.exports = mailSender;
