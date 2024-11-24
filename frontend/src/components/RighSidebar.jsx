// File: RightSidebar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';
import SuggestedUser from './SuggestedUser';

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className='hidden md:block w-fit my-10 pr-5'>
      <div className='flex items-center gap-2'>
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="user-image" className="w-full object-cover" />
          </Avatar>
        </Link>
        <div>
          <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
          <span className='text-gray-600 text-sm'>{user?.bio || 'Bio Here...'}</span>
        </div>
      </div>
      <SuggestedUser />
    </div>
  )
}

export default RightSidebar;
