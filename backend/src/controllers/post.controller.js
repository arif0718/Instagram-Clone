import sharp from "sharp"; //for resizing the image(compressing)
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) return res.status(400).json({ message: "Image required" });

    //image optimization
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    //buffer to data uri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;

    //image upload to cloudinary
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    //getting user detail while click user in post
    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New post added successfully",
      post,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .popolate({ path: "author", select: "username, profilePicture" })
      .popolate({
        path: "comments",
        sort: { createdAt: -1 },
        popolate: {
          path: "author",
          select: "username, profilePicture",
        },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .popolate({ path: "author", select: "username, profilePicture" })
      .popolate({
        path: "comments",
        sort: { createdAt: -1 },
        popolate: {
          path: "author",
          select: "username, profilePicture",
        },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const likerId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    //like logic started
    await post.updateOne({ $addToSet: { likes: likerId } }); //used addtoset instead of push query buz we don't want repeatation
    await post.save();

    //implement socket.io for real time notification
    //pending

    return res.status(200).json({ message: "Post liked", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const dislikePost = async (req, res) => {
  try {
    const likerId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    //dislike logic started
    await post.updateOne({ $pull: { likes: likerId } }); //used addtoset instead of push query buz we don't want repeatation
    await post.save();

    //implement socket.io for real time notification
    //pending

    return res.status(200).json({ message: "Post disliked", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const commneterId = req.id;
    const postId = req.params.id;

    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!text)
      return res
        .status(404)
        .json({ message: "text is required", success: false });

    //dislike logic started
    const comment = await Comment.create({
      text,
      author: commneterId,
      post: postId,
    });

    await comment.populate({
      path: "author",
      select: "username, profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "Comment Added",
      comment,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).popolate(
      "author",
      "username profilePicture"
    );

    if (!comments)
      return res
        .status(404)
        .json({ message: "No comments for this post", success: false });

    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const authorId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    //check if the logged-in user is the owner of the post or not
    if (post.author.toString() != authorId)
      return res.status(403).json({ message: "Unauthorized" });

    //dlt post
    await Post.findByIdAndDelete(postId);

    //remove the post id from the user's post
    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() != postId);
    await user.save();

    //dlt associated comments
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    console.log(error);
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    const user = await user.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      //already bookmarked -> remove from the bookmark
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "unsaved",
        message: "Post removed from bookmark",
        success: true,
      });
    } else {
      //add the post to the bookmark
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({ type: "saved", message: "Post bookmarked", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
