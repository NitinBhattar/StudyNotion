// Import
const mongoose = require("mongoose");
require("dotenv").config();

const mongoConnect = () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(console.log("MongoDB is connected"))
    .catch((error) => {
        console.log("Connection with MongoDB failed");
        console.error(error);
        process.exit(1);
    });
};

// Export
module.exports = mongoConnect;
