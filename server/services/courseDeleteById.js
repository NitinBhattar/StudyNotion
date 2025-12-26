// Import
const CourseModel = require("../models/CourseModel.js");
const sectionDeleteById = require("../services/sectionDeleteById.js");

// Course delete
const courseDeleteById = async (courseId) => {
    try {
        // Validation
        if(!courseId) {
            throw new Error("Course Id is required");      
        }

        // Fetch details
        const courseDetails = await CourseModel.findById(courseId);

        // Course not found
        if(!courseDetails) {
            throw new Error("Course not found");  
        }

        // Deleting all Sections, Promise will throw error in catch
        await Promise.all(
            courseDetails.courseContent.map(sectionId =>
                sectionDeleteById(sectionId)
            )
        );

        // Deleting Course
        await CourseModel.findByIdAndDelete(courseId);
    }
    catch(error) {
        console.error("Course deletion failed ", error);
        throw error;   
    }
}

// Export
module.exports = courseDeleteById;
