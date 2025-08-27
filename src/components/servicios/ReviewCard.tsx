"use client"

import { Star } from "lucide-react"

interface ReviewCardProps {
  name: string
  location: string
  comment: string
  rating: number
  avatar: string
}

export default function ReviewCard({ name, location, comment, rating, avatar }: ReviewCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <p className="italic text-gray-700 mb-4">“{comment}”</p>
      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`}
          />
        ))}
      </div>
      <div className="flex items-center space-x-3">
        <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
        <div>
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="text-sm text-gray-500">{location}</p>
        </div>
      </div>
    </div>
  )
}