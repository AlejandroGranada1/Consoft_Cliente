'use client';
import { Pencil, Eye, Trash2 } from 'lucide-react';
import { Role } from '@/lib/types';

interface RoleRowProps {
	role: Role;
	onView: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

export default function RoleRow({ role, onView, onEdit, onDelete }: RoleRowProps) {
	return (
		<div className='table-preset md:grid-cols-6'>
			{/* Nombre */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Nombre: </span>
				{role.name}
			</p>

			{/* Descripción */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Descripción: </span>
				{role.description}
			</p>

			{/* Usuarios */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Usuarios: </span>
				{role.usersCount}
			</p>

			{/* Fecha de creación */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Fecha de creación: </span>
				{new Date(role.createdAt).toLocaleDateString()}
			</p>

			{/* Estado */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Estado: </span>
				<span className={role.status ? 'text-green-500' : 'text-red-500'}>
					{role.status ? 'Activo' : 'Inactivo'}
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
