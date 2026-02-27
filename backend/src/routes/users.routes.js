import express from "express";
const router = express.Router();

/**
 * method:Post
 * @description: registering User
 */

router.post("/register", registerUser);

export default router;

