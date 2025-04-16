import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/utils/config/database';
import Comment from '@/utils/models/comment';
import Post from '@/utils/models/post';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');

  if (!postId) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  await dbConnect();

  const comments = await Comment.find({ postId }).sort({ createdAt: -1 });

  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    await dbConnect();

    const { postId, content, parentCommentId, author, authorImage, authorEmail } = await req.json();

    const newComment = new Comment({
      postId,
      content,
      parentCommentId,
      author,
      authorImage,
      authorEmail,
    });

    await newComment.save();

    // Update the post's comment count and add commenter's image
    await Post.findByIdAndUpdate(
      postId,
      {
        $inc: { comments: 1 },
        $addToSet: { commenters: authorImage } // Add unique commenter images
      },
      { new: true }
    );

    return NextResponse.json({ message: 'Comment created successfully', comment: newComment });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Error creating comment' }, { status: 500 });
  }
}