import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()
app.use(cors({
    orgin:process.env.CORS_ORIGIN ,
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("Public"))
app.use(cookieParser())

//routes import
import userRouter from "./routes/User.routes.js";


//routes declareation 
app.use("/api/v1/users",userRouter)
//https://localhost:8000/api/v1/users/register

export {app}
