import { Pencil, Eye, Trash2 } from 'lucide-react';
import { Role, User } from '@/lib/types';
import Image from 'next/image';

interface UserRowProps {
	user: User;
	onView: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

export default function UserRow({ onDelete, onEdit, onView, user }: UserRowProps) {
	console.log(user);
	return (
		<div className='table-preset md:grid-cols-7'>
			{/* Foto de perfil */}
			<Image
				src={
					user.profile_picture && user.profile_picture.trim() !== ''
						? user.profile_picture
						: '/default_user.png'
				}
				alt='Foto Usuario'
				width={48}
				height={48}
				className='hidden md:block w-12 h-12 rounded-full object-cover border shadow'
			/>
			{/* Nombre */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Nombre: </span>
				{user.name}
			</p>

			{/* Correo */}
			<p className='table-item truncate w-20'>
				<span className='font-semibold md:hidden'>Correo: </span>
				{user.email}
			</p>

			{/* Rol */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Rol: </span>
				{(user.role as Role)?.name}
			</p>

			{/* Fecha de Registro */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Fecha de Registro: </span>
				{new Date(user.registeredAt).toLocaleDateString()}
			</p>

			{/* Estado */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Estado: </span>
				<span className={user.status ? 'text-green-500' : 'text-red-500'}>
					{user.status ? 'Activo' : 'Inactivo'}
				</span>
			</p>

			{/* Acciones */}
			<div className='flex gap-4 justify-center w-full md:w-auto'>
				<Eye
					size={20}
					color='#d9b13b'
					onClick={onView}
					className='cursor-pointer hover:scale-110 transition-transform'
					aria-label='Ver detalles'
				/>
				<Pencil
					size={20}
					color='#7588f0'
					onClick={onEdit}
					className='cursor-pointer hover:scale-110 transition-transform'
					aria-label='Editar'
				/>
				<Trash2
					size={19}
					color='#fa4334'
					onClick={onDelete}
					className='cursor-pointer hover:scale-110 transition-transform'
					aria-label='Eliminar'
				/>
			</div>
		</div>
	);
}
