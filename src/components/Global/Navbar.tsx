'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import UserMenu from '@/components/UserMenu';
import { useUser } from '@/providers/userContext';
import { useCart } from '@/providers/CartContext';
import { useState } from 'react';
import CartDropdown from '../carrito/CartDropdown';

export default function Navbar() {
	const [openCart, setOpenCart] = useState(false);
	const { user } = useUser();

	return (
		<nav className='flex items-center justify-between px-6 py-4 bg-white shadow-sm relative'>
			<Link
				href='/client'
				className='text-xl font-bold'>
				<span className='text-[#1E293B]'>Confort</span>{' '}
				<span className='text-[#5C3A21]'>&</span>{' '}
				<span className='text-[#1E293B]'>Estilo</span>
			</Link>

			<div className='flex gap-6 text-[#1E293B]'>
				<Link href='/client'>Inicio</Link>
				<Link href='/client/agendarcita'>Agendar Cita</Link>
				<Link href='/client/productos'>Productos</Link>
				<Link href='/client/servicios'>Servicios</Link>
			</div>

			<div className='flex items-center gap-4 relative'>
				<div className='relative'>
					{user && (
						<ShoppingCart
							onClick={() => setOpenCart(!openCart)}
							className='h-6 w-6 cursor-pointer text-[#1E293B] hover:text-[#5C3A21]'
						/>
					)}

					{openCart && (
						<CartDropdown
							isOpen={openCart}
							setIsOpen={setOpenCart}
						/>
					)}
				</div>

				<UserMenu />
			</div>
		</nav>
	);
}
