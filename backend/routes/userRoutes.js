const express = require("express");
const User = require("../models/User");

const router = express.Router();

// POST /api/users
router.post("/", async (req, res) => {
    try {
        const { fullName, email, phone } = req.body;

        // Check required fields
        if (!fullName || !email || !phone) {
            return res.status(400).json({
                message: "Full name, email and phone are required"
            });
        }

        // Check whether email already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingUser) {
            return res.status(409).json({
                message: "A user with this email is already registered"
            });
        }

        // Create new user
        const user = new User({
            fullName,
            email,
            phone
        });

        // Save to MongoDB
        const savedUser = await user.save();

        // Return created user
        res.status(201).json(savedUser);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Unable to create user"
        });
    }
});
// GET /api/users
router.get("/", async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });

        res.status(200).json(users);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Unable to fetch users"
        });
    }
});
module.exports = router;