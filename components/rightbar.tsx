"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation';

// Define post type
type PostType = {
  id: string;
  title: string;
  author: string;
  date: string;
  comments: number;
  authorImage: string;
};

export default function Rightbar() {
  // State for following posts
  const [followingPosts, setFollowingPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch following posts on component mount
  useEffect(() => {
    async function fetchFollowingPosts() {
      try {
        const response = await fetch('/api/posts/following');
        if (!response.ok) {
          throw new Error('Failed to fetch following posts');
        }
        const data = await response.json();
        
        // Transform the data if needed to ensure it fits our PostType
        const formattedData = data.map((post: any) => ({
          id: post.id,
          title: post.title,
          author: post.author,
          date: post.date,
          comments: typeof post.comments === 'object' ? (post.comments?.length || 0) : (post.comments || 0),
          authorImage: post.authorImage
        }));
        
        setFollowingPosts(formattedData.slice(0, 10)); // Limit to 10 posts
      } catch (error) {
        console.error('Error fetching following posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFollowingPosts();
  }, []);

  // Handle View All click
  const handleViewAll = () => {
    router.push('/?category=following&source=following');
  };

  return (
    <aside className="md:w-64 lg:w-80 md:shrink-0 pt-6 pb-12 md:pb-20">
      <div className="md:pl-6 lg:pl-2">
        {/* Sidebar content */}
        <div className="space-y-6">
          {/* Following Posts */}
          <div>
            <div className="text-xs uppercase text-slate-600 font-semibold mb-4">Following Posts</div>
            {loading ? (
              <div className="text-center py-3">
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-500"></div>
                <p className="mt-2 text-xs text-slate-400">Loading posts...</p>
              </div>
            ) : followingPosts.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-3">No following posts found</p>
            ) : (
              <ul className="space-y-2">
                {followingPosts.map((post) => (
                  <li key={post.id} className="bg-clear p-3  transition duration-150 ease-in-out">
                    <div className="flex items-center mb-2">
                      <div className="h-5 w-5 rounded-full overflow-hidden mr-2 flex-shrink-0">
                        <Image 
                          className="object-cover" 
                          src={post.authorImage}
                          width={20}
                          height={20}
                          alt={post.author}
                        />
                      </div>
                      <div className="text-xs truncate">
                        <a className="font-medium text-indigo-500 hover:text-indigo-400 transition duration-150 ease-in-out" href="#0">
                          {post.author}
                        </a>
                      </div>
                    </div>
                    <h3 className="text-sm mb-2 line-clamp-2 h-10">
                      <Link className="text-slate-200 font-semibold hover:text-white transition duration-150 ease-in-out" href={`/posts/${post.id}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <div className="text-xs text-slate-600">
                      <span className="text-slate-500">{post.date}</span> · <span className="text-slate-500">{post.comments} Comments</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 text-right">
              <button 
                onClick={handleViewAll} 
                className="text-xs font-medium text-indigo-500 hover:text-indigo-400 transition duration-150 ease-in-out"
              >
                View All <span className="tracking-normal ml-1">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}