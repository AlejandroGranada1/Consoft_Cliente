'use client';

import { Category } from '@/lib/types';
import { Eye, Edit, Trash2, MoreVertical, Layers, Package } from 'lucide-react';
import { useState } from 'react';

interface CategoryRowProps {
	category: Category;
	onView: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

export default function CategoryRow({ category, onView, onEdit, onDelete }: CategoryRowProps) {
	const [showActions, setShowActions] = useState(false);

	return (
		<div className='relative group'>
			{/* Versión Desktop */}
			<div className='hidden md:grid grid-cols-4 place-items-center py-3 px-4
				rounded-xl border border-white/10 bg-white/5
				hover:bg-white/8 transition-all duration-200'>

				{/* Categoría */}
				<div className='min-w-0 w-full text-center'>
					<p className="text-sm text-white/90 font-medium truncate">
						{category.name}
					</p>
				</div>

				{/* Descripción */}
				<div className='min-w-0 w-full text-center'>
					<p className="text-sm text-white/60 truncate" title={category.description || ''}>
						{category.description || 'Sin descripción'}
					</p>
				</div>

				{/* Productos */}
				<div className="flex items-center gap-1.5">
					<Package size={12} className="text-white/40" />
					<p className="text-sm text-white/60">{category.products?.length || 0}</p>
				</div>

				{/* Acciones */}
				<div className="flex items-center gap-2">
					<button
						onClick={onView}
						className="p-1.5 rounded-lg text-white/40 hover:text-[#C8A882]
							hover:bg-white/5 transition-all duration-200"
						title="Ver detalles">
						<Eye size={16} />
					</button>
					<button
						onClick={onEdit}
						className="p-1.5 rounded-lg text-white/40 hover:text-[#C8A882]
							hover:bg-white/5 transition-all duration-200"
						title="Editar">
						<Edit size={16} />
					</button>
					<button
						onClick={onDelete}
						className="p-1.5 rounded-lg text-white/40 hover:text-red-400
							hover:bg-white/5 transition-all duration-200"
						title="Eliminar">
						<Trash2 size={16} />
					</button>
				</div>
			</div>

			{/* Versión Mobile */}
			<div className='md:hidden rounded-xl border border-white/10 bg-white/5 p-4'>
				<div className='flex justify-between items-start mb-3'>
					<div>
						<div className="flex items-center gap-2">
							<Layers size={14} className="text-[#C8A882]" />
							<h3 className="text-white font-medium text-sm">{category.name}</h3>
						</div>
						{category.description && (
							<p className="text-xs text-white/40 mt-2 max-w-[200px]">
								{category.description}
							</p>
						)}
					</div>

					<div className="flex items-center gap-1.5">
						<Package size={12} className="text-white/40" />
						<span className="text-xs text-white/60">{category.products?.length || 0}</span>
					</div>
				</div>

				<div className='flex justify-end mt-3'>
					<button
						onClick={() => setShowActions(!showActions)}
						className='p-2 rounded-lg text-white/40 hover:text-white
							hover:bg-white/5 transition-all'>
						<MoreVertical size={18} />
					</button>

					{showActions && (
						<div className='absolute right-4 mt-8 w-32 rounded-lg
							border border-white/10 bg-[#252320] shadow-lg z-10'>
							<button
								onClick={() => { onView(); setShowActions(false); }}
								className='w-full px-4 py-2 text-left text-sm text-white/70
									hover:bg-white/5 first:rounded-t-lg
									flex items-center gap-2'>
								<Eye size={14} /> Ver
							</button>
							<button
								onClick={() => { onEdit(); setShowActions(false); }}
								className='w-full px-4 py-2 text-left text-sm text-white/70
									hover:bg-white/5
									flex items-center gap-2'>
								<Edit size={14} /> Editar
							</button>
							<button
								onClick={() => { onDelete(); setShowActions(false); }}
								className='w-full px-4 py-2 text-left text-sm text-red-400
									hover:bg-white/5 last:rounded-b-lg
									flex items-center gap-2'>
								<Trash2 size={14} /> Eliminar
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}