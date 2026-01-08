// Import modules
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Connection with cloudinary
const cloudinaryConnect = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }
    catch(error) {
        console.error(error);
    }
};

// Exports
module.exports = cloudinaryConnect;
