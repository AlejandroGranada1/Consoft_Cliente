"use client"

interface Props {
  id: number
  title: string
  message: string
  date: string
}

export default function NotificationCard({ title, message, date }: Props) {
  return (
    <div className="bg-white shadow-sm rounded-xl p-4 border border-[#E5E5E5] hover:shadow-md transition">
      <h2 className="font-semibold text-[#1E293B]">{title}</h2>
      <p className="text-[#1E293B] mt-1">{message}</p>
      <span className="text-sm text-[#8B5E3C] mt-2 block">{date}</span>
    </div>
  )
}