'use client'

import Image from 'next/image'
import React, { useState } from 'react';
import Link from 'next/link'
import HeaderLogo from '@/components/ui/header-logo'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import UserInfo from '@/components/ui/userInfo';
import { faRocket, faUsers, faBook, faPodcast, faHandshake, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { signIn, signOut, useSession } from "next-auth/react";
import HeaderLogin from './headerLogin';

export default function Header() {
  const { status, data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleCloseMenu = () => { setIsMenuOpen(false) };
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  
  const toggleExplore = () => {
    setIsExploreOpen(!isExploreOpen);
  };

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen)
  };

  return (
    <header className="absolute w-full bg-header-bg z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 md:h-16">
          <HeaderLogo />

           {/* Desktop navigation */}
           <nav className="flex grow">
            {/* Desktop Links */}
            <div className="relative hidden md:flex items-center space-x-3 ml-3">
              <Link href="/start" className="text-sm font-bold text-slate-400 hover:text-slate-200">
                START
              </Link>

              <button 
                onClick={toggleExplore} 
                className={`block text-sm font-bold ${isExploreOpen ? 'text-slate-200' : 'text-slate-400'} hover:text-slate-200`}
              >
                EXPLORE
              </button>

              {/* Horizontal sliding links container */}
              <div className="flex overflow-hidden">
                <div 
                  className={`flex space-x-12 transition-transform duration-300 ml-6 ${
                    isExploreOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'
                  }`}
                >
                  <Link href="/" 
                    className="text-sm font-bold text-slate-400 hover:text-red-400 whitespace-nowrap"
                    onClick={toggleExplore}
                  >
                    Community
                  </Link>
                  
                  <Link href="/expert-directory" 
                    className="text-sm font-bold text-slate-400 hover:text-yellow-200 whitespace-nowrap"
                    onClick={toggleExplore}
                  >
                    Browse Expert
                  </Link>
                  
                  <Link href="/" 
                    className="text-sm font-bold text-slate-400 hover:text-green-400 whitespace-nowrap"
                    onClick={toggleExplore}
                  >
                    Podcast
                  </Link>
                  
                  <Link href="/" 
                    className="text-sm font-bold text-slate-400 hover:text-blue-400 whitespace-nowrap"
                    onClick={toggleExplore}
                  >
                    Circles
                  </Link>
                  
                  <Link href="/" 
                    className="text-sm font-bold text-slate-400 hover:text-pink-400 whitespace-nowrap"
                    onClick={toggleExplore}
                  >
                    Newsletter
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden ml-2 text-slate-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>

            {/* Full Page Mobile Menu Overlay */}
            {isMenuOpen && (
              <div className="fixed inset-0 bg-body-bg z-50 mt-1">
                {/* Top Bar with Logo and Close Button */}
                <div className="w-full bg-header-bg flex justify-center items-center">
                  {/* Logo */}
                  <Link href="/" passHref>
                    <div className="flex justify-center w-full">
                      <HeaderLogo />
                    </div>
                  </Link>
                  {/* Close Button */}
                  <button onClick={handleCloseMenu} className="absolute right-5">
                    <FontAwesomeIcon icon={faTimes} className="text-white" size="lg" />
                  </button>
                </div>

                {/* Menu Items with Icons */}
                <div className="mt-10 px-4 space-y-6 text-between w-full">
                  <Link href="/start" passHref>
                    <div className="text-orange-400 text-l font-bold" onClick={handleCloseMenu}>
                      <FontAwesomeIcon icon={faRocket} className="mr-2 w-6 justify-center" />
                      <span>START</span>
                    </div>
                  </Link>

                  <Link href="/" passHref>
                    <div className="text-red-400 text-l font-bold mt-5" onClick={handleCloseMenu}>
                      <FontAwesomeIcon icon={faUsers} className="mr-2 w-6 justify-center" />
                      <span>COMMUNITY</span>
                    </div>
                  </Link>

                  <Link href="/expert-directory" passHref>
                    <div className="text-yellow-200 text-l font-bold mt-5" onClick={handleCloseMenu}>
                      <FontAwesomeIcon icon={faBook} className="mr-2 w-6 justify-center" />
                      <span>BROWSE EXPERT</span>
                    </div>
                  </Link>

                  <Link href="/" passHref>
                    <div className="text-green-400 text-l font-bold mt-5" onClick={handleCloseMenu}>
                      <FontAwesomeIcon icon={faPodcast} className="mr-2 w-6 justify-center" />
                      <span>PODCAST</span>
                    </div>
                  </Link>

                  <Link href="/" passHref>
                    <div className="text-blue-400 text-l font-bold mt-5" onClick={handleCloseMenu}>
                      <FontAwesomeIcon icon={faHandshake} className="mr-2 w-6 justify-center" />
                      <span>CIRCLES</span>
                    </div>
                  </Link>

                  <Link href="/" passHref>
                    <div className="text-pink-400 text-l font-bold mt-5" onClick={handleCloseMenu}>
                      <FontAwesomeIcon icon={faEnvelope} className="mr-2 w-6 justify-center" />
                      <span>NEWSLETTER</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            <HeaderLogin />
          </nav>
        </div>
      </div>
    </header>
  )
}