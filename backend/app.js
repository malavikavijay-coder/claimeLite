const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const claimRoutes = require("./routes/claimRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/claims", claimRoutes);

// Test API
app.get("/api/test", (req, res) => {
    res.json({
        message: "ClaimLite backend is working!"
    });
});

module.exports = app;
