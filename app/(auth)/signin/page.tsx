"use client";

import Link from 'next/link'
import Image from 'next/image'
import HeaderLogo from '@/components/ui/header-logo'
import Illustration from '@/public/images/hero-illustration.svg'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

//export const metadata = {
//  title: 'Sign In - Community',
//  description: 'Page description',
//}

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    return setUser((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors
    
    try {
      if (!user.email || !user.password) {
        setError("Please fill all the fields");
        setLoading(false);
        return;
      }
      const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
      if (!emailRegex.test(user.email)) {
        setError("Invalid email format");
        setLoading(false);
        return;
      }

      console.log("Attempting sign in with:", user.email);
      
      const res = await signIn("credentials", {
        email: user.email,
        password: user.password,
        redirect: false,
      });

      if (res?.error) {
        console.error("Sign in error:", res.error);
        if (res.error === "CredentialsSignin") {
          setError("Invalid email or password");
        } else {
          setError("An error occurred during sign in. Please try again.");
        }
        setLoading(false);
        return;
      }

      console.log("Sign in successful, redirecting to home page");
      router.push("/");
    } catch (error) {
      console.error("Sign in exception:", error);
      setError("An unexpected error occurred. Please try again later.");
      setLoading(false);
    } finally {
      // Only clear form if successfully signed in
      if (!error) {
        setUser({
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
                  Not a member?{' '}
                  <Link className="font-medium text-indigo-500 hover:text-indigo-400 transition duration-150 ease-in-out" href="/join">
                    Join
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
                  Welcome back to the Community
                </h1>
              </div>

              {/* Form */}
              <div className="max-w-sm mx-auto">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="sr-only" htmlFor="email">
                        Email
                      </label>
                      <input 
                        id="email" 
                        name="email" 
                        className="form-input text-sm w-full" 
                        type={"email"} placeholder="Your email" 
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
                  
                  {error && (
                    <div className="mt-4 text-red-500 text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <button 
                      type="submit" 
                      className="btn-sm text-white bg-indigo-500 hover:bg-indigo-600 w-full"
                      disabled={loading}
                    >
                      {loading ? "Signing In..." : "Sign In"}
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
                  type="button"    
                  className="btn-sm h-9 text-indigo-500 border border-slate-700 bg-gradient-to-tr from-slate-800/20 via-slate-800/50 to-slate-800/20 hover:bg-slate-800 w-full relative flex after:flex-1"
                >
                  <div className="flex-1 flex items-center">
                    <svg className="w-4 h-4 fill-indigo-500 shrink-0" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.679 6.545H8.043v3.273h4.328c-.692 2.182-2.401 2.91-4.363 2.91a4.727 4.727 0 1 1 3.035-8.347l2.378-2.265A8 8 0 1 0 8.008 16c4.41 0 8.4-2.909 7.67-9.455Z" />
                    </svg>
                  </div>
                  <span className="flex-auto pl-3">Sign In With Google</span>
                </button>

                {/* Divider */}
                <div className="flex items-center my-4">
                  <div className="border-t border-slate-800 grow mr-3" aria-hidden="true" />
                  <div className="text-xs text-slate-400 italic">Forgot password</div>
                  <div className="border-t border-slate-800 grow ml-3" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>    
    </>
  )
}
