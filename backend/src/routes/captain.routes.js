import express from "express";
import { registerCaptain } from "../controllers/captain.controllers.js";
import {body} from "express-validator";

const router = express.Router();

/**
 * captain registration route
 * method:post
 * endpoint: /api/captain/register
 */
router.post("/register", [
    body("fullName.firstName").notEmpty().withMessage("First name is required and must be at least 3 characters long").isLength({min:3}).withMessage("First name must be at least 3 characters long"),
    body("email").notEmpty().isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().isLength({min:6}).withMessage("Password must be at least 6 characters long"),
    body("vehicle.color").notEmpty().withMessage("Vehicle color is required"),
    body("vehicle.numberPlate").notEmpty().withMessage("Vehicle number plate is required"),
    body("vehicle.capacity").notEmpty().withMessage("Vehicle capacity is required"),
    body("vehicle.type").notEmpty().withMessage("Vehicle type is required")
], registerCaptain);

export default router;