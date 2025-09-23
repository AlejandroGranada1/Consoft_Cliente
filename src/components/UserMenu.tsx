'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/context/userContext';
import { User } from 'lucide-react';
import Swal from 'sweetalert2';
import api from './Global/axios';
import { useRouter } from 'next/navigation';

export default function UserMenu() {
	const router = useRouter();
	const { user, setUser } = useUser();

	const handleLogout = () => {
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
					setUser(null);
					router.push('/client');
				}
			}
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<User className='h-6 w-6 cursor-pointer text-[#1E293B] hover:text-[#5C3A21]' />
			</DropdownMenuTrigger>

			<DropdownMenuContent className='w-52 bg-white border rounded-xl shadow-lg p-1'>
				{/* Acceso */}
				{user?.role.name === 'Administrador' && (
					<DropdownMenuItem
						onClick={() => router.push('/admin/configuracion')}
						className='px-3 py-2 rounded-md text-[#1E293B] hover:bg-[#5C3A21] hover:text-white cursor-pointer'>
						Panel administrativo
					</DropdownMenuItem>
				)}
				{!user ? (
					<>
						<DropdownMenuItem
							onClick={() => (window.location.href = '/client/auth/login')}
							className='px-3 py-2 rounded-md text-[#1E293B] hover:bg-[#5C3A21] hover:text-white cursor-pointer'>
							Iniciar Sesión
						</DropdownMenuItem>

						<DropdownMenuItem
							onClick={() => (window.location.href = '/client/auth/register')}
							className='px-3 py-2 rounded-md text-[#1E293B] hover:bg-[#5C3A21] hover:text-white cursor-pointer'>
							Registrarme
						</DropdownMenuItem>

						<DropdownMenuSeparator />
					</>
				) : (
					<>
						{/* Funciones extra */}
						<DropdownMenuItem
							onClick={() => (window.location.href = '/client/pedidos')}
							className='px-3 py-2 rounded-md text-[#1E293B] hover:bg-[#5C3A21] hover:text-white cursor-pointer'>
							Mis pedidos
						</DropdownMenuItem>

						<DropdownMenuItem
							onClick={() => (window.location.href = '/client/notificaciones')}
							className='px-3 py-2 rounded-md text-[#1E293B] hover:bg-[#5C3A21] hover:text-white cursor-pointer'>
							Notificaciones
						</DropdownMenuItem>
						<button
							onClick={handleLogout}
							className='hover:bg-red hover:text-white py-1.5 rounded-sm w-full flex justify-start pl-3 text-sm transition-colors cursor-pointer'>
							Cerrar Sesion
						</button>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
