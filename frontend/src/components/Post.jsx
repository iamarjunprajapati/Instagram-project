import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { MoreHorizontal } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  FaRegComment,
  FaRegHeart,
  FaHeart,
  FaRegBookmark,
} from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import CommentDialog from "./CommentDialog";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();


  const likeDislikeHandler = async () => {
    try {
      const action = liked ? 'dislike' : 'like';
      const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/${action}`, { withCredentials: true });
      if (res.data.success) {
        // console.log('data with success');

        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        // post updation
        const updatedPostData = posts.map(p =>
          p._id === post._id ? {
            ...p,
            likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
          } : p
        );
        dispatch(setPosts(updatedPostData))
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    }
  }

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  }
  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post._id}`, { withCredentials: true });
      if (res.data.success) {
        const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id);
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    }
    catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }

  const commentHandler = async () => {
    try {
      console.log('posting started');
      const res = await axios.post(`http://localhost:8000/api/v1/post/${post._id}/comment`, { text }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);
        const updatedPostData = posts.map(p =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        )
        dispatch(setPosts(updatedPostData));
        setText("")
        toast.success(res.data.message);
      }

    } catch (error) {
      console.log(error);
    }
  }

  const bookmarkHandler = async () => {
    try {
      let res = await axios.get(`https://social-media-project-insta.onrender.com/api/v1/post/${post?._id}/bookmark`, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className="my-4 w-full max-w-sm sm:ml-[25%] m-auto">
      <div className="flex px-4 sm:px-0 items-center justify-between">
        <div className="flex my-3 items-center gap-2">
          <Link to={`/profile/${post?.author._id}`}>
            <Avatar className="w-6 h-6">
              <AvatarImage src={post.author?.profilePicture} alt="user-image" className="w-full object-cover" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <h1>{post.author.username} {user?._id === post.author._id && <Badge variant="secondary"> Author </Badge>}</h1>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer"></MoreHorizontal>
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center ">
            <Button variant="ghost" className="mx-3 w-fit ">
              Unfollow
            </Button>
            <Button variant="ghost" className="mx-3 w-fit ">
              Add to favourites
            </Button>
            {
              user && user?._id === post?.author._id && <Button variant="ghost" className="mx-3 w-fit text-[#ED4956]" onClick={deletePostHandler}> Delete
              </Button>
            }
          </DialogContent>
        </Dialog>
      </div>
      <img
        src={post.image}
        alt="post-image"
        className="rounded-xl my-2 w-full aspect-square object-contain border-md"
      />
      <div className=" flex justify-between px-4 sm:px-0 items-center">
        <div className="flex gap-4 py-2">
          {
            liked ? <FaHeart size={"22px"} className="cursor-pointer overflow-hidden text-red-600 " onClick={likeDislikeHandler} /> :
              <FaRegHeart size={"22px"} className="cursor-pointer hover:text-gray-600 " onClick={likeDislikeHandler}
              />
          }

          <FaRegComment size={"22px"} className="cursor-pointer hover:text-gray-600" onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }} />
          <FiSend
            size={"22px"}
            className="cursor-pointer hover:text-gray-600"
          />
        </div>
        <div>
          <FaRegBookmark onClick={bookmarkHandler}
            size={"22px"}
            className="cursor-pointer hover:text-gray-600"
          />
        </div>
      </div>
      <span className="font-medium block px-4 sm:px-0 mb-2">{postLike} likes </span>
      <p className="font-bold px-4 sm:px-0"> {post.author.username}
        <span className="text-sm font-normal ml-2">{post.caption}</span>
      </p>
      {
        comment.length > 0 && <span className="hover:cursor-pointer px-4 sm:px-0" onClick={() => {
          dispatch(setSelectedPost(post));
          setOpen(true);
        }} >View all {post.comments.length} comments </span>
      }
      <CommentDialog open={open} setOpen={setOpen} post={post} />
      <div className="flex px-4 sm:px-0 justify-between h-8">
        <input type="text" placeholder="Add a comment..." value={text} onChange={changeEventHandler} className="outline-none text-sm w-full" />
        {
          text && <span className="text-[#3BADF8]" onClick={commentHandler}>Post</span>
        }
      </div>
    </div>
  );
};

export default Post;
