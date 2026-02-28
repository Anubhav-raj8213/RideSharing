import {User, BlacklistedToken, Captain} from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import {validationResult} from "express-validator";
const secretKey = process.env.JWT_SECRET_KEY;

const registerCaptain = async (req, res) => {
    try{
        const {fullName:{firstName, lastName}, email, password, vehicle} = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array()
            })
        }
        if(!firstName || !email || !password || !vehicle.color || !vehicle.numberPlate || !vehicle.capacity || !vehicle.type){
            return res.status(400).json({
                message:"All fields are required"
            })
        }
        const existingCaptain = await Captain.findOne({email});
        if(existingCaptain) return res.status(400).json({
            message:"Captain already exists"
        })
        const newCaptain =await Captain.create({
            fullName:{
                firstName,
                lastName
            },
            email,
            password,
            vehicle
        })
        const token = newCaptain.generateToken();
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly:true,
            secure:true
        }
        res.cookie("token",token,options);
        const captainResponse = newCaptain.toObject();
        delete captainResponse.password;
        return res.status(201).json({
            message:"Captain registered successfully",
            captain:captainResponse,
            token
        })
    }
    catch(error){
        return res.status(500).json({
            message:"Something went wrong during captain registration",
            error:error
        })
    }
}



export {
    registerCaptain
}