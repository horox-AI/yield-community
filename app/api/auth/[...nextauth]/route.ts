import connect from "@/utils/config/database";
import User from "@/utils/models/auth";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcryptjs from "bcryptjs";

// Helper function to generate a color - same as in LetterAvatar.tsx for consistency
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
  
  // Simple hash function to convert string to a number
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Use the hash to pick a color
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Helper function to get initials - same as in LetterAvatar.tsx
const getInitials = (name: string): string => {
  if (!name) return '?';
  
  // Try to get first letter of first and last name
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  }
  
  // If only one word, just use the first letter
  return name.charAt(0).toUpperCase();
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        try {
          console.log("Auth attempt for:", email);
          await connect();
          
          // Important: User model name is capitalized to be consistent with our schema
          const user = await User.findOne({ email });
          
          if (!user) {
            console.error("User not found:", email);
            return null;
          }
          
          const passwordsMatch = await bcryptjs.compare(
            password,
            user.password
          );
          
          if (!passwordsMatch) {
            console.error("Password mismatch for:", email);
            return null;
          }
          
          console.log("Auth successful for:", email);
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      if (account.provider === "google") {
        try {
          console.log('Google sign in - User:', user);
          const { name, email, image } = user;
          await connect();
          const ifUserExists = await User.findOne({ email });
          if (ifUserExists) {
            console.log('Existing user:', ifUserExists);
            // Update the user's name and image if they've changed
            if (ifUserExists.name !== name || ifUserExists.image !== image) {
              // Ensure the image path is stored correctly
              const imagePath = image.startsWith('http') ? image : image.split('/').pop();
              await User.updateOne({ email }, { name, image: imagePath });
              console.log('Updated user info');
            }
            return true;
          }
          // For new users, store just the filename if it's not a full URL
          const imagePath = image.startsWith('http') ? image : image.split('/').pop();
          const newUser = new User({
            name: name,
            email: email,
            image: imagePath,
          });
          const res = await newUser.save();
          console.log('New user created:', res);
          return true;
        } catch (err) {
          console.error('Error in Google sign in:', err);
          return false;
        }
      }
      return true;
    },
    
    async jwt({ token, user, account, trigger }) {
      if (trigger === "update" && token) {
        // Handle token updates if needed
        return { ...token, ...user };
      }
      
      // Pass user details to token on sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      console.log('Session callback - Token:', token);
      console.log('Session callback - Initial session:', session);
      
      if (session.user) {
        // Add the user ID to the session
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        
        // Handle the image path
        let imagePath = token.picture || token.image;
        
        // If user has no image (typical for email authentication), use letter avatar
        if (!imagePath || imagePath === 'avatar.png') {
          // Use the new format: letter-avatar:INITIALS:COLOR
          const displayName = session.user.name || session.user.email || 'User';
          const initials = getInitials(displayName);
          const color = stringToColor(displayName);
          
          // Store both initials and color
          session.user.image = `letter-avatar:${initials}:${color}`;
        } else if (imagePath && !imagePath.startsWith('http') && !imagePath.startsWith('/')) {
          imagePath = `/images/${imagePath}`;
          session.user.image = imagePath;
        } else {
          session.user.image = imagePath;
        }
      }
      
      console.log('Session callback - Final session:', session);
      return session;
    },
  },
  
  pages: {
    signIn: "/signin",
    error: '/auth/error',
  },
  
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };