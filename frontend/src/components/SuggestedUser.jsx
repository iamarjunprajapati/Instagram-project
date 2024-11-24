import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage } from './ui/avatar';
const SuggestedUser = () => {
    const { suggestedUser } = useSelector(store => store.auth);

    return (
        <div className='my-7'>
            <div className='flex items-center justify-between'>
                <h1 className='font-semibold text-sm text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See All</span>
            </div>
            {
                suggestedUser.map((user) => {
                    return (
                        <div key={user._id} className='flex justify-between my-2 items-center'>
                            <div className='flex items-center gap-2'>
                                <Link to={`/profile/${user._id}`}>
                                    <Avatar>
                                        <AvatarImage src={user?.profilePicture} alt="user-image" className="w-full object-cover" />
                                    </Avatar>
                                </Link>
                                <div>
                                    <h1 className='font-semibold text-sm'><Link to={`/profile/${user._id}`}>{user?.username}</Link></h1>
                                    <span className='text-gray-600 text-sm'>{user?.bio || 'Bio Here...'}</span>
                                </div>
                            </div>
                            <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#4099d4]'>Follow</span>

                        </div>)
                })
            }
        </div>
    )
}

export default SuggestedUser