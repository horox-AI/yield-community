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
    if (session?.user?.image) {
      // Check if it's a letter avatar format
      if (session.user.image.startsWith('letter-avatar:')) {
        setUseLetterAvatar(true);
        
        // Parse the letter avatar format (letter-avatar:INITIALS:COLOR)
        const parts = session.user.image.substring('letter-avatar:'.length).split(':');
        
        if (parts.length >= 2) {
          // New format with initials and color
          setLetterAvatarName(parts[0]);
          setLetterAvatarColor(parts[1]);
        } else {
          // Old format with just the name
          setLetterAvatarName(parts[0]);
          setLetterAvatarColor(undefined);
        }
      } else {
        // Regular image
        setUseLetterAvatar(false);
        setImageSrc(session.user.image);
      }
    } else if (session?.user?.email) {
      // If no Google image, try to fetch user-uploaded image
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
          setImageSrc(url);
          setUseLetterAvatar(false);
        })
        .catch(err => {
          console.error("Error fetching profile image:", err);
          setImageSrc(fallbackImage.src);
          setUseLetterAvatar(false);
        });
    } else {
      // If no session or email, use fallback image
      setImageSrc(fallbackImage.src);
      setUseLetterAvatar(false);
    }
  }, [session]);

  return (
    <div className="p-0 flex flex-col gap-3 w-10 h-10 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10">
      <div className="relative w-full h-full">
        <div className="absolute inset-0 rounded-full border-4 border-slate-400">
          {useLetterAvatar ? (
            <LetterAvatar 
              name={letterAvatarName} 
              size={40} 
              className="relative z-10"
              predefinedColor={letterAvatarColor}
            />
          ) : (
            <Image
              className="rounded-full object-cover relative z-10"
              src={imageSrc}
              alt="User profile picture"
              width={40}
              height={40}
              onError={() => {
                console.error("Error loading image, falling back to default");
                setImageSrc(fallbackImage.src);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
