import React from 'react';

export function DeveloperBrand() {
  return (
    <div className="relative py-8 text-center overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="w-64 h-32 opacity-30 blur-3xl"
          style={{
            background: 'radial-gradient(ellipse, hsl(var(--gold)) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* 3D Container */}
      <div className="relative inline-block transform-3d">
        {/* Decorative lines */}
        <div className="absolute -left-16 top-1/2 w-12 h-px bg-gradient-to-r from-transparent to-gold opacity-50" />
        <div className="absolute -right-16 top-1/2 w-12 h-px bg-gradient-to-l from-transparent to-gold opacity-50" />

        {/* Main text container */}
        <div className="relative">
          <p className="text-sm text-muted-foreground mb-2 tracking-widest uppercase">
            Developed by
          </p>
          
          {/* Name with metallic gold effect */}
          <h3 
            className="text-3xl md:text-4xl font-display font-bold tracking-wide metallic-gold"
            style={{
              textShadow: '0 0 40px hsl(var(--gold) / 0.5)',
            }}
          >
            SALMAN KHAN
          </h3>

          {/* Animated underline */}
          <div className="relative mt-3 mx-auto w-48 h-0.5 overflow-hidden rounded-full">
            <div 
              className="absolute inset-0 animate-shimmer"
              style={{
                background: 'linear-gradient(90deg, transparent, hsl(var(--gold-light)), hsl(var(--gold)), hsl(var(--gold-light)), transparent)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>

          {/* Tagline */}
          <p className="text-xs text-muted-foreground mt-4 tracking-wider opacity-80">
            Passion for Discipline, Sports & Technology
          </p>

          {/* Decorative gold accents */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-gold/50 animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-0.5 h-0.5 rounded-full bg-gold/30 animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>

      {/* Bottom border glow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(var(--gold) / 0.5), transparent)',
        }}
      />
    </div>
  );
}
