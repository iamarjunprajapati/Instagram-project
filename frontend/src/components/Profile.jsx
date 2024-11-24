import useGetUserPofile from '@/hooks/useGetUserProfile'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { FaHeart } from 'react-icons/fa';
import { MessageCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { setUserProfile } from '@/redux/authSlice';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserPofile(userId);
  const [activeTab, setActiveTab] = useState('posts');
  const { userProfile, user } = useSelector(store => store.auth);
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const dispatch = useDispatch();
  // console.log(isLoggedInUserProfile);
  const isFollowing = userProfile?.followers.includes(user._id);

 
  const followUnfollowHandler = async () => {
    let res = await axios.post(`http://localhost:8000/api/v1/user/followorunfollow/${userProfile?._id}`,{},{withCredentials:true});
    if (res.data.success) {
      toast.success(res.data.message);
    }
    
  }
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }
  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;
  

  return (
    <div className='flex justify-center sm:ml-[18%]'>
      <div className='flex flex-col '>
        <div className="flex items-center justify-center py-4 px-0 sm:px-10 sm:py-10">
          <div className='flex gap-10 sm:gap-20 w-[80%]'>
            <section className='flex items-center justify-center w-[30%]'>
              <Avatar className="h-16 w-16 sm:h-40 sm:w-40">
                <AvatarImage src={userProfile?.profilePicture} alt="user-image" className="object-cover h-full" />
              </Avatar>
            </section>
            <section className='w-full'>
              <div className='flex flex-col gap-3'>
                <div className="flex items-center gap-2">
                  <span className=' text-[20px] font-semibold'>{userProfile?.username}</span>
                  {
                    isLoggedInUserProfile ? (
                      <div className="flex flex-wrap gap-2">
                        <Link to={`/account/edit`}>
                          <Button variant="secondary" className="hover:bg-gray-200 h-8 rounded-xl flex-1">
                            Edit profile
                          </Button>
                        </Link>
                        <Button variant="secondary" className="hover:bg-gray-200 h-8 rounded-xl w-full sm:w-auto">
                          Ad tools
                        </Button>
                        <Button variant="secondary" className="hover:bg-gray-200 h-8 rounded-xl flex-1">
                          View archive
                        </Button>
                      </div>

                    ) : ( 
                      isFollowing ? (
                        <>
                          <Button variant="secondary" className="rounded-xl h-8" onClick={followUnfollowHandler}>Unfollow</Button>
                          <Button variant="secondary" className="rounded-xl h-8">Message</Button>
                        </>
                      ) : (
                        <Button className="rounded-xl bg-[#0095F6] hover:bg-[#54baff] h-8" onClick={followUnfollowHandler} >Follow</Button>
                      )
                    )
                  }
                </div>
                <div className='flex items-center gap-4'>
                  <p><span className='font-semibold'>{userProfile?.posts.length}</span> posts</p>
                  <p><span className='font-semibold'>{userProfile?.followers?.length}</span> followers</p>
                  <p><span className='font-semibold'>{userProfile?.following?.length}</span> following</p>
                </div>

              </div>
            </section>
          </div>
        </div>
        <div className='flex flex-col gap-1 sm:py-4 p-4 '>
          <span className='font-semibold'>{userProfile?.bio || 'Bio here...'}</span>
          <span>😅 This is my first full mern-stack project. </span>
          <span>😅 This is my first full mern-stack project. </span>
          <span>😅 This is my first full mern-stack project. </span>
        </div>
        <div className='border-t border-t-gray-200'>
          <div className="flex items-center justify-center gap-10 text-sm">
            <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ""}`} onClick={() => handleTabChange('posts')}>
              POSTS
            </span>
            <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ""}`} onClick={() => handleTabChange('saved')}>
              SAVED
            </span>
            <span className={`py-3 cursor-pointer ${activeTab === 'reels' ? 'font-bold' : ""}`} onClick={() => handleTabChange('reels')}>
              REELS
            </span>
            <span className={`py-3 cursor-pointer ${activeTab === 'tags' ? 'font-bold' : ""}`} onClick={() => handleTabChange('tags')}>
              TAGS
            </span>
          </div>
          <div className='grid grid-cols-3 gap-1 sm:mb-0 mb-16'>
            {
              displayedPost?.map((post) => {
                return (
                  <div key={post?._id} className='relative group cursor-pointer'>
                    <img src={post.image} alt="post-image" className='rounded-sm my-1 aspect-square object-cover' />
                    <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <div className='flex items-center text-white space-x-4'>
                        <button className='flex items-center gap-2 hover:text-gray-300'>
                          <FaHeart />
                          <span>{post.likes.length}</span>
                        </button>
                        <button className='flex items-center gap-2 hover:text-gray-300'>
                          <MessageCircle />
                          <span>{post.likes.length}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile