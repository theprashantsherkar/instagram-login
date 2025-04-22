import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
        const mongoURL = process.env.MONGO_URI
        const connection = await mongoose.connect(mongoURL, {
            dbName:"Instagram Comments"
        })
        if(connection){
            console.log(`Database Connected!`.bgYellow.red.bold);
        }
    } catch (error) {
        console.log(error);
    }
}