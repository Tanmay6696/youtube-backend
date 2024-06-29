import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apierrors.js";
import {User} from "../models/Users.models.js"
import {uploadcloudinary} from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/apiresponse.js";
const generateaccessandrefershtokens =async(UserId)=>{
    try{
        const user =await User.findById(UserId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        user.refreshtoken=refreshToken
        await user.save({validatebeforesave:false})
        return {accessToken,refreshToken}
    }
    catch(error){

        throw new ApiError(401,"something went wrong");
    }

}

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
    const existedUser=await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser===true){
        throw new ApiError(409,"user is alerady there")
    }
    // console.log("avatar0",req.files);
    // console.log("coverimage  ",req.files?.coverImage?.[0]);

    // console.log("avatar",req.files?.avatar[0]?.path);
    // console.log("coverImagelocalpath ",req.files?.coverImage?.[0]?.path);
    const avatarlocalpath=req.files?.avatar[0]?.path;
    const coverImagelocalpath=req.files?.coverImage?.path;
    if(avatarlocalpath===false){
        throw new ApiError(409,"avatar is not alerady there")
    }
    const Avatar=await uploadcloudinary(avatarlocalpath)
    const CoverImage=await uploadcloudinary(coverImagelocalpath) || " "

    if(!Avatar){
        throw new ApiError(409,"avatar is not alerady there")
    }
    const user=await User.create(
        {
            username,
            email,
            fullname,
            avatar:Avatar.url,
            password,
            coverImage:CoverImage?.url|| "",
        }
    )
    const Usercreated=await User.findById(user._id).select("-password -refreshtoken")
    if(!Usercreated){
        throw new ApiError(500,"something went wrong")

    }
    return res.status(201).json(
        new ApiResponse(200,Usercreated,"user is created" ,200)
    )
})
const LoginUser=asyncHandler(async(req,res)=>{
    //todos
    //import username password email
    //check in database that user is presnt or not
    //if yes -> then check password (access & refresh token -> to user),send secure cookies
    //if no then show error 
    
    const {email,username,password}=req.body();
    if(!email){
        throw new ApiError(400,"email is not present");
    }
    const findUser=await User.findById(email)
    console.log("findUser",findUser);
    if(!findUser){
        throw new ApiError(400,"User  is not present");
    }
    const IsPasswordCorrect=await findUser.isPasswordCorrect(password)
    if(IsPasswordCorrect){
        //create access and refresh tokens 
        const {AccessToken,RefreshToken}=await generateaccessandrefershtokens(findUser._id)
    }
    else{
        throw new ApiError(401,"password  is not correct");
    }
    const loggedInUser=await findUser.findById(findUser._id).select("-password -refreshtoken")
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken",AccessToken)
    .cookie("refreshToken",RefreshToken)
    .json(
        new ApiResponse(
            200,
            {
                findUser:loggedInUser,accessToken,refreshToken
            },
            "User Logged In suceesfully"
        )
    )
    
})
const logout=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {   
            $set:{
                refreshtoken:undefined
            }
        },
        {
        new:true
        }
    ) 
    const options={
        httpOnly:true,
        secure:true
    }
    return res 
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200),{},"User logout")
})
export  {registerUser,LoginUser,logout}