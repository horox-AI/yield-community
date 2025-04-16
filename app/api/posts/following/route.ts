import { NextResponse } from 'next/server';
import connect from '@/utils/config/database';
import Post from '@/utils/models/post';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/utils/models/user';

// Fetch following posts (posts from authors the user follows)
export async function GET() {
  try {
    // Connect to the database
    await connect();

    // Get the current user's session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      // If user is not logged in, return sample posts instead of unauthorized error
      // This makes the UI more friendly for visitors who aren't logged in
      return await getFallbackPosts();
    }

    // Find the current user by email
    const currentUser = await User.findOne({ email: session.user.email });
    
    if (!currentUser) {
      return await getFallbackPosts();
    }

    // Fetch the following user IDs from the current user's following list
    const followingUserIds = currentUser.following || [];

    // If not following anyone, return fallback posts
    if (followingUserIds.length === 0) {
      return await getFallbackPosts();
    }

    // Find posts created by users that the current user follows
    // Sort by most recent first (descending createdAt)
    const followingPosts = await Post.find({
      author: { $in: followingUserIds }
    })
    .sort({ createdAt: -1 })
    .populate("author", "name image")
    .limit(20); // Fetch up to 20 posts, we'll use 10 in the UI

    // If no posts from followed users, return fallback posts
    if (followingPosts.length === 0) {
      return await getFallbackPosts();
    }

    // Transform the posts to include necessary properties
    const formattedPosts = followingPosts.map((post: any) => {
      const createdDate = new Date(post.createdAt);
      const formattedDate = `${createdDate.getDate()} ${createdDate.toLocaleString('default', { month: 'short' })}`;
      
      return {
        id: post._id.toString(),
        title: post.title,
        author: post.author.name,
        authorImage: post.author.image || "/images/avatar-01.jpg", // Default image if none available
        date: formattedDate,
        comments: post.comments?.length || 0
      };
    });

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error("Error fetching following posts:", error);
    return NextResponse.json({ message: "Failed to fetch following posts" }, { status: 500 });
  }
}

// Fallback function to return some popular posts when user has no following
async function getFallbackPosts() {
  try {
    // Get popular posts instead
    const posts = await Post.find()
      .sort({ votes: -1 })  // Sort by popularity
      .limit(10)
      .lean();
    
    // Format the posts similarly
    const formattedPosts = posts.map((post: any) => {
      // Format the date
      const createdDate = new Date(post.createdAt || new Date());
      const formattedDate = `${createdDate.getDate()} ${createdDate.toLocaleString('default', { month: 'short' })}`;
      
      return {
        id: post._id.toString(),
        title: post.title,
        author: post.author,
        authorImage: post.authorImage || "/images/avatar-01.jpg",
        date: formattedDate,
        comments: Array.isArray(post.comments) ? post.comments.length : 0
      };
    });
    
    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error("Error fetching fallback posts:", error);
    // Return empty array if even fallback fails
    return NextResponse.json([]);
  }
} 