import {v2 as cloudinary} from "cloudinary";
import exp from "constants";
import fs from "fs"
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_NAME,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadcloudinary = async (localfilepath) =>{
    try{
        if(!localfilepath){
            return null;
        }
        else{
            const Response = await cloudinary.uploader
            .upload(
                localfilepath, {
                    resource_type:"auto",
                }
            )
            .catch((error) => {
                console.log(error);
            });
            fs.unlinkSync(localfilepath);
            console.log("successfully upload : ",Response.url);
            return Response;
        }   
    }
    catch (error){
        console.log("Error",error);
        fs.unlinkSync(localfilepath); //remove locally saved temporailty filed as opertion got failed 
        return null;
    }
}
export {uploadcloudinary}

