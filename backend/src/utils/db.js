import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDb = async () => {
    try{
        const connectionInstance = await mongoose.connect(process.env.DB_URL);
        const db = connectionInstance.connection;
        db.on("error", console.error.bind(console, "MongoDB connection error:"));
        db.on("disconnected", () => {
            console.log("MongoDB connection disconnected");
        });
        console.log("Connected to MongoDB");
    }
    catch(error){
        console.error("Error connecting to MongoDB:", error);
    }
}

export default connectDb;