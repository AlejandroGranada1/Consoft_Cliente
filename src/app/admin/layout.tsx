'use client'
import { LogOut } from 'lucide-react';
import Sidebar from '@/components/admin/global/Sidebar';
import api from '@/components/Global/axios';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const handleLogout = async () => {
		const Swal = (await import('sweetalert2')).default;
		Swal.fire({
			title: '¿Cerrar sesión?',
			html: 'Estas apunto de cerrar sesion',
			confirmButtonColor: 'brown',
			confirmButtonText: 'Cerrar sesión',
			showCancelButton: true,
			cancelButtonText: 'Cancelar',
		}).then(async (result) => {
			if (result.isConfirmed) {
				const response = await api.post('/api/auth/logout');
				if (response.status == 200) {
					window.location.href = '/client';
				}
			}
		});
	};


	return (
		<div className='flex'>
			{/* Sidebar fijo */}
			<Sidebar />

			{/* Contenido principal */}
			<div className='flex-1 flex flex-col'>
				{/* TopBar */}
				<header className='flex items-center justify-end gap-10 border-b border-gray-200 px-6 h-20'>
					<p className='py-1 px-4 rounded-xl border border-gray-300 text-sm'>
						Administrador
					</p>
					<LogOut
						onClick={handleLogout}
						size={30}
						cursor={'pointer'}
					/>
				</header>

				{/* Contenido de cada página */}
				<main>{children}</main>
			</div>
		</div>
	);
}
