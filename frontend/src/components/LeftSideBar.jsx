// File: LeftSideBar.jsx
import {
  Home,
  Search,
  TrendingUp,
  MessageCircle,
  PlusSquare,
  Heart,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { useState } from "react";
import CreatePost from "./CreatePost";
import myImage from '../assets/blank-profile-picture.png';
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(store => store.realTimeNotification);

  const logoutHandler = async () => {
    try {
      let res = await axios.get("https://social-media-project-insta.onrender.com/api/v1/user/logout", { withCredentials: true });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const SidebarHandler = (button) => {
    if (button === "Logout") {
      logoutHandler();
    } else if (button === "Create") {
      setOpen(true);
    } else if (button === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (button === "Home") {
      navigate(`/`);
    } else if (button === "Messages") {
      navigate(`/chat`);
    }
  };

  const SidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Trending" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage
            src={user ? user.profilePicture : myImage}
            className="w-full object-cover"
          />
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-10 px-4 border-t items-center justify-center border-gray-300 bg-white w-full h-14 md:h-screen md:w-[17%] md:border-t-0 md:border-r md:top-0 md:left-0 md:flex md:flex-col overflow-x-hidden flex ">
      <div className="flex md:flex-col">
        {SidebarItems.map((e, index) => {
          return (
            <div
              key={index}
              onClick={() => SidebarHandler(e.text)}
              className="flex items-center gap-3 my-1 p-3 relative hover:bg-gray-100 cursor-pointer rounded-xl"
            >
              <span>{e.icon}</span> <span className="hidden md:block">{e.text}</span>
              {e.text === 'Notifications' && likeNotification?.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="icon" className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">{likeNotification.length}</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div>
                      {
                        likeNotification?.length === 0 ? (<p>No New Notification</p>) : (
                          likeNotification.map((notification) => {
                            return (
                              <div key={notification?.userId} className="flex gap-2 items-center">
                                <Avatar>
                                  <AvatarImage src={notification?.userDetails?.profilePicture} className="w-full object-cover">
                                  </AvatarImage>
                                </Avatar>
                                <p className="text-sm"><span className="font-bold">{notification?.userDetails?.username}</span> liked your post</p>
                              </div>
                            )
                          })
                        )
                      }
                    </div>
                  </PopoverContent>
                </Popover>)}
            </div>
          );
        })}
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSideBar;
