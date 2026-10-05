import React, { useState } from 'react';
import VideoModal from './VideoModal';

export default function NytexVideoCard({ 
  className = '',
  videoSrc = '/videos/Capacitacion_NyTEX_Fase_1_Starter_2026-10-05T00-46-06.mp4',
  title = 'NyTEX ERP',
  subtitle = 'Ver recorrido en 3 minutos'
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className={`group relative bg-[#0B1528] text-white p-7 sm:p-8 rounded-3xl flex flex-col items-center justify-center cursor-pointer shadow-xl border border-slate-700/60 hover:border-cyan-400/60 transition-all duration-300 hover:shadow-cyan-500/20 hover:scale-[1.03] select-none text-center ${className}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsOpen(true); }}
        title="Haga clic para reproducir el recorrido de NyTEX ERP"
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-cyan-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Circular Blue Play Button */}
        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#0080FF] group-hover:bg-[#0070E0] flex items-center justify-center text-white mb-4 shadow-lg shadow-[#0080FF]/40 transition-transform duration-300 group-hover:scale-110">
          <svg 
            className="w-7 h-7 sm:w-8 sm:h-8 ml-1 text-white fill-current drop-shadow" 
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        {/* Text exactly matching the user's design */}
        <h3 className="font-extrabold text-xl sm:text-2xl text-white tracking-tight mb-1 group-hover:text-cyan-200 transition-colors">
          {title}
        </h3>
        <p className="text-slate-300 text-sm font-medium tracking-wide">
          {subtitle}
        </p>
      </div>

      <VideoModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        videoSrc={videoSrc}
        title={`${title} — ${subtitle}`}
      />
    </>
  );
}
