'use client';
import {
	X,
	Package,
	Tag,
	FileText,
	Image as ImageIcon,
	FolderTree,
	ToggleLeft,
	Edit,
	Eye,
} from 'lucide-react';
import { Category, DefaultModalProps, Product } from '@/lib/types';
import React, { useState } from 'react';
import EditProductModal from './EditProductModal';
import Image from 'next/image';
import { createPortal } from 'react-dom';

function ProductDetailsModal({ isOpen, onClose, extraProps }: DefaultModalProps<Product>) {
	const [editModal, setEditModal] = useState(false);

	if (!isOpen || !extraProps) return null;

	const imageUrl =
		extraProps.imageUrl && extraProps.imageUrl.trim() !== ''
			? extraProps.imageUrl
			: '/def_prod.png';

	const category = extraProps.category as Category;

	return createPortal(
		<>
			<div
				className='fixed inset-0 z-50 flex items-center justify-center p-4'
				style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
				<div
					className='w-full max-w-3xl rounded-2xl border border-white/10
					shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col max-h-[90vh]'
					style={{ background: 'rgba(30,30,28,0.95)', backdropFilter: 'blur(20px)' }}>
					{/* Header */}
					<header className='relative px-6 py-5 border-b border-white/10'>
						<div className='absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2'>
							<button
								onClick={() => setEditModal(true)}
								className='p-2 rounded-lg text-white/40 hover:text-[#C8A882]
									hover:bg-white/5 transition-all duration-200'
								title='Editar producto'>
								<Edit size={18} />
							</button>
							<button
								onClick={onClose}
								className='p-2 rounded-lg text-white/40 hover:text-white/70
									hover:bg-white/5 transition-all duration-200'>
								<X size={18} />
							</button>
						</div>
						<h2 className='text-lg font-medium text-white text-center flex items-center justify-center gap-2'>
							<Package
								size={18}
								className='text-[#C8A882]'
							/>
							Detalles del producto
						</h2>
					</header>

					<div className='grid grid-cols-2 gap-6 p-6 overflow-y-auto'>
						{/* Columna izquierda - Información */}
						<div className='space-y-5'>
							{/* Nombre */}
							<div className='space-y-2'>
								<label className='text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block'>
									Nombre del producto
								</label>
								<div
									className='w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
									text-sm text-white/90 truncate'>
									{extraProps.name}
								</div>
							</div>

							{/* Categoría */}
							<div className='space-y-2'>
								<label className='text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block'>
									Categoría
								</label>
								<div
									className='w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
									text-sm text-white/90 truncate'>
									{category?.name || 'Sin categoría'}
								</div>
							</div>

							{/* Descripción */}
							<div className='space-y-2'>
								<label className='text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block'>
									Descripción
								</label>
								<div
									className='w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
									text-sm text-white/70 min-h-[60px] line-clamp-4 break-words whitespace-normal'>
									{extraProps.description || 'Sin descripción'}
								</div>
							</div>

							{/* Estado */}
							<div className='space-y-2'>
								<label className='text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block'>
									Estado
								</label>
								<div className='flex items-center gap-3'>
									<div
										className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${extraProps.status
												? 'bg-green-500/10 text-green-400 border border-green-500/20'
												: 'bg-red-500/10 text-red-400 border border-red-500/20'
											}`}>
										<span
											className={`w-2 h-2 rounded-full ${extraProps.status ? 'bg-green-400' : 'bg-red-400'
												}`}
										/>
										{extraProps.status ? 'Activo' : 'Inactivo'}
									</div>
								</div>
							</div>
						</div>

						{/* Columna derecha - Imagen */}
						<div className='bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-start'>
							<h3 className='text-sm font-medium text-white mb-4 flex items-center gap-2 self-start'>
								<ImageIcon
									size={16}
									className='text-[#C8A882]'
								/>
								Imagen del producto
							</h3>

							<div className='w-full space-y-3'>
								<div className='rounded-xl border border-white/10 overflow-hidden bg-white/5 p-2'>
									<img
										src={imageUrl}
										alt={extraProps.name}
										className='w-full max-h-64 object-contain rounded-lg'
									/>
								</div>
								{extraProps.imageUrl ? (
									<p className='text-xs text-white/30 text-center break-all'>
										{extraProps.imageUrl.substring(0, 50)}...
									</p>
								) : (
									<p className='text-xs text-yellow-400/70 text-center flex items-center justify-center gap-1'>
										<Eye size={12} />
										Imagen por defecto
									</p>
								)}
							</div>
						</div>

						{/* Resumen - ocupa ambas columnas */}
						<div className='col-span-2 p-4 rounded-xl border border-white/10 bg-white/5 overflow-hidden'>
							<div className='flex justify-between items-center gap-4'>
								<div className='min-w-0 flex-1'>
									<p className='text-sm font-medium text-white truncate'>Resumen</p>
									<p className='text-xs text-white/40 mt-1 truncate'>{extraProps.name}</p>
									<p className='text-xs text-white/40 truncate'>
										{category?.name || 'Sin categoría'}
									</p>
								</div>
								<div className='text-right'>
									<span
										className={`text-xs px-3 py-1.5 rounded-full ${extraProps.status
												? 'bg-green-500/10 text-green-400 border border-green-500/20'
												: 'bg-red-500/10 text-red-400 border border-red-500/20'
											}`}>
										{extraProps.status ? 'Activo' : 'Inactivo'}
									</span>
								</div>
							</div>
						</div>

						{/* Botones - ocupan ambas columnas */}
						<div className='col-span-2 flex justify-end gap-3 pt-4 border-t border-white/10'>
							<button
								type='button'
								onClick={onClose}
								className='px-5 py-2.5 rounded-lg
									border border-white/15 bg-white/5
									text-white/70 text-sm
									hover:bg-white/10 hover:text-white
									transition-all duration-200'>
								Cerrar
							</button>
							<button
								type='button'
								onClick={() => setEditModal(true)}
								className='px-5 py-2.5 rounded-lg
									border border-[#C8A882]/30 bg-[#C8A882]/10
									text-[#C8A882] text-sm font-medium
									hover:bg-[#C8A882]/20 hover:border-[#C8A882]/50
									flex items-center gap-2
									transition-all duration-200'>
								<Edit size={14} />
								Editar Producto
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Modal de edición */}
			<EditProductModal
				isOpen={editModal}
				onClose={() => setEditModal(false)}
				extraProps={extraProps}
				updateList={() => { }}
			/>
		</>,
		document.body,
	);
}

export default ProductDetailsModal;
