const express = require("express");
const Claim = require("../models/Claim");
const User = require("../models/User");

const router = express.Router();

// POST /api/claims
router.post("/", async (req, res) => {
    try {
        const { userId, claimType, amount, description } = req.body;

        // Check required fields
        if (!userId || !claimType || !amount || !description) {
            return res.status(400).json({
                message: "User, claim type, amount and description are required"
            });
        }

        // Check whether user exists
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Create claim
        const claim = new Claim({
            userId,
            claimType,
            amount,
            description
        });

        // Save claim
        const savedClaim = await claim.save();

        res.status(201).json(savedClaim);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Unable to create claim"
        });
    }
});
// GET /api/claims
router.get("/", async (req, res) => {
    try {
        const claims = await Claim.find()
            .populate("userId", "fullName email")
            .sort({ createdAt: -1 });

        res.status(200).json(claims);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Unable to fetch claims"
        });
    }
});

module.exports = router;