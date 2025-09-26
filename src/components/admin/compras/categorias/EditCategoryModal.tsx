'use client';
import { DefaultModalProps, Category } from '@/app/types';
import React, { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { updateElement } from '../../global/alerts';
import api from '@/components/Global/axios';

function EditCategoryModal({
	isOpen,
	onClose,
	extraProps,
	updateList,
}: DefaultModalProps<Category>) {
	const [categoryData, setCategoryData] = useState<Category>({
		_id: '',
		name: '',
		description: '',
		products: [],
	});

	// 🔹 Prellenar datos cuando se abre el modal
	useEffect(() => {
		if (extraProps) {
			setCategoryData(extraProps);
		}
	}, [extraProps, isOpen]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setCategoryData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			// llamada al helper (muestra alertas)
			const resposne = await updateElement(
				'Categoría',
				`/api/categories/${categoryData._id}`,
				{ name: categoryData.name, description: categoryData.description },
				updateList
			);

			onClose();
		} catch (error) {
			console.error('Error al actualizar categoría:', error);
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
						<IoMdClose />
					</button>
					<h1 className='text-xl font-semibold mb-4'>EDITAR CATEGORÍA</h1>
				</header>

				<form onSubmit={handleSubmit}>
					{/* Nombre */}
					<div className='flex flex-col'>
						<label htmlFor='name'>Categoría</label>
						<input
							id='name'
							name='name'
							type='text'
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
							value={categoryData.description}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					{/* Botones */}
					<div className='w-full flex justify-between mt-10'>
						<button
							type='submit'
							className='px-10 py-2 rounded-lg border border-brown text-brown cursor-pointer'>
							Guardar
						</button>
						<button
							type='button'
							onClick={onClose}
							className='px-10 py-2 rounded-lg border border-gray bg-gray cursor-pointer'>
							Cancelar
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default EditCategoryModal;
