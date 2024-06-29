import mongoose,{Schema} from "mongoose";
import jwt from "json-web-token"; //for tokens
import bcrypt from "bcrypt";// for password
const Userschema=new Schema(
    { 
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        fullname:{
            type:String,
            required:true,
            lowercase:true,
            trim:true
        },
        avatar:{
            type:String,//cloudnary url
            required:true
        },
        coverImage:{
            type:String
        },
        watchhistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            required:[true,"Password is required"]
        },
        refreshtoken:{
            type:String
        }

    }
    ,{
        timestamps:true
    }
)
Userschema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password=bcrypt.hash(this.password,10)
    next()
})
Userschema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}
Userschema.methods.generateAccessToken=function() {
    return jwt.sign(
        {
            _id:this.id,
            email:this.email,
            username:this.username,
            fullname:this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expireIn:process.env.ACCESS_TOKEN_EXPIRAY
        }
    )
}
Userschema.methods.generateRefreshToken=function() {
    return jwt.sign(
        {
            _id:this.id
        },
        process.env.REFRESH_TOKRN_SECRET,
        {
            expireIn:process.env.REFRESH_TOKRN_EXPIRAY
        }
    )
}

export const User=mongoose.model("User",Userschema);