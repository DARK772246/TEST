import React from 'react';

interface PremiumLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function PremiumLoader({ size = 'md', text }: PremiumLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const ringSize = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* Outer rotating ring */}
        <div
          className={`${ringSize[size]} absolute -inset-2 rounded-full animate-rotate-ring`}
          style={{
            background: 'conic-gradient(from 0deg, transparent, hsl(var(--gold)), hsl(var(--gold-light)), transparent)',
          }}
        />
        
        {/* Middle pulsing ring */}
        <div
          className={`${ringSize[size]} absolute -inset-2 rounded-full animate-pulse-gold opacity-50`}
          style={{
            background: 'radial-gradient(circle, transparent 40%, hsl(var(--gold) / 0.3) 70%, transparent 100%)',
          }}
        />

        {/* Inner shield/logo */}
        <div
          className={`${sizeClasses[size]} relative rounded-full flex items-center justify-center`}
          style={{
            background: 'linear-gradient(135deg, hsl(var(--gold-dark)), hsl(var(--gold)), hsl(var(--gold-light)))',
            boxShadow: '0 0 30px hsl(var(--gold) / 0.5), inset 0 2px 4px hsl(0 0% 100% / 0.3)',
          }}
        >
          {/* Inner rotating element */}
          <div
            className="absolute inset-1 rounded-full animate-rotate-ring"
            style={{
              background: 'conic-gradient(from 180deg, hsl(var(--gold-light)), transparent, hsl(var(--gold-light)))',
              animationDuration: '2s',
              animationDirection: 'reverse',
            }}
          />
          
          {/* Center dot */}
          <div
            className="w-1/3 h-1/3 rounded-full z-10"
            style={{
              background: 'radial-gradient(circle, hsl(0 0% 100%), hsl(var(--gold-light)))',
              boxShadow: '0 0 10px hsl(var(--gold) / 0.8)',
            }}
          />
        </div>

        {/* Orbiting dots */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-rotate-ring"
            style={{
              background: 'hsl(var(--gold-light))',
              boxShadow: '0 0 10px hsl(var(--gold))',
              top: '50%',
              left: '50%',
              transformOrigin: '0 0',
              animationDuration: `${2 + i * 0.5}s`,
              animationDelay: `${i * 0.3}s`,
              transform: `rotate(${i * 120}deg) translateX(${size === 'lg' ? 50 : size === 'md' ? 35 : 20}px)`,
            }}
          />
        ))}
      </div>

      {text && (
        <p className="text-gold font-medium animate-pulse text-center mt-4">{text}</p>
      )}
    </div>
  );
}

export function FullPageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6">
        <PremiumLoader size="lg" />
        <p className="text-gold-shimmer font-display text-xl animate-pulse">{text}</p>
      </div>
    </div>
  );
}
