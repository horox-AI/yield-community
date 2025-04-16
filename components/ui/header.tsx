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
import HeaderLogin from './headerLogin';








export default function Header() {

  const { status, data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleCloseMenu = () => { setIsMenuOpen(false) };
  const [isExploreDropdownOpen, setIsExploreDropdownOpen] = useState(false);
  const toggleExploreDropdown = () => {
    setIsExploreDropdownOpen(!isExploreDropdownOpen)
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

            {/* Additional Links or Elements */}



            {/* Desktop Links */}
            <div className=" relative hidden md:flex items-center space-x-3 ml-3">
              <Link href="/start" className="text-sm font-bold text-slate-400 hover:text-slate-200">
                START
              </Link>

              <button onClick={toggleExploreDropdown} className="block text-sm font-bold text-slate-400 hover:text-slate-200">
                EXPLORE
              </button>

              {/* Explore Dropdown Menu */}
              {isExploreDropdownOpen && (
                <div className="absolute top-full left-8 mt-2 py-2 w-48 bg-header-bg rounded-md shadow-xl z-20"
                >
                  <Link href="/start" passHref>
                    <div className="block px-4 py-2 text-sm font-bold capitalize text-red-400 hover:bg-post-bg " onClick={toggleExploreDropdown}>
                      COMMUNITY
                    </div>
                  </Link>

                  <Link href="/" passHref>
                    <div className="block px-4 py-2 text-sm font-bold capitalize text-yellow-200 hover:bg-post-bg "
                      onClick={toggleExploreDropdown}>
                      SERVICES
                    </div>
                  </Link>
                  <Link href="/" passHref>
                    <div className="block px-4 py-2 text-sm font-bold capitalize text-green-400 hover:bg-post-bg "
                      onClick={toggleExploreDropdown}>
                      PODCAST
                    </div>
                  </Link>
                  <Link href="/" passHref>
                    <div className="block px-4 py-2 text-sm font-bold capitalize text-blue-400 hover:bg-post-bg "
                      onClick={toggleExploreDropdown}>
                      MEETUPS
                    </div>
                  </Link>
                  <Link href="/" passHref>
                    <div className="block px-4 py-2 text-sm font-bold capitalize text-pink-400 hover:bg-post-bg "
                      onClick={toggleExploreDropdown}>
                      NEWSLETTER
                    </div>
                  </Link>

                  {/* Add more dropdown links as needed */}
                </div>
              )}



            </div>






            {/* Mobile Menu Button */}
            <button className="md:hidden ml-2 text-slate-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="absolute top-full left-0 bg-white shadow-md rounded-lg p-3 z-50 ml-3">
                <Link href="/start" className="block text-sm font-bold text-slate-400 hover:text-slate-200">
                  START
                </Link>
                <Link href="/start" className="block text-sm font-bold text-slate-400 hover:text-slate-200">
                  EXPLORE
                </Link>
              </div>






            )}



            {/* Full Page Mobile Menu Overlay */}
            {isMenuOpen && (
              <div className="fixed inset-0 bg-body-bg z-50 mt-1" >
                {/* Top Bar with Logo and Close Button */}
                <div className="w-full bg-header-bg flex justify-center flex items-center ">
                  {/* Logo */}
                  <Link href="/" passHref>
                    <div className="flex justify-center w-full">
                      {/* Replace with your logo */}
                      <HeaderLogo />
                    </div>
                  </Link>
                  {/* Close Button */}
                  <button onClick={handleCloseMenu} className="absolute  right-5">
                    <FontAwesomeIcon icon={faTimes} className="text-white" size="lg" />
                  </button>
                </div>

                {/* Menu Items with Icons */}
                <div className="mt-10 px-4 space-y-6 text-between w-full">

                  <Link href="/start" passHref>
                    <div className="text-orange-400 text-l font-bold" onClick={handleCloseMenu}>
                      <FontAwesomeIcon icon={faRocket} className="mr-2 w-6 justify-center" /> {/* Icon with some margin */}
                      <span>START</span>
                    </div>
                  </Link>

                  <Link href="/" passHref>
                    <div className="text-red-400 text-l font-bold mt-5" onClick={handleCloseMenu}>
                      <FontAwesomeIcon icon={faUsers} className="mr-2 w-6 justify-center" /> {/* Icon with some margin */}
                      <span>COMMUNITY</span>
                    </div>
                  </Link>

                  <Link href="/" passHref>
                    <div className="text-yellow-200 text-l font-bold mt-5 " onClick={handleCloseMenu}>
                      <FontAwesomeIcon icon={faBook} className="mr-2 w-6 justify-center" /> {/* Icon for START */}
                      <span>SERVICES</span>
                    </div>
                  </Link>

                  <Link href="/" passHref>
                    <div className="text-green-400 text-l font-bold mt-5" onClick={handleCloseMenu}>
                      <FontAwesomeIcon icon={faPodcast} className="mr-2 w-6 justify-center" /> {/* Icon for START */}
                      <span>PODCAST</span>
                    </div>
                  </Link>

                  <Link href="/" passHref>
                    <div className="text-blue-400 text-l font-bold mt-5" onClick={handleCloseMenu}>
                      <FontAwesomeIcon icon={faHandshake} className="mr-2 w-6 justify-center" /> {/* Icon for START */}
                      <span>MEETUPS</span>
                    </div>
                  </Link>

                  <Link href="/" passHref>
                    <div className="text-pink-400 text-l font-bold mt-5" onClick={handleCloseMenu}>
                      <FontAwesomeIcon icon={faEnvelope} className="mr-2 w-6 justify-center" /> {/* Icon for START */}
                      <span>NEWSLETTER</span>
                    </div>
                  </Link>


                  {/* Repeat for other links */}
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