import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import MainLayout from "./components/MainLayout.jsx";
import Home from "./components/Home.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Profile from "./components/Profile.jsx";
import EditProfile from "./components/EditProfile.jsx";
// import ChatPage from "./components/chatPage.jsx";
import { io } from 'socket.io-client';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";
import ProtectedRoute from "./components/ProtectedRoute";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute> <MainLayout /> </ProtectedRoute>,
    children: [
      {
        path: "/",
        element: <ProtectedRoute><Home></Home></ProtectedRoute>,
      },
      {
        path: "/profile/:id",
        element: <ProtectedRoute> <Profile /></ProtectedRoute>,
      },
      {
        path: "/account/edit",
        element: <ProtectedRoute><EditProfile /></ProtectedRoute>,
      },
      // {
      //   path: "/chat",
      //   element: <ProtectedRoute> <ChatPage /></ProtectedRoute>,
      // },

    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

function App() {
  const { user } = useSelector(store => store.auth);
  const { socket } = useSelector(store => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:8000', {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));
      // listening all events
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      })

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    } else if (socket) {
      socket?.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
