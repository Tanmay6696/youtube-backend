import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apierrors.js";
import {User} from "../models/Users.models.js"
import {uploadcloudinary} from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/apiresponse.js";

const registerUser=asyncHandler(async(req,res)=>{
    // get data from user
    //validations -> not empty
    //check user alerady present (from user nad email)
    //avatar & coverimage present or not
    //upload on cloudinary 
    //create user object why to create object? to send in mongodb
    // remove password & refresh token from response 
    //check response for user creation 
    //return response to client 
    const {email,username,fullname,password}=req.body
    //console.log("body" ,req.body);
    if(
        [email,username,fullname,password].some((fields)=>
            fields.trim===" "
        )
    ){
        throw new ApiError(400,"all fields are required")
    }


    //unique users
    const existedUser=User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser===true){
        throw new ApiError(409,"user is alerady there")
    }
    console.log("avatar",req.files?.avatar[0]?.path);
    const avatarlocalpath=req.files?.avatar[0]?.path;
    const coverImagelocalpath=req.files?.coverImage[0]?.path;
    if(avatarlocalpath===false){
        throw new ApiError(409,"avatar is not alerady there")
    }
    const avatar=await uploadcloudinary(avatarlocalpath)
    const coverImage=await uploadcloudinary(coverImagelocalpath)

    if(!avatar){
        throw new ApiError(409,"avatar is not alerady there")
    }
    const user=await User.create(
        {
            username,
            email,
            fullname,
            avatar:avatar.url,
            password,
            coverImage:coverImage?.url|| "",
        }
    )
    const Usercreated=await user.findById(user._id).select("-password -refreshtoken")
    if(!Usercreated){
        throw new ApiError(500,"something went wrong")

    }
    return res.status(201).json(
        new ApiResponse(200,Usercreated,"user is created" ,200)
    )
})
export  {registerUser}