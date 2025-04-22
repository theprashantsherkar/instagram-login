import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    commentContent:{
        type:String,
    },
    userId:{
        type:Number
    },
    likes:{
        type:Number,
        default:0
    },

}, {
    timestamps:true
});

export const Comment = mongoose.model("Comments", commentSchema);


