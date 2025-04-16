import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/utils/config/database';
import Post from '@/utils/models/post';
import User from '@/utils/models/user';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  console.log('Create post - Session:', session);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    await dbConnect();

    const { title, content, category, tags, images, status } = await req.json();
    console.log('Create post - Received data:', { title, content, category, tags, images, status });

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json({ error: 'Title, content, and category are required' }, { status: 400 });
    }

    // Validate title length
    if (title.length > 100) {
      return NextResponse.json({ error: 'Title cannot be longer than 100 characters' }, { status: 400 });
    }

    // Validate content length
    if (content.length < 50) {
      return NextResponse.json({ error: 'Content must be at least 50 characters long' }, { status: 400 });
    }

    // Format the date to include only month and day
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleString('default', { month: 'short' })} ${currentDate.getDate()}`;

    const newPost = new Post({
      title,
      content,
      author: session.user.name,
      authorEmail: session.user.email,
      authorImage: session.user.image,
      date: formattedDate,
      category: category || 'Real Estate Investing',
      tags: tags || [],
      images: images || [],
      status: status || 'published'
    });

    console.log('Create post - New post data:', newPost);

    await newPost.save();

    return NextResponse.json({ 
      message: 'Post created successfully', 
      post: newPost,
      redirect: status === 'published' ? '/' : '/my-drafts'
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Error creating post' }, { status: 500 });
  }
}