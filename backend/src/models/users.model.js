import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
    fullName:{
        firstName:{
            type:String,
            required:true,
            minlength:[3,"first name should be atleast 3 characters long"]
        },
        lastName:{
            type:String,
            minlength:[3,"last name should be atleast 3 characters long"]
        }
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    socketId:{
        type:String,
    },
})

userSchema.pre("save", async function(){
    if(!this.isModified("password")) return ;
    this.password = await bcrypt.hash(this.password, 10);
});

const secretKey = process.env.JWT_SECRET_KEY;


userSchema.methods.generateToken  = function(){
    const token = jwt.sign({userId:this._id}, secretKey, {expiresIn:"1d"});
    return token;
}

userSchema.methods.comparePassword = async function(password){
    const result = await bcrypt.compare(password,this.password);
    return result;
}

const User = mongoose.model("User", userSchema);

export default User;