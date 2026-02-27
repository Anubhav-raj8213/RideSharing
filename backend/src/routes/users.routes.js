import express from "express";
const router = express.Router();
import {body} from "express-validator";
import {registerUser} from "../controllers/users.controllers.js";

/**
 * method:Post
 * @description: registering User
 */

router.post("/register", [
        body("fullName.firstName").notEmpty().withMessage("First name is required and must be at least 3 characters long").isLength({min:3}).withMessage("First name must be at least 3 characters long"),
        body("email").notEmpty().isEmail().withMessage("Invalid email address"),
        body("password").notEmpty().isLength({min:6}).withMessage("Password must be at least 6 characters long")
], registerUser);

export default router;

