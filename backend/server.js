import express from "express";
import dotenv from "dotenv";
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';
import cookieParser from "cookie-parser";

import connectToMongoDb from './db/connectToMongoDb.js';



const app=express();

const PORT= process.env.PORT || 5000;

dotenv.config();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api/users",userRoutes)


app.get("/", (req,res)=>{
    res.send("Hello World!!");
});



app.listen(PORT, ()=> {
    connectToMongoDb();
    console.log(`Server running on port ${PORT}`)
});