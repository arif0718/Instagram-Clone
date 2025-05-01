import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";

const Post = ({post}) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
   const {user} = useSelector(store => store.auth);
   const {posts} = useSelector(store => store.post);
   const dispatch = useDispatch();
   const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
   const [postLike, setPostLike] = useState(post.likes.length);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? 'dislike' : 'like';
      const res = await axios.get(`http://localhost:8000/api/v1/post/${post?._id}/${action}`, {withCredentials:true});
      if(res.data.success){
        const updatedLikes = liked?postLike-1 : postLike+1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        // after refresing the page like data get lost so we have to updata store
        const updatedpostData = posts.map(p => 
          p._id == post._id ?{
            ...p,
            likes: liked?p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
          } : p
        );
        dispatch(setPosts(updatedpostData));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const deleteHandler = async () => {
    try {
      const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post?._id}`, {withCredentials:true});
      if(res.data.success){
        const updatedPostData = posts.filter((postItem) => postItem?._id != post?._id);
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }

  return (
    // w-full property we remove
    <div className="my-8 max-w-sm mx-auto">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="post-image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>{post.author?.username}</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit ">
              Add to favorites
            </Button>
            {
              user && user?._id == post?.author._id && <Button onClick={deleteHandler} variant="ghost" className="cursor-pointer w-fit ">
              Delete
            </Button>
            }
            
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post.image}
        alt="post_img"
      />

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          <FaRegHeart onClick={likeOrDislikeHandler}
            size={"22px"}
            className="cursor-pointer hover:text-gray-600"
          />{" "}
          {/* icon taken by react-icons for using this 1st i it by "npm i react-icons" */}
          <MessageCircle onClick={()=> setOpen(true)} className="cursor-pointer hover:text-gray-600" />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>

      <span className="font-medium block mb-2">{postLike} likes</span>
      <p>
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post.caption}
      </p>
      <span onClick={()=> setOpen(true)} className="cursor-pointer text-sm text-gray-400" >View all 10 comments</span>
      <CommentDialog open={open} setOpen={setOpen} />

      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full"
        />
        {text && <span className="text-[#3BADF8]">Post</span>}
      </div>

    </div>
  );
};

export default Post;
