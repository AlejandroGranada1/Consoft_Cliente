"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import UserMenu from "@/components/UserMenu"

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold">
        <span className="text-[#1E293B]">Confort</span>{" "}
        <span className="text-[#5C3A21]">&</span>{" "}
        <span className="text-[#1E293B]">Estilo</span>
      </Link>

      {/* Links */}
      <div className="flex gap-6 text-[#1E293B]">
        <Link href="/">Inicio</Link>
        <Link href="/agendarcita">Agendar Cita</Link>
        <Link href="/productos">Productos</Link>
        <Link href="/servicios">Servicios</Link>
      </div>

      {/* Icons */}
      <div className="flex items-center gap-4">
        <ShoppingCart className="h-6 w-6 cursor-pointer text-[#1E293B] hover:text-[#5C3A21]" />
        <UserMenu /> 
      </div>
    </nav>
  )
}