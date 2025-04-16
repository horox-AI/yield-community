import mongoose from "mongoose";

// Helper functions for letter avatars
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

// Default values for letter avatar
const defaultColor = "#3498db"; // A nice blue
const defaultInitials = "U"; // For "User"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please write your fullname"],
  },
  email: {
    type: String,
    required: [true, "please provide a valid email"],
    unique: true,
  },
  password: {
    type: String,
  },
  image: {
    type: mongoose.Schema.Types.Mixed, // Can be a string for letter avatars or an object with binary data
    default: `letter-avatar:${defaultInitials}:${defaultColor}` // Use the new format
  },
  bio: {
    type: String,
    default: 'Click edit to add your bio',
  },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

// Important: We use mongoose.models.User here to match what's expected by NextAuth
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;