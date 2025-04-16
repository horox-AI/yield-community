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

export default function PostsList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [allPosts, setAllPosts] = useState<PostType[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const postsPerPage = 10;
  const currentPage = Number(searchParams.get('page') || '1');
  const [totalPages, setTotalPages] = useState(1);
  
  // Get the search query from URL parameters
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        
        // If there's a search query, handle it
        if (searchQuery) {
          // For search, we'll initially fetch all posts (could be optimized with a dedicated search API)
          const response = await fetch('/api/posts/regular');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const allPostsData = await response.json();
          
          // Filter posts by search query (case-insensitive)
          const query = searchQuery.toLowerCase();
          const filteredPosts = allPostsData.filter((post: PostType) =>
            post.title.toLowerCase().includes(query) ||
            (post.content ? post.content.toLowerCase().includes(query) : false) ||
            post.author.toLowerCase().includes(query)
          );
          
          setAllPosts(filteredPosts);
          setTotalPages(Math.ceil(filteredPosts.length / postsPerPage));
          
          // Get current page posts
          const indexOfLastPost = currentPage * postsPerPage;
          const indexOfFirstPost = indexOfLastPost - postsPerPage;
          setPosts(filteredPosts.slice(indexOfFirstPost, indexOfLastPost));
          
          setLoading(false);
          return;
        }
        
        // Default: fetch popular posts
        const response = await fetch('/api/posts/popular');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAllPosts(data);
        setTotalPages(Math.ceil(data.length / postsPerPage));
        
        // Get current page posts
        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
        setPosts(data.slice(indexOfFirstPost, indexOfLastPost));
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPosts();
  }, [searchQuery, currentPage]);
  
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
          <div key="sponsor" className="my-3 bg-gradient-to-tr from-slate-800/20 via-slate-800/50 to-slate-800/20">
            <div className="relative p-5">
              <div
                className="absolute inset-0 -m-px pointer-events-none -z-10 before:absolute before:inset-0 before:bg-gradient-to-t before:from-slate-700 before:to-slate-800 after:absolute after:inset-0 after:bg-slate-900 after:m-px"
                aria-hidden="true"
              />
              <div className="flex items-center space-x-3 mb-3">
                <div className="shrink-0 bg-indigo-500/10 p-1.5 rounded-full border border-indigo-500/20">
                  <Image src={SponsorImage} width="24" height="24" alt="Sponsor" />
                </div>
                <div className="font-bold text-indigo-400">Sponsored by Community Partner</div>
              </div>
              <div className="pl-10">
                <p className="text-sm text-slate-300 mb-2">
                  Discover how our Community software can help you build and connect with your audience.
                </p>
                <a className="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 transition duration-150 ease-in-out group" href="#0">
                  Learn More 
                  <svg className="w-3 h-3 fill-current ml-2 group-hover:translate-x-1 transition-transform duration-150 ease-in-out" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z" fillRule="nonzero" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        );
      }
    });
    
    return result;
  };

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    // Calculate page range to display
    const pageRange = 2; // Show 2 pages before and after current page
    let startPage = Math.max(1, currentPage - pageRange);
    let endPage = Math.min(totalPages, currentPage + pageRange);

    // Ensure we always show at least 5 pages if possible
    if (endPage - startPage + 1 < Math.min(5, totalPages)) {
      if (currentPage < totalPages / 2) {
        // We're closer to the start, so extend end
        endPage = Math.min(totalPages, startPage + 4);
      } else {
        // We're closer to the end, so extend start
        startPage = Math.max(1, endPage - 4);
      }
    }

    const pages = [];

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`mx-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${
          currentPage === 1
            ? 'text-slate-500 cursor-not-allowed'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
      >
        <span className="sr-only">Previous Page</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    );

    // First page and ellipsis if needed
    if (startPage > 1) {
      pages.push(
        <button
          key="1"
          onClick={() => handlePageChange(1)}
          className="mx-1 px-3 py-1 rounded-md text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors duration-150 ease-in-out"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="mx-1 px-2 py-1 text-slate-600">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`mx-1 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${
            i === currentPage
              ? 'bg-indigo-500 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="mx-1 px-2 py-1 text-slate-600">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="mx-1 px-3 py-1 rounded-md text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors duration-150 ease-in-out"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`mx-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${
          currentPage === totalPages
            ? 'text-slate-500 cursor-not-allowed'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
      >
        <span className="sr-only">Next Page</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );

    return (
      <div className="mt-6 flex justify-center items-center">
        <div className="flex items-center py-2 px-4 bg-slate-800/50 rounded-lg border border-slate-700">
          {pages}
        </div>
      </div>
    );
  };

  return (
   <div className="md:grow md:pb-12 mx-0 sm:mx-2 md:mx-4 lg:mx-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        {searchQuery ? (
          <div className="text-xl font-semibold text-slate-200 py-4">
            Search results for: <span className="text-indigo-400">"{searchQuery}"</span>
            {allPosts.length > 0 && (
              <span className="text-slate-400 text-base font-normal ml-2">
                ({allPosts.length} {allPosts.length === 1 ? 'post' : 'posts'} found)
              </span>
            )}
          </div>
        ) : (
          <div className="text-xs uppercase pb-4 text-slate-600 font-semibold">Popular Discussions</div>
        )}
      </div>

      {/* Main content */}
      <div className="mb-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="mt-4 text-slate-400">Loading posts...</p>
          </div>
        ) : posts.length > 0 ? (
          <>
            {/* Posts - List container */}
            <div className="flex flex-col space-y-3 mb-8">
              {renderPosts()}
            </div>
            
            {/* Pagination */}
            {renderPagination()}
          </>
        ) : (
          <div className="text-center py-8">
            {searchQuery ? (
              <p className="text-slate-400">No posts found matching "{searchQuery}"</p>
            ) : (
              <p className="text-slate-400">No posts found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}