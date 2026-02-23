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
	Calendar,
	Hash
} from 'lucide-react';
import { Category, DefaultModalProps, Product } from '@/lib/types';
import React, { useState } from 'react';
import EditProductModal from './EditProductModal';

function ProductDetailsModal({ isOpen, onClose, extraProps }: DefaultModalProps<Product>) {
	const [editModal, setEditModal] = useState(false);

	if (!isOpen || !extraProps) return null;

	const imageUrl =
		extraProps.imageUrl && extraProps.imageUrl.trim() !== ''
			? extraProps.imageUrl
			: '/def_prod.png';

	return (
		<>
			<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
				<div className='modal-frame w-full max-w-3xl flex flex-col max-h-[92vh]'>
					
					<header className='sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-xs'>
						<div className='flex items-center justify-between'>
							<h1 className='text-2xl font-bold flex items-center gap-2'>
								<Package size={20} /> Detalles del Producto
							</h1>
							<button
								onClick={onClose}
								className='p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors'>
								<X size={18} />
							</button>
						</div>
					</header>

					<div className='grid grid-cols-2 gap-6 p-6 overflow-y-auto'>
						
						{/* Columna izquierda - Información */}
						<div className='space-y-5'>
							
							{/* Nombre */}
							<div className='border rounded-lg p-4 bg-gray-50'>
								<h3 className='font-semibold mb-3 flex items-center gap-2'>
									<Tag size={16} />
									Nombre del producto
								</h3>
								<p className='text-gray-800 bg-white border rounded-md px-3 py-2'>
									{extraProps.name}
								</p>
							</div>

							{/* Categoría */}
							<div className='border rounded-lg p-4 bg-gray-50'>
								<h3 className='font-semibold mb-3 flex items-center gap-2'>
									<FolderTree size={16} />
									Categoría
								</h3>
								<p className='text-gray-800 bg-white border rounded-md px-3 py-2'>
									{(extraProps.category as Category)?.name || 'Sin categoría'}
								</p>
							</div>

							{/* Descripción */}
							<div className='border rounded-lg p-4 bg-gray-50'>
								<h3 className='font-semibold mb-3 flex items-center gap-2'>
									<FileText size={16} />
									Descripción
								</h3>
								<p className='text-gray-700 bg-white border rounded-md px-3 py-2 min-h-[60px]'>
									{extraProps.description || 'Sin descripción'}
								</p>
							</div>

							{/* Estado */}
							<div className='border rounded-lg p-4 bg-gray-50'>
								<h3 className='font-semibold mb-3 flex items-center gap-2'>
									<ToggleLeft size={16} />
									Estado
								</h3>
								<div className='flex items-center gap-3'>
									<span className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${
										extraProps.status 
											? 'bg-green-100 text-green-700 border border-green-200' 
											: 'bg-red-100 text-red-700 border border-red-200'
									}`}>
										<span className={`w-2 h-2 rounded-full ${
											extraProps.status ? 'bg-green-500' : 'bg-red-500'
										}`} />
										{extraProps.status ? 'Activo' : 'Inactivo'}
									</span>
									<p className='text-xs text-gray-500'>
										{extraProps.status 
											? 'El producto está disponible en el catálogo' 
											: 'El producto no se muestra en el catálogo'}
									</p>
								</div>
							</div>
						</div>

						{/* Columna derecha - Imagen */}
						<div className='bg-gray-50 border rounded-lg p-6 flex flex-col items-center justify-start'>
							<h3 className='font-semibold mb-4 flex items-center gap-2 self-start'>
								<ImageIcon size={16} />
								Imagen del producto
							</h3>
							
							<div className='w-full space-y-3'>
								<div className='border rounded-lg overflow-hidden bg-white p-2 shadow-sm'>
									<img
										src={imageUrl}
										alt={extraProps.name}
										className='w-full max-h-64 object-contain rounded-md'
									/>
								</div>
								{extraProps.imageUrl ? (
									<p className='text-xs text-gray-500 text-center break-all'>
										{extraProps.imageUrl}
									</p>
								) : (
									<p className='text-xs text-yellow-600 text-center flex items-center justify-center gap-1'>
										<Eye size={12} />
										Imagen por defecto
									</p>
								)}
							</div>
						</div>

						{/* Resumen del producto - ocupa ambas columnas */}
						<div className='col-span-2 p-4 bg-gray-50 rounded-lg border'>
							<div className='flex justify-between items-center'>
								<div>
									<span className='font-semibold text-lg'>Resumen:</span>
									<p className='text-sm text-gray-600 mt-1'>
										{extraProps.name}
									</p>
									<p className='text-sm text-gray-600'>
										{(extraProps.category as Category)?.name || 'Sin categoría'}
									</p>
								</div>
								<div className='text-right'>
									<span className={`text-sm font-medium px-3 py-1 rounded-full ${
										extraProps.status 
											? 'bg-green-100 text-green-700' 
											: 'bg-red-100 text-red-700'
									}`}>
										{extraProps.status ? 'Activo' : 'Inactivo'}
									</span>
								</div>
							</div>
						</div>

						{/* Botones - ocupan ambas columnas */}
						<div className='col-span-2 flex justify-between pt-4 border-t'>
							<button
								type='button'
								onClick={onClose}
								className='px-6 py-2 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-100 transition-colors'>
								Cerrar
							</button>
							<button
								type='button'
								onClick={() => setEditModal(true)}
								className='px-6 py-2 border border-brown text-brown rounded-md hover:bg-brown hover:text-white transition-colors flex items-center gap-2'>
								<Edit size={16} />
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
			/>
		</>
	);
}

export default ProductDetailsModal;