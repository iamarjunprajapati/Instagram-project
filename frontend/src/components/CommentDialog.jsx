import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import React, { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";

const CommentDialog = ({ open, setOpen, post }) => {
  // console.log(post);

  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector(store => store.post);
  const [comment, setComment] = useState(selectedPost?.comments);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(selectedPost){
      setComment(selectedPost.comments)
    }
  },[selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    }
    else {
      setText("");
    }
  }

  const postCommentHandler = async () => {
    try {
      console.log('posting started');

      const res = await axios.post(`https://social-media-project-insta.onrender.com/api/v1/post/${selectedPost?._id}/comment`, { text }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map(p =>
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
        )
        dispatch(setPosts(updatedPostData));
        setText("")
        toast.success(res.data.message);
      }

    } catch (error) {
      console.log(error);
    }
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
              src={selectedPost?.image}
              alt="user-image"
              className=" border"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author.profilePicture} className="w-full object-cover" />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold">{selectedPost?.author?.username}</Link>
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
              {
                comment?.map((comment) => {
                  return <Comment key={comment._id} comment={comment} />
                })
              }
            </div>
            <div className="p-4">
              <div className="flex gap-3">
                <input type="text" placeholder="Add a comment..." value={text} onChange={changeEventHandler} className="w-full outline-none border border-gray-500 py-1 px-2 rounded" />
                <Button disabled={!text.trim()} variant="outline" onClick={postCommentHandler}>Post</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
