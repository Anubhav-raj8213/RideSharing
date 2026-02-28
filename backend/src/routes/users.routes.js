import express from "express";
const router = express.Router();
import {body} from "express-validator";
import {registerUser, loginUser, getUserProfile, logoutUser} from "../controllers/users.controllers.js";
import authMiddleware  from "../middlewares/auth.middleware.js";

/**
 * method:Post
 * @description: registering User
 */

router.post("/register", [
        body("fullName.firstName").notEmpty().withMessage("First name is required and must be at least 3 characters long").isLength({min:3}).withMessage("First name must be at least 3 characters long"),
        body("email").notEmpty().isEmail().withMessage("Invalid email address"),
        body("password").notEmpty().isLength({min:6}).withMessage("Password must be at least 6 characters long")
], registerUser);

/**
 * method:post
 * @description: login User
 */

router.post("/login",[
    body("email").isEmail().withMessage("Invalid email ID"),
    body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long")
],loginUser)

/**
 * method:get
 * @description:fetching user porfile
 */

router.get("/profile", authMiddleware, getUserProfile);

/**
 * logout route
 * method:post
 */

router.post("/logout", logoutUser);

export default router;
