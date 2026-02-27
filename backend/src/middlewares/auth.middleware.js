import {User} from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY;

const authMiddleware = async(req,res,next) => {
    try{
        const token = req.cookies.token || req.header("Authorization").replace("Bearer", "");
        if(!token){
            return res.status(401).json({
                message:"Unauthorized, token not found"
            })
        }
        
        const decodedToken = jwt.verify(token, secretKey);

        const user = await User.findById(decodedToken.userId);

        if(!user){
            return res.status(400).json({
                message:"User not found"
            })
        }

        req.user = user;
        next();
    }
    catch(error){
        return res.status(401).json({
            message:"Unauthorized, invalid token"
        })
    }
}