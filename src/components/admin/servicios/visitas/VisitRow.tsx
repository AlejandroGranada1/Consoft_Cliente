// components/admin/servicios/visitas/VisitRow.tsx
import { Eye, Trash2 } from 'lucide-react';
import { Visit } from '@/lib/types';

interface VisitRowProps {
	visit: Visit;
	onView: () => void;
	onDelete: () => void;
}

export default function VisitRow({ onView, onDelete, visit }: VisitRowProps) {
	return (
		<div className='table-preset grid md:grid-cols-5'>
			{/* ID corto de la visita */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>ID de Visita: </span>
				{visit._id?.slice(-4).toUpperCase() || 'N/A'}
			</p>
			
			{/* Fecha */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Fecha: </span>
				{new Date(visit.visitDate).toLocaleDateString()}
			</p>
			
			{/* Cliente */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Cliente: </span>
				{visit?.user?.name}
			</p>
			
			{/* Estado */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Estado: </span>
				<span
					className={`px-2 py-1 rounded-xl ${
						visit.status === 'Terminada'
							? 'bg-green/30 text-green'
							: visit.status === 'Cancelada'
							? 'bg-red/30 text-red'
							: 'bg-orange/30 text-orange'
					}`}>
					{visit.status}
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