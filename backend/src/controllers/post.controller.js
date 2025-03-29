import sharp from "sharp";      //for resizing the image(compressing)
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
export const addNewPost = async (req, res) => {
    try {
        const {caption} = req.body;
        const image = req.file;
        const authorId = req.id;

        if(!image) return res.status(400).json({message:'Image required'});

        //image optimization
        const optimizedImageBuffer = await sharp(image.buffer)
        .resize({width:800, height:800, fit:'inside'})
        .toFormat('jpeg', {quality:80})
        .toBuffer();

        //buffer to data uri
        const fileUri = `data:image/jpeg; base64, ${optimizedImageBuffer.toString('base64')}`;

        //image upload to cloudinary
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image:cloudResponse.secure_url,
            author:authorId
        });

        const user = await User.findById(authorId);
        if(user){
            user.posts.push(post._id);
            await user.save();
        }

        //getting user detail while click user in post
        await post.populate({path:'auhtor', select:'-password'});

        return res.status(201).json({
            message:'New post added successfully',
            success: true,
            post
        })

    } catch (error) {
        console.log(error);
    }
}

export const getAllPost = async (req, res) =>{
    try {
        const posts = await Post.find().sort({createdAt:-1})
        .popolate({path:'author', select:'username, profilePicture'})
        .popolate({
            path:'comments',
            sort:{createdAt:-1},
            popolate:{
                path:'author',
                select:'username, profilePicture'
            }
        });

        return res.status(200).json({
            posts,
            success:true
        })

    } catch (error) {
        console.log(error);
    }
}

export const getUserPost  = async (req, res)=>{
    try {
        const authorId = req.id;
        const posts = await Post.find({author:authorId}).sort({createdAt:-1})
        .popolate({path:'author', select:'username, profilePicture'})
        .popolate({
            path:'comments',
            sort:{createdAt:-1},
            popolate:{
                path:'author',
                select:'username, profilePicture'
            }
        });

        return res.status(200).json({
            posts,
            success:true
        })
        
    } catch (error) {
        console.log(error);
    }
}