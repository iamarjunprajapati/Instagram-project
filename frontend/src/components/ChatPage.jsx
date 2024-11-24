import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { MessageCircleCode, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';
import { toast } from 'sonner';

const ChatPage = () => {
    const [textMessage, setTextMessage] = useState("");
    const { user, suggestedUser, selectedUser } = useSelector((store) => store.auth);
    const { onlineUsers, messages } = useSelector(store => store.chat);
    const dispatch = useDispatch();
    // console.log(selectedUser);
    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/message/send/${receiverId}`, { textMessage }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                console.log(res.data.newMessage);
                setTextMessage("")
            }
        } catch (error) {
            console.log(error);

        }
    }
    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null))
        }
    }, [])

    return (
        <div className='flex md:ml-[17%] w-md-full m-[0%] h-screen'>
            {
                !selectedUser && <section className="w-full sm:w-auto">
                    <h1 className='font-bold mb-4 px-3 text-xl'>{user?.username}</h1>
                    <hr className='mb-4 border-gray-300' />
                    <div className='overflow-y-auto h-[80vh]'>
                        {
                            suggestedUser.map((user) => {
                                const isOnline = onlineUsers.includes(user?._id)
                                return (
                                    <div key={user?._id} onClick={() => { dispatch(setSelectedUser(user)) }} className='flex gap-3 items-center p-3 pr-md-40 hover:bg-gray-50 cursor-pointer'>
                                        <Avatar>
                                            <AvatarImage src={user?.profilePicture} />
                                        </Avatar>
                                        <div className='flex flex-col'>
                                            <span className='font-medium '>{user?.username}</span>
                                            <span className={`text-xs ${isOnline ? 'text-green-600' : 'text-red-600'} font-bold `}>{isOnline ? "Online" : "Offline"}</span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </section>
            }

            {
                selectedUser ? (
                    <section className='flex flex-1 border-l-gray-300 flex-col h-full border-l'>
                        <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10'>
                            <Avatar>
                                <AvatarImage src={selectedUser?.profilePicture} alt="suggested-user-image" className="w-full object-cover" />
                            </Avatar>
                            <div className='flex fle-col'>
                                <span>{selectedUser?.username}</span>
                            </div>
                        </div>
                        <Messages selectedUser={selectedUser} />
                        <div className="flex items-center bg-white p-4 border-t border-t-gray-300 fixed bottom-0 w-[100%] md:w-[82%] mb-14 md:mb-0 ">
                            <Input value={textMessage} onChange={(e) => { setTextMessage(e.target.value) }} type="text" className="flex-1 mr-2 focus-visible:ring-transparent" placeholder="Messages..." />
                            <Button type="text" onClick={() => sendMessageHandler(selectedUser?._id)} > Send </Button>
                        </div>
                    </section>
                ) : (
                    <div className='hidden md:flex flex-col items-center justify-center m-auto border-l'>
                        <MessageCircleCode className='w-32 h-32 my-4' />
                        <h1 className='font-medium text-xl'>Your Messages</h1>
                        <span>Send a message to start a converstion</span>
                    </div>
                )
            }
        </div>
    )
}

export default ChatPage;