'use client'

import { Paintbrush, Ruler, Home, Wrench, Star, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="w-full">
      {/* ====== HERO / BANNER ====== */}
      <section
        className="relative w-full h-[75vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/Banner.png')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-white max-w-3xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Estilo, calidad y diseño para tu hogar
          </h1>
          <Link
            href="/client/agendarcita"
            className="inline-block bg-[#8B5E3C] text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-[#6F452A] transition"
          >
            Agenda tu cita
          </Link>
        </div>
      </section>

      {/* ====== ¿QUÉ OFRECEMOS? ====== */}
      <section className="relative bg-[#fff9f4] py-16 md:py-20">
        <div className="text-center mb-12 md:mb-16 px-4">
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900">
            ¿Qué ofrecemos?
          </h2>
          <p className="mt-4 text-gray-700 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
            Ofrecemos soluciones integrales en mobiliario y diseño para el hogar,
            combinando experiencia, materiales de calidad y atención personalizada
            para garantizar resultados duraderos y estéticamente impecables.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <div className="bg-[#f3eee9] rounded-2xl shadow-md p-6 md:p-8 hover:shadow-lg transition">
              <Ruler className="text-[#8B5E3C] mb-2" />
              <h3 className="font-bold text-xl text-gray-900">Diseño Personalizado</h3>
              <p className="text-gray-700 mt-3 text-sm md:text-base leading-relaxed">
                Diseñamos muebles a medida que se adaptan perfectamente a tu espacio,
                combinando funcionalidad, estética y materiales de alta calidad.
              </p>
            </div>

            <div className="bg-[#f3eee9] rounded-2xl shadow-md p-6 md:p-8 hover:shadow-lg transition">
              <Home className="text-[#8B5E3C] mb-2" />
              <h3 className="font-bold text-xl text-gray-900">Revisión a Domicilio</h3>
              <p className="text-gray-700 mt-3 text-sm md:text-base leading-relaxed">
                Visitamos tu hogar para evaluar, medir y asesorarte personalmente,
                asegurando soluciones precisas y ajustadas a tus necesidades reales.
              </p>
            </div>

            <div className="bg-[#f3eee9] rounded-2xl shadow-md p-6 md:p-8 hover:shadow-lg transition">
              <Paintbrush className="text-[#8B5E3C] mb-2" />
              <h3 className="font-bold text-xl text-gray-900">Lacado y Pintura</h3>
              <p className="text-gray-700 mt-3 text-sm md:text-base leading-relaxed">
                Renovamos tus muebles con acabados profesionales, resistentes y modernos,
                devolviéndoles vida y elegancia.
              </p>
            </div>

            <div className="bg-[#f3eee9] rounded-2xl shadow-md p-6 md:p-8 hover:shadow-lg transition">
              <Wrench className="text-[#8B5E3C] mb-2" />
              <h3 className="font-bold text-xl text-gray-900">Restauración</h3>
              <p className="text-gray-700 mt-3 text-sm md:text-base leading-relaxed">
                Recuperamos muebles antiguos o dañados respetando su esencia y valor,
                prolongando su vida útil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== POR QUÉ ELEGIRNOS ====== */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-6">
              ¿Por qué elegir Confort & Estilo?
            </h2>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6">
              Nos destacamos por nuestro compromiso con la calidad, la atención al detalle
              y la satisfacción de nuestros clientes. Cada proyecto es tratado como único,
              garantizando resultados funcionales, duraderos y visualmente impecables.
            </p>

            <ul className="space-y-4 text-gray-700 text-sm md:text-base">
              <li className="flex items-start gap-3">
                <CheckCircle className="text-[#8B5E3C]" />
                Materiales de alta calidad y acabados premium.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-[#8B5E3C]" />
                Atención personalizada en cada etapa del proyecto.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-[#8B5E3C]" />
                Experiencia comprobada en diseño y restauración.
              </li>
            </ul>
          </div>

          <div className="bg-[#f3eee9] rounded-2xl p-8 shadow-md">
            <h3 className="font-bold text-xl mb-4 text-gray-900">
              Nuestro compromiso
            </h3>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              Acompañarte desde la idea inicial hasta la entrega final, asegurando que
              cada mueble refleje tu estilo y supere tus expectativas.
            </p>
          </div>
        </div>
      </section>


      {/* ====== CTA FINAL ====== */}
      <section className="bg-[#8B5E3C] py-10 text-center text-white px-6">
        <h2 className="text-2xl md:text-4xl font-extrabold mb-4">
          ¿Listo para transformar tu hogar?
        </h2>
        <p className="max-w-2xl mx-auto mb-8 text-sm md:text-base text-white/90">
          Agenda una cita con nuestro equipo y da el primer paso para renovar
          tus espacios con diseño, calidad y estilo.
        </p>
        <Link
          href="/client/agendarcita"
          className="inline-block bg-white text-[#8B5E3C] px-8 py-4 rounded-full font-semibold hover:bg-[#f3eee9] transition"
        >
          Agendar ahora
        </Link>
      </section>
    </main>
  );
}
