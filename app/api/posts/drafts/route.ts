import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/utils/config/database';
import Post from '@/utils/models/post';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    await dbConnect();

    // Find drafts for the current user
    const drafts = await Post.find({
      authorEmail: session.user.email,
      status: 'draft'
    }).sort({ updatedAt: -1 }); // Sort by last updated

    return NextResponse.json(drafts);
  } catch (error) {
    console.error('Error fetching drafts:', error);
    return NextResponse.json({ error: 'Error fetching drafts' }, { status: 500 });
  }
} 