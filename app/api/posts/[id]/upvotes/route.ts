import { NextResponse } from 'next/server';
import db from '@/utils/config/database';
import Post from '@/utils/models/post';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/utils/models/user'; // Add this import

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log("API route accessed");
  console.log("Received params:", params);
  const { id } = params;
  console.log("Post ID:", id);

  // Check if the user is authenticated
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log("Connecting to database...");
    await db();
    console.log("Database connected");

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid post ID:", id);
      return NextResponse.json({ message: 'Invalid post ID' }, { status: 400 });
    }

    console.log("Attempting to update post with ID:", id);
    let updatedPost;
    try {
      // First, find the post
      const post = await Post.findById(id);
      if (!post) {
        console.log("Post not found for ID:", id);
        return NextResponse.json({ message: 'Post not found' }, { status: 404 });
      }

      console.log("Current post data:", JSON.stringify(post, null, 2));

      // Ensure votes is a number and increment it
      post.votes = (typeof post.votes === 'number' ? post.votes : Number(post.votes) || 0) + 1;
      
      // Save the updated post
      updatedPost = await post.save();
      console.log("Updated post data:", JSON.stringify(updatedPost, null, 2));

    } catch (dbError) {
      console.error("Database operation failed:", dbError);
      if (dbError instanceof mongoose.Error.ValidationError) {
        console.error("Validation error details:", JSON.stringify(dbError.errors, null, 2));
      }
      return NextResponse.json({ message: 'Database operation failed', error: (dbError as Error).message }, { status: 500 });
    }

    console.log('Successfully updated post:', updatedPost);
    return NextResponse.json({ votes: updatedPost.votes });
  } catch (error) {
    console.error('Failed to update the post:', error);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    return NextResponse.json({ message: 'Failed to update the post', error: (error as Error).message }, { status: 500 });
  }
}