"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import fallbackImage from '@/public/images/avatar.png';
import { useState, useEffect } from "react";
import LetterAvatar from './LetterAvatar';

export default function UserInfo() {
  const { data: session } = useSession();
  const [imageSrc, setImageSrc] = useState<string>(fallbackImage.src);
  const [useLetterAvatar, setUseLetterAvatar] = useState<boolean>(false);
  const [letterAvatarName, setLetterAvatarName] = useState<string>('');
  const [letterAvatarColor, setLetterAvatarColor] = useState<string | undefined>(undefined);

  useEffect(() => {
    console.log('Current session:', session?.user);
    
    if (!session?.user?.email) {
      console.log('No session or email found, using fallback image');
      setImageSrc(fallbackImage.src);
      setUseLetterAvatar(false);
      return;
    }

    if (session.user.image) {
      console.log('User image found:', session.user.image);
      const letterAvatarMatch = session.user.image.match(/(?:\/images\/)?letter-avatar:([^:]+):(.+)/);
      
      if (letterAvatarMatch) {
        console.log('Letter avatar detected');
        setUseLetterAvatar(true);
        
        const [, initials, color] = letterAvatarMatch;
        console.log('Parsed - Initials:', initials, 'Color:', color);
        
        setLetterAvatarName(initials);
        setLetterAvatarColor(color);
      } else {
        console.log('Using regular session image');
        setUseLetterAvatar(false);
        setImageSrc(session.user.image);
      }
    } else {
      console.log('No session image, attempting to fetch from database');
      fetch(`/api/get-image?email=${session.user.email}`)
        .then(res => {
          if (res.ok) {
            return res.blob();
          } else {
            throw new Error('Image not found');
          }
        })
        .then(blob => {
          const url = URL.createObjectURL(blob);
          console.log('Successfully fetched image from database');
          setImageSrc(url);
          setUseLetterAvatar(false);
        })
        .catch(err => {
          console.error("Error fetching profile image:", err);
          setImageSrc(fallbackImage.src);
          setUseLetterAvatar(false);
        });
    }
  }, [session]);

  const avatarSize = 40; // Base size for the avatar

  return (
    <div className="p-0 flex items-center justify-center w-10 h-10 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10">
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-slate-400" />
        {useLetterAvatar ? (
          <div className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden rounded-full">
            <LetterAvatar 
              name={letterAvatarName} 
              size={avatarSize}
              className="w-full h-full"
              predefinedColor={letterAvatarColor}
            />
          </div>
        ) : (
          <Image
            className="rounded-full object-cover relative z-10"
            src={imageSrc}
            alt="User profile picture"
            fill
            sizes="(max-width: 640px) 24px, (max-width: 768px) 32px, 40px"
          />
        )}
      </div>
    </div>
  );
}
