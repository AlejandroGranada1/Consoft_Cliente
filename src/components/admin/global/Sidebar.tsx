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
	DollarSign,
	FolderPlus,
} from 'lucide-react';
import SidebarLink from './SidebarLink';

import Link from 'next/link';

function Sidebar() {
	return (
		<aside className='h-screen w-[240px] bg-white flex flex-col'>
			{/* Logo + TopBar */}
			<div className='flex items-center justify-between px-4 py-3 border-b border-gray-200 h-20'>
				<Link
					href={'/client'}
					className='font-bold text-lg text-brown'>
					Confort & Estilo
				</Link>
			</div>

			{/* Links */}
			<nav className='flex-1 flex flex-col justify-evenly overflow-y-auto border-r border-gray'>
				<SidebarLink
					groupTitle='Chats'
					routes={[
						{ value: 'Chats', icon: <MessageSquare />, href: '/admin/chats' },
					]}></SidebarLink>
				<SidebarLink
					groupTitle='Configuración'
					routes={[{ value: 'Roles', icon: <Settings />, href: '/admin/configuracion' }]}
				/>
				<SidebarLink
					groupTitle='Usuarios'
					routes={[{ value: 'Usuarios', icon: <Users />, href: '/admin/usuarios' }]}
				/>
				<SidebarLink
					groupTitle='Ventas'
					routes={[
						{
							value: 'Pedidos',
							icon: <FileText />,
							href: '/admin/ventas/pedidos',
						},
						{ value: 'Pagos', icon: <Wallet />, href: '/admin/ventas/pagos' },
						{ value: 'Ventas', icon: <TrendingUp />, href: '/admin/ventas' },
						{
							value: 'Cotizaciones',
							icon: <ShoppingCart />,
							href: '/admin/ventas/cotizaciones',
						},
					]}
				/>
				<SidebarLink
					groupTitle='Servicios'
					routes={[
						{
							value: 'Servicios',
							icon: <Server />,
							href: '/admin/servicios',
						},
						{
							value: 'Visitas',
							icon: <MapPin />,
							href: '/admin/servicios/visitas',
						},
					]}
				/>
				<SidebarLink
					groupTitle='Compras'
					routes={[
						{
							value: 'Categorías',
							icon: <FolderPlus />,
							href: '/admin/compras/categorias',
						},
						{
							value: 'Productos',
							icon: <Layers />,
							href: '/admin/compras/productos',
						},
					]}
				/>
				<SidebarLink
					groupTitle='Desempeño'
					routes={[
						{ value: 'Desempeño', icon: <TrendingUp />, href: '/admin/desempeno' },
					]}
				/>
			</nav>
		</aside>
	);
}

export default Sidebar;
