import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            dbName:"Instagram Comments"
        })
        if(connection){
            console.log(`Database Connected!`.bgYellow.red.bold);
        }
    } catch (error) {
        console.log(error);
    }
}