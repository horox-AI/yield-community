"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import SponsorImage from '@/public/images/sponsor.png';

type PostType = {
  id: string;
  title: string;
  content?: string;
  author: string;
  date: string;
  votes?: number;
  userVoted?: boolean;
  comments?: any[];
  authorImage: string;
  commenters?: string[];
  category?: string;
  tags?: string[];
};

export default function CategoryFilteredPosts() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [allPosts, setAllPosts] = useState<PostType[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  
  // Pagination state
  const postsPerPage = 10;
  const currentPage = Number(searchParams.get('page') || '1');
  const [totalPages, setTotalPages] = useState(1);
  
  // Get the search query and category from URL parameters
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';

  // Category name mapping for display
  const categoryNames: {[key: string]: string} = {
    'regular': 'Real Estate Investing',
    'market-trends': 'Market Trends',
    'renovation': 'Property Renovation',
    'financing': 'Financing & Loans',
    'legal': 'Tax & Legal'
  };

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        
        // Always fetch all posts first, then filter as needed
        const response = await fetch('/api/posts/regular');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const allPostsData = await response.json();
        
        let filteredPosts = allPostsData;
        
        // If there's a search query, filter by that
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredPosts = allPostsData.filter((post: PostType) =>
            post.title.toLowerCase().includes(query) ||
            (post.content ? post.content.toLowerCase().includes(query) : false) ||
            post.author.toLowerCase().includes(query)
          );
        }
        
        // If there's a category, filter by that
        if (categoryParam) {
          setCurrentCategory(categoryParam);
          filteredPosts = filteredPosts.filter((post: PostType) => 
            post.category === categoryParam
          );
        } else {
          setCurrentCategory(null);
        }
        
        // If we're not filtering by anything specific, use popular posts
        if (!searchQuery && !categoryParam) {
          const popularResponse = await fetch('/api/posts/popular');
          if (popularResponse.ok) {
            filteredPosts = await popularResponse.json();
          }
        }
        
        setAllPosts(filteredPosts);
        setTotalPages(Math.ceil(filteredPosts.length / postsPerPage));
        
        // Get current page posts
        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
        setPosts(filteredPosts.slice(indexOfFirstPost, indexOfLastPost));
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPosts();
  }, [searchQuery, categoryParam, currentPage]);
  
  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    // Create a new URLSearchParams object from the current search params
    const params = new URLSearchParams(searchParams.toString());
    
    // Update the page parameter
    params.set('page', pageNumber.toString());
    
    // Navigate to the new URL with updated search params
    router.push(`?${params.toString()}`);
  };

  // Function to render posts with sponsor inserted at the right position
  const renderPosts = () => {
    if (!posts || posts.length === 0) return null;
    
    let result: JSX.Element[] = [];
    
    posts.forEach((post, index) => {
      // Add the post
      result.push(
        <div key={post.id} className={`${index < 4 ? '-order-1' : ''} bg-gradient-to-tr from-slate-800/20 via-slate-800/50 to-slate-800/20`}>
          <div className="relative p-5">
            <div
              className="absolute inset-0 -m-px pointer-events-none -z-10 before:absolute before:inset-0 before:bg-gradient-to-t before:from-slate-700 before:to-slate-800 after:absolute after:inset-0 after:bg-slate-900 after:m-px"
              aria-hidden="true"
            />
            <div className="sm:flex items-center space-y-3 sm:space-y-0 sm:space-x-5">
              {/* Upvote button */}
              <div className="shrink-0">
                <button className={`flex items-center text-left w-16 px-2.5 py-1 rounded border ${post.userVoted ? 'border-indigo-400 bg-indigo-400/10' : 'border-slate-700'} bg-gradient-to-tr from-slate-800/20 via-slate-800/50 to-slate-800/20 hover:bg-slate-800 transition duration-150 ease-in-out`}>
                  <svg className="shrink-0 fill-indigo-400 mr-1.5" width="11" height="7" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.664 6.747.336 5.253 5.5.662l5.164 4.591-1.328 1.494L5.5 3.338z" />
                  </svg>
                  <span className="grow text-center text-xs font-medium text-indigo-500">{post.votes || 0}</span>
                </button>
              </div>
              {/* Content */}
              <div className="grow lg:grid lg:grid-cols-[1fr,auto] lg:gap-6">
                <div className="w-full">
                  {/* Title - Enhanced with border bottom */}
                  <div className="mb-3 pb-2 border-b border-slate-800/60">
                    <h2 className="text-lg">
                      <Link className="text-slate-100 font-semibold hover:text-white transition duration-150 ease-in-out" href={`/posts/${post.id}`}>
                        {post.title}
                      </Link>
                    </h2>
                  </div>
                  
                  {/* Content preview - New addition */}
                  <div className="mb-3 text-sm text-slate-400 line-clamp-2">
                    {post.content ? post.content.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...' : 'No content preview available'}
                  </div>
                  
                  {/* Category indicator - Show only in mixed category views */}
                  {post.category && !currentCategory && (
                    <div className="mb-3">
                      <Link 
                        href={`/?category=${post.category}`}
                        className="inline-block px-2 py-0.5 text-xs rounded bg-indigo-900/30 text-indigo-300 border border-indigo-800 hover:bg-indigo-800/30 transition-colors"
                      >
                        {categoryNames[post.category] || post.category}
                      </Link>
                    </div>
                  )}
                  
                  {/* Tags - New addition */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 text-xs rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="px-2 py-0.5 text-xs rounded bg-slate-800 text-slate-400 border border-slate-700">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Author info - Enhanced with top border */}
                  <div className="flex items-center pt-2 border-t border-slate-800/60">
                    <Image className="rounded-full mr-2" src={post.authorImage} width="16" height="16" alt={post.author} />
                    <div className="text-xs text-slate-600">
                      <a className="font-medium text-indigo-500 hover:text-indigo-400 transition duration-150 ease-in-out" href="#0">
                        {post.author}
                      </a>{' '}
                      · <span className="text-slate-500">{post.date}</span> ·{' '}
                      <span className="text-slate-500">
                        {post.comments?.length || 0} Comment{(post.comments?.length || 0) === 1 ? '' : 's'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Commenters avatars - Repositioned */}
                {post.commenters && post.commenters.length > 0 && (
                  <div className="shrink-0 flex -space-x-3 self-center justify-self-end mt-4 lg:mt-0">
                    {post.commenters.map((commenter, index) => {
                      // Ensure the image path is properly formatted
                      let imageSrc = commenter;
                      
                      // If it's a simple username like "user1", convert to a proper path
                      if (typeof commenter === 'string' && commenter.match(/^user\d+$/)) {
                        // Use a placeholder image from a public service
                        imageSrc = `https://randomuser.me/api/portraits/men/${parseInt(commenter.replace('user', ''), 10)}.jpg`;
                      }
                      
                      // If it doesn't start with http or /, prepend /
                      if (typeof imageSrc === 'string' && !imageSrc.startsWith('http') && !imageSrc.startsWith('/')) {
                        imageSrc = `/${imageSrc}`;
                      }
                      
                      return (
                        <Image
                          key={index}
                          className="rounded-full border-2 border-slate-900 box-content"
                          src={imageSrc}
                          width="24"
                          height="24"
                          alt={`Commenter ${index + 1}`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
      
      // Add sponsor after the 5th post (index 4)
      if (index === 4 && !searchQuery) {
        result.push(
          <div key="sponsor" className="order-first md:order-none bg-gradient-to-tr from-slate-800/20 via-slate-800/50 to-slate-800/20">
            <div className="relative p-5">
              <div
                className="absolute inset-0 -m-px pointer-events-none -z-10 before:absolute before:inset-0 before:bg-gradient-to-t before:from-slate-700 before:to-slate-800 after:absolute after:inset-0 after:bg-slate-900 after:m-px"
                aria-hidden="true"
              />
              
              {/* Sponsored Label */}
              <div className="mb-2 text-xs text-slate-500 uppercase tracking-wider">Sponsored</div>
              
              {/* Sponsor Content with Enhanced Design */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <div className="sm:flex items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="shrink-0">
                    <Image className="rounded-md shadow-md" src={SponsorImage} width="200" height="150" alt="Sponsor" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">Invest Smarter with AI-Driven Analytics</h3>
                    <p className="text-sm text-slate-400 mb-3">
                      Unlock premium access to AI-powered property insights, market forecasts, and personalized investment recommendations.
                    </p>
                    <div className="space-x-2">
                      <a href="#0" className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-sm transition duration-150 ease-in-out">
                        Learn More
                      </a>
                      <a href="#0" className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-slate-700 hover:bg-slate-600 text-white font-medium text-sm transition duration-150 ease-in-out">
                        Free Trial
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-right text-slate-500 hover:underline">
                  <a href="#0">Why am I seeing this ad?</a>
                </div>
              </div>
            </div>
          </div>
        );
      }
    });
    
    return result;
  };

  // Function to render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    let pages = [];
    const maxVisiblePages = 5;
    
    // Calculate range of pages to show
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // First page and previous
    if (currentPage > 1) {
      pages.push(
        <button
          key="first"
          onClick={() => handlePageChange(1)}
          className="inline-flex items-center justify-center rounded leading-5 px-2.5 py-2 bg-slate-800/30 hover:bg-slate-800 border border-slate-700 text-slate-300 mr-1"
        >
          <span className="sr-only">First</span>
          <svg className="h-4 w-4 fill-current" viewBox="0 0 16 16">
            <path d="M7.962 4L6.228 5.616l4.101 3.323-4.101 3.323L7.962 14l5.116-5.061z" />
          </svg>
        </button>
      );
    }
    
    // Pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`inline-flex items-center justify-center leading-5 px-3.5 py-2 rounded border ${
            currentPage === i 
              ? 'bg-indigo-500 text-white' 
              : 'bg-slate-800/30 hover:bg-slate-800 border-slate-700 text-slate-300'
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Last page and next
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          className="inline-flex items-center justify-center rounded leading-5 px-2.5 py-2 bg-slate-800/30 hover:bg-slate-800 border border-slate-700 text-slate-300 ml-1"
        >
          <span className="sr-only">Last</span>
          <svg className="h-4 w-4 fill-current" viewBox="0 0 16 16">
            <path d="M8.038 12l1.734-1.616-4.101-3.323 4.101-3.323L8.038 2 2.922 7.061z" />
          </svg>
        </button>
      );
    }
    
    return <div className="flex justify-center space-x-1 mt-8">{pages}</div>;
  };

  return (
    <div className="mb-12 md:mb-20">
      {/* Page header */}
      <div className="md:flex md:justify-between md:items-end mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {currentCategory 
              ? `${categoryNames[currentCategory] || currentCategory} Posts` 
              : searchQuery 
                ? `Search Results: ${searchQuery}` 
                : 'Popular Discussions'}
          </h1>
          <div className="text-sm text-slate-500 mt-1">
            {allPosts.length} {allPosts.length === 1 ? 'post' : 'posts'} found
          </div>
        </div>
      </div>
      
      {/* Filter indicator */}
      {(currentCategory || searchQuery) && (
        <div className="mb-8 flex items-center">
          <span className="text-sm text-slate-400 mr-3">Filtered by:</span>
          {currentCategory && (
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full px-3 py-1 text-sm flex items-center mr-2">
              {categoryNames[currentCategory] || currentCategory}
              <button 
                onClick={() => router.push('/')} 
                className="ml-2 text-indigo-300 hover:text-indigo-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                </svg>
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="bg-slate-500/10 text-slate-400 border border-slate-500/20 rounded-full px-3 py-1 text-sm flex items-center">
              "{searchQuery}"
              <button 
                onClick={() => router.push('/')} 
                className="ml-2 text-slate-400 hover:text-slate-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}

      {/* Loading indicator */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-2 text-sm text-slate-400">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-slate-800/50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-slate-200 mb-2">No posts found</h3>
          <p className="text-slate-400 mb-6">
            {currentCategory || searchQuery 
              ? `We couldn't find any posts matching your criteria.` 
              : `There are no posts available at this time.`}
          </p>
          {(currentCategory || searchQuery) && (
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center justify-center px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600 text-white transition duration-150 ease-in-out"
            >
              View All Posts
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Posts grid */}
          <div className="space-y-2 md:space-y-4">
            {renderPosts()}
          </div>
          
          {/* Pagination */}
          {renderPagination()}
        </>
      )}
    </div>
  );
} 