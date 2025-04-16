"use client";

import React, { useMemo } from 'react';

interface LetterAvatarProps {
  name: string;
  size?: number;
  className?: string;
  predefinedColor?: string;
}

/**
 * Generate a color based on the string provided
 * This will always return the same color for the same string
 */
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

/**
 * Get the first letter of each word in the name
 */
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

/**
 * Parse the letter-avatar format if present (letter-avatar:INITIALS:COLOR)
 * Returns an object with the initials and color if found
 */
const parseLetterAvatarFormat = (name: string): { initials?: string; color?: string } => {
  if (!name || !name.startsWith('letter-avatar:')) return {};
  
  const parts = name.substring('letter-avatar:'.length).split(':');
  
  if (parts.length === 1) {
    // Old format: letter-avatar:NAME - just use the name for initials
    return { initials: getInitials(parts[0]) };
  } else if (parts.length >= 2) {
    // New format: letter-avatar:INITIALS:COLOR
    return { 
      initials: parts[0],
      color: parts[1]
    };
  }
  
  return {};
};

const LetterAvatar: React.FC<LetterAvatarProps> = ({ 
  name, 
  size = 40, 
  className = '',
  predefinedColor
}) => {
  // Memoize the color and initials so they don't recompute on every render
  const { color, initials } = useMemo(() => {
    // Check if using the letter-avatar format
    if (name?.startsWith('letter-avatar:')) {
      const parsed = parseLetterAvatarFormat(name);
      return {
        initials: parsed.initials || '?',
        color: parsed.color || stringToColor(parsed.initials || 'Unknown')
      };
    }
    
    // Regular name processing with optional predefined color
    return {
      color: predefinedColor || stringToColor(name || 'Unknown'),
      initials: getInitials(name || 'Unknown')
    };
  }, [name, predefinedColor]);

  return (
    <div 
      className={`flex items-center justify-center rounded-full text-white ${className}`}
      style={{ 
        backgroundColor: color,
        width: size,
        height: size,
        fontSize: size * 0.4,
        fontWeight: 'bold',
      }}
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </div>
  );
};

export default LetterAvatar; 