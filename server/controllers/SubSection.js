// Import
const SectionModel = require("../models/SectionModel.js");
const SubSectionModel = require("../models/SubSectionModel.js");
const cloudinaryUploader = require("../utils/cloudinaryUploader.js");
const cloudinaryRemover = require("../utils/cloudinaryRemover.js");
const subSectionDeleteById = require("../services/subSectionDeleteById.js")

// Create SubSection
const createSubSection = async (req, res) => {
    try {
        // Fetching data & files
        const {title, timeDuration, description, sectionId} = req.body;
        const video = req?.files?.videoFile;

        // Fields are missing
        if(!title || !timeDuration || !description || !video) {
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
                message: "Section not found"
            });
        }

        // Checking if section exists
        const section = await SectionModel.findById(sectionId);

        if(!section) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }

        // Uplaod video to Cloudinary
        const videoDetails = await cloudinaryUploader(video, process.env.CLOUDINARY_COURSE_VIDEO_FOLDER);

        // Create & Update in DB
        const SubSectionDetails = await SubSectionModel.create({
                                                                title,
                                                                timeDuration,
                                                                description,
                                                                videoUrl: videoDetails.secure_url,
                                                                videoId: videoDetails.public_id
                                                                });
        const updatedSection = await SectionModel.findByIdAndUpdate(
                                                                        sectionId,
                                                                        {$addToSet: {subSections: SubSectionDetails._id}},
                                                                        {new: true}
                                                                    )
                                                                    .populate("subSections").exec();

        // Mongo fail check
        if(!updatedSection) {
            // 404 is course not found
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }
                                                                    
        // 201 is success for new resource allocation
        return res.status(201).json({
            success: true,
            message: "Subsection created successfully",
            data: updatedSection
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Failed creating subsection"
        });
    }
};

// Update SubSection
const updateSubSection = async (req, res) => {
    try {
        // Fetching data & files
        const {title, timeDuration, description, subSectionId} = req.body;
        const video = req?.files?.videoFile;

        // Fields are missing
        if(!title && !timeDuration && !description && !video) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "At least one field is required"
            });
        }

        // Failed fetching subsection
        if(!subSectionId) {
            // 400 is Bad request
            return res.status(400).json({
                success: false,
                message: "Subsection Id is missing"
            });
        }

        // Fetching details
        const subSection = await SubSectionModel.findById(subSectionId);

        if(!subSection) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "Subsection not found"
            });           
        }

        // Field by field update
        if(title) {
            subSection.title = title;
        }
        if(timeDuration) {
            subSection.timeDuration = timeDuration;
        }
        if(description) {
            subSection.description = description;
        }
        if(video) {
            // Remove old video
            await cloudinaryRemover(subSection.videoId, "video");

            // Upload new video
            const videoDetails = await cloudinaryUploader(video, process.env.CLOUDINARY_COURSE_VIDEO_FOLDER);
            subSection.videoUrl = videoDetails.secure_url;
            subSection.videoId = videoDetails.public_id;
        }

        // Goes to catch if failed
        await subSection.save();
                                                                    
        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "Subsection updated successfully",
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Failed updating subsection"
        });
    }
};

// Delete SubSection
const deleteSubSection = async (req, res) => {
    try {
        // Fetching data
        const {subSectionId, sectionId} = req.body;

        // Failed fetching subsection or section
        if(!subSectionId || !sectionId) {
            // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "Missing Fields"
            });
        }

        // Fetch details
        const subSectionDetails = await SubSectionModel.findById(subSectionId);

        // MongoDB fail
        if(!subSectionDetails) {
            // 404 is course not found
            return res.status(404).json({
                success: false,
                message: "Subsection not found"
            });            
        }

        // Cloudinary delete
        await cloudinaryRemover(subSectionDetails.videoId, "video");

        // Delete from Section
        const updatedSection = await SectionModel.findByIdAndUpdate(sectionId, {$pull: {subSections: subSectionDetails._id}}, {new: true});

        // MongoDB fail
        if(!updatedSection) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "Subsection not found"
            });            
        }

        // Deleting subsection
        await SubSectionModel.findByIdAndDelete(subSectionId);
                                                                    
        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "Subsection deleted successfully"
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Failed deleting subsection"
        });
    }
};

// Export
module.exports = {createSubSection, updateSubSection, deleteSubSection};
