'use client'
import { LogOut, User } from 'lucide-react';
import Sidebar from '@/components/admin/global/Sidebar';
import api from '@/components/Global/axios';
import { useState, useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    const Swal = (await import('sweetalert2')).default;
    Swal.fire({
      title: '¿Cerrar sesión?',
      html: 'Estás a punto de cerrar sesión',
      background: '#1e1e1c',
      color: '#fff',
      confirmButtonColor: '#8B5E3C',
      confirmButtonText: 'Cerrar sesión',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#4a4a4a',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await api.post('/api/auth/logout');
        if (response.status == 200) {
          window.location.href = '/client';
        }
      }
    });
  };

  return (
    <div className="h-screen flex overflow-hidden relative"
      style={{
        background: `
          radial-gradient(ellipse at 75% 10%, rgba(120,100,80,0.16) 0%, transparent 50%),
          radial-gradient(ellipse at 15% 65%, rgba(90,75,60,0.13) 0%, transparent 50%),
          linear-gradient(160deg, #1e1e1c 0%, #252320 30%, #2a2724 60%, #1e1c1a 100%)
        `,
      }}
    >
      {/* Grain effect */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.045]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)' }}
      />

      {/* Sidebar fijo - sin scroll */}
      <Sidebar />

      {/* Contenido principal - SCROLLABLE */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* TopBar - sticky */}
        <header className={`sticky top-0 z-20 flex items-center justify-between gap-10 px-6 py-4 transition-all duration-300
          ${scrolled 
            ? 'bg-[#1e1e1c]/80 backdrop-blur-xl border-b border-white/10' 
            : 'bg-transparent border-b border-white/5'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C8A882]/20 to-[#8B5E3C]/20 flex items-center justify-center">
              <User size={16} className="text-[#C8A882]" />
            </div>
            <span className="text-sm text-white/60">Panel Administrativo</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 rounded-xl
              bg-white/5 border border-white/10
              text-xs text-[#C8A882] font-medium
              flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8A882] animate-pulse"></span>
              Administrador
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl
                bg-white/5 border border-white/10
                text-white/40 hover:text-[#C8A882]
                hover:bg-white/8 hover:border-[#C8A882]/30
                transition-all duration-200 group"
              title="Cerrar sesión"
            >
              <LogOut size={18} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </header>

        {/* Contenido de cada página - AQUÍ VA EL SCROLL */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}