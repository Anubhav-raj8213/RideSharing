import {User, BlacklistedToken} from "../models/index.js"
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import {body, validationResult} from "express-validator";
const secretKey = process.env.JWT_SECRET_KEY;

const registerUser = async (req, res) => {
    try{
        const {fullName:{firstName, lastName}, email, password} = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array()
            })
        }
        if(!firstName || !email || !password){
            return res.status(400).json({
                message:"All fields are required"
            })
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            })
        }
        // console.log("User registration controller worked till here")
        const newUser = await User.create({
            fullName:{
                firstName,
                lastName
            },
            email,
            password
        })

        const token = newUser.generateToken();
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly:true,
            secured:true
        }
        res.cookie("token", token, options);
        const userResponse = newUser.toObject();
        delete userResponse.password;
        return res.status(201).json({
            message:"User registered successfully",
            user:userResponse,
            token
        })
    }
    catch(error){
        return res.status(500).json({
            error:error.message,
            message:"Something went wrong during user registration"
        });
    }
}

const loginUser = async(req,res) => {
    try{

        const existingToken = req.cookies?.token;

        if(existingToken){
            const validToken = jwt.verify(existingToken, secretKey);
            if(validToken) return res.status(400).json({
                message:"User already logged in"
            })
        }

        const {email,password} = req.body;

        if(!email || !password) return res.status(400).json({
            message:"All fields are required"
        })

        const errors = validationResult(req);

        if(!errors.isEmpty()) return res.status(400).json({
            errors:errors.array()
        })

        const user = await User.findOne({email}).select("+password");

        if(!user){
            return res.status(400).json({
                message:"User does not exist, please register first"
            })
        }

        if(!(await user.comparePassword(password))) return res.status(400).json({
            message:"Invalid credentials"
        }) 

        const token = user.generateToken();
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly:true,
            secured:true
        }
        res.cookie("token", token, options);
        const userResponse = user.toObject();
        delete userResponse.password;
        return res.status(200).json({
            message:"User logged in successfully",
            user:userResponse,
            token
        })
    }
    catch(error){
        return res.status(500).json({
            message:"Something went wrong during user login",
            error:error.message
        })
    }
}


const getUserProfile = async(req,res) => {
    try{
        const user = req.user;
        if(!user) return res.status(400).json({
            message:"User not found"
        })
        const userResponse = user.toObject();
        delete userResponse.password;
        return res.status(200).json({
            user:userResponse
        })
    }
    catch(error){
        return res.status(500).json({
            message:"Something went wrong while fetching user profile",
            error:error.message
        })
    }
}

const logoutUser = async(req,res) => {
    try{
        const token = req.cookies?.token || req.headers?.authorization.split(" ")[1];
        if(!token) return res.status(200).json({
            message:"User logged out successfully"
        })
        const isTokenBlacklisted = await BlacklistedToken.findOne({token});
        if(isTokenBlacklisted) return res.status(200).json({
            message:"User already logged out"
        })
        const blacklistedToken = new BlacklistedToken({
            token
        })
        await blacklistedToken.save();
        res.clearCookie("token");
        return res.status(200).json({
            message:"User logged out successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            message:"Something went wrong during user logout",
            error:error.message
        })
    }
}

export {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser
}