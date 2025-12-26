// Import
const cloudinary = require("cloudinary").v2;

// File Remover
const cloudinaryRemover = async (publicId, resourceType) => {
    try {
        if (!publicId) {
            throw new Error("publicId is required");
        }
        
        return await cloudinary.uploader.destroy(publicId, {resource_type: resourceType});
    }
    catch(error) {
        console.log(error);
        throw new Error("Cloudinary deletion failed");
    }
};

// Export
module.exports = cloudinaryRemover;
