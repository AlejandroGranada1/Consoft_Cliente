'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, TreePine, Eye } from 'lucide-react';
import Link from 'next/link';
import { Service } from '@/lib/types';
import { useGetServices } from '@/hooks/apiHooks';
import { useEffect, useRef, useState } from 'react';

const AUTO_DELAY = 3000;

function useVisibleCount() {
  const [visible, setVisible] = useState(4);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setVisible(1);
      else if (window.innerWidth < 1024) setVisible(2);
      else setVisible(4);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return visible;
}

/* ── Card mejorada ── */
function ServiceCard({ title, description, image }: { title: string; description: string; image: string }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/25 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)] hover:-translate-y-1">
      {/* Imagen */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Overlay degradado sobre imagen */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 via-transparent to-transparent" />
      </div>

      {/* Contenido */}
      <div className="p-5">
        <h3 className="font-semibold text-white text-base mb-2 leading-snug">{title}</h3>
        <p className="text-white/55 text-xs leading-relaxed line-clamp-3">{description}</p>
      </div>

      {/* Acento línea inferior */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-[#8B5E3C] to-[#C8A882] transition-all duration-500" />
    </div>
  );
}

export default function ServiciosPage() {
  const { data, isLoading } = useGetServices();
  const services: Service[] = data?.data ?? [];

  const VISIBLE = useVisibleCount();
  const total = services.length;
  const needsCarousel = total > VISIBLE;
  const maxIndex = Math.max(0, total - VISIBLE);

  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setCurrent((c) => Math.min(c, maxIndex));
  }, [maxIndex]);

  const goTo = (index: number) => setCurrent(Math.min(Math.max(index, 0), maxIndex));
  const prev = () => { setAutoPlay(false); goTo(current === 0 ? maxIndex : current - 1); };
  const next = () => { setAutoPlay(false); goTo(current === maxIndex ? 0 : current + 1); };

  useEffect(() => {
    if (!autoPlay || !needsCarousel) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c >= maxIndex ? 0 : c + 1));
    }, AUTO_DELAY);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [autoPlay, needsCarousel, maxIndex]);

  return (
    <div
      className="min-h-screen w-full relative flex flex-col"
      style={{
        /* Fondo gris-cálido oscuro — como la imagen de referencia, menos café */
        background: `
          radial-gradient(ellipse at 75% 15%, rgba(120, 100, 80, 0.18) 0%, transparent 50%),
          radial-gradient(ellipse at 20% 70%, rgba(90, 75, 60, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(70, 60, 50, 0.10) 0%, transparent 70%),
          linear-gradient(160deg, #1e1e1c 0%, #252320 30%, #2a2724 60%, #1e1c1a 100%)
        `,
      }}
    >
      {/* Grain sutil */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)' }}
      />

      <div className="relative z-10 flex flex-col min-h-screen px-6 pt-16 pb-12 max-w-6xl mx-auto w-full">

        {/* ── Hero ── */}
        <div className="mb-10">
          <span className="inline-block bg-white/10 backdrop-blur border border-white/15 text-white text-[11px] font-medium tracking-[.07em] uppercase px-4 py-1.5 rounded-full mb-4">
            Nuestros servicios
          </span>
          <h1 className="font-serif text-white leading-tight mb-2" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)' }}>
            Lo que <em className="italic text-[#C8A882]">hacemos</em>
          </h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm">
            Soluciones de diseño y fabricación a medida para transformar cada espacio de tu hogar.
          </p>
        </div>

        {/* ── Carrusel ── */}
        <div className="relative mb-16">
          {needsCarousel && (
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 bg-white/10 backdrop-blur border border-white/20 shadow-lg rounded-full p-2.5 hover:bg-white/20 hover:border-white/40 transition-all"
            >
              <ChevronLeft size={18} className="text-white" />
            </button>
          )}

          <div className="overflow-hidden mx-2">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                width: `${(total / VISIBLE) * 100}%`,
                transform: `translateX(-${(current / total) * 100}%)`,
              }}
            >
              {services.map((service) => (
                <div
                  key={service._id}
                  className="px-3 box-border"
                  style={{ width: `${100 / total}%` }}
                >
                  <ServiceCard
                    description={service.description!}
                    image={service.imageUrl!}
                    title={service.name}
                  />
                </div>
              ))}
            </div>
          </div>

          {needsCarousel && (
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 bg-white/10 backdrop-blur border border-white/20 shadow-lg rounded-full p-2.5 hover:bg-white/20 hover:border-white/40 transition-all"
            >
              <ChevronRight size={18} className="text-white" />
            </button>
          )}

          {needsCarousel && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setAutoPlay(false); goTo(i); }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? 'w-5 bg-[#C8A882]' : 'w-1.5 bg-white/25'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Sección destacada ── */}
        <div
          className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,.35)]"
          style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.04)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Imagen */}
            <div className="relative h-64 md:h-auto overflow-hidden">
              <img
                src="/ServiciosImg.jpg"
                alt="Fabricación a tu gusto"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1e1e1c]/60 hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1c]/70 to-transparent md:hidden" />
            </div>

            {/* Texto */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <span className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium mb-4">
                Servicio estrella
              </span>
              <h2 className="font-serif text-white text-2xl md:text-3xl leading-tight mb-6">
                Fabricación <em className="italic text-[#C8A882]">a tu gusto</em>
              </h2>

              <ul className="space-y-3.5 mb-8">
                {[
                  { icon: <Sparkles size={14} />, text: 'Diseño 100% personalizado' },
                  { icon: <TreePine size={14} />,  text: 'Selección de materiales premium' },
                  { icon: <Eye size={14} />,        text: 'Asesoría y visualización previa' },
                ].map(({ icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-white/70 text-sm">
                    <span className="text-[#C8A882] shrink-0">{icon}</span>
                    {text}
                  </li>
                ))}
              </ul>

              <Link href="agendarcita">
                <button className="inline-flex items-center gap-2 bg-[#8B5E3C] hover:bg-[#6F452A] text-white px-7 py-3 rounded-full text-sm font-medium shadow-lg hover:gap-3 transition-all duration-200 w-fit">
                  Agenda tu Cita <ArrowRight size={15} />
                </button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}