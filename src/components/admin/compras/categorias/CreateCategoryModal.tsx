'use client';
import { X } from 'lucide-react';
import { DefaultModalProps, Category } from '@/lib/types';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

import { createElement } from '../../global/alerts';

const initialState: Omit<Category, 'id'> = {
	name: '',
	description: '',
	products: [],
	_id: undefined,
};

function CreateCategoryModal({ isOpen, onClose, updateList }: DefaultModalProps<Category>) {
	const [categoryData, setCategoryData] = useState<Omit<Category, 'id'>>(initialState);

	/* 🔹 LIMPIAR AL CERRAR (MISMO PATRÓN) */
	useEffect(() => {
		if (!isOpen) {
			setCategoryData(initialState);
		}
	}, [isOpen]);

	// Maneja cambios en inputs
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setCategoryData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		/* 🔹 VALIDACIONES (IGUAL QUE SERVICES) */
		if (!categoryData.name.trim() || !categoryData.description?.trim()) {
			return Swal.fire(
				'Campos incompletos',
				'Nombre y descripción son obligatorios',
				'warning'
			);
		}

		try {
			const confirm = await createElement(
				'categoría',
				'/api/categories',
				categoryData,
				updateList
			);

			if (confirm) {
				if (updateList) await updateList();
				onClose();
				setCategoryData(initialState);
			}
		} catch (error) {
			console.error('Error al crear categoría:', error);
		}
	};

	if (!isOpen) return null;

	return (
		<div className='modal-bg'>
			<div className='modal-frame w-[600px]'>
				<header className='w-fit mx-auto'>
					<button
						onClick={onClose}
						className='absolute top-4 left-4 text-2xl text-gray-500 hover:text-black cursor-pointer'>
						<X />
					</button>
					<h1 className='text-xl font-semibold mb-4'>AGREGAR CATEGORÍA</h1>
				</header>

				<form onSubmit={handleSubmit}>
					{/* Nombre */}
					<div className='flex flex-col'>
						<label htmlFor='name'>Categoría</label>
						<input
							id='name'
							name='name'
							type='text'
							placeholder='Nombre de la categoría'
							value={categoryData.name}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					{/* Descripción */}
					<div className='flex flex-col mt-4'>
						<label htmlFor='description'>Descripción</label>
						<input
							id='description'
							name='description'
							type='text'
							placeholder='Descripción de la categoría'
							value={categoryData.description}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					{/* Botones */}
					<div className='w-full flex justify-between mt-10'>
						<button
							type='button'
							onClick={onClose}
							className='px-10 py-2 rounded-lg border border-gray bg-gray cursor-pointer'>
							Cancelar
						</button>
						<button
							type='submit'
							className='px-10 py-2 rounded-lg border border-brown text-brown cursor-pointer'>
							Guardar
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default CreateCategoryModal;
