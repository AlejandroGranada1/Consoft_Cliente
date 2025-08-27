"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"

export default function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <User className="h-5 w-5 cursor-pointer text-[#1E293B] hover:text-[#5C3A21]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-white border shadow-md">
        <DropdownMenuItem className="text-[#1E293B] hover:text-[#5C3A21] cursor-pointer">
          Iniciar Sesión
        </DropdownMenuItem>
        <DropdownMenuItem className="text-[#1E293B] hover:text-[#5C3A21] cursor-pointer">
          Registrarme
        </DropdownMenuItem>
        <DropdownMenuItem className="text-[#1E293B] hover:text-[#5C3A21] cursor-pointer">
          Modo oscuro
        </DropdownMenuItem>
        <DropdownMenuItem className="text-[#1E293B] hover:text-[#5C3A21] cursor-pointer">
          Mis pedidos
        </DropdownMenuItem>
        <DropdownMenuItem className="text-[#1E293B] hover:text-[#5C3A21] cursor-pointer">
          Notificaciones
        </DropdownMenuItem>
        <DropdownMenuItem className="text-[#1E293B] hover:text-[#5C3A21] cursor-pointer">
          Configuración
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}