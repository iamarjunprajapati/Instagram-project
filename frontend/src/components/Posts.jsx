import React from "react";
import Post from "./Post";
import { useSelector } from "react-redux";

const Posts = () => {
  const {posts} = useSelector(store =>store.post); 
  return (
    <div className="flex items-center flex-1 flex-col my-5 content-center">
      {posts.map((post) => (
        <Post key={post._id} post={post}/>
      ))}
    </div>
  );
};

export default Posts;
