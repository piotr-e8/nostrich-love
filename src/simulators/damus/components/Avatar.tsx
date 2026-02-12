import React from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md',
  className = '' 
}) => {
  // Check if src is a gradient class (contains 'from-', 'to-', etc.)
  const isGradient = src && (src.includes('from-') || src.includes('gradient'));
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-20 h-20',
  };

  if (isGradient) {
    // Use the gradient classes directly
    const gradientClass = src || 'from-purple-500 to-blue-500';
    return (
      <div 
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center ${className}`}
        title={alt}
      >
        <span className="text-white font-bold text-lg">
          {alt.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  // Use as image URL
  return (
    <img
      src={src || `https://api.dicebear.com/7.x/avataaars/svg?seed=${alt}`}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full object-cover bg-gray-100 ${className}`}
    />
  );
};

export default Avatar;
