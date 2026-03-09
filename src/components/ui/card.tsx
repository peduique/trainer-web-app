interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={`rounded-xl border bg-white p-6 shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow text-left w-full' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}
