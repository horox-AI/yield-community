"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface UpvoteButtonProps {
  id: string;
  initialVotes: number;
  initialUserVoted: boolean;
  className?: string;
  svgClassName?: string;
  textClassName?: string;
}

const UpvoteButton: React.FC<UpvoteButtonProps> = ({
  id,
  initialVotes,
  initialUserVoted,
  className,
  svgClassName,
  textClassName
}) => {
  const [votes, setVotes] = useState(initialVotes);
  const [userVoted, setUserVoted] = useState(initialUserVoted);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { data: session, status } = useSession();

  const handleUpvote = async () => {
    if (status === 'unauthenticated') {
      setError('Please log in to vote');
      return;
    }

    if (userVoted) {
      setError('You have already voted on this post');
      return;
    }

    console.log('Upvote button clicked for post:', id);
    if (isLoading) return;
    setIsLoading(true);
    setError('');
    try {
      console.log('Sending POST request to:', `/api/posts/${id}/upvotes`);
      const response = await axios.post(`/api/posts/${id}/upvotes`);
      console.log('Response received:', response.data);
      if (response.data.votes !== undefined) {
        setVotes(response.data.votes);
        setUserVoted(true);
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Error upvoting post:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data);
        if (error.response?.status === 401) {
          setError('Please log in to vote');
        } else if (error.response?.status === 409) {
          setError('You have already voted on this post');
        } else {
          setError('Failed to upvote. Please try again.');
        }
      }
    }
    setIsLoading(false);
  };

  return (
    <div>
      <button
        onClick={handleUpvote}
        disabled={isLoading || status === 'loading' || status === 'unauthenticated' || userVoted}
        className={`${className} ${userVoted ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <svg className={svgClassName} width="11" height="7" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.664 6.747.336 5.253 5.5.662l5.164 4.591-1.328 1.494L5.5 3.338z" />
        </svg>
        <span className={textClassName}>{votes}</span>
      </button>
      {error && <p style={{ color: 'red', fontSize: '0.8em', marginTop: '5px' }}>{error}</p>}
    </div>
  );
};

export default UpvoteButton;