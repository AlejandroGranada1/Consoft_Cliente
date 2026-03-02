'use client';

import {
	TrendingUp,
	Layers,
	FileText,
	Package,
	Users,
	ShoppingCart,
	Settings,
	MessageSquare,
	Wallet,
	Server,
	MapPin,
	FolderPlus,
	X,
	Menu,
	Home,
} from 'lucide-react';
import SidebarLink from './SidebarLink';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Sidebar() {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [openGroup, setOpenGroup] = useState<string | null>(null); // Estado para controlar qué grupo está abierto

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const handleToggleGroup = (groupTitle: string) => {
		setOpenGroup(openGroup === groupTitle ? null : groupTitle);
	};

	return (
		<>
			{/* Botón Mobile */}
			<button
				className={`md:hidden fixed top-4 left-4 z-50 p-3 rounded-xl
          bg-[#8B5E3C] hover:bg-[#6F452A]
          text-white shadow-lg shadow-[#8B5E3C]/20
          transition-all duration-200`}
				onClick={() => setMobileOpen(!mobileOpen)}>
				{mobileOpen ? <X size={20} /> : <Menu size={20} />}
			</button>

			{/* Sidebar - altura completa */}
			<aside
				className={`fixed top-0 left-0 h-screen w-72 flex flex-col
          transform transition-all duration-300 z-40
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:static md:flex
          border-r border-white/10
          shadow-[4px_0_20px_rgba(0,0,0,0.3)]
          ${scrolled ? 'backdrop-blur-xl bg-[#1e1e1c]/95' : 'bg-[#1e1e1c]'}`}
				style={{
					background: scrolled
						? 'rgba(30,30,28,0.95)'
						: 'linear-gradient(180deg, #1e1e1c 0%, #252320 100%)',
					height: '100vh', // Aseguramos altura completa
				}}>
				{/* Logo - fijo arriba */}
				<div className='flex items-center justify-between px-5 py-5 border-b border-white/10'>
					<Link
						href={'/client'}
						className='font-serif text-base md:text-xl text-white hover:text-[#C8A882] transition-colors ml-16 md:ml-0 flex justify-between w-full'>
						Confort & Estilo
						<div className='w-8 h-8 rounded-lg bg-[#C8A882]/10 flex items-center justify-center'>
							<Home
								size={16}
								className='text-[#C8A882]'
							/>
						</div>
					</Link>
				</div>

				{/* User info - fijo */}
				<div className='px-5 py-4 border-b border-white/10'>
					<div className='flex items-center gap-3'>
						<div
							className='w-10 h-10 rounded-xl bg-gradient-to-br from-[#C8A882] to-[#8B5E3C] 
              flex items-center justify-center text-white font-medium shadow-lg'>
							A
						</div>
						<div>
							<p className='text-sm font-medium text-white'>Administrador</p>
							<p className='text-xs text-white/40'>admin@confort.com</p>
						</div>
					</div>
				</div>

				{/* Links - scrollable si es necesario */}
				<nav className='flex-1 overflow-y-auto py-4 px-3 space-y-1'>
					<SidebarLink
						groupTitle='Chats'
						icon={<MessageSquare size={18} />}
						routes={[
							{
								value: 'Mensajes',
								href: '/admin/chats',
								description: 'Conversaciones con clientes',
							},
						]}
						isOpen={openGroup === 'Chats'}
						onToggle={() => handleToggleGroup('Chats')}
					/>

					<SidebarLink
						groupTitle='Configuración'
						icon={<Settings size={18} />}
						routes={[
							{
								value: 'Roles de usuario',
								href: '/admin/configuracion',
								description: 'Gestionar permisos',
							},
						]}
						isOpen={openGroup === 'Configuración'}
						onToggle={() => handleToggleGroup('Configuración')}
					/>

					<SidebarLink
						groupTitle='Usuarios'
						icon={<Users size={18} />}
						routes={[
							{
								value: 'Usuarios',
								href: '/admin/usuarios',
								description: 'Gestionar cuentas',
							},
						]}
						isOpen={openGroup === 'Usuarios'}
						onToggle={() => handleToggleGroup('Usuarios')}
					/>

					<SidebarLink
						groupTitle='Ventas'
						icon={<TrendingUp size={18} />}
						routes={[
							{
								value: 'Pedidos',
								href: '/admin/ventas/pedidos',
								description: 'Ver pedidos',
							},
							{
								value: 'Pagos',
								href: '/admin/ventas/pagos',
								description: 'Transacciones',
							},
							{ value: 'Ventas', href: '/admin/ventas', description: 'Estadísticas' },
							{
								value: 'Cotizaciones',
								href: '/admin/ventas/cotizaciones',
								description: 'Presupuestos',
							},
						]}
						isOpen={openGroup === 'Ventas'}
						onToggle={() => handleToggleGroup('Ventas')}
					/>

					<SidebarLink
						groupTitle='Servicios'
						icon={<Server size={18} />}
						routes={[
							{
								value: 'Servicios',
								href: '/admin/servicios',
								description: 'Catálogo',
							},
							{
								value: 'Visitas',
								href: '/admin/servicios/visitas',
								description: 'Agenda',
							},
						]}
						isOpen={openGroup === 'Servicios'}
						onToggle={() => handleToggleGroup('Servicios')}
					/>

					<SidebarLink
						groupTitle='Compras'
						icon={<Package size={18} />}
						routes={[
							{
								value: 'Categorías',
								href: '/admin/compras/categorias',
								description: 'Clasificación',
							},
							{
								value: 'Productos',
								href: '/admin/compras/productos',
								description: 'Inventario',
							},
						]}
						isOpen={openGroup === 'Compras'}
						onToggle={() => handleToggleGroup('Compras')}
					/>

					<SidebarLink
						groupTitle='Desempeño'
						icon={<TrendingUp size={18} />}
						routes={[
							{
								value: 'Métricas',
								href: '/admin/desempeno',
								description: 'Análisis',
							},
						]}
						isOpen={openGroup === 'Desempeño'}
						onToggle={() => handleToggleGroup('Desempeño')}
					/>
				</nav>

				{/* Footer - pegado abajo */}
				<div className='p-4 border-t border-white/10 mt-auto'>
					<div className='flex items-center gap-2 text-xs text-white/30'>
						<span>© 2024</span>
						<span className='w-1 h-1 rounded-full bg-white/20'></span>
						<span>v1.0.0</span>
					</div>
				</div>
			</aside>

			{/* Overlay Mobile */}
			{mobileOpen && (
				<div
					className='fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden'
					onClick={() => setMobileOpen(false)}
				/>
			)}
		</>
	);
}
