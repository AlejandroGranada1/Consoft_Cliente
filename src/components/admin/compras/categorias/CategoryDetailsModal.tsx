'use client';
import { DefaultModalProps, Category } from '@/app/types';
import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import EditCategoryModal from './EditCategoryModal';

function CategoryDetailsModal({ isOpen, onClose, extraProps }: DefaultModalProps<Category>) {
	const [editModal, setEditModal] = useState(false);

	if (!isOpen || !extraProps) return null;

	return (
		<div className='modal-bg'>
			<div className='modal-frame w-[600px]'>
				<header className='w-fit mx-auto'>
					<button
						onClick={onClose}
						className='absolute top-4 left-4 text-2xl text-gray-500 hover:text-black cursor-pointer'>
						<IoMdClose />
					</button>
					<h1 className='text-xl font-semibold mb-4'>DETALLES DE LA CATEGORÍA</h1>
				</header>

				<div>
					{/* Nombre */}
					<div className='flex flex-col'>
						<label className='font-semibold'>Categoría</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>{extraProps.name}</p>
					</div>

					{/* Descripción */}
					<div className='flex flex-col mt-4'>
						<label className='font-semibold'>Descripción</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{extraProps.description || 'Sin descripción'}
						</p>
					</div>

					{/* Productos */}
					<div className='flex flex-col mt-4'>
						<label className='font-semibold'>Productos</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{extraProps.products.length}
						</p>
					</div>
				</div>
			</div>

			{/* Edit Modal */}
			<EditCategoryModal
				isOpen={editModal}
				onClose={() => setEditModal(false)}
				extraProps={extraProps}
			/>
		</div>
	);
}

export default CategoryDetailsModal;
