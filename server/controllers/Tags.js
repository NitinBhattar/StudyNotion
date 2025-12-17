// Import
const TagModel = require("../models/TagModel.js");

// Create Tag
const createTag = async (req, res) => {
    try {
        // Fetching data
        const {name, description} = req.body;

        // Fields are missing
        if(!name || !description) {
          // 400 is Bad Request
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if tag already exists or not
        const existingTag = await TagModel.findOne({name});

        // Tag already exists
        if(existingTag) {
            // 409 is conflict
            return res.status(409).json({
                success: false,
                message: "Tag already exists"
            });
        }

        // Create entry in DB
        const tagDetails = await TagModel.create({name, description});

        // 201 is success for new resource allocation
        return res.status(201).json({
            success: true,
            message: "Tag created successfully"
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Failed creating tags"
        });
    }
};

// Show All Tags
const showAllTags = async (req, res) => {
    try {
        // Fetch tags, getting only selected data i.e marked true
        const allTags = await TagModel.find({}, {name: true, description: true});

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "All tags fetched successfully",
            data: allTags
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Failed fetching all tags"
        });        
    }
};

// Export
module.exports = {createTag, showAllTags}
