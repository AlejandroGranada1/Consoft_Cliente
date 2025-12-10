'use client';
import { Category, DefaultModalProps, Product } from '@/lib/types';
import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import EditProductModal from './EditProductModal';

function CategoryDetailsModal({ isOpen, onClose, extraProps }: DefaultModalProps<Product>) {
	const [editModal, setEditModal] = useState(false);

	if (!isOpen || !extraProps) return null;

	const imageUrl =
		extraProps.imageUrl && extraProps.imageUrl.trim() !== ''
			? extraProps.imageUrl
			: '/def_prod.png';

	return (
		<div className='modal-bg'>
			<div className='modal-frame w-[800px]'>
				<header className='w-fit mx-auto'>
					<button
						onClick={onClose}
						className='absolute top-4 left-4 text-2xl text-gray-500 hover:text-black cursor-pointer'>
						<IoMdClose />
					</button>
					<h1 className='text-xl font-semibold mb-4'>DETALLES DEL PRODUCTO</h1>
				</header>

				<section className='grid grid-cols-2 gap-4'>
					{/* Datos */}
					<div>
						<div className='flex flex-col'>
							<label className='font-semibold'>Producto</label>
							<p className='border px-3 py-2 rounded-md bg-gray-100'>
								{extraProps.name}
							</p>
						</div>

						<div className='flex flex-col mt-4'>
							<label className='font-semibold'>Categoría</label>
							<p className='border px-3 py-2 rounded-md bg-gray-100'>
								{(extraProps.category as Category).name}
							</p>
						</div>

						<div className='flex flex-col mt-4'>
							<label className='font-semibold'>Descripción</label>
							<p className='border px-3 py-2 rounded-md bg-gray-100'>
								{extraProps.description || 'Sin descripción'}
							</p>
						</div>

						<div className='flex flex-col mt-4'>
							<label className='font-semibold'>Imagen (URL)</label>
							<p className='border px-3 py-2 rounded-md bg-gray-100'>
								{extraProps.imageUrl}
							</p>
						</div>

						<div className='flex flex-col mt-4'>
							<label className='font-semibold'>Estado</label>
							<p
								className={`px-3 py-2 rounded-md w-fit ${extraProps.status
										? 'bg-green-100 text-green-700'
										: 'bg-red-100 text-red-700'
									}`}>
								{extraProps.status ? 'Activo' : 'Inactivo'}
							</p>
						</div>
					</div>

					{/* PREVIEW DE IMAGEN */}
					<div className='border rounded-lg p-4 flex justify-center items-center bg-gray-50'>
						<img
							src={imageUrl}
							alt={extraProps.name}
							className='max-w-full max-h-64 object-contain rounded-md'
						/>
					</div>
				</section>
			</div>
		</div>
	);
}

export default CategoryDetailsModal;
