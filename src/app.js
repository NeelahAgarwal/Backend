import express, { json } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app=express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials:true,
}))
app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(express.static("public"))
app.use(cookieParser())


// Routes import 

import userRoutes from "./routes/user.routes.js"
// Routes Declaration

app.use("/api/v1/users",userRoutes)

//http://localhost:8000/api/v1/users/register


export {app};