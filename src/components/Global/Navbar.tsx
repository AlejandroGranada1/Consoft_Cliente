'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import UserMenu from '../UserMenu';
import { useState } from 'react';
import CartDropdown from '../carrito/CartDropdown';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [openCart, setOpenCart] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link href="/client" className="text-xl font-bold text-[#1E293B] sm:text-sm">
          Confort <span className="text-[#5C3A21]">&</span> Estilo
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-6 items-center text-[#1E293B]">
          <Link href="/client" className={`relative pb-1 ${isActive('/client') && 'font-semibold'}`}>
            Inicio {isActive('/client') && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5C3A21]"></span>}
          </Link>
          <Link href="/client/agendarcita" className={`relative pb-1${isActive('/client/agendarcita') && 'font-semibold'}`}>
            Agendar Cita {isActive('/client/agendarcita') && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5C3A21]"></span>}
          </Link>
          <Link href="/client/productos" className={`relative pb-1 ${isActive('/client/productos') && 'font-semibold'}`}>
            Productos {isActive('/client/productos') && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5C3A21]"></span>}
          </Link>
          <Link href="/client/servicios" className={`relative pb-1 ${isActive('/client/servicios') && 'font-semibold'}`}>
            Servicios {isActive('/client/servicios') && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5C3A21]"></span>}
          </Link>
          <UserMenu />
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div onClick={() => setOpenCart(!openCart)}>
            <ShoppingCart size={24} className="text-[#1E293B]" />
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenu && (
        <div className="md:hidden bg-white shadow-lg absolute w-full left-0 top-16 border-t border-gray-200 z-50">
          <Link href="/client" className="block px-6 py-3 border-b" onClick={() => setMobileMenu(false)}>Inicio</Link>
          <Link href="/client/agendarcita" className="block px-6 py-3 border-b" onClick={() => setMobileMenu(false)}>Agendar Cita</Link>
          <Link href="/client/productos" className="block px-6 py-3 border-b" onClick={() => setMobileMenu(false)}>Productos</Link>
          <Link href="/client/servicios" className="block px-6 py-3 border-b" onClick={() => setMobileMenu(false)}>Servicios</Link>
          <div className="px-6 py-3 border-b"><UserMenu /></div>
        </div>
      )}

      {openCart && <CartDropdown isOpen={openCart} setIsOpen={setOpenCart} />}
    </nav>
  );
}
