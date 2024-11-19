import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    }
    else {
      setText("");
    }
  }
   
  const sendMessageHandler = async () => {
    alert(text);
  }

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => {
          setOpen(false);
        }}
        className="flex flex-col p-0 max-w-4xl"
      >
        <div className="flex justify-between">
          <div className="w-1/2">
            <img
              src="https://images.unsplash.com/photo-1728230516814-a134ddbe2819?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="user-image"
              srcset=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage />
                    <AvatarFallback> CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold">username</Link>
                  {/* <span>bio</span> */}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-semibold ">Unfollow</div>
                  <div className="cursor-pointer w-full font-semibold ">Add to favourites</div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-3">
              comments
            </div>
            <div className="p-4">
              <div className="flex gap-3">
                <input type="text" placeholder="Add a comment..." value={text} onChange={changeEventHandler} className="w-full outline-none border border-gray-500 py-1 px-2 rounded" />
                <Button disabled={!text.trim()} variant="outline" onClick={sendMessageHandler}>Send</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
