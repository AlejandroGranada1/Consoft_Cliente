'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/providers/userContext';
import { User } from 'lucide-react';
import Swal from 'sweetalert2';
import api from './Global/axios';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UserMenu() {
	const router = useRouter();
	const { user, setUser, loadUser } = useUser();

	// 🔥 AUTO-CARGA DEL USUARIO SI ESTÁ EN SESIÓN
	useEffect(() => {
		loadUser();
	}, []);

	if (user === undefined) return null

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
				{typeof user?.role !== 'string' &&
					(user?.role.name === 'Administrador' || user?.role.name === 'Master') && (
						<>
							<DropdownMenuItem onClick={() => router.push('/admin/configuracion')}>
								Panel Administrativo
							</DropdownMenuItem>

							<DropdownMenuItem onClick={() => router.push('/admin/chats')}>
								Mensajes
							</DropdownMenuItem>
						</>
					)}

				{!user ? (
					<>
						<DropdownMenuItem onClick={() => router.push('/client/auth/login')}>
							Iniciar Sesión
						</DropdownMenuItem>

						<DropdownMenuItem onClick={() => router.push('/client/auth/register')}>
							Registrarme
						</DropdownMenuItem>

						<DropdownMenuSeparator />
					</>
				) : (
					<>
						<DropdownMenuItem onClick={() => router.push('/client/pedidos')}>
							Mis Pedidos
						</DropdownMenuItem>

						<DropdownMenuItem onClick={() => router.push('/client/notificaciones')}>
							Notificaciones
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => router.push('/client/perfil')}>
							Mi Perfil
						</DropdownMenuItem>
						<DropdownMenuItem onClick={()=> router.push("/client/favoritos")}>
							Favoritos
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
