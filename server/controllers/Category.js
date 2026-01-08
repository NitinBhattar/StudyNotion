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

// Category Page Details
const categoryPageDetails = async (req, res) => {
    try {
        //  Get categoryId
        const {categoryId} = req.body;

        // Validation
        if(!categoryId) {
            // 400 is Bad request
            return res.status(400).json({
                success: false,
                message: "Category Id is missing"
            });
        }

        // Get courses for specific categoryIds
        const selectedCategory = await CategoryModel.findById(categoryId)
                                                    .populate({
                                                        path: "courses",
                                                        match: { status: "Published" },
                                                        populate: [ { path: "ratingAndReview"},
                                                                    { path: "instructor", select: "firstName lastName imageUrl" }]
                                                    })
                                                    .lean().exec();

        // MongoDB fail check
        if(!selectedCategory || selectedCategory.courses.length === 0) {
            // 404 is Not Found
            return res.status(404).json({
                success: false,
                message: "Courses for category not found"
            });
        }

        // Get courses for other categoryIds, $ne is not equal, No MongoDB check for find, return an array
        const differentCategories = await CategoryModel.find({_id: {$ne: categoryId}})
                                                       .populate({
                                                           path: "courses",
                                                           match: { status: "Published" },
                                                           populate: [ { path: "ratingAndReview"},
                                                                       { path: "instructor", select: "firstName lastName imageUrl" }]
                                                       })
                                                       .lean().exec();

        // Get top selling courses, sort it according to most students enrolled
        const allCategories = await CategoryModel.find({})
                                                 .populate({
                                                    path: "courses",
                                                    match: { status: "Published" },
                                                   populate: [ { path: "ratingAndReview"},
                                                               { path: "instructor", select: "firstName lastName imageUrl" }]
                                                 })
                                                 .lean().exec();

        const allCourses = allCategories.flatMap((category) => category.courses);
        // Based on no. of enrollments and will only give top 10 courses
        const topSellingCourses = allCourses.sort((a, b) => b.studentsEnrolled.length - a.studentsEnrolled.length);

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "Fetched details for category page",
            data: {
                selectedCategory,
                differentCategories,
                topSellingCourses
            }
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
}

// Show All Categories
const showAllCategories = async (req, res) => {
    try {
        // Fetch categories, getting only selected data i.e marked true
        const allCategories = await CategoryModel.find();

        // 200 is OK
        return res.status(200).json({
            success: true,
            message: "All categories fetched successfully",
            allCategories
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
module.exports = {createCategory, categoryPageDetails, showAllCategories}
