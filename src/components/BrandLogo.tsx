import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export default function BrandLogo({ className = '', size = 'md', showText = true }: BrandLogoProps) {
  const dimensions = {
    sm: { box: 'w-10 h-10', svg: 'w-8 h-8', text: 'text-[11px]' },
    md: { box: 'w-16 h-16', svg: 'w-13 h-13', text: 'text-sm' },
    lg: { box: 'w-24 h-24', svg: 'w-20 h-20', text: 'text-base' },
    xl: { box: 'w-36 h-36', svg: 'w-30 h-30', text: 'text-lg' }
  };

  const dim = dimensions[size];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* High-Fidelity App Icon Mimicking the macOS Premium Circular Style with White & Blue Theme */}
      <div className={`${dim.box} bg-gradient-to-b from-white to-[#f0f5fa] border-2 border-indigo-600/10 shadow-lg shadow-indigo-100/50 rounded-full flex items-center justify-center relative overflow-hidden p-1`}>
        {/* Soft Ambient Inner Glow from Top */}
        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-blue-50/30 to-transparent pointer-events-none" />
        
        {/* Royal Blue Indicator Dot above the letters, centered */}
        <div className="absolute top-1.5 w-[4px] h-[4px] bg-[#2563eb] rounded-full blur-[0.5px] shadow-[0_0_6px_rgba(37,99,235,0.6)] opacity-95" />

        {/* Scalable Vector SVG zoomed in perfectly (using bounds 18 20 85 70 instead of 0 0 120 120 for optimal fill) */}
        <svg 
          viewBox="18 20 85 70" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={`${dim.svg} text-indigo-600`}
        >
          <defs>
            {/* Cyan/Blue Fill Gradient for elements */}
            <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>

            {/* Glowing Arrow Gradient - Sky to Royal Blue to Indigo */}
            <linearGradient id="arrowGrad" x1="0.3" y1="0.7" x2="0.8" y2="0.2">
              <stop offset="0%" stopColor="#06b6d4" /> {/* Cyan */}
              <stop offset="50%" stopColor="#2563eb" /> {/* Vivid Blue */}
              <stop offset="100%" stopColor="#1e40af" /> {/* Deep Royal Blue */}
            </linearGradient>
            
            {/* Subtle Royal Blue Shadow for Arrow to prevent muddiness */}
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="1" dy="1.5" stdDeviation="1" floodColor="#1e3a8a" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Letter 'P' Base with Blue-filled Stem */}
          {/* Vertical stem filled with Cyan/Blue gradient */}
          <rect x="25" y="35" width="10" height="50" rx="2" fill="url(#cyanGrad)" />
          {/* Premium royal blue outline path of 'P' */}
          <path 
            d="M 25 85 L 25 35 Q 25 25, 45 25 L 55 25 Q 70 25, 70 42.5 Q 70 60, 55 60 L 35 60" 
            stroke="#1e3a8a" 
            strokeWidth="7.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          
          {/* Letter 'M' integrated with rising Arrow ticking upwards */}
          {/* Left leg of M is a rich blue tick mark starting from center */}
          <path 
            d="M 52 64 L 64 78 M 64 78 L 95 38" 
            stroke="#1e3a8a" 
            strokeWidth="9" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            filter="url(#shadow)"
          />
          
          {/* Standard Right leg of M */}
          <path 
            d="M 88 56 L 88 85" 
            stroke="url(#cyanGrad)" 
            strokeWidth="7" 
            strokeLinecap="round" 
            opacity="0.95"
          />

          {/* Cyan/Arrow Fill representation */}
          {/* Upward gradient check/arrow layer to show progress */}
          <path 
            d="M 55 64 L 64 74 L 95 34 L 100 45 L 95 34 L 84 34" 
            stroke="url(#arrowGrad)" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          
          {/* Arrow Tip */}
          <path 
            d="M 82 32 L 96 32 L 96 46" 
            stroke="#1e3a8a" 
            strokeWidth="7" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>

      {showText && (
        <div className="text-center mt-3">
          <span className={`${dim.text} text-indigo-600 font-extrabold tracking-widest block uppercase`}>
            PPM
          </span>
          <span className="text-[9px] text-[#5c6873] font-semibold tracking-[0.2em] uppercase block mt-1">
            signed edutn43
          </span>
        </div>
      )}
    </div>
  );
}
