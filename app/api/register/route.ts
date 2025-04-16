import connect from "@/utils/config/database";
import User from "@/utils/models/auth";
import bcryptjs from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";

// Helper functions to match what's in other files
const getInitials = (name: string): string => {
  if (!name) return '?';
  
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  }
  
  return name.charAt(0).toUpperCase();
};

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

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connect();
    
    // Parse the request body
    const { name, email, password } = await request.json();
    
    console.log('Registration request:', { name, email, password: '********' });
    
    // Validate input fields
    if (!name || !email || !password) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      console.error('Password too short');
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('User already exists:', email);
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Generate letter avatar in the new format
    const initials = getInitials(name);
    const color = stringToColor(name);
    const letterAvatar = `letter-avatar:${initials}:${color}`;

    // Create the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      image: letterAvatar // Save the letter avatar in the new format
    });

    console.log('Creating new user:', { name, email, image: letterAvatar });
    
    // Save the user to the database
    const savedUser = await newUser.save();
    console.log('User saved successfully:', savedUser._id);

    // Return success response
    return NextResponse.json({
      message: "User created successfully",
      success: true,
      user: {
        name: savedUser.name,
        email: savedUser.email,
        image: savedUser.image
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      error: error.message || "Internal server error" 
    }, { status: 500 });
  }
}