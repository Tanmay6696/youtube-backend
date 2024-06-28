//require('dotenv').config({path:'./env'})
import dotenv from "dotenv"
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
import ConnectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
    path:'./env'
})
ConnectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log("server is running " ,process.env.PORT);
    })
})
.catch((err)=>{
    console.log("MONGO DB FAILED");
})