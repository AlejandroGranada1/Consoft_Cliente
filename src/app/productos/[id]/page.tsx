"use client"

import { use } from "react"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const products = [
  { id: "1", name: "Silla de sala", description: "Cómoda silla de madera con cojín beige.", price: "$120", image: "/sillaProduct.png" },
  { id: "2", name: "Mesa de comedor", description: "Mesa de madera para 6 personas.", price: "$300", image: "/MesaProducts.jpeg" },
  { id: "3", name: "Silla de comedor", description: "Sillas para tu comedor", price: "$90", image: "/SillaComedorProducts.jpeg" }
]

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id: raw } = use(params)

  // Permitimos varias URLs: /productos/1 ó /productos/1-silla-de-sala
  const idNum = raw.match(/^\d+/)?.[0] ?? "1"
  const product = products.find((p) => p.id === idNum) ?? products[0]

  return (
    <div className="relative w-full min-h-screen bg-gray-50 flex flex-col">
      {/* Botón volver */}
      <button
        onClick={() => router.push("/productos")}
        className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow hover:bg-gray-100"
      >
        <ArrowLeft size={20} /> Volver
      </button>

      {/* Contenido */}
      <div className="flex flex-1 flex-col md:flex-row items-center justify-center gap-12 p-8 max-w-6xl mx-auto w-full">
        {/* Imagen más grande */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-w-lg h-[450px] md:h-[550px] object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Info */}
        <div className="w-full md:w-1/2 max-w-md">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="mt-4 text-gray-700 text-lg">{product.description}</p>
          <p className="mt-6 text-3xl font-semibold">{product.price}</p>

          <button className="mt-8 w-full md:w-auto px-8 py-4 bg-[#8B5E3C] text-white rounded-xl hover:bg-[#70492F] text-lg">
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  )
}