import { ApiError } from "../utils/apierrors";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "json-web-token" 
import { User } from "../models/Users.models";
export const verifedJWT=asyncHandler(async(req,res,next)=>{
    try{
        const Token=req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer"," ")
    if(!Token){
        throw new ApiError(401,"Unauthorized error")
    }
    const decodedinfo=await jwt.verify(Token,process.env.ACCESS_TOKEN_SECRET)
    const user=await User.findById(decodedinfo?._id).select("-passwoed -refreshtoken")
    if(!user){

        //frontend discussion 
        throw new ApiError(400,"Invalid Access token")
    }
    req.user=user;
    next()
    }
    catch(err){
        throw new ApiError(401,err?.message||"Invalid")
    }
    
})