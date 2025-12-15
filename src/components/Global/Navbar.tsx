// Navbar.tsx corregido
'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import UserMenu from '@/components/UserMenu';
import { useUser } from '@/providers/userContext';
import { useState } from 'react';
import CartDropdown from '../carrito/CartDropdown';
import { usePathname } from 'next/navigation'; // ¡Nuevo import!

export default function Navbar() {
	const [openCart, setOpenCart] = useState(false);
	const pathname = usePathname(); // Obtiene la ruta actual

	// Función para verificar si un enlace está activo
	const isActive = (path: string) => {
		return pathname === path;
	};

	return (
		<nav className='flex items-center justify-between px-6 py-4 bg-white shadow-sm relative text-sm'>
			<Link
				href='/client'
				className='text-xl font-bold'>
				<span className='text-[#1E293B]'>Confort</span>{' '}
				<span className='text-[#5C3A21]'>&</span>{' '}
				<span className='text-[#1E293B]'>Estilo</span>
			</Link>

			<div className='flex gap-6 text-[#1E293B]'>
				<Link
					href='/client'
					className={`relative pb-1 ${isActive('/client') && 'font-semibold'}`}>
					Inicio
					{isActive('/client') && (
						<span className='absolute bottom-0 left-0 w-full h-0.5 bg-[#5C3A21]'></span>
					)}
				</Link>
				<Link
					href='/client/agendarcita'
					className={`relative pb-1 ${
						isActive('/client/agendarcita') && 'font-semibold'
					}`}>
					Agendar Cita
					{isActive('/client/agendarcita') && (
						<span className='absolute bottom-0 left-0 w-full h-0.5 bg-[#5C3A21]'></span>
					)}
				</Link>
				<Link
					href='/client/productos'
					className={`relative pb-1 ${isActive('/client/productos') && 'font-semibold'}`}>
					Productos
					{isActive('/client/productos') && (
						<span
							aria-current='page'
							className='absolute bottom-0 left-0 w-full h-0.5 bg-[#5C3A21]'></span>
					)}
				</Link>
				<Link
					href='/client/servicios'
					className={`relative pb-1 mr-2 ${isActive('/client/servicios') && 'font-semibold'}`}>
					Servicios
					{isActive('/client/servicios') && (
						<span className='absolute bottom-0 left-0 w-full h-0.5 bg-[#5C3A21]'></span>
					)}
				</Link>
			</div>

			<UserMenu />
		</nav>
	);
}
