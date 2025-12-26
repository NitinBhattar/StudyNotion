// Import
const SubSectionModel = require("../models/SubSectionModel.js");
const cloudinaryRemover = require("../utils/cloudinaryRemover.js");

// Subsection delete
const subSectionDeleteById = async (subSectionId) => {
    try {
        // Validation
        if(!subSectionId) {
            throw new Error("Subsection Id is required");      
        }

        // Fetch details
        const subSectionDetails = await SubSectionModel.findById(subSectionId);

        // Subsection not found
        if(!subSectionDetails) {
            throw new Error("Subsection not found");  
        }

        // Cloudinary delete
        await cloudinaryRemover(subSectionDetails.videoId, "video");
        // Delete from DB
        await SubSectionModel.findByIdAndDelete(subSectionId);
    }
    catch(error) {
        console.error("Subsection deletion failed ", error);
        throw error;   
    }
}

// Export
module.exports = subSectionDeleteById;
