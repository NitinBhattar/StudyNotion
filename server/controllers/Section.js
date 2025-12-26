// Import
const CourseModel = require("../models/CourseModel.js");
const SectionModel = require("../models/SectionModel.js");
const subSectionDeleteById = require("../services/subSectionDeleteById.js");

// Create Section
const createSection = async (req, res) => {
    try {
        // Fetching data
        const {sectionName, courseId} = req.body;

        // Fields are missing
        if(!sectionName) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Failed fetching course
        if(!courseId) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "Course Id is missing"
            });
        }

        // Checking if course is avaiable
        const course = await CourseModel.findById(courseId);

        if(!course) {
            // 404 is Bad Request
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Create & Update in DB
        const sectionDetails = await SectionModel.create({sectionName});
        const updatedCourse = await CourseModel.findByIdAndUpdate(
                                                                    courseId,
                                                                    {$addToSet: {courseContent: sectionDetails._id}},
                                                                    {new: true}
                                                                )
                                                                .populate({
                                                                    // Populate this path
                                                                    path: "courseContent",
                                                                    // Another nested populate query
                                                                    populate: {path: "subSections"}
                                                                })
                                                                .exec();

        // Mongo fail check
        if(!updatedCourse) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }
                                                                    
        // 201 is success for new resource allocation
        return res.status(201).json({
            success: true,
            message: "Section created successfully",
            data: updatedCourse
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Failed creating section"
        });
    }
};

// Update Section
const updateSection = async (req, res) => {
    try {
        // Fetching data
        const {sectionName, sectionId} = req.body;

        // Fields are missing
        if(!sectionName) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Failed fetching section
        if(!sectionId) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "Section Id is missing"
            });
        }

        // Update in DB
        const updatedSection = await SectionModel.findByIdAndUpdate(sectionId, {sectionName}, {new: true});

        // MongoDB fail
        if(!updatedSection) {
            // 404 is course not found
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });            
        }
                                                                    
        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "Section updated successfully"
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Failed updating section"
        });
    }
};

// Delete Section
const deleteSection = async (req, res) => {
    try {
        // Fetching data
        const {sectionId, courseId} = req.body;

        // Failed fetching course or section
        if(!courseId || !sectionId) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "Missing Fields"
            });
        }

        // Fetching details
        const sectionDetails = await SectionModel.findById(sectionId);

        // MongoDB fail
        if(!sectionDetails) {
            // 404 is course not found
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });            
        }

        // Deleting all Subsections, Promise will throw error in catch
        await Promise.all(
            sectionDetails.subSections.map(subSectionId =>
                subSectionDeleteById(subSectionId)
            )
        );


        // Delete from course
        const updatedCourse = await CourseModel.findByIdAndUpdate(courseId, {$pull: {courseContent: sectionDetails._id}}, {new: true});

        // MongoDB fail
        if(!updatedCourse) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });            
        }

        // Deleting Section
        await SectionModel.findByIdAndDelete(sectionId);
                                              
        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully"
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Failed deleting section"
        });
    }
};

// Export
module.exports = {createSection, updateSection, deleteSection};
