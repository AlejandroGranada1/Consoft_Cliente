"use client"

interface ServiceCardProps {
  image: string
  title: string
  description: string
}

export default function ServiceCard({ image, title, description }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 max-w-xs mx-auto">
      <img
        src={image}
        alt={title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-brown-700 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  )
}