import { NextResponse } from 'next/server';
import connect from '@/utils/config/database';
import Post from '@/utils/models/post';

export const dynamic = 'force-dynamic';

// Fetch all posts (regular sorting - by updatedAt)
export async function GET() {
  try {
    await connect();
    const posts = await Post.find().sort({ updatedAt: -1 }).lean();

    const formattedPosts = posts.map(post => ({
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      author: post.author,
      date: post.date,
      votes: post.votes,
      comments: post.comments,
      authorImage: post.authorImage,
      commenters: post.commenters || []
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// Helper function to format posts
const formatPosts = (posts) => {
  return posts.map(post => ({
    id: post._id.toString(),
    title: post.title,
    content: post.content,
    author: post.author,
    date: post.date,
    votes: post.votes,
    comments: post.comments,
    authorImage: post.authorImage,
    commenters: post.commenters || []
  }));
};



