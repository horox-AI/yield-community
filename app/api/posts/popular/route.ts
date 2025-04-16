import { NextResponse } from 'next/server';
import connect from '@/utils/config/database';
import Post from '@/utils/models/post';

// Fetch popular posts (sorted by votes)
export async function GET() {
  try {
    await connect();
    const posts = await Post.find().sort({ votes: -1 }).limit(20).lean();
    
    const formattedPosts = posts.map(post => ({
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      author: post.author,
      date: post.date,
      votes: post.votes,
      comments: post.comments,
      authorImage: post.authorImage,
      commenters: post.commenters || [],
      category: post.category || 'regular',
      tags: post.tags || []
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error("Failed to fetch popular posts:", error);
    return NextResponse.json({ error: 'Failed to fetch popular posts' }, { status: 500 });
  }
} 