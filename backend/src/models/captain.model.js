import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const secretKey = process.env.JWT_SECRET_KEY;

const captainSchema = new mongoose.Schema({
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
        unique:true,
        lowercase:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password:{
        type:String,
        required:true,
    },
    socketId:{
        type:String,
    },
    status:{
        type:String,
        enum:["online","offline"],
        default:"offline"
    },
    vehicle:{
        color:{
            type:String,
            required:true,
            minlength:[3, "color should be atleast 3 characters long"]
        },
        numberPlate:{
            type:String,
            required:true
        },
        capacity:{
            type:Number,
            required:true,
            min:[1, "capacity should be atleast 1"],
            max:10
        },
        type:{
            type:String,
            required:true,
            enum:["Car", "Bike", "Auto Rickshaw"]
        }
    },
    location:{
        lat:{
            type:Number
        },
        long:{
            type:Number
        }
    }
});

captainSchema.pre("save", async function(){
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password,10);
})

captainSchema.methods.generateToken = function(){
    return jwt.sign({captainId:this._id}, secretKey, {expiresIn:"1d"});
}

captainSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}




const Captain = mongoose.model("Captain", captainSchema);

export default Captain;