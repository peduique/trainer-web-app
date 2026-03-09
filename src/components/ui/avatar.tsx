interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-16 w-16 text-lg' };

export function Avatar({ src, alt, name, size = 'md', className = '' }: AvatarProps) {
  const initials = name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? '?';

  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? name ?? 'Avatar'}
        className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div
      aria-label={alt ?? name ?? 'Avatar'}
      className={`flex items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 ${sizeClasses[size]} ${className}`}
    >
      {initials}
    </div>
  );
}
