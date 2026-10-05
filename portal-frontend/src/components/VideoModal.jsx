import React, { useEffect } from 'react';

export default function VideoModal({ isOpen, onClose, videoSrc, title = 'NyTEX ERP — Recorrido en 3 minutos' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-[#0B1528] rounded-3xl overflow-hidden shadow-2xl border border-cyan-500/40 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#07101E] to-[#0D1E38] border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></span>
            <div>
              <h3 className="text-white font-extrabold text-lg sm:text-xl tracking-tight">
                {title}
              </h3>
              <p className="text-cyan-300 text-xs font-medium">
                Demostración Operativa en Vivo y Capacitación Guiada por Fases
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl font-bold transition-colors cursor-pointer"
            title="Cerrar video (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Video Player */}
        <div className="relative bg-black flex items-center justify-center max-h-[75vh]">
          <video 
            src={videoSrc || '/videos/Capacitacion_NyTEX_Fase_1_Starter_2026-10-05T00-46-06.mp4'} 
            controls 
            autoPlay 
            className="w-full h-auto max-h-[75vh] object-contain shadow-2xl focus:outline-none"
          >
            Tu navegador no soporta reproducción de video HTML5.
          </video>
        </div>

        {/* Modal Footer Info */}
        <div className="px-6 py-3.5 bg-[#07101E] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white font-black px-2 py-0.5 rounded text-[10px] uppercase">
              Fase 1 Starter
            </span>
            <span>Incluye los 7 módulos medulares con automatización de mouse y voz sincronizada.</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a 
              href={videoSrc || '/videos/Capacitacion_NyTEX_Fase_1_Starter_2026-10-05T00-46-06.mp4'} 
              download="Capacitacion_NyTEX_Fase_1_Starter.mp4"
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1.5 underline"
            >
              <span>⬇</span> Descargar Video MP4
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
