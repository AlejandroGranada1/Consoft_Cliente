"use client"

import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import ReviewCard from "@/components/servicios/ReviewCard"
import Link from "next/link"

export default function ServiciosPage() {
  return (
    <section className="px-6 py-12 bg-[#fff9f6]">
      <div className="max-w-6xl mx-auto">

        {/* --- Sección 1: Tarjetas de servicios --- */}
        <h1 className="text-3xl font-bold text-center text-[#4b2e1a] mb-10">
          Servicios
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
          <div className="bg-white rounded-xl shadow-md border p-4 flex flex-col items-center text-center">
            <img src="/personalizado.png" alt="Tapicería" className="rounded-lg mb-4 h-40 object-cover w-full"/>
            <h3 className="font-semibold text-[#4b2e1a] mb-2">Tapicería Personalizada</h3>
            <p className="text-gray-600 text-sm">Personalizamos tus muebles con telas y acabados a tu gusto</p>
          </div>

          <div className="bg-white rounded-xl shadow-md border p-4 flex flex-col items-center text-center">
            <img src="/reparacion.png" alt="Restauración" className="rounded-lg mb-4 h-40 object-cover w-full"/>
            <h3 className="font-semibold text-[#4b2e1a] mb-2">Restauración de muebles</h3>
            <p className="text-gray-600 text-sm">Reparamos y devolvemos a la vida piezas y muebles antiguos y dañados</p>
          </div>

          <div className="bg-white rounded-xl shadow-md border p-4 flex flex-col items-center text-center">
            <img src="/Fabricacion.png" alt="Fabricación" className="rounded-lg mb-4 h-40 object-cover w-full"/>
            <h3 className="font-semibold text-[#4b2e1a] mb-2">Fabricación a tu gusto</h3>
            <p className="text-gray-600 text-sm">Creamos muebles únicos según tus medidas y necesidades</p>
          </div>

          <div className="bg-white rounded-xl shadow-md border p-4 flex flex-col items-center text-center">
            <img src="/lacado.png" alt="Lacado" className="rounded-lg mb-4 h-40 object-cover w-full"/>
            <h3 className="font-semibold text-[#4b2e1a] mb-2">Lacado y pintura</h3>
            <p className="text-gray-600 text-sm">Dale un nuevo acabado a tus muebles con técnicas profesionales</p>
          </div>
        </div>

        {/* --- Sección 2: Servicio destacado --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-20">
          {/* Imagen */}
          <div className="relative">
            <img
              src="/imagen2.png"
              alt="Fabricación a tu gusto"
              className="w-full h-80 object-cover rounded-xl shadow-md"
            />
            {/* Tarjeta pequeña con estrellas */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 flex items-center space-x-2">
              <img
                src="/mini.png"
                alt="mini"
                className="w-12 h-12 rounded-md object-cover"
              />
              <div className="flex text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Texto */}
          <div>
            <h2 className="text-3xl font-bold text-[#4b2e1a] mb-6 text-center ">
              Fabricación a tu gusto
            </h2>
            <ul className="space-y-3 text-gray-700 text-center ">
              <li>✨ Diseño 100% personalizado</li>
              <li>🪵 Selección de materiales</li>
              <li>👁️ Asesoría y visualización previa</li>
            </ul>
            <Link href="/agendarcita">
              <Button className="mt-6 bg-[#4b2e1a] hover:bg-[#3a2314] text-white px-6 py-3 rounded-full text-lg shadow-md ml-50">
                Agenda tu Cita
              </Button>
            </Link>
          </div>
        </div>

        {/* --- Sección 3: Reseñas --- */}
        <h2 className="text-2xl font-semibold text-[#4b2e1a] mt-12 mb-6 text-center">
          Reseñas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ReviewCard
            name="Laura G."
            location="Medellín"
            comment="El comedor que me fabricaron quedó perfecto. Pudieron ajustar las medidas y el acabado fue incluso mejor de lo que esperaba."
            rating={4}
            avatar="/laura.png"
          />
        </div>

      </div>
    </section>
  )
}
