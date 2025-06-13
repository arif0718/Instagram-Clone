import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
import path from "path";

dotenv.config({});

const PORT = process.env.PORT||3000;

const __dirname = path.resolve();

// app.get("/", (req,res)=>{
//     return res.status(200).json({
//         message:"I'm from backend",
//         success:true
//     })
// })

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
const corsOptions = {
    // origin:'http://localhost:5173',
    origin: process.env.URL,
    credentials:true
}
app.use(cors(corsOptions));

//routes
app.use("/api/v1/user", userRoute);                //"https://instavibe-uzz9.onrender.com/api/v1/user"
app.use("/api/v1/post", postRoute);  
app.use("/api/v1/message", messageRoute);

//connecting backend+frontend for production level
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req,res)=>{
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
})

server.listen(PORT, ()=>{
    connectDB();
    console.log(`Server is listen at port ${PORT}`);
})