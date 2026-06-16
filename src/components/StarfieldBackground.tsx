import React, { useMemo } from "react";

interface Star {
  id: number;
  left: string;
  top: string;
  size: number;
  opacity: number;
  glow: boolean;
  isAltAnimation: boolean;
  delay: string;
}

export default function StarfieldBackground() {
  const starsArray = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2, // 2px to 6px
      opacity: Math.random() * 0.45 + 0.15, // 15% to 60% opacity
      glow: Math.random() > 0.4,
      isAltAnimation: Math.random() > 0.5,
      delay: `${Math.random() * -15}s`, // pre-cached negative delay so they starts at already drifted positions
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {starsArray.map((star) => (
        <div
          key={star.id}
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: star.delay,
          }}
          className={`absolute rounded-full bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-300 pointer-events-none ${
            star.isAltAnimation ? "animate-slow-drift-alt" : "animate-slow-drift"
          } ${
            star.glow ? "shadow-[0_0_8px_4px_rgba(56,189,248,0.3)]" : "shadow-xs"
          }`}
        />
      ))}
    </div>
  );
}
