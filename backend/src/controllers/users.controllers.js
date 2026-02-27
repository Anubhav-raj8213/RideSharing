import {User} from "../models/index.js"
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY;

const registerUser = async (req, res) => {
    try{
        const {fullName:{firstName, lastName}, email, password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            })
        }
        if(!firstName || !email || !password){
            return res.status(400).json({
                message:"All fields are required"
            })
        }
        const newUser = await User.create({
            fullName:{
                firstName,
                lastName
            },
            email,
            password
        })

        const token = await newUser.generateToken();
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly:true,
            secured:true
        }
        res.cookie("token", token, options);
        return res.status(201).json({
            message:"User registered successfully",
            user:newUser
        })
    }
    catch(error){
        return res.status(500).json({
            error:error.message,
            message:"Something went wrong during user registration"
        });
    }
}