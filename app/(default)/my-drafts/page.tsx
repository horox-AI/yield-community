'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

type DraftPost = {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};

export default function MyDraftsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [drafts, setDrafts] = useState<DraftPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/signin');
      return;
    }

    // Fetch user's draft posts
    if (status === 'authenticated') {
      fetchDrafts();
    }
  }, [status, router]);

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts/drafts');
      if (!response.ok) {
        throw new Error('Failed to fetch drafts');
      }
      const data = await response.json();
      setDrafts(data);
    } catch (error) {
      console.error('Error fetching drafts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const deleteDraft = async (id: string) => {
    if (!confirm('Are you sure you want to delete this draft?')) return;
    
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete draft');
      }
      
      // Remove the deleted draft from the list
      setDrafts(drafts.filter(draft => draft._id !== id));
    } catch (error) {
      console.error('Error deleting draft:', error);
      alert('Failed to delete draft. Please try again.');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-slate-400">Loading drafts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My Drafts</h1>
        <Link 
          href="/create-post" 
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Create New Post
        </Link>
      </div>

      {drafts.length === 0 ? (
        <div className="bg-slate-800/25 border border-slate-800 rounded-lg p-8 text-center">
          <svg 
            className="w-16 h-16 mx-auto mb-4 text-slate-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M19 14v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5m14-2l-5-5-5 5M14 3v6"
            />
          </svg>
          <h2 className="text-xl font-semibold mb-2">No drafts found</h2>
          <p className="text-slate-400 mb-6">You haven't saved any drafts yet.</p>
          <Link 
            href="/create-post" 
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <div 
              key={draft._id} 
              className="bg-slate-800/25 border border-slate-800 rounded-lg p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-slate-100">
                    {draft.title || 'Untitled Draft'}
                  </h2>
                  <div className="flex items-center text-sm text-slate-400 space-x-4 mb-2">
                    <span>{draft.category}</span>
                    <span>•</span>
                    <span>Last updated: {formatDate(draft.updatedAt)}</span>
                  </div>
                  <p className="text-slate-300 line-clamp-2">
                    {draft.content.replace(/<[^>]*>/g, '').substring(0, 150)}
                    {draft.content.length > 150 ? '...' : ''}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link 
                    href={`/edit-post/${draft._id}`}
                    className="p-2 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors"
                    title="Edit draft"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <button 
                    onClick={() => deleteDraft(draft._id)}
                    className="p-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors"
                    title="Delete draft"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 