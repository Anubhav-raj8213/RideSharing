import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const blacklistedTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // 24 hours in seconds
    }
}, { timestamps: true });

const BlacklistedToken = mongoose.model("BlacklistToken", blacklistedTokenSchema);

export default BlacklistedToken;