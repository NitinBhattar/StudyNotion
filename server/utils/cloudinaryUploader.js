// Import
const cloudinary = require("cloudinary").v2;

// File Uploader
const cloudinaryUploader = async (file, folder, quality) => {
    try {
        // > 10 MB files need this
        const options = {folder, resource_type: "auto"};

        // if present, add these in options
        if(quality) {
            options.quality = quality;
        }

        return await cloudinary.uploader.upload(file.tempFilePath, options);
    }
    catch(error) {
        console.error(error);
        throw new Error("Cloudinary upload failed");
    }
};

// Export
module.exports = cloudinaryUploader;
