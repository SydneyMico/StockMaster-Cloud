
import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  noBackground?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 64, className = "", noBackground = false }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Shape matching the provided icon's corner radius */}
      {!noBackground && (
        <rect width="512" height="512" rx="128" fill="#5252f2"/>
      )}
      
      {/* Main Isometric Box Body */}
      <path 
        d="M256 100L100 190V370L256 460L412 370V190L256 100Z" 
        fill="white"
      />
      
      {/* Top Face Highlight for 3D depth */}
      <path 
        d="M256 100L100 190L256 280L412 190L256 100Z" 
        fill="#eef2ff"
      />
      
      {/* Edge Definitions (Indigo Creases) */}
      <path 
        d="M100 190L256 280L412 190" 
        stroke="#5252f2" 
        strokeWidth="24" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M256 280V460" 
        stroke="#5252f2" 
        strokeWidth="24" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Top Flap Decorative Stripe matching the provided image exactly */}
      <path 
        d="M185 145L310 215" 
        stroke="#5252f2" 
        strokeWidth="38" 
        strokeLinecap="round" 
        opacity="0.12"
      />
    </svg>
  );
};

export default Logo;
