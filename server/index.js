// Import
const express = require("express");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoConnect = require("./config/MongoDBConnect.js");
const cloudinaryConnect = require("./config/CloudinaryConnect.js");
require("dotenv").config();

// Variables
const app = express();
const PORT = process.env.PORT || 4000;

// Routes
const userRoutes = require("./routes/userRoutes.js");
const profileRoutes = require("./routes/profileRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");
const courseRoutes = require("./routes/courseRoutes.js");

// MiddleWares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        // Localhost 3000 for same machine, otherwise wherever the frontend is
        // Server only reads http request, so http not https
        origin: "http://localhost:3000",
        // credentials: true means the browser is allowed to send credentials with requests, for session-auth or JWT
        credentials: true
    })
);
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp"
    })
);

// Connects
mongoConnect();
cloudinaryConnect();

// Mouting routes, clean ups
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/profile", profileRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Starting server at ${PORT}`);
});

// Default Route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Server is running...."
    })
});
