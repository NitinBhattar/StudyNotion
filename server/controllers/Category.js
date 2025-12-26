// Import
const CategoryModel = require("../models/CategoryModel.js");

// Create Category
const createCategory = async (req, res) => {
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

        // Check if category already exists or not
        const existingCategory = await CategoryModel.findOne({name});

        // Category already exists
        if(existingCategory) {
            // 409 is conflict
            return res.status(409).json({
                success: false,
                message: "Category already exists"
            });
        }

        // Create entry in DB
        const categoryDetails = await CategoryModel.create({name, description});

        // 201 is success for new resource allocation
        return res.status(201).json({
            success: true,
            message: "Category created successfully"
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Failed creating Category"
        });
    }
};

// Show All Categories
const showAllCategories = async (req, res) => {
    try {
        // Fetch categories, getting only selected data i.e marked true
        const allCategories = await CategoryModel.find({}, {name: true, description: true});

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "All categories fetched successfully",
            data: allCategories
        });
    }
    catch(error) {
        console.error(error);
        // 500 is Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Failed fetching all categories"
        });        
    }
};

// Export
module.exports = {createCategory, showAllCategories}
