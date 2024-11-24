import React from "react";
import Feed from "./Feed";
import RightSidebar from "./RighSidebar";
import { Outlet } from "react-router-dom";
import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";
const Home = () =>{
    useGetAllPost();
    useGetSuggestedUsers();
    return (
        <div className="flex">
            <div className="flex-grow w-full sm:mb-0 mb-14">
                <Feed />
                <Outlet />
            </div>
            <RightSidebar />
        </div>
    )
}

export default Home;