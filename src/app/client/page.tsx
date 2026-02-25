'use client'

import { Paintbrush, Ruler, Home, Wrench, ArrowRight, Sparkles, ShieldCheck, Clock, Hammer } from "lucide-react";
import Link from "next/link";
import { useGetServices } from '@/hooks/apiHooks';
import { Service } from '@/lib/types';

function ServiceCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="border border-white/[0.07] rounded-2xl p-7 bg-white/[0.03] hover:border-[#8B5E3C]/40 hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-200">
      <div className="w-10 h-10 rounded-xl bg-[#8B5E3C]/10 border border-[#8B5E3C]/20 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-serif text-[#f0e8d8] text-[.97rem] font-medium mb-2">{title}</h3>
      <p className="text-[#6b5b4e] text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function WhyCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="border border-white/[0.07] rounded-2xl p-6 bg-white/[0.03] hover:border-[#8B5E3C]/40 hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-200">
      <div className="w-9 h-9 rounded-lg bg-[#8B5E3C]/10 border border-[#8B5E3C]/20 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-serif text-[#f0e8d8] text-sm font-medium mb-1.5">{title}</h3>
      <p className="text-[#6b5b4e] text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

const sectionBg = {
  background: `
    radial-gradient(ellipse at 75% 10%, rgba(120,100,80,0.16) 0%, transparent 50%),
    radial-gradient(ellipse at 15% 65%, rgba(90,75,60,0.13) 0%, transparent 50%),
    linear-gradient(160deg, #1e1e1c 0%, #252320 30%, #2a2724 60%, #1e1c1a 100%)
  `,
};

export default function HomePage() {

  const { data } = useGetServices();
  const services: Service[] = data?.data ?? [];

  const dynamicTicker = services.map((s: Service) => s.name);
  const extraTicker = ['Materiales Premium', 'Garantía', 'Servicio a Domicilio'];
  const TICKER_ITEMS = [...dynamicTicker, ...extraTicker];

  return (
    <main className="w-full overflow-x-hidden font-sans">

      {/* ── HERO ── */}
      <section
        className="relative w-full flex items-end min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/Banner.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1208]/85 via-[#1C1208]/55 to-[#1C1208]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1208]/70 via-[#1C1208]/20 to-[#1C1208]/30" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-20 md:pb-28">
          <div className="max-w-lg">
            <span className="inline-block bg-white/10 backdrop-blur border border-white/20 text-white text-[11px] font-medium tracking-[.07em] uppercase px-4 py-1.5 rounded-full mb-5">
              Diseño · Restauración · Medellín
            </span>
            <h1 className="font-serif text-white leading-tight mb-4" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)' }}>
              Estilo, calidad<br />
              <em className="italic text-[#C8A882]">y diseño</em><br />
              para tu hogar
            </h1>
            <p className="text-white/70 text-[.97rem] leading-relaxed max-w-sm mb-8">
              Muebles a medida, restauración y acabados premium — atención personalizada desde la primera visita.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/client/agendarcita"
                className="inline-flex items-center gap-2.5 bg-[#8B5E3C] hover:bg-[#6F452A] text-white px-7 py-3.5 rounded-full text-sm font-medium shadow-lg shadow-[#8B5E3C]/25 hover:gap-4 transition-all duration-200">
                Agenda tu cita <ArrowRight size={16} />
              </Link>
              <Link href="/client/servicios"
                className="inline-flex items-center gap-2.5 border border-white/35 text-white hover:bg-white/10 px-7 py-3.5 rounded-full text-sm font-medium transition-all duration-200">
                Ver servicios
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="bg-[#8B5E3C] overflow-hidden py-3">
        <div className="flex w-max" style={{ animation: 'ticker 24s linear infinite' }}>
          <style>{`@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
          {[...Array(2)].map((_, i) =>
            TICKER_ITEMS.map((t, index) => (
              <span key={`${i}-${index}-${t}`} className="flex items-center gap-3.5 whitespace-nowrap px-9 text-[.78rem] font-medium tracking-[.07em] uppercase text-white/70">
                <span className="w-1 h-1 rounded-full bg-[#C8A882] shrink-0" />
                {t}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ── SERVICIOS ── */}
      <section id="servicios" className="relative py-14 md:py-20" style={sectionBg}>

        {/* Grain */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '180px 180px',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-[11px] tracking-[.08em] uppercase text-[#8B5E3C] font-medium mb-2">
                Nuestros servicios
              </p>
              <h2 className="font-serif text-[clamp(1.9rem,3.5vw,3rem)] text-[#f0e8d8] leading-tight">
                ¿Qué ofrecemos?
              </h2>
            </div>
            <p className="max-w-xs text-[#6b5b4e] text-sm leading-relaxed">
              Soluciones integrales en mobiliario y diseño combinando experiencia y materiales de calidad.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ServiceCard icon={<Ruler size={18} className="text-[#8B5E3C]" />} title="Diseño a medida"
              desc="Creamos muebles pensados exactamente para tu espacio. Te asesoramos desde la idea hasta el detalle final." />
            <ServiceCard icon={<Home size={18} className="text-[#8B5E3C]" />} title="Visita a domicilio"
              desc="Vamos directamente hasta tu casa. Medimos, evaluamos y te aconsejamos en persona para encontrar la mejor solución." />
            <ServiceCard icon={<Paintbrush size={18} className="text-[#8B5E3C]" />} title="Lacado y pintura"
              desc="Le damos nueva vida a tus muebles con acabados profesionales. Colores modernos y resistencia que dura años." />
            <ServiceCard icon={<Wrench size={18} className="text-[#8B5E3C]" />} title="Restauración"
              desc="Recuperamos ese mueble antiguo que tanto quieres. Lo dejamos como nuevo sin perder su historia." />
          </div>
        </div>
      </section>

      {/* ── POR QUÉ ── */}
      <section className="relative py-14 md:py-20" style={sectionBg}>
        <div className="h-px bg-white/5 max-w-6xl mx-auto mb-14" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-[11px] tracking-[.08em] uppercase text-[#8B5E3C] font-medium mb-2">
                ¿Por qué nosotros?
              </p>
              <h2 className="font-serif text-[clamp(1.9rem,3.5vw,3rem)] text-[#f0e8d8] leading-tight">
                Confort & Estilo:<br />calidad que se nota
              </h2>
            </div>
            <p className="max-w-xs text-[#6b5b4e] text-sm leading-relaxed">
              Más de 12 años creando espacios únicos con atención, materiales premium y experiencia comprobada.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <WhyCard icon={<ShieldCheck size={17} className="text-[#8B5E3C]" />} title="Materiales premium"
              desc="Seleccionamos cada material por su durabilidad y acabado impecable. Nada de segunda opción." />
            <WhyCard icon={<Sparkles size={17} className="text-[#8B5E3C]" />} title="Atención personalizada"
              desc="Cada proyecto es único. Te acompañamos en cada decisión para que el resultado sea exactamente lo que imaginaste." />
            <WhyCard icon={<Hammer size={17} className="text-[#8B5E3C]" />} title="Experiencia comprobada"
              desc="Más de 12 años perfeccionando el diseño y la restauración de muebles con cientos de clientes satisfechos." />
            <WhyCard icon={<Clock size={17} className="text-[#8B5E3C]" />} title="Entrega a tiempo"
              desc="Cumplimos los plazos acordados. Sabemos que tu tiempo vale y lo respetamos en cada etapa del proceso." />
          </div>

          {/* Commitment card */}
          <div className="relative overflow-hidden rounded-2xl p-10 border border-white/[0.07]"
            style={{ background: 'linear-gradient(135deg, #1e1208 0%, #2c1a0a 50%, #3a2010 100%)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(200,168,130,0.12) 0%, transparent 70%)' }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(139,94,60,0.15) 0%, transparent 70%)' }} />
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B5E3C]/60 to-transparent" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#8B5E3C]/15 border border-[#8B5E3C]/25 rounded-full mb-4">
                  <Sparkles size={13} className="text-[#c4945a]" />
                  <span className="text-[11px] uppercase tracking-wider text-[#c4945a] font-medium">Nuestro compromiso</span>
                </div>
                <p className="font-serif text-[1.4rem] leading-snug text-[#f0e8d8] mb-2">
                  "Cada mueble refleja tu estilo y supera tus expectativas."
                </p>
                <p className="text-sm text-[#6b5b4e] leading-relaxed">
                  Acompañarte desde la idea inicial hasta la entrega final, con precisión en cada detalle.
                </p>
              </div>
              <Link href="/client/agendarcita"
                className="shrink-0 inline-flex items-center gap-2.5 bg-[#8B5E3C] hover:bg-[#6F452A] text-white px-6 py-3 rounded-full text-sm font-medium hover:gap-4 transition-all duration-200">
                Agendar gratis <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative py-16 md:py-20" style={sectionBg}>
        <div className="h-px bg-white/5 max-w-6xl mx-auto mb-16" />
        <div className="relative z-10 max-w-xl mx-auto px-6 text-center">
          <p className="text-[11px] tracking-[.08em] uppercase text-[#8B5E3C] font-medium mb-4">
            Da el primer paso
          </p>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3.4rem)] text-[#f0e8d8] leading-tight mb-4">
            ¿Listo para transformar<br />
            <em className="italic text-[#c4945a]">tu hogar?</em>
          </h2>
          <p className="text-[#6b5b4e] text-[.95rem] leading-relaxed mb-8 max-w-sm mx-auto">
            Agenda una cita gratuita y da el primer paso para renovar tus espacios con diseño, calidad y estilo.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/client/agendarcita"
              className="inline-flex items-center gap-2.5 bg-[#8B5E3C] hover:bg-[#6F452A] text-white px-7 py-3.5 rounded-full text-sm font-medium shadow-lg hover:gap-4 transition-all duration-200">
              Agendar ahora <ArrowRight size={16} />
            </Link>
            <Link href="/client/servicios"
              className="inline-flex items-center gap-2.5 border border-[#8B5E3C]/40 text-[#c4945a] hover:bg-[#8B5E3C] hover:text-white hover:border-[#8B5E3C] px-7 py-3.5 rounded-full text-sm font-medium hover:gap-4 transition-all duration-200">
              Ver servicios
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}