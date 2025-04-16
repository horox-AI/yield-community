import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/utils/models/user';
import dbConnect from '@/utils/config/database';

// Import these helper functions to match what's in NextAuth
// Helper function to generate a color
const stringToColor = (string: string): string => {
  // List of vibrant colors suitable for avatars
  const colors = [
    "#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e",
    "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50",
    "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6",
    "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d",
    "#6366f1", "#8b5cf6", "#ec4899", "#ef4444", "#f97316",
    "#84cc16", "#14b8a6", "#06b6d4", "#0ea5e9", "#8b5cf6"
  ];
  
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Helper function to get initials
const getInitials = (name: string): string => {
  if (!name) return '?';
  
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  }
  
  return name.charAt(0).toUpperCase();
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    await dbConnect();

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const bio = formData.get('bio') as string;
    const imageFile = formData.get('image') as File | null;
    const email = formData.get('email') as string || session.user.email;

    let updateData: any = { name, bio };

    if (imageFile) {
      // User uploaded an image file
      const buffer = await imageFile.arrayBuffer();
      const imageBuffer = Buffer.from(buffer);
      updateData.image = {
        data: imageBuffer,
        contentType: imageFile.type
      };
    } else if (name) {
      // No image file provided, but we have a name - use letter avatar with new format
      const initials = getInitials(name);
      const color = stringToColor(name);
      updateData.image = `letter-avatar:${initials}:${color}`;
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate a data URL for the image if it's a binary image
    let imageUrl = null;
    let image = updatedUser.image;
    
    // Handle different image formats
    if (typeof updatedUser.image === 'string') {
      // For letter avatars or string-based image paths
      image = updatedUser.image;
    } else if (updatedUser.image && updatedUser.image.data) {
      // For binary images
      const base64Image = updatedUser.image.data.toString('base64');
      imageUrl = `data:${updatedUser.image.contentType};base64,${base64Image}`;
      image = imageUrl;
    }

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        hasImage: !!updatedUser.image,
        image: image,
        imageUrl: imageUrl
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Error updating profile' }, { status: 500 });
  }
}