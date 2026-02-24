'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
  subtitle: string;
  illustration: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthLayout({ subtitle, illustration, children, footer }: AuthLayoutProps) {
  return (
    <section className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* ── Panel izquierdo: imagen de fondo + contenido ── */}
      <div
        className="hidden md:flex flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{
          backgroundImage: "url('/Auth/BannerAuth.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-[#1a1008]/65 pointer-events-none" />
        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)' }} />

        {/* Contenido */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
          <Link href="/client" className="font-serif text-2xl font-bold text-white mb-10">
            Confort <span className="text-[#C8A882]">&</span> Estilo
          </Link>

          <h2 className="font-serif text-white text-xl leading-snug mb-3">
            Muebles <em className="italic text-[#C8A882]">artesanales</em>
            <br />para tu hogar
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Diseño personalizado, calidad garantizada y atención a domicilio en Medellín.
          </p>

          <div className="flex gap-2 mt-10">
            {[0, 1, 2].map(i => (
              <span key={i} className={`rounded-full ${i === 0 ? 'w-5 h-1.5 bg-[#C8A882]' : 'w-1.5 h-1.5 bg-white/25'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Panel derecho: formulario ── */}
      <div
        className="flex items-center justify-center min-h-screen p-6 md:p-10"
        style={{
          background: `
            radial-gradient(ellipse at 80% 10%, rgba(90, 75, 60, 0.10) 0%, transparent 50%),
            linear-gradient(160deg, #1e1e1c 0%, #252320 50%, #2a2724 100%)
          `,
        }}
      >
        <div className="w-full max-w-md space-y-8">
          <div className="md:hidden text-center mb-2">
            <Link href="/client" className="font-serif text-xl font-bold text-white">
              Confort <span className="text-[#C8A882]">&</span> Estilo
            </Link>
          </div>

          <div>
            <span className="inline-block text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium mb-2">
              {subtitle}
            </span>
            <div className="h-px bg-white/10 mt-3" />
          </div>

          {children}

          {footer && (
            <div className="pt-2 border-t border-white/10">
              {footer}
            </div>
          )}
        </div>
      </div>

    </section>
  );
}