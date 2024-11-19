import React from "react";
import { Outlet } from "react-router-dom";
import LeftSideBar from "./LeftSideBar";
const MainLayout = () =>{
    
    return (
        <>
        <LeftSideBar />
        <div>
            <Outlet/>
        </div>
        </>
    )
}

export default MainLayout;