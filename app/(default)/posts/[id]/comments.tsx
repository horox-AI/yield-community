'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';

interface Comment {
  _id: string;
  author: string;
  authorImage: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const { data: session } = useSession();
  const { id: postId } = useParams();

  useEffect(() => {
    // Fetch comments for this post
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    const response = await fetch(`/api/comments?postId=${postId}`);
    const data = await response.json();
    setComments(data);
  };

  const handleSubmitComment = async (e: React.FormEvent, parentCommentId: string | null = null) => {
    e.preventDefault();
    if (!session) {
      alert('You must be signed in to comment');
      return;
    }

    const userImage = session.user?.image || '/images/userStandardProfileSquare.png';
    const authorImage = userImage.startsWith('http') ? userImage : userImage.split('/').pop();

    const commentData = {
      postId,
      content: newComment,
      parentCommentId,
      author: session?.user?.name ?? 'Anonymous',
      authorImage: authorImage,
      authorEmail: session?.user?.email, // Add this line
    };

    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData),
    });

    if (response.ok) {
      setNewComment('');
      setReplyingTo(null);
      fetchComments(); // Refresh comments
    } else {
      alert('Failed to post comment');
    }
  };

  const renderComments = (commentsToRender: Comment[], depth = 0) => {
    const getImageSrc = (imageName: string | undefined) => {
      if (!imageName) {
        return '/images/avatar.png';
      }
      if (imageName.startsWith('http')) {
        return imageName;
      }
      if (imageName.startsWith('/')) {
        return imageName;
      }
      return `/images/${imageName}`;
    };

    return commentsToRender.map((comment) => (
      <li key={comment._id} className={depth > 0 ? 'ml-6 mt-4' : 'mt-4'}>
        <div className="mb-1">
          <div className="flex items-center mb-1">
            <Image 
              className="rounded-full mr-2" 
              src={getImageSrc(comment.authorImage)}
              width={20} 
              height={20} 
              alt={comment.author} 
            />
            <div className="text-xs text-slate-600">
              <span className="font-medium text-indigo-500">{comment.author}</span>
              {' · '}
              <span className="text-slate-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="text-sm text-slate-400 space-y-4 mb-1">
            <p>{comment.content}</p>
          </div>
          <div className="text-xs text-slate-600">
            <button onClick={() => setReplyingTo(comment._id)} className="text-slate-200 underline hover:no-underline">
              Reply
            </button>
          </div>
          {replyingTo === comment._id && (
            <form onSubmit={(e) => handleSubmitComment(e, comment._id)} className="mt-4">
              <div className="w-full mb-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={2}
                  className="form-textarea w-full placeholder:italic bg-slate-800 text-white"
                  placeholder="Write a reply..."
                />
              </div>
              <div className="text-right">
                <button type="submit" className="btn-sm py-1.5 text-white bg-indigo-500 hover:bg-indigo-600">
                  Post Reply
                </button>
              </div>
            </form>
          )}
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <ul className="border-l-2 border-slate-700 mt-4">
            {renderComments(comment.replies, depth + 1)}
          </ul>
        )}
      </li>
    ));
  };

  return (
    <div>
      <h4 className="font-bold text-slate-200 mb-2">{comments.length} comments</h4>
      <form onSubmit={(e) => handleSubmitComment(e)} className="mb-4">
        <div className="w-full mb-2">
          <label className="sr-only" htmlFor="comment">
            Comment
          </label>
          <textarea
            id="comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            className="form-textarea w-full placeholder:italic bg-slate-800 text-white"
            placeholder="Say something nice..."
          />
        </div>
        <div className="text-right">
          <button type="submit" className="btn-sm py-1.5 text-white bg-indigo-500 hover:bg-indigo-600">
            Post Comment
          </button>
        </div>
      </form>
      <ul>
        {renderComments(comments)}
      </ul>
    </div>
  );
}