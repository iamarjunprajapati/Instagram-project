import React from "react";
import Feed from "./Feed";
import RightSidebar from "./RighSidebar";
import { Outlet } from "react-router-dom";
import useGetAllPost from "@/hooks/useGetAllPost";
const Home = () =>{
    useGetAllPost();
    return (
        <div className="flex">
            <div className=" flex-grow">
                <Feed></Feed>
            
            </div>
            <RightSidebar />
        </div>
    )
}

export default Home;