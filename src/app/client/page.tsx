'use client'

import { Paintbrush, Ruler, Home, Wrench, ArrowRight, Sparkles, ShieldCheck, Clock, Hammer } from "lucide-react";
import Link from "next/link";
import { useGetServices } from '@/hooks/apiHooks';
import { Service } from '@/lib/types';

function ServiceCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white border border-[#E8DDD4] rounded-2xl p-7 hover:border-[#C8A882] hover:shadow-[0_8px_28px_rgba(139,94,60,.1)] hover:-translate-y-1 transition-all duration-200">
      <div className="w-10 h-10 rounded-xl bg-[#F3EEE9] flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-[.97rem] text-[#1C1208] mb-2">{title}</h3>
      <p className="text-[#7A6555] text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function WhyCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white border border-[#E8DDD4] rounded-2xl p-6 hover:border-[#C8A882] hover:shadow-[0_8px_28px_rgba(139,94,60,.08)] hover:-translate-y-1 transition-all duration-200">
      <div className="w-9 h-9 rounded-lg bg-[#F3EEE9] flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-sm text-[#1C1208] mb-1.5">{title}</h3>
      <p className="text-[#7A6555] text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

export default function HomePage() {

  const { data } = useGetServices();
  const services: Service[] = data?.data ?? [];

  const dynamicTicker = services.map((s: Service) => s.name);

  const extraTicker = [
    'Materiales Premium',
    'Garantía',
    'Servicio a Domicilio'
  ];

  const TICKER_ITEMS = [...dynamicTicker, ...extraTicker];

  return (
    <main className="w-full overflow-x-hidden font-sans">

      {/* ── HERO — min-h-screen para cubrir el navbar fixed ── */}
      <section
        className="relative w-full flex items-end min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/Banner.jpg')" }}
      >
        {/* Gradiente más pronunciado abajo para que el texto sea legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1208]/85 via-[#1C1208]/55 to-[#1C1208]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1208]/70 via-[#1C1208]/20 to-[#1C1208]/30" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-20 md:pb-28">
          <div className="max-w-lg">
            <span className="inline-block bg-white/10 backdrop-blur border border-white/20 text-white text-[11px] font-medium tracking-[.07em] uppercase px-4 py-1.5 rounded-full mb-5">
              Diseño · Restauración · Medellín
            </span>

            <h1
              className="font-serif text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)' }}
            >
              Estilo, calidad<br />
              <em className="italic text-[#C8A882]">y diseño</em><br />
              para tu hogar
            </h1>

            <p className="text-white/70 text-[.97rem] leading-relaxed max-w-sm mb-8">
              Muebles a medida, restauración y acabados premium — atención personalizada desde la primera visita.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/client/agendarcita"
                className="inline-flex items-center gap-2.5 bg-[#8B5E3C] hover:bg-[#6F452A] text-white px-7 py-3.5 rounded-full text-sm font-medium shadow-lg shadow-[#8B5E3C]/25 hover:shadow-[#8B5E3C]/40 hover:gap-4 transition-all duration-200"
              >
                Agenda tu cita <ArrowRight size={16} />
              </Link>
              <Link
                href="/client/servicios"
                className="inline-flex items-center gap-2.5 border border-white/35 text-white hover:bg-white/10 px-7 py-3.5 rounded-full text-sm font-medium transition-all duration-200"
              >
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
      <section id="servicios" className="bg-[#FDF9F6] py-14 md:py-18">
        <div className="max-w-6xl mx-auto px-6">

          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-[11px] tracking-[.08em] uppercase text-[#8B5E3C] font-medium mb-2">
                Nuestros servicios
              </p>
              <h2 className="font-serif text-[clamp(1.9rem,3.5vw,3rem)] text-[#1C1208] leading-tight">
                ¿Qué ofrecemos?
              </h2>
            </div>
            <p className="max-w-xs text-[#7A6555] text-sm leading-relaxed">
              Soluciones integrales en mobiliario y diseño combinando experiencia y materiales de calidad.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ServiceCard
              icon={<Ruler size={18} className="text-[#8B5E3C]" />}
              title="Diseño a medida"
              desc="Creamos muebles pensados exactamente para tu espacio. Te asesoramos desde la idea hasta el detalle final para que quede perfecto."
            />
            <ServiceCard
              icon={<Home size={18} className="text-[#8B5E3C]" />}
              title="Visita a domicilio"
              desc="Vamos directamente hasta tu casa. Medimos, evaluamos y te aconsejamos en persona para encontrar la mejor solución."
            />
            <ServiceCard
              icon={<Paintbrush size={18} className="text-[#8B5E3C]" />}
              title="Lacado y pintura"
              desc="Le damos nueva vida a tus muebles con acabados profesionales. Colores modernos, superficies lisas y resistencia que dura años."
            />
            <ServiceCard
              icon={<Wrench size={18} className="text-[#8B5E3C]" />}
              title="Restauración"
              desc="Recuperamos ese mueble antiguo que tanto quieres. Respetamos su esencia y lo dejamos como nuevo, sin perder su historia."
            />
          </div>
        </div>
      </section>

      {/* ── POR QUÉ ── */}
      <section className="bg-[#F3EEE9] py-14 md:py-18">
        <div className="max-w-6xl mx-auto px-6">

          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-[11px] tracking-[.08em] uppercase text-[#8B5E3C] font-medium mb-2">
                ¿Por qué nosotros?
              </p>
              <h2 className="font-serif text-[clamp(1.9rem,3.5vw,3rem)] text-[#1C1208] leading-tight">
                Confort & Estilo:<br />calidad que se nota
              </h2>
            </div>
            <p className="max-w-xs text-[#7A6555] text-sm leading-relaxed">
              Más de 12 años creando espacios únicos con atención, materiales premium y experiencia comprobada.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <WhyCard
              icon={<ShieldCheck size={17} className="text-[#8B5E3C]" />}
              title="Materiales premium"
              desc="Seleccionamos cada material por su durabilidad y acabado impecable. Nada de segunda opción."
            />
            <WhyCard
              icon={<Sparkles size={17} className="text-[#8B5E3C]" />}
              title="Atención personalizada"
              desc="Cada proyecto es único. Te acompañamos en cada decisión para que el resultado sea exactamente lo que imaginaste."
            />
            <WhyCard
              icon={<Hammer size={17} className="text-[#8B5E3C]" />}
              title="Experiencia comprobada"
              desc="Más de 12 años perfeccionando el diseño y la restauración de muebles con cientos de clientes satisfechos."
            />
            <WhyCard
              icon={<Clock size={17} className="text-[#8B5E3C]" />}
              title="Entrega a tiempo"
              desc="Cumplimos los plazos acordados. Sabemos que tu tiempo vale y lo respetamos en cada etapa del proceso."
            />
          </div>

          {/* commitment card — ancho completo */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#2C2420] via-[#5C3317] to-[#8B5A2B] rounded-2xl p-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8973A]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#C8973A]/20 rounded-full mb-4">
                  <Sparkles size={13} className="text-[#C8973A]" />
                  <span className="text-[11px] uppercase tracking-wider text-[#FAF5EE] font-medium">Nuestro compromiso</span>
                </div>
                <p className="font-serif text-[1.4rem] leading-snug text-white mb-2">
                  "Cada mueble refleja tu estilo y supera tus expectativas."
                </p>
                <p className="text-sm text-white/65 leading-relaxed">
                  Acompañarte desde la idea inicial hasta la entrega final, con precisión en cada detalle.
                </p>
              </div>
              <Link
                href="/client/agendarcita"
                className="shrink-0 inline-flex items-center gap-2.5 bg-white text-[#2C2420] px-6 py-3 rounded-full text-sm font-medium hover:bg-[#F3EEE9] hover:gap-4 transition-all duration-200"
              >
                Agendar gratis <ArrowRight size={15} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="bg-[#FDF9F6] py-16 md:py-20">
        <div className="max-w-xl mx-auto px-6 text-center">
          <p className="text-[11px] tracking-[.08em] uppercase text-[#8B5E3C] font-medium mb-4">
            Da el primer paso
          </p>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3.4rem)] text-[#1C1208] leading-tight mb-4">
            ¿Listo para transformar<br />
            <em className="italic text-[#8B5E3C]">tu hogar?</em>
          </h2>
          <p className="text-[#7A6555] text-[.95rem] leading-relaxed mb-8 max-w-sm mx-auto">
            Agenda una cita gratuita y da el primer paso para renovar tus espacios con diseño, calidad y estilo.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/client/agendarcita"
              className="inline-flex items-center gap-2.5 bg-[#8B5E3C] hover:bg-[#6F452A] text-white px-7 py-3.5 rounded-full text-sm font-medium shadow-lg shadow-[#8B5E3C]/22 hover:shadow-[#8B5E3C]/38 hover:gap-4 transition-all duration-200"
            >
              Agendar ahora <ArrowRight size={16} />
            </Link>
            <Link
              href="/client/servicios"
              className="inline-flex items-center gap-2.5 border border-[#C8A882] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white hover:border-[#8B5E3C] px-7 py-3.5 rounded-full text-sm font-medium hover:gap-4 transition-all duration-200"
            >
              Ver servicios
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}