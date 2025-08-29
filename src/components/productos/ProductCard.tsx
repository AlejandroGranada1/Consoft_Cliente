"use client"

import Image from "next/image"
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProductCard({
  id,
  name,
  price,
  image,
}: {
  id: string
  name: string
  price: string
  image: string
}) {
  const router = useRouter()

  return (
    <div className="bg-white rounded-xl shadow flex flex-col h-[420px]">
      {/* Imagen con altura fija */}
      <div className="relative w-full h-56 rounded-t-xl overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
        {/* Botón favorito */}
        <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100">
          <Heart size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4">
        <h2 className="text-lg font-semibold">{name}</h2>
        <span className="mt-auto font-bold text-[#8B5E3C]">{price}</span>
        <button
          onClick={() => router.push(`/productos/${id}`)}
          className="mt-2 px-4 py-2 bg-[#8B5E3C] text-white rounded-lg hover:bg-[#70492F]"
        >
          Ver detalle
        </button>
      </div>
    </div>
  )
}
