"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"

export default function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <User className="h-6 w-6 cursor-pointer text-[#1E293B] hover:text-[#5C3A21]" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-52 bg-white border rounded-xl shadow-lg p-1">
        {/* Acceso */}
        <DropdownMenuItem
          onClick={() => (window.location.href = "/client/notificaciones/auth/login")}
          className="px-3 py-2 rounded-md text-[#1E293B] hover:bg-[#5C3A21] hover:text-white cursor-pointer"
        >
          Iniciar Sesión
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => (window.location.href = "/client/notificaciones/auth/register")}
          className="px-3 py-2 rounded-md text-[#1E293B] hover:bg-[#5C3A21] hover:text-white cursor-pointer"
        >
          Registrarme
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Funciones extra */}
        <DropdownMenuItem
          onClick={() => (window.location.href = "/client/pedidos")}
          className="px-3 py-2 rounded-md text-[#1E293B] hover:bg-[#5C3A21] hover:text-white cursor-pointer"
        >
          Mis pedidos
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => (window.location.href = "/client/notificaciones")}
          className="px-3 py-2 rounded-md text-[#1E293B] hover:bg-[#5C3A21] hover:text-white cursor-pointer"
        >
          Notificaciones
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => (window.location.href = "/client/configuracion")}
          className="px-3 py-2 rounded-md text-[#1E293B] hover:bg-[#5C3A21] hover:text-white cursor-pointer"
        >
          Configuración
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}