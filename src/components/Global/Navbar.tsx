'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import UserMenu from '../UserMenu';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/client',             label: 'Inicio' },
  { href: '/client/agendarcita', label: 'Agendar Cita' },
  { href: '/client/productos',   label: 'Referencias' },
  { href: '/client/servicios',   label: 'Servicios' },
];

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const isHome = pathname === '/client' || pathname === '/client/agendarcita' || pathname === '/client/productos' || pathname === '/client/servicios' || pathname === '/client/perfil' || pathname === '/client/carrito' || pathname === '/client/pedidos' || pathname === '/client/notificaciones' || pathname.startsWith('/client/productos/' ) || pathname.startsWith('/client/auth/' ) || pathname.startsWith('/client/pagos/') || pathname.startsWith('/client/pagos/') || pathname.startsWith('/client/pedidos/') ;

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const floating  = isHome && !scrolled;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${floating
          ? 'bg-transparent'
          : 'bg-white border-b border-[#E8DDD4]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/client"
            className={`font-serif text-xl font-bold shrink-0 transition-colors duration-300
              ${floating ? 'text-white' : 'text-[#1C1208]'}`}
          >
            Confort <span className={floating ? 'text-[#C8A882]' : 'text-[#8B5E3C]'}>&</span> Estilo
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative px-3 py-1.5 text-sm rounded-md transition-all duration-300
                  ${floating
                    ? `text-white/90 hover:text-white hover:bg-white/10 ${isActive(href) ? 'font-semibold text-white' : ''}`
                    : `text-[#7A6555] hover:text-[#1C1208] hover:bg-[#F3EEE9] ${isActive(href) ? 'font-semibold text-[#1C1208]' : ''}`
                  }`}
              >
                {label}
                {isActive(href) && (
                  <span className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full transition-colors duration-300
                    ${floating ? 'bg-white' : 'bg-[#8B5E3C]'}`}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop — UserMenu con separador */}
          <div className={`hidden md:flex items-center pl-4 border-l transition-colors duration-300
            ${floating ? 'border-white/20' : 'border-[#E8DDD4]'}`}
          >
            <UserMenu floating={floating} />
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className={`md:hidden p-2 rounded-md transition-colors duration-300
              ${floating ? 'text-white hover:bg-white/10' : 'text-[#7A6555] hover:bg-[#F3EEE9]'}`}
          >
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileMenu && (
          <div className="md:hidden absolute w-full left-0 top-16 bg-white border-t border-[#E8DDD4] shadow-lg">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenu(false)}
                className={`flex items-center px-6 py-3.5 text-sm border-b border-[#F3EEE9] transition-colors
                  ${isActive(href)
                    ? 'text-[#8B5E3C] font-semibold bg-[#FDF9F6]'
                    : 'text-[#7A6555] hover:bg-[#FDF9F6] hover:text-[#1C1208]'
                  }`}
              >
                {label}
              </Link>
            ))}
            <div className="px-6 py-4">
              <UserMenu floating={false} />
            </div>
          </div>
        )}
      </nav>

      {/* Spacer solo en páginas que no son home */}
      {!isHome && <div className="h-16" />}
    </>
  );
}