import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setAuthUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const EditProfile = () => {
    const imageRef = useRef();
    const { user, userProfile } = useSelector(store => store.auth);

    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        profilePhoto: user?.profilePicture,
        bio: user?.bio,
        gender: userProfile?.gender || '' // Use a default value if userProfile is null
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, profilePhoto: file });
        }
    };

    const selectChangeHandler = (value) => {
        setInput({ ...input, gender: value });
    };

    const editProfileHandler = async () => {
        const formData = new FormData();
        formData.append('bio', input.bio);
        formData.append('gender', input.gender);
        if (input.profilePhoto) {
            formData.append('profilePicture', input.profilePhoto);
        }
        try {
            setLoading(true);
            const res = await axios.post("https://social-media-project-insta.onrender.com/api/v1/user/profile/edit", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedUserData = {
                    ...user,
                    bio: res.data.user?.bio,
                    profilePicture: res.data.user?.profilePicture,
                    gender: res.data.user?.gender
                };
                dispatch(setAuthUser(updatedUserData));
                toast.success(res.data.message);
                navigate(`/profile/${user?._id}`);
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex max-w-2xl mx-auto pl-md-10 px-2'>
            <section className='flex flex-col gap-6 w-full my-8'>
                <h1 className='font-bold text-xl'>Edit Profile</h1>
                <div className='flex items-center justify-between bg-gray-100 rounded-xl p-4'>
                    <div className='flex items-center gap-3'>
                        <Avatar>
                            <AvatarImage src={user.profilePicture} className="w-full object-cover"></AvatarImage>
                        </Avatar>

                        <div>
                            <h1 className='font-semibold text-sm'>{user?.username}</h1>
                            <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
                        </div>
                    </div>
                    <input type="file" ref={imageRef} onChange={fileChangeHandler} className='hidden' />
                    <Button onClick={() => imageRef?.current.click()} className="rounded"> Change Photo</Button>
                </div>
                <div>
                    <h1 className='fond-bold text-xl mb-2'>
                        Bio
                    </h1>
                    <Textarea value={input.bio} onChange={e => setInput({ ...input, bio: e.target.value })} className="focus:visible ring-transparent rounded" name="bio" />
                </div>
                <div>
                    <h1 className='fond-bold text-xl mb-2'>
                        Gender
                    </h1>
                    <Select className="rounded" defaultValue={input?.gender} onValueChange={selectChangeHandler}>
                        <SelectTrigger className="rounded  w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex justify-end'>
                    {
                        loading ? <Button className="w-fit rounded">
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait</Button> :
                            <Button className="w-fit rounded" onClick={editProfileHandler}>Submit</Button>
                    }

                </div>
            </section >
        </div >
    );
};

export default EditProfile;
