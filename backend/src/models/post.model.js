import mongoose, { mongo } from "mongoose";
import { User } from "./user.model";

const postSchema = new mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    },
    caption:{
        type:String,
        default:''
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }]
});
export const Post = mongoose.model('Post', postSchema);