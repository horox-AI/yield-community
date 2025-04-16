"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import HeaderLogo from '@/components/ui/header-logo';
import Illustration from '@/public/images/hero-illustration.svg';
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import LetterAvatar from '@/components/ui/LetterAvatar';

//export const metadata = {
//  title: 'Sign Up - Community',
 // description: 'Join our community and start building your real estate portfolio',
//}

export default function Join() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Add state for showing avatar preview
  const [previewName, setPreviewName] = useState('');

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    if (name === 'name') {
      setPreviewName(value);
    }
    return setUser((prevInfo) => ({ ...prevInfo, [name]: value }));
  };
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    console.log(user);
    try {
      if (!user.name || !user.email || !user.password) {
        setError("please fill all the fields");
        setLoading(false);
        return;
      }
      const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
      if (!emailRegex.test(user.email)) {
        setError("invalid email id");
        setLoading(false);
        return;
      }
      
      // Register the user
      const res = await axios.post("/api/register", user);
      console.log(res.data);
      
      if (res.status == 200 || res.status == 201) {
        console.log("user added successfully");
        
        // After successful registration, try to sign in the user
        const signInResult = await signIn("credentials", {
          email: user.email,
          password: user.password,
          redirect: false,
        });
        
        if (signInResult?.error) {
          console.error("Sign-in after registration failed:", signInResult.error);
          setError("Registration successful but sign-in failed. Please try signing in manually.");
        } else {
          // Clear any errors and redirect to homepage
          setError("");
          router.push("/");
        }
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      // Display the error message from the API if available
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Failed to register. Please try again.");
      }
    } finally {
      setLoading(false);
      
      // Only clear the form if there's no error
      if (!error) {
        setUser({
          name: "",
          email: "",
          password: "",
        });
      }
    }
  };

   return (
    <>
      {/* Site header */}
      <header className="absolute w-full z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-12 md:h-16">
            
            <HeaderLogo />

            <nav className="flex grow">
              <div className="flex grow justify-end flex-wrap items-center">
                <div className="text-sm text-slate-500">
                  Already a member?{' '}
                  <Link className="font-medium text-indigo-500 hover:text-indigo-400 transition duration-150 ease-in-out" href="/signin">
                    sign In
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="grow">
        <section className="relative">
          {/* Illustration */}
          <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none -z-10" aria-hidden="true">
            <Image src={Illustration} className="max-w-none" priority alt="Hero Illustration" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">
              {/* Page header */}
              <div className="max-w-2xl mx-auto text-center">
                <h1 className="h2 font-aspekta bg-clip-text text-transparent bg-gradient-to-tr from-indigo-500 via-sky-300 to-slate-200 pb-12">
                  Join a thriving community of investors and wealth builders
                </h1>
              </div>

              {/* Form */}
              <div className="max-w-sm mx-auto">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-slate-400" htmlFor="name">
                        Full Name <span className="text-xs text-slate-500">(This is how you'll appear in the community)</span>
                      </label>
                      <input 
                        id="name" 
                        name="name"
                        className="form-input text-sm w-full" 
                        type="text" 
                        placeholder="Your full name" 
                        value={user.name}
                        onChange={handleInputChange}
                        required 
                      />
                      {previewName && (
                        <div className="flex items-center mt-2 gap-3">
                          <div className="rounded-md bg-slate-800 p-2">
                            <LetterAvatar 
                              name={previewName} 
                              size={32} 
                            />
                          </div>
                          <span className="text-xs text-slate-400">Your profile avatar</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="sr-only" htmlFor="email">
                        Email
                      </label>
                      <input 
                        id="email" 
                        name="email"
                        className="form-input text-sm w-full" 
                        type={"email"} 
                        placeholder="Your email" 
                        value={user.email}
                        onChange={handleInputChange}
                        required />
                    </div>
                    <div>
                      <label className="sr-only" htmlFor="password">
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        className="form-input text-sm w-full"
                        type={"password"}
                        placeholder="Your password"
                        autoComplete="on"
                        value={user.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    {error && <p className="py-6 text-lg">{error}</p>}
                    <button type="submit" className="btn-sm text-white bg-indigo-500 hover:bg-indigo-600 w-full">
                      {loading ? "Processing" : "Sign Up "}
                    </button>
                     
                  </div>
                </form>

                {/* Divider */}
                <div className="flex items-center my-4">
                  <div className="border-t border-slate-800 grow mr-3" aria-hidden="true" />
                  <div className="text-xs text-slate-400 italic">Or</div>
                  <div className="border-t border-slate-800 grow ml-3" aria-hidden="true" />
                </div>

                {/* Social login */}
                <button  
                  onClick={() => signIn("google", { callbackUrl: "/" })}   
                  className="btn-sm h-9 text-indigo-500 border border-slate-700 bg-gradient-to-tr from-slate-800/20 via-slate-800/50 to-slate-800/20 hover:bg-slate-800 w-full relative flex after:flex-1"
                >
                      
                  <div className="flex-1 flex items-center">
                    <svg className="w-4 h-4 fill-indigo-500 shrink-0" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.679 6.545H8.043v3.273h4.328c-.692 2.182-2.401 2.91-4.363 2.91a4.727 4.727 0 1 1 3.035-8.347l2.378-2.265A8 8 0 1 0 8.008 16c4.41 0 8.4-2.909 7.67-9.455Z" />
                    </svg>
                  </div>
                  <span className="flex-auto pl-3">Sign In With Google</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>    
    </>
  )
}
