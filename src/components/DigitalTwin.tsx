import React from 'react';
import { motion } from 'motion/react';

export const DigitalTwin: React.FC = () => {
  return (
    <div className="relative w-full aspect-square flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[#C5A059]/5 rounded-full blur-3xl" />
      
      {/* Stylized Face SVG */}
      <motion.svg
        viewBox="0 0 200 200"
        className="w-full h-full max-w-[400px] drop-shadow-[0_0_10px_rgba(76,107,95,0.2)]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <defs>
          <linearGradient id="faceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4C6B5F" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#4C6B5F" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        {/* Face Outline */}
        <path
          d="M100,20 C60,20 30,50 30,100 C30,150 60,180 100,180 C140,180 170,150 170,100 C170,50 140,20 100,20 Z"
          fill="url(#faceGradient)"
          stroke="#4C6B5F"
          strokeWidth="0.5"
          opacity="0.6"
        />
        
        {/* Grid Lines */}
        <g stroke="#4C6B5F" strokeWidth="0.1" opacity="0.2">
          {Array.from({ length: 10 }).map((_, i) => (
            <React.Fragment key={i}>
              <line x1="30" y1={40 + i * 14} x2="170" y2={40 + i * 14} />
              <line x1={40 + i * 12} y1="20" x2={40 + i * 12} y2="180" />
            </React.Fragment>
          ))}
        </g>

        {/* Analysis Points */}
        <motion.circle cx="70" cy="80" r="2" fill="#C5A059" animate={{ r: [2, 4, 2] }} transition={{ repeat: Infinity, duration: 2 }} />
        <motion.circle cx="130" cy="80" r="2" fill="#C5A059" animate={{ r: [2, 4, 2] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} />
        <motion.circle cx="100" cy="120" r="2" fill="#4C6B5F" animate={{ r: [2, 5, 2], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} />
        
        {/* Scanning Line */}
        <motion.line
          x1="30" y1="20" x2="170" y2="20"
          stroke="#C5A059"
          strokeWidth="0.5"
          animate={{ y1: [20, 180, 20], y2: [20, 180, 20] }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        />
      </motion.svg>

      {/* Overlay Labels */}
      <div className="absolute top-0 left-0 p-4 border-l border-t border-[#E5E7EB]">
        <div className="text-[10px] uppercase tracking-widest text-[#6B7280] font-bold">Scanning...</div>
        <div className="text-xs font-mono text-[#4C6B5F]">EPIDERMIS_LAYER_01</div>
      </div>
      
      <div className="absolute bottom-0 right-0 p-4 border-r border-b border-[#E5E7EB] text-right">
        <div className="text-[10px] uppercase tracking-widest text-[#6B7280] font-bold">Status</div>
        <div className="text-xs font-mono text-[#C5A059]">OPTIMIZING</div>
      </div>
    </div>
  );
};
