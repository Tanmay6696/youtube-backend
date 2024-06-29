import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const VideoSchema=new Schema(
    {
        Video:{
            type:String,//cloudnary url
            required:true,
            unique:true
        },
        Thumbnail:{
            type:String,
            required:true
            
        },
        Title:{
            type:String,
            required:true
            
        },
        Description:{
            type:String,
            required:true
            
        },
        Duration :{
            type:Number,//from cloudnary url time
            required:true
            
        },
        VideoViews:{
            type:Number,
            default:0
            
        },
        IsPublished:{
            type:Boolean,
            default:true
            
        },
        Owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
            
        },
    }
,{timestamps:true})
VideoSchema.plugin(mongooseAggregatePaginate )
export const Video=mongoose.model("Video",VideoSchema);