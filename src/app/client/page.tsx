"use client"

import { Paintbrush, Ruler, Home, Wrench } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="w-full">
      {/* ====== HERO / BANNER ====== */}
      <section
        className="relative w-full h-[75vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/Banner.png')" }}
      >
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Contenido */}
        <div className="relative z-10 text-white max-w-2xl px-4">
          <h1 className="text-5xl font-bold mb-6">
            Estilo y calidad para tu hogar
          </h1>
          <Link
            href="/client/agendarcita"
            className="inline-block bg-[#8B5E3C] text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-[#6F452A] transition"
          >
            Agenda tu cita
          </Link>
        </div>
      </section>

      {/* ====== ¿QUÉ OFRECEMOS? ====== */}
      <section className="relative bg-[#fff9f4] py-20">
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            ¿Qué ofrecemos?
          </h2>
        </div>

        {/* Grid + imagen central */}
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 gap-8 md:gap-16">
            {/* Arriba izquierda */}
            <div className="bg-[#f3eee9] rounded-2xl shadow-md p-8 flex flex-col items-start hover:shadow-lg transition">
              <Ruler className="text-[#8B5E3C] w-7 h-7 mb-3" />
              <h3 className="font-bold text-xl text-gray-900">
                Diseño Personalizado
              </h3>
              <p className="text-gray-700 mt-2">
                Creamos muebles a medida que se adaptan a tu estilo y espacio.
              </p>
            </div>

            {/* Arriba derecha */}
            <div className="bg-[#f3eee9] rounded-2xl shadow-md p-8 flex flex-col items-start hover:shadow-lg transition">
              <Home className="text-[#8B5E3C] w-7 h-7 mb-3" />
              <h3 className="font-bold text-xl text-gray-900">
                Revisión a Domicilio
              </h3>
              <p className="text-gray-700 mt-2">
                Vamos y revisamos tu producto en tu hogar.
              </p>
            </div>

            {/* Abajo izquierda */}
            <div className="bg-[#f3eee9] rounded-2xl shadow-md p-8 flex flex-col items-start hover:shadow-lg transition">
              <Paintbrush className="text-[#8B5E3C] w-7 h-7 mb-3" />
              <h3 className="font-bold text-xl text-gray-900">
                Lacado y Pintura
              </h3>
              <p className="text-gray-700 mt-2">
                Dale un nuevo acabado a tus muebles con técnicas profesionales.
              </p>
            </div>

            {/* Abajo derecha */}
            <div className="bg-[#f3eee9] rounded-2xl shadow-md p-8 flex flex-col items-start hover:shadow-lg transition">
              <Wrench className="text-[#8B5E3C] w-7 h-7 mb-3" />
              <h3 className="font-bold text-xl text-gray-900">Restauración</h3>
              <p className="text-gray-700 mt-2">
                Reparamos y devolvemos la vida a piezas antiguas o dañadas.
              </p>
            </div>
          </div>

          {/* Imagen central superpuesta */}
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <img
              src="/SillaLanding.png"
              alt="Silla"
              className="w-40 md:w-52 lg:w-64 object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
