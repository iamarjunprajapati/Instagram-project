import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetAllMessage from '@/hooks/useGetAllMessage';
import useGetRTM from '@/hooks/useGetRTM';

const Messages = ({ selectedUser }) => {
    useGetRTM();
    // console.log(selectedUser);
    useGetAllMessage();
    const { messages } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);
    // console.log(messages);

    return (
        <div className='flex-1'>
            <div className='flex justify-center'>
                <div className='flex flex-col items-center justify-center'>
                    <Avatar>
                        <AvatarImage src={selectedUser?.profilePicture} />
                    </Avatar>
                    <span >{selectedUser?.username}</span>
                    <Link to={`/profile/${selectedUser?._id}`}>
                        <Button variant="secondary" className="h-8 my-2">View Profile</Button>
                    </Link>
                </div>
            </div>
            <div className="flex flex-col gap-3 mb-[10rem]">
                {
                    messages && messages.map((msg) => {
                        return (
                            <div key={msg?._id} className={`flex ${msg?.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`mx-3 p-2 rounded max-w-xs break-words ${msg.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                                    {msg.message}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
export default Messages;