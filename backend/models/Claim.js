const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        claimType: {
            type: String,
            required: true,
            enum: ["Auto", "Home", "Health"]
        },

        amount: {
            type: Number,
            required: true,
            min: 0.01,
            max: 1000000
        },

        description: {
            type: String,
            required: true,
            minlength: 10,
            maxlength: 500,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Claim", claimSchema);