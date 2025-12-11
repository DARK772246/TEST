import React from 'react';

interface Avatar3DProps {
  src?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar3D({ src, fallback, size = 'md', className = '' }: Avatar3DProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  const ringOffset = {
    sm: '-inset-0.5',
    md: '-inset-1',
    lg: '-inset-1.5',
    xl: '-inset-2',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Outer animated gold ring */}
      <div
        className={`absolute ${ringOffset[size]} rounded-full animate-rotate-ring`}
        style={{
          background: 'conic-gradient(from 0deg, hsl(var(--gold-dark)), hsl(var(--gold)), hsl(var(--gold-light)), hsl(var(--gold)), hsl(var(--gold-dark)))',
          animationDuration: '4s',
        }}
      />

      {/* Inner glow ring */}
      <div
        className={`absolute ${ringOffset[size]} rounded-full animate-pulse-gold opacity-60`}
        style={{
          background: 'radial-gradient(circle, transparent 50%, hsl(var(--gold) / 0.3) 100%)',
        }}
      />

      {/* Avatar container */}
      <div
        className={`${sizeClasses[size]} relative rounded-full overflow-hidden flex items-center justify-center font-semibold z-10`}
        style={{
          background: src ? 'transparent' : 'linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--muted)))',
          boxShadow: 'inset 0 2px 4px hsl(0 0% 100% / 0.1), 0 4px 12px hsl(0 0% 0% / 0.2)',
        }}
      >
        {src ? (
          <img src={src} alt={fallback} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gold font-display">{fallback}</span>
        )}
      </div>

      {/* Shine effect */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none z-20 overflow-hidden"
      >
        <div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/20 to-transparent transform rotate-45"
        />
      </div>
    </div>
  );
}
