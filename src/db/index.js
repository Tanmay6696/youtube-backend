import mongoose, { connect } from "mongoose";
import { DB_NAME } from "../constants.js";

const ConnectDB=async () =>{
    try{
       const connectionsinstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
       console.log(`\n mongodb connected !! DB HOST :${connectionsinstance.connection.host} `);
    }
    catch(error){
        console.log("ERROR: ",error);
        process.exit(1)
    }
}
export default ConnectDB