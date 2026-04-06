'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { startTour } from '@/lib/tour';
import { Sparkles } from 'lucide-react';

export default function TourGuide() {
  const pathname = usePathname();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show button after a short delay for a nice entrance
    const timer = setTimeout(() => setIsVisible(true), 1000);
    
    const handleStartTour = () => {
      startTour(pathname);
    };

    window.addEventListener('start-tour', handleStartTour);

    return () => {
      window.removeEventListener('start-tour', handleStartTour);
      clearTimeout(timer);
    };
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <button
      onClick={() => startTour(pathname)}
      className="fixed bottom-6 left-6 z-[60] flex items-center gap-2 px-4 py-2.5 
        bg-[#8B5E3C] text-white rounded-full shadow-2xl shadow-[#8B5E3C]/40 
        hover:bg-[#6F452A] hover:-translate-y-1 active:scale-95 transition-all duration-300
        group overflow-hidden border border-white/10"
      title="Iniciar Tour Guiado"
    >
      {/* Glossy effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <Sparkles size={18} className="group-hover:rotate-12 transition-transform duration-300" />
      <span className="text-sm font-medium tracking-wide">¿Ayuda?</span>
      
      {/* Subtle pulse */}
      <span className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-0 transition-all duration-700" />
    </button>
  );
}
