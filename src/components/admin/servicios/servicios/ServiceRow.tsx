import { formatCOP } from '@/lib/formatCOP';
import { Order, Sale, Service, User } from '@/lib/types';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import React from 'react';

interface ServiceRowProps {
	service: Service;
	onView: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

export default function ServiceRow({ onView, onDelete, onEdit, service }: ServiceRowProps) {
	return (
		<div className='table-preset md:grid-cols-4'>
			{/* Servicio */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Servicio: </span>
				{service.name}
			</p>
			{/* Descripcion */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Descripcion: </span>
				{service.description}
			</p>
			{/* Estado */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Estado: </span>
				<span
					className={`px-2 py-1 rounded-xl ${
						service.status ? 'bg-green/30 text-green' : 'bg-red/30 text-red'
					}`}>
					{service.status ? 'Activo' : 'Inactivo'}
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
