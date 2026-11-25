const mongoose = require("mongoose");
require("dotenv").config({
    path: require("path").join(__dirname, ".env")
});

const app = require("./app");

const PORT = process.env.PORT || 3000;

// MongoDB connection
if (process.env.NODE_ENV !== "test") {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("MongoDB connected successfully");

            app.listen(PORT, () => {
                console.log(`Backend running on port ${PORT}`);
            });
        })
        .catch((error) => {
            console.error("MongoDB connection failed:", error);
        });
}

module.exports = app;
