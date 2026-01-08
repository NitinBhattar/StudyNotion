// Import
const CourseProgressModel = require("../models/CourseProgressModel.js");
const SubSectionModel = require("../models/SubSectionModel.js");

// Update course progress
const updateCourseProgress = async (req, res) => {
    try {
        // Fetching data
        const { courseId, subSectionId } = req.body;
        const userId = req.user.id;
        
        // Fields are missing
        if(!courseId || !subSectionId) {
            // 400 is Bad request
            return res.status(400).json({
                success: false,
                message: "Fields are missing"
            });
        }

        // Validation
        const subSection = await SubSectionModel.findById(subSectionId);

        if (!subSection) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "Subsection not found"
            });
        }

        // Get course progress details
        const updatedCourseProgress = await CourseProgressModel.findOneAndUpdate({courseId: courseId, userId: userId},
                                                                                {$addToSet: {completedVideos: subSectionId}},
                                                                                {new: true});

        // MongoDB fail check
        if (!updatedCourseProgress) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "Course Progress data not found"
            });
        }

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "Course progress updated successfully"
        });
    }
    catch (error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Something went wrong updating course progress"
        });
    }
};

// Export
module.exports = updateCourseProgress;
