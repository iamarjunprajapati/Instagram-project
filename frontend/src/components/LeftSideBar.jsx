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
import myImage from '../assets/blank-profile-picture.png'

const LeftSideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const logoutHandler = async () => {
    try {
      let res = await axios.get("http://localhost:8000/api/v1/user/logout");
      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const SidebarHandler = (button) => {
    if (button === "Logout") {
      logoutHandler();
    } else if (button === "Create") {
      setOpen(true);
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
            src={user? user.profilePicture:myImage}
            className="w-full object-cover"
          />
          <AvatarFallback></AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col">
        <h1>Logo</h1>
        <div>
          {SidebarItems.map((e, index) => {
            return (
              <div
                key={index}
                onClick={() => SidebarHandler(e.text)}
                className="flex items-center gap-3 my-1 p-3 relative hover:bg-gray-100 cursor-pointer rounded-xl"
              >
                <span>{e.icon}</span> <span>{e.text}</span>
              </div>
            );
          })}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSideBar;
