// models/User.ts

import mongoose from 'mongoose';

// Generate a default color and initials for the default avatar
const defaultColor = "#3498db"; // A nice blue
const defaultInitials = "U"; // For "User"

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: {
    type: mongoose.Schema.Types.Mixed, // Can be a string for letter avatars or an object with binary data
    default: `letter-avatar:${defaultInitials}:${defaultColor}` // Use the new format
  },
  bio: { type: String, default: '' },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users this user follows
  // ... other fields
}, { timestamps: true });  // Add timestamps

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;