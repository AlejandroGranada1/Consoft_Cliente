'use client';

import Link from 'next/link';
import { LogOut, User, Settings, Package, ShoppingCart, Mail, ChevronDown } from 'lucide-react';
import { useUser } from '@/providers/userContext';
import { Role } from '@/lib/types';
import { useLogout } from '@/hooks/useAuth';
import CartDropdown from './carrito/CartDropdown';
import { useState } from 'react';
import { useMyCart, useMyQuotations } from '@/hooks/useQuotations';

interface UserMenuProps {
	floating?: boolean;
}

export default function UserMenu({ floating = false }: UserMenuProps) {
	const [openCart, setOpenCart] = useState(false);
	const [openMenu, setOpenMenu] = useState(false);
	const { data: cart } = useMyCart();
	const { data } = useMyQuotations();

	const { user } = useUser();
	const logout = useLogout();

	// Clases base según si está flotando sobre el hero o no
	const itemBase = floating
		? 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm'
		: 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[#7A6555] hover:text-[#1C1208] hover:bg-[#F3EEE9] transition-all duration-200 text-sm';

	if (!user) {
		return (
			<Link
				href='/client/auth/login'
				className={
					floating
						? 'px-4 py-2 bg-white/15 border border-white/25 text-white rounded-full text-sm font-medium hover:bg-white/25 transition-colors'
						: 'px-4 py-2 bg-[#8B5E3C] text-white rounded-full text-sm font-medium hover:bg-[#6F452A] transition-colors'
				}>
				Iniciar Sesión
			</Link>
		);
	}

	const items = cart?.items || [];
	const allQuotations = data || [];

	const notificationStatuses = [
		'Solicitada',
		'Cotizada',
		'Aprobada',
		'Rechazada',
		'Completada',
		'Revisada',
	];
	const notifications = allQuotations.filter(
		(q: any) => notificationStatuses.includes(q.status) && q.status !== 'Carrito',
	);

	const isAdmin = (user.role as Role)?.name === 'Administrador';

	return (
		<div className='relative'>
			{/* ── DESKTOP ── */}
			<div className='hidden md:flex items-center gap-0.5'>
				<Link
					href='/client/perfil'
					className={itemBase}>
					<User size={16} />
					<span>Perfil</span>
				</Link>

				<button
					type='button'
					onClick={() => setOpenCart(!openCart)}
					className={`${itemBase} relative`}>
					<ShoppingCart size={16} />
					{items.length > 0 && (
						<span className='absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold'>
							{items.length > 9 ? '9+' : items.length}
						</span>
					)}
				</button>

				<Link
					href='/client/pedidos'
					className={itemBase}>
					<Package size={16} />
					<span>Pedidos</span>
				</Link>

				<Link
					href='/client/notificaciones'
					className={`${itemBase} relative`}>
					<Mail size={16} />
					<span>Notificaciones</span>
					{notifications.length > 0 && (
						<span className='absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold'>
							{notifications.length > 9 ? '9+' : notifications.length}
						</span>
					)}
				</Link>

				{isAdmin && (
					<Link
						href='/admin/configuracion'
						className={
							floating
								? 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/15 border border-white/25 text-white text-sm hover:bg-white/25 transition-all duration-200'
								: 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#F5EDE4] border border-[#E8DDD4] text-[#8B5E3C] text-sm hover:bg-[#E8DDD4] transition-all duration-200'
						}>
						<Settings size={16} />
						<span>Admin</span>
					</Link>
				)}

				<button
					type='button'
					onClick={() => {
						logout.mutateAsync();
						window.location.href = '/client/auth/login';
					}}
					className={
						floating
							? 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm'
							: 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-red-500 hover:bg-red-50 transition-all duration-200 text-sm'
					}>
					<LogOut size={16} />
					<span>Salir</span>
				</button>
			</div>

			{/* ── MOBILE DROPDOWN ── */}
			<div className='md:hidden'>
				<button
					type='button'
					onClick={() => setOpenMenu(!openMenu)}
					className='flex items-center gap-2 px-3 py-2 bg-[#F3EEE9] rounded-lg text-[#7A6555]'>
					<User size={18} />
					<ChevronDown
						size={16}
						className={`transition-transform ${openMenu ? 'rotate-180' : ''}`}
					/>
				</button>

				{openMenu && (
					<div className='absolute right-0 mt-2 w-52 bg-white shadow-xl rounded-2xl border border-[#E8DDD4] z-50 overflow-hidden py-1'>
						<Link
							href='/client/perfil'
							className='flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#7A6555] hover:bg-[#FDF9F6] hover:text-[#1C1208] transition-colors'>
							<User size={15} /> Perfil
						</Link>
						<button
							type='button'
							onClick={() => setOpenCart(!openCart)}
							className='flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#7A6555] hover:bg-[#FDF9F6] hover:text-[#1C1208] transition-colors w-full text-left'>
							<ShoppingCart size={15} /> Carrito
						</button>
						<Link
							href='/client/pedidos'
							className='flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#7A6555] hover:bg-[#FDF9F6] hover:text-[#1C1208] transition-colors'>
							<Package size={15} /> Pedidos
						</Link>
						<Link
							href='/client/notificaciones'
							className='flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#7A6555] hover:bg-[#FDF9F6] hover:text-[#1C1208] transition-colors'>
							<Mail size={15} /> Notificaciones
						</Link>
						{isAdmin && (
							<Link
								href='/admin/configuracion'
								className='flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#8B5E3C] bg-[#F5EDE4] hover:bg-[#E8DDD4] transition-colors'>
								<Settings size={15} /> Admin
							</Link>
						)}
						<div className='border-t border-[#F3EEE9] my-1' />
						<button
							type='button'
							onClick={async () => {
								await logout.mutateAsync();
								window.location.href = '/client/auth/login';
							}}
							className='flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left'>
							<LogOut size={15} /> Salir
						</button>
					</div>
				)}
			</div>

			{openCart && (
				<CartDropdown
					isOpen={openCart}
					setIsOpen={setOpenCart}
				/>
			)}
		</div>
	);
}
