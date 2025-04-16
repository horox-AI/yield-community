'use client'

import Image from 'next/image'
import React, { useState } from 'react';
import Link from 'next/link'
import HeaderLogo from '@/components/ui/header-logo'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'; // Import the icon for the three vertical dots
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import UserInfo from '@/components/ui/userInfo';
import { faRocket, faUsers, faBook, faPodcast, faHandshake, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { signIn, signOut, useSession } from "next-auth/react";

export default function HeaderLogin() {

    const { status, data: session } = useSession();
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    
    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen)
    };

    const closeDropdown = () => {
        setIsUserDropdownOpen(false);
    };

    const handleSignOut = () => {
        closeDropdown();
        signOut();
    };

    return (

        <div className="relative flex grow justify-end flex-wrap items-center">
      {status === 'authenticated' ? (
        <div className="relative">
          <button 
            onClick={toggleUserDropdown} 
            className="text-sm font-bold text-slate-400 hover:text-slate-200 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out"
          >
            <UserInfo />
          </button>
          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-0 py-2 w-48 bg-header-bg rounded-md shadow-xl z-20">
              <Link 
                href="/profile" 
                className="block px-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-200"
                onClick={closeDropdown}
              >
                PROFILE
              </Link>
              <button 
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-200"
              >
                SIGN OUT
              </button>
            </div>
          )}
        </div>
            ) : (
                console.log('Not authenticated, showing login/signup links'),
                // User is not logged in, show Log In and Sign Up links
                //<div className="relative  md:flex items-center space-x-3 ml-3">
                    <ul className="flex grow justify-end flex-wrap items-center">
                        <li>
                            <Link href="/signin" className="text-sm font-bold text-slate-400 hover:text-slate-200 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out">
                                LOG IN
                            </Link>
                        </li>
                        <li className="ml-3">
                            <Link href="/join" className="btn-sm font-bold text-white bg-button-600-bg hover:bg-button-500-bg w-full">
                                SIGN UP
                            </Link>
                        </li>
                    </ul>
               // </div>
            )}
        </div>
    );
}