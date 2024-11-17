"use client"
import React, { memo, useEffect, useState } from 'react';

interface LoaderProps {
  message?: string;
}

const PremiumLoader: React.FC<LoaderProps> = memo(({ message = "Loading" }) => {
  const [dots, setDots] = useState(0);

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev + 1) % 4);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Create loading message with animated dots
  const loadingText = message + '.'.repeat(dots);

  const styles = `
    @keyframes orbital {
      0% { transform: rotate(0deg) translateX(0) rotate(0deg); opacity: 0; }
      50% { opacity: 1; }
      100% { transform: rotate(360deg) translateX(0) rotate(-360deg); opacity: 0; }
    }

    @keyframes wave {
      0%, 100% { transform: scaleY(0.5); }
      50% { transform: scaleY(1.5); }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }

    @keyframes glow {
      0%, 100% { opacity: 0.5; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.1); }
    }

    .wave-bar {
      animation: wave 1s ease-in-out infinite;
    }

    .orbital-circle {
      animation: orbital 4s linear infinite;
    }

    .floating-element {
      animation: float 3s ease-in-out infinite;
    }

    .glow-effect {
      animation: glow 2s ease-in-out infinite;
    }
  `;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <style>{styles}</style>
      
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-900/98 to-black backdrop-blur-lg" />

      {/* Main container */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Glowing background effect */}
        <div className="absolute -inset-20 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl glow-effect" />

        {/* Central loading animation */}
        <div className="relative w-60 h-60">
          {/* Orbital rings */}
          {[...Array(3)].map((_, i) => (
            <div
              key={`ring-${i}`}
              className="absolute inset-0 rounded-full border-2 border-transparent"
              style={{
                background: `linear-gradient(${120 * i}deg, transparent, rgba(147, 51, 234, ${0.3 + i * 0.2}), transparent)`,
                transform: `rotate(${i * 120}deg)`,
                animation: `orbital ${6 - i}s linear infinite`
              }}
            />
          ))}

          {/* Center piece */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-32 h-32">
              {/* Pulsing circles */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full opacity-20 animate-ping" />
              <div className="absolute inset-2 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full opacity-30 floating-element" />
              <div className="absolute inset-4 bg-gradient-to-tr from-blue-300 to-purple-300 rounded-full opacity-40" />
              
              {/* Wave bars */}
              <div className="absolute inset-0 flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={`wave-${i}`}
                    className="w-1.5 h-12 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full wave-bar"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div className="mt-12 text-2xl font-medium">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {loadingText}
          </span>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5,
                animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

PremiumLoader.displayName = 'PremiumLoader';

export default PremiumLoader;