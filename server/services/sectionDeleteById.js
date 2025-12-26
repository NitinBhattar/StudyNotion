// Import
const SectionModel = require("../models/SectionModel.js");
const subSectionDeleteById = require("../services/subSectionDeleteById.js");

// Section delete
const sectionDeleteById = async (sectionId) => {
    try {
        // Validation
        if(!sectionId) {
            throw new Error("Section Id is required");      
        }

        // Fetch details
        const sectionDetails = await SectionModel.findById(sectionId);

        // Section not found
        if(!sectionDetails) {
            throw new Error("Section not found");  
        }

        // Deleting all Subsections, Promise will throw error in catch
        await Promise.all(
            sectionDetails.subSections.map(subSectionId =>
                subSectionDeleteById(subSectionId)
            )
        );

        // Deleting Section
        await SectionModel.findByIdAndDelete(sectionId);
    }
    catch(error) {
        console.error("Section deletion failed ", error);
        throw error;   
    }
}

// Export
module.exports = sectionDeleteById;
