import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

const CommentDialog = ({ open, setOpen }) => {
  //use for input text in dialog box
  const [text, setText] = useState("");

  //after writing the comment check comment is there or not then set the text
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if(inputText.trim()){
      setText(inputText);
    }else{
      setText("");
    }
  }

  //used for interecting with backend for input comment
  const sendMessageHandler = async () => {
    alert(text);
  }

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="min-w-5xl p-0 flex flex-col"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              src="https://plus.unsplash.com/premium_photo-1737047260023-59e065679bf8?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D"
              alt="post_img"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>

                <div>
                  <Link className="font-semibold text-xs ">username</Link>
                  {/* <span className="text-gray-600 text-sm">Bio here...</span> */}
                </div>
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
                  <Button variant="ghost" className="cursor-pointer w-fit ">
                    Delete
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
            <hr />

            {/* for comments */}
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              comments shows here
            </div>
            <hr />

            {/* input space div*/}
            <div className="flex items-center gap-2 m-2">
              <input type="text" value={text} onChange={changeEventHandler} placeholder="Add a comment..." className="w-full outline-none border border-gray-300 p-2 rounded"/>
              <Button disabled={!text.trim()} onClick={sendMessageHandler} variant="outline">Send</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
