// components/admin/compras/categorias/CategoryRow.tsx
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Category } from '@/lib/types';

interface CategoryRowProps {
	category: Category;
	onView: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

export default function CategoryRow({ onView, onEdit, onDelete, category }: CategoryRowProps) {
	return (
		<div className='table-preset grid md:grid-cols-4'>
			{/* Nombre de la categoría */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Categoría: </span>
				{category.name}
			</p>

			{/* Descripción */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Descripción: </span>
				{category.description || 'Sin descripción'}
			</p>

			{/* Cantidad de productos */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Productos: </span>
				{category.products?.length || 0}
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
