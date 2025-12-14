// components/admin/compras/productos/ProductRow.tsx
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Category, Product } from '@/lib/types';

interface ProductRowProps {
	product: Product;
	onView: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

export default function ProductRow({ onView, onEdit, onDelete, product }: ProductRowProps) {
	// Obtener nombre de la categoría (puede ser objeto o string)
	const categoryName =
		typeof product.category === 'string'
			? product.category
			: (product.category as Category)?.name || 'Sin categoría';

	return (
		<div className='table-preset grid md:grid-cols-5'>
			{/* Nombre del producto */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Producto: </span>
				{product.name}
			</p>

			{/* Categoría */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Categoría: </span>
				{categoryName}
			</p>

			{/* Descripción */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Descripción: </span>
				{product.description || 'Sin descripción'}
			</p>

			{/* Estado */}
			<p className='table-item'>
				<span className='font-semibold md:hidden'>Estado: </span>
				<span
					className={`px-2 py-1 rounded-xl ${
						product.status ? 'bg-green/30 text-green' : 'bg-red/30 text-red'
					}`}>
					{product.status ? 'Activo' : 'Inactivo'}
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
