// UserMenu.tsx - Versión horizontal visible
'use client';

import Link from 'next/link';
import { LogOut, User, Settings, Package, FileText, ShoppingCart, Mail } from 'lucide-react';
import { useUser } from '@/providers/userContext';
import { Role } from '@/lib/types';
import { useLogin, useLogout } from '@/hooks/useAuth';
import CartDropdown from './carrito/CartDropdown';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function UserMenu() {
	const [openCart, setOpenCart] = useState(false);
	const router = useRouter();
	const { user } = useUser();
	const logout = useLogout();
	const pathname = usePathname(); // Obtiene la ruta actual

	if (!user) {
		return (
			<Link
				href='/client/auth/login'
				className='px-4 py-2 bg-[#5C3A21] text-white rounded-lg hover:bg-[#4A2F1A] transition-colors'>
				Iniciar Sesión
			</Link>
		);
	}

	// Función para verificar si un enlace está activo
	const isActive = (path: string) => {
		return pathname === path;
	};

	console.log(user);
	return (
		<div className='flex items-center gap-4'>
			{/* Menú horizontal de opciones */}
			<div className='flex gap-2 border-l border-gray-200 pl-4'>
				<Link
					href='/client/perfil'
					className='relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors'
					title='Mi Perfil'>
					<User size={18} />
					<span className='hidden md:inline text-sm'>Perfil</span>
					{isActive('/client/perfil') && (
						<span className='absolute bottom-0 left-0 w-full h-0.5 bg-[#5C3A21]'></span>
					)}
				</Link>
				<div className='flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors'>
					<ShoppingCart
						onClick={() => setOpenCart(!openCart)}
						className='h-6 w-6 cursor-pointer text-[#1E293B] hover:text-[#5C3A21]'
					/>

					{openCart && (
						<CartDropdown
							isOpen={openCart}
							setIsOpen={setOpenCart}
						/>
					)}
				</div>

				<Link
					href='/client/pedidos'
					className='relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors'
					title='Mis Pedidos'>
					<Package size={18} />
					<span className='hidden md:inline text-sm'>Pedidos</span>
					{isActive('/client/pedidos') && (
						<span className='absolute bottom-0 left-0 w-full h-0.5 bg-[#5C3A21]'></span>
					)}
				</Link>

				<Link
					href='/client/notificaciones'
					className='relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors'
					title='Mis Cotizaciones'>
					<Mail size={18} />
					<span className='hidden md:inline text-sm'>Notificaciones</span>
					{isActive('/client/notificaciones') && (
						<span className='absolute bottom-0 left-0 w-full h-0.5 bg-[#5C3A21]'></span>
					)}
				</Link>

				{(user.role as Role)?.name === 'Administrador' && (
					<Link
						href='/admin/configuracion'
						className='flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors bg-amber-50 text-amber-700'
						title='Panel Admin'>
						<Settings size={18} />
						<span className='hidden md:inline text-sm'>Admin</span>
					</Link>
				)}

				<button
					onClick={() => {
						logout.mutateAsync();
						window.location.href = '/client/auth/login';
					}}
					className='flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-red-600'
					title='Cerrar Sesión'>
					<LogOut size={18} />
					<span className='hidden md:inline text-sm'>Salir</span>
				</button>
			</div>
		</div>
	);
}
