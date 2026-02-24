'use client';

import { Product, Category } from '@/lib/types';
import { Eye, Edit, Trash2, MoreVertical, Package, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface ProductRowProps {
	product: Product;
	onView: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

export default function ProductRow({ product, onView, onEdit, onDelete }: ProductRowProps) {
	const [showActions, setShowActions] = useState(false);

	const category = product.category as Category;
	const imageUrl = product.imageUrl || '/def_prod.png';

	return (
		<div className='relative group'>
			{/* Versión Desktop */}
			<div className='hidden md:grid grid-cols-5 place-items-center py-3 px-4
				rounded-xl border border-white/10 bg-white/5
				hover:bg-white/8 transition-all duration-200'>
				
				{/* Producto con imagen pequeña */}
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10">
						<Image
							src={imageUrl}
							alt={product.name}
							width={32}
							height={32}
							className="object-cover w-full h-full"
						/>
					</div>
					<p className="text-sm text-white/90 font-medium">{product.name}</p>
				</div>

				{/* Categoría */}
				<p className="text-sm text-white/60">
					{category?.name || 'Sin categoría'}
				</p>

				{/* Descripción */}
				<p className="text-sm text-white/60 max-w-[200px] truncate">
					{product.description || 'Sin descripción'}
				</p>

				{/* Estado */}
				<div className="flex items-center gap-1.5">
					{product.status ? (
						<CheckCircle size={14} className="text-green-400" />
					) : (
						<XCircle size={14} className="text-red-400" />
					)}
					<span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
						product.status 
							? 'bg-green-500/10 text-green-400 border border-green-500/20' 
							: 'bg-red-500/10 text-red-400 border border-red-500/20'
					}`}>
						{product.status ? 'Activo' : 'Inactivo'}
					</span>
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
				<div className='flex gap-3'>
					<div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
						<Image
							src={imageUrl}
							alt={product.name}
							width={48}
							height={48}
							className="object-cover w-full h-full"
						/>
					</div>
					<div className="flex-1">
						<h3 className="text-white font-medium text-sm">{product.name}</h3>
						<p className="text-xs text-white/40 mt-1">{category?.name || 'Sin categoría'}</p>
					</div>
				</div>

				<div className='flex justify-between items-center mt-3'>
					<div className="flex items-center gap-1.5">
						{product.status ? (
							<CheckCircle size={14} className="text-green-400" />
						) : (
							<XCircle size={14} className="text-red-400" />
						)}
						<span className={`text-[10px] px-2 py-0.5 rounded-full ${
							product.status 
								? 'bg-green-500/10 text-green-400 border border-green-500/20' 
								: 'bg-red-500/10 text-red-400 border border-red-500/20'
						}`}>
							{product.status ? 'Activo' : 'Inactivo'}
						</span>
					</div>

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