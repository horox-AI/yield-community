"use client";

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import User01 from '@/public/images/avatar-01.jpg'
import User05 from '@/public/images/avatar-05.jpg'
import User06 from '@/public/images/avatar-06.jpg'
import User09 from '@/public/images/avatar-09.jpg'
import { useRouter, useSearchParams } from 'next/navigation';

type PostType = {
  id: string;
  title: string;
  author: string;
  date: string;
  comments: number | any[];
  authorImage: string;
};

// This maps category slugs to their display names and icons
const categoryConfig = [
  {
    slug: 'regular',
    name: 'Real Estate Investing',
    icon: '🏠'
  },
  {
    slug: 'market-trends',
    name: 'Market Trends',
    icon: '📈'
  },
  {
    slug: 'renovation',
    name: 'Property Renovation',
    icon: '🛠️'
  },
  {
    slug: 'financing',
    name: 'Financing & Loans',
    icon: '💰'
  },
  {
    slug: 'legal',
    name: 'Tax & Legal',
    icon: '📊'
  }
];

export default function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [newestPosts, setNewestPosts] = useState<PostType[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  
  // Get the current category from URL
  const currentCategory = searchParams.get('category') || '';

  // Handle search form submission
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Handle category click
  const handleCategoryClick = (category: string) => {
    // If the category is already selected, go back to all posts
    if (category === currentCategory) {
      router.push('/');
    } else {
      router.push(`/?category=${category}`);
    }
  };

  // Fetch newest posts for the "New Discussions" section
  useEffect(() => {
    async function fetchNewestPosts() {
      try {
        const response = await fetch('/api/posts/newest');
        if (!response.ok) {
          throw new Error('Failed to fetch newest posts');
        }
        const data = await response.json();
        setNewestPosts(data.slice(0, 3)); // Only show the first 3 posts
      } catch (error) {
        console.error('Error fetching newest posts:', error);
      } finally {
        setLoadingPosts(false);
      }
    }

    fetchNewestPosts();
  }, []);

  // Format date to display in a user-friendly format (e.g., "22 Feb")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
  };

  // Count comments properly
  const getCommentCount = (comments: any[] | number) => {
    if (Array.isArray(comments)) {
      return comments.length;
    }
    return comments || 0;
  };

  return (
    <aside className="md:w-64 lg:w-80 md:shrink-0 pt-6 pb-12 md:pb-20">
      <div className="md:pl-6 lg:pl-6">
        {/* Sidebar content */}
        <div className="space-y-6">
          {/* Search form */}
          <form onSubmit={handleSearch}>
            <div className="flex flex-wrap">
              <div className="w-full">
                <label className="block text-sm sr-only" htmlFor="search">
                  Search
                </label>
                <div className="relative flex items-center">
                  <input 
                    id="search" 
                    type="search" 
                    className="form-input py-1 w-full pl-10 rounded-full" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search posts..."
                  />
                  <div className="absolute inset-0 right-auto flex items-center justify-center">
                    <svg className="w-4 h-4 shrink-0 mx-3" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path
                        className="fill-slate-600"
                        d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm8.707 12.293a.999.999 0 11-1.414 1.414L11.9 13.314a8.019 8.019 0 001.414-1.414l2.393 2.393z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Create Post Button - Moved from categories section */}
          <div className="mt-2">
            <Link 
              href="/create-post" 
              className="group flex items-center px-3 py-2 text-slate-200 font-medium rounded-md hover:bg-indigo-500/20 transition duration-150 ease-in-out"
            >
              <span className="mr-3 text-lg flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </span>
              <span className="group-hover:text-indigo-400 transition duration-150 ease-in-out">
                Create New Post
              </span>
            </Link>
          </div>

          {/* New Discussions */}
          <div>
            <div className="text-xs uppercase text-slate-600 font-semibold mb-4">New Discussions</div>
            {loadingPosts ? (
              <div className="text-center py-3">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-500"></div>
                <p className="mt-2 text-xs text-slate-500">Loading discussions...</p>
              </div>
            ) : newestPosts.length > 0 ? (
              <ul className="space-y-3">
                {newestPosts.map((post) => (
                  <li key={post.id}>
                    <div className="flex items-center mb-1">
                      <img 
                        className="rounded-full mr-2" 
                        src={post.authorImage} 
                        width="16" 
                        height="16" 
                        alt={post.author} 
                      />
                      <div className="text-xs">
                        <a className="font-medium text-indigo-500 hover:text-indigo-400 transition duration-150 ease-in-out" href="#0">
                          {post.author}
                        </a>
                      </div>
                    </div>
                    <h3 className="text-sm mb-1">
                      <Link className="text-slate-200 font-semibold hover:text-white transition duration-150 ease-in-out" href={`/posts/${post.id}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <div className="text-xs text-slate-600">
                      <span className="text-slate-500">{post.date}</span> · 
                      <span className="text-slate-500">{getCommentCount(post.comments)} Comments</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 text-center py-3">No discussions found</p>
            )}
          </div>

          {/* Categories - Simplified list */}
          <div>
            <div className="text-xs uppercase text-slate-600 font-semibold mb-4">Categories</div>
            <ul className="space-y-1.5">
              <li>
                <Link 
                  href="/?category=regular" 
                  className="group flex items-center px-3 py-2 rounded-md hover:bg-slate-800/60 transition duration-150 ease-in-out"
                >
                  <span className="mr-3 text-lg">🏠</span>
                  <span className="text-slate-200 font-medium group-hover:text-indigo-400 transition duration-150 ease-in-out">
                    Real Estate Investing
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/?category=market-trends" 
                  className="group flex items-center px-3 py-2 rounded-md hover:bg-slate-800/60 transition duration-150 ease-in-out"
                >
                  <span className="mr-3 text-lg">📈</span>
                  <span className="text-slate-200 font-medium group-hover:text-indigo-400 transition duration-150 ease-in-out">
                    Market Trends
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/?category=renovation" 
                  className="group flex items-center px-3 py-2 rounded-md hover:bg-slate-800/60 transition duration-150 ease-in-out"
                >
                  <span className="mr-3 text-lg">🛠️</span>
                  <span className="text-slate-200 font-medium group-hover:text-indigo-400 transition duration-150 ease-in-out">
                    Property Renovation
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/?category=financing" 
                  className="group flex items-center px-3 py-2 rounded-md hover:bg-slate-800/60 transition duration-150 ease-in-out"
                >
                  <span className="mr-3 text-lg">💰</span>
                  <span className="text-slate-200 font-medium group-hover:text-indigo-400 transition duration-150 ease-in-out">
                    Financing & Loans
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/?category=legal" 
                  className="group flex items-center px-3 py-2 rounded-md hover:bg-slate-800/60 transition duration-150 ease-in-out"
                >
                  <span className="mr-3 text-lg">📊</span>
                  <span className="text-slate-200 font-medium group-hover:text-indigo-400 transition duration-150 ease-in-out">
                    Tax & Legal
                  </span>
                </Link>
              </li>
            </ul>
          </div>


          {/* Popular Posts */}
          <div>
            <div className="text-xs uppercase text-slate-600 font-semibold mb-4">Popular Posts</div>
            <ul className="space-y-3">
              <li>
                <div className="flex items-center mb-1">
                  <Image className="rounded-full mr-2" src={User06} width="16" height="16" alt="User 06" />
                  <div className="text-xs">
                    <a className="font-medium text-indigo-500 hover:text-indigo-400 transition duration-150 ease-in-out" href="#0">
                      MaryLync77
                    </a>
                  </div>
                </div>
                <h3 className="text-sm mb-1">
                  <Link className="text-slate-200 font-semibold hover:text-white transition duration-150 ease-in-out" href="/posts/1">
                    How do you decide and keep focus on the <em className="italic">"right"</em> things?
                  </Link>
                </h3>
                <div className="text-xs text-slate-600">
                  <span className="text-slate-500">22 Feb</span> · <span className="text-slate-500">14 Comments</span>
                </div>
              </li>
              <li>
                <div className="flex items-center mb-1">
                  <Image className="rounded-full mr-2" src={User09} width="16" height="16" alt="User 09" />
                  <div className="text-xs">
                    <a className="font-medium text-indigo-500 hover:text-indigo-400 transition duration-150 ease-in-out" href="#0">
                      Zakaria_C
                    </a>
                  </div>
                </div>
                <h3 className="text-sm mb-1">
                  <Link className="text-slate-200 font-semibold hover:text-white transition duration-150 ease-in-out" href="/posts/1">
                    How do you approach building a team for your startup?
                  </Link>
                </h3>
                <div className="text-xs text-slate-600">
                  <span className="text-slate-500">22 Feb</span> · <span className="text-slate-500">44 Comments</span>
                </div>
              </li>
              <li>
                <div className="flex items-center mb-1">
                  <Image className="rounded-full mr-2" src={User01} width="16" height="16" alt="User 01" />
                  <div className="text-xs">
                    <a className="font-medium text-indigo-500 hover:text-indigo-400 transition duration-150 ease-in-out" href="#0">
                      IndieMark
                    </a>
                  </div>
                </div>
                <h3 className="text-sm mb-1">
                  <Link className="text-slate-200 font-semibold hover:text-white transition duration-150 ease-in-out" href="/posts/1">
                    The 5 big lessons I've learnt from Geeks and Experts
                  </Link>
                </h3>
                <div className="text-xs text-slate-600">
                  <span className="text-slate-500">20 Feb</span> · <span className="text-slate-500">19 Comments</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="-rotate">
            <div className="relative p-5 bg-gradient-to-tr from-slate-800/20 via-slate-800/50 to-slate-800/20">
              <div
                className="absolute inset-0 -m-px pointer-events-none -z-10 before:absolute before:inset-0 before:bg-gradient-to-t before:from-slate-700 before:to-slate-800 after:absolute after:inset-0 after:bg-slate-900 after:m-px"
                aria-hidden="true"
              />
              <div className="font-semibold text-center bg-clip-text text-transparent bg-gradient-to-tr from-indigo-500 via-sky-300 to-slate-200 mb-3">
                Get the best of Community, directly in your inbox.
              </div>
              {/* Form */}
              <div className="w-full">
                <label className="block text-sm sr-only" htmlFor="newsletter">
                  Email
                </label>
                <form className="relative flex items-center max-w-xs mx-auto">
                  <input id="newsletter" type="email" className="form-input py-1.5 w-full pr-10 rounded-full" placeholder="Your email" />
                  <button type="submit" className="absolute inset-0 left-auto" aria-label="Subscribe">
                    <svg className="w-3 h-3 fill-current text-indigo-500 mx-3 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z" fillRule="nonzero" />
                    </svg>
                  </button>
                </form>
                {/* Success message */}
                {/* <p className="mt-2 text-slate-200 text-center text-xs">Thanks for subscribing!</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}