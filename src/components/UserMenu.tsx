'use client';

import Link from 'next/link';
import {
  LogOut,
  User,
  Settings,
  Package,
  ShoppingCart,
  Mail,
  ChevronDown,
} from 'lucide-react';
import { useUser } from '@/providers/userContext';
import { Role } from '@/lib/types';
import { useLogout } from '@/hooks/useAuth';
import CartDropdown from './carrito/CartDropdown';
import { useState } from 'react';

export default function UserMenu() {
  const [openCart, setOpenCart] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const { user } = useUser();
  const logout = useLogout();

  if (!user) {
    return (
      <Link
        href="/client/auth/login"
        className="px-4 py-2 bg-[#5C3A21] text-white rounded-lg hover:bg-[#4A2F1A] transition-colors"
      >
        Iniciar Sesión
      </Link>
    );
  }

  return (
    <div className="relative">

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex gap-2 border-l border-gray-200 pl-4">

          <Link href="/client/perfil" className="menu-item">
            <User size={18} />
            <span className="text-sm">Perfil</span>
          </Link>

          <button
            type="button"
            onClick={() => setOpenCart(!openCart)}
            className="menu-item"
          >
            <ShoppingCart size={18} />
          </button>

          <Link href="/client/pedidos" className="menu-item">
            <Package size={18} />
            <span className="text-sm">Pedidos</span>
          </Link>

          <Link href="/client/notificaciones" className="menu-item">
            <Mail size={18} />
            <span className="text-sm">Notificaciones</span>
          </Link>

          {(user.role as Role)?.name === 'Administrador' && (
            <Link
              href="/admin/configuracion"
              className="menu-item bg-amber-50 text-amber-700"
            >
              <Settings size={18} />
              <span className="text-sm">Admin</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => {
              logout.mutateAsync();
              window.location.href = '/client/auth/login';
            }}
            className="menu-item text-red-600"
          >
            <LogOut size={18} />
            <span className="text-sm">Salir</span>
          </button>
        </div>
      </div>

      {/* ---------- MOBILE DROPDOWN ---------- */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setOpenMenu(!openMenu)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg"
        >
          <User size={18} />
          <ChevronDown size={16} />
        </button>

        {openMenu && (
          <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-xl border border-gray-200 z-50">

            <Link href="/client/perfil" className="dropdown-item">
              <User size={16} /> Perfil
            </Link>

            <button
              type="button"
              onClick={() => setOpenCart(!openCart)}
              className="dropdown-item w-full text-left"
            >
              <ShoppingCart size={16} /> Carrito
            </button>

            <Link href="/client/pedidos" className="dropdown-item">
              <Package size={16} /> Pedidos
            </Link>

            <Link href="/client/notificaciones" className="dropdown-item">
              <Mail size={16} /> Notificaciones
            </Link>

            {(user.role as Role)?.name === 'Administrador' && (
              <Link
                href="/admin/configuracion"
                className="dropdown-item text-amber-700"
              >
                <Settings size={16} /> Admin
              </Link>
            )}

            <div className="border-t border-gray-200 my-1" />

            <button
              type="button"
              onClick={() => {
                logout.mutateAsync();
                window.location.href = '/client/auth/login';
              }}
              className="dropdown-item text-red-600 w-full text-left"
            >
              <LogOut size={16} /> Salir
            </button>
          </div>
        )}
      </div>

      {openCart && (
        <CartDropdown isOpen={openCart} setIsOpen={setOpenCart} />
      )}
    </div>
  );
}