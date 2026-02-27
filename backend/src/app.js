import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";
const app = express();
import connectDB from "./utils/db.js";
import { usersRoutes } from "./routes/index.js";
import cookieParser from "cookie-parser";

await connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Route for rhe user registration
app.use("/api/users", usersRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});



export default app;