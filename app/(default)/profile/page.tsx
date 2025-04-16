'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import fallbackImage from '@/public/images/avatar.png';
import LetterAvatar from '@/components/ui/LetterAvatar';

interface UserData {
  name: string;
  email: string;
  hasImage: boolean;
  bio: string;
  image?: string;
  imageUrl?: string; 
}

// Helper functions to match what's in other files
const getInitials = (name: string): string => {
  if (!name) return '?';
  
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  }
  
  return name.charAt(0).toUpperCase();
};

const stringToColor = (string: string): string => {
  // List of vibrant colors suitable for avatars
  const colors = [
    "#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e",
    "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50",
    "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6",
    "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d",
    "#6366f1", "#8b5cf6", "#ec4899", "#ef4444", "#f97316",
    "#84cc16", "#14b8a6", "#06b6d4", "#0ea5e9", "#8b5cf6"
  ];
  
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user as UserData | undefined;
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [useLetterAvatar, setUseLetterAvatar] = useState<boolean>(false);
  const [letterAvatarName, setLetterAvatarName] = useState<string>('');
  const [letterAvatarColor, setLetterAvatarColor] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserData();
    }
  }, [session]);

  useEffect(() => {
    // Check if session image is a letter avatar
    if (session?.user?.image && session.user.image.startsWith('letter-avatar:')) {
      setUseLetterAvatar(true);
      
      // Parse the letter avatar format
      const parts = session.user.image.substring('letter-avatar:'.length).split(':');
      if (parts.length >= 2) {
        // New format with both initials and color
        setLetterAvatarName(parts[0]);
        setLetterAvatarColor(parts[1]);
      } else {
        // Old format with just the name
        setLetterAvatarName(parts[0]);
        setLetterAvatarColor(undefined);
      }
    } else {
      setUseLetterAvatar(false);
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/get-user-data?email=${session?.user?.email}`);
      console.log('API Response:', response);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched user data:', data);
        setUserData(data);
        console.log('Set userData:', data);
        setName(data.name || '');
        setBio(data.bio || '');
        
        // Check if we have a letter avatar format
        if (data.image && data.image.startsWith('letter-avatar:')) {
          setUseLetterAvatar(true);
          
          // Parse the letter avatar format
          const parts = data.image.substring('letter-avatar:'.length).split(':');
          if (parts.length >= 2) {
            // New format with both initials and color
            setLetterAvatarName(parts[0]);
            setLetterAvatarColor(parts[1]);
          } else {
            // Old format with just the name
            setLetterAvatarName(parts[0]);
            setLetterAvatarColor(undefined);
          }
          
          setImageSrc(null);
        } else {
          // Use imageUrl or image, whichever is available
          setUseLetterAvatar(false);
          setImageSrc(data.imageUrl || data.image || null);
        }
        
        setImagePreview(null); // Reset preview when fetching new data
        console.log('After setting states:', { name, bio, imageSrc, useLetterAvatar, letterAvatarName, letterAvatarColor });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Set a preview image for the edit form
        setImagePreview(reader.result as string);
        setUseLetterAvatar(false); // Switching to regular image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsEditing(false); // Close the popup immediately

    try {
      console.log('Starting save process');
      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio);
      formData.append('email', session?.user?.email || '');

      if (fileInputRef.current?.files?.[0]) {
        formData.append('image', fileInputRef.current.files[0]);
        console.log('Adding image to form data');
        setUseLetterAvatar(false); // User is uploading their own image
      } else if (!imageSrc && !imagePreview) {
        // If user hasn't uploaded an image, use letter avatar
        // (No need to add it to formData, the API will generate it)
        setUseLetterAvatar(true);
        // The server will generate the appropriate letter avatar format
      }

      console.log('Sending request to /api/profile/update');
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      if (response.ok) {
        const updatedData = await response.json();
        console.log('Updated data:', updatedData);
        
        // Update the user data and image source
        if (updatedData.user) {
          setUserData(updatedData.user);
          
          // Check if the returned image is a letter avatar
          if (updatedData.user.image && updatedData.user.image.startsWith('letter-avatar:')) {
            console.log('Received letter avatar format:', updatedData.user.image);
            setUseLetterAvatar(true);
            
            // Parse the letter avatar format
            const parts = updatedData.user.image.substring('letter-avatar:'.length).split(':');
            if (parts.length >= 2) {
              // New format with both initials and color
              setLetterAvatarName(parts[0]);
              setLetterAvatarColor(parts[1]);
            } else {
              // Old format with just the name
              setLetterAvatarName(parts[0]);
              setLetterAvatarColor(undefined);
            }
            
            setImageSrc(null);
          } else if (updatedData.user.imageUrl) {
            console.log('Setting new image URL:', updatedData.user.imageUrl);
            setImageSrc(updatedData.user.imageUrl);
            setUseLetterAvatar(false);
          } else if (imagePreview && fileInputRef.current?.files?.[0]) {
            // If we have a preview image but no imageUrl in response, keep using the preview
            console.log('Using preview image as no imageUrl in response');
            setImageSrc(imagePreview);
            setUseLetterAvatar(false);
          }
        }
        
        // Reset the preview
        setImagePreview(null);
      } else {
        const errorText = await response.text();
        console.error('Failed to update profile:', errorText);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="container mx-auto py-8">
        <div className="bg-post-bg shadow rounded-lg p-6 max-w-2xl mx-auto">
          <div className="flex flex-col items-center">
            {useLetterAvatar ? (
              <div className="w-32 h-32 mb-4">
                <LetterAvatar 
                  name={letterAvatarName} 
                  size={128} 
                  className=""
                  predefinedColor={letterAvatarColor}
                />
              </div>
            ) : (
              <Image
                src={imagePreview || imageSrc || session?.user?.image || fallbackImage}
                alt="Profile"
                width={128}
                height={128}
                className="w-32 h-32 rounded-full mb-4 object-cover"
              />
            )}
            <h1 className="text-2xl font-bold">{userData?.name || session?.user?.name || ''}</h1>
            <p className="text-gray-600">
              {userData?.email || session?.user?.email || 'Email not available'}
            </p>
            <p className="text-gray-400 mt-2">{userData?.bio || 'Click edit to add your bio'}</p>
            
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-header-bg hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Edit 
            </button>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className={`fixed inset-0 bg-body-bg bg-opacity-80 flex items-center justify-center ${isEditing ? '' : 'hidden'}`}>
          <div className="bg-header-bg rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            
            {/* Profile Image Preview */}
            <div className="mb-4 flex flex-col items-center">
              {useLetterAvatar && !imagePreview ? (
                <div className="w-24 h-24 mb-3">
                  <LetterAvatar 
                    name={letterAvatarName} 
                    size={96} 
                    className=""
                    predefinedColor={letterAvatarColor}
                  />
                </div>
              ) : (
                <Image
                  src={imagePreview || imageSrc || session?.user?.image || fallbackImage}
                  alt="Profile Preview"
                  width={100}
                  height={100}
                  className="w-24 h-24 rounded-full mb-3 object-cover"
                />
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="shadow bg-header-bg appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="bio">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="shadow bg-header-bg appearance-none border rounded w-full text-gray-200 leading-tight focus:outline-none focus:shadow-outline h-24"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="profile-picture">
                Profile Picture
              </label>
              <input
                id="profile-picture"
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="bg-header-bg text-gray-200"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}