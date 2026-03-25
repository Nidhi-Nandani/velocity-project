import React from 'react';

interface AvatarProps {
  initials: string;
  color: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  presenceCount?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ initials, color, size = 'md', className = "", presenceCount }) => {
  const sizeClasses = {
    xs: 'h-5 w-5 text-[8px]',
    sm: 'h-6 w-6 text-[10px]',
    md: 'h-8 w-8 text-xs',
    lg: 'h-10 w-10 text-sm',
  };

  return (
    <div 
      className={`relative flex items-center justify-center rounded-full border-2 border-white font-medium text-white shadow-sm transition-transform hover:scale-110 ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: color }}
    >
      {initials}
      {presenceCount && presenceCount > 1 && (
        <div className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-[8px] font-bold text-white ring-1 ring-white">
          +{presenceCount - 1}
        </div>
      )}
    </div>
  );
};
