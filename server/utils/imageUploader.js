// Import
const cloudinary = require("cloudinary").v2;

// Image Uploader
const imageUploader = async (file, folder, quality) => {
    // > 10 MB files need this
    const options = {folder, resource_type: "auto"};

    // if present, add these in options
    if(quality) {
        options.quality = quality;
    }

    return await cloudinary.uploader.upload(file.tempFilePath, options);
};

// Export
module.exports = imageUploader;