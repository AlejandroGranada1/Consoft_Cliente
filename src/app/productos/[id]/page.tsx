"use client"

import { use } from "react"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const products = [
  {
    id: "1",
    name: "Silla de sala",
    description: "Cómoda silla de madera con cojín beige.",
    price: "$120",
    image: "/sillaProduct.png",
  },
  {
    id: "2",
    name: "Mesa de comedor",
    description: "Mesa de madera para 6 personas.",
    price: "$300",
    image: "/MesaProducts.jpeg",
  },
  {
    id: "3",
    name: "Silla de comedor",
    description: "Sillas para tu comedor",
    price: "$90",
    image: "/SillaComedorProducts.jpeg",
  },
]

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id: raw } = use(params)

  const idNum = raw.match(/^\d+/)?.[0] ?? "1"
  const product = products.find((p) => p.id === idNum) ?? products[0]

  return (
    <div className="relative w-full min-h-screen bg-[#FAF4EF] flex flex-col">
      {/* Botón volver */}
      <button
        onClick={() => router.push("/productos")}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/90 text-[#5C3A21] font-medium rounded-full shadow-lg hover:bg-[#F3E6DD] transition-colors"
      >
         Volver
      </button>

      {/* Contenido */}
      <div className="flex flex-1 flex-col md:flex-row items-center justify-center gap-14 p-8 max-w-7xl mx-auto w-full">
        {/* Imagen */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-lg h-[450px] md:h-[550px] object-cover rounded-3xl shadow-xl border-4 border-white group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Info */}
        <div className="w-full md:w-1/2 max-w-md bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-[#4E2F1B]">{product.name}</h1>
          <p className="mt-4 text-gray-700 text-lg leading-relaxed">
            {product.description}
          </p>
          <p className="mt-6 text-3xl font-semibold text-[#8B5E3C]">
            {product.price}
          </p>

          <button className="mt-10 w-full px-8 py-4 bg-[#8B5E3C] text-white rounded-2xl shadow-md hover:bg-[#70492F] hover:shadow-lg active:scale-95 transition-all text-lg font-medium">
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  )
}
