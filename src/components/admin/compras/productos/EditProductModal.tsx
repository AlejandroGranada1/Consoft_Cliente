'use client';
import { DefaultModalProps, Category, Product } from '@/app/types';
import React, { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import api from '@/components/Global/axios';
import { updateElement } from '../../global/alerts';

function EditProductModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<Product>) {
	// 📌 Estado único para el formulario
	const [formData, setFormData] = useState<{
		_id: string;
		name: string;
		description: string;
		category: string; // solo guardamos el id
		imageUrl: string;
		status: boolean;
		imageFile?: File;
	}>({
		_id: '',
		name: '',
		description: '',
		category: '',
		imageUrl: '',
		status: true,
	});

	const [categories, setCategories] = useState<Category[]>([]);

	// 📌 Prellenar datos cuando se abre
	useEffect(() => {
		if (extraProps) {
			setFormData({
				_id: extraProps._id!,
				name: extraProps.name,
				description: extraProps.description!,
				category: extraProps.category?._id || '',
				imageUrl: extraProps.imageUrl || '',
				status: extraProps.status,
			});
		}
	}, [extraProps, isOpen]);

	// 📌 Traer categorías
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await api.get('/api/categories');
				setCategories(res.data.categories);
			} catch (err) {
				console.error('Error al cargar categorías', err);
			}
		};
		if (isOpen) fetchCategories();
	}, [isOpen]);

	// 📌 Manejo de inputs
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
		}));
	};

	// 📌 Manejo de archivo
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setFormData((prev) => ({
				...prev,
				imageUrl: URL.createObjectURL(file), // preview local
				imageFile: file,
			}));
		}
	};

	// 📌 Enviar formulario
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await updateElement('Producto', `/api/products/${formData._id}`, formData, updateList);
			onClose();
		} catch (err) {
			console.error('Error al actualizar producto', err);
		}
	};

	if (!isOpen) return null;

	return (
		<div className='modal-bg'>
			<div className='modal-frame w-[800px]'>
				<header className='w-fit mx-auto'>
					<button
						onClick={onClose}
						className='absolute top-4 left-4 text-2xl text-gray-500 hover:text-black cursor-pointer'>
						<IoMdClose />
					</button>
					<h1 className='text-xl font-semibold mb-4'>EDITAR PRODUCTO</h1>
				</header>

				<form
					onSubmit={handleSubmit}
					className='grid grid-cols-2 gap-6'>
					<div className='flex flex-col gap-4'>
						{/* Nombre */}
						<div className='flex flex-col'>
							<label htmlFor='name'>Producto</label>
							<input
								id='name'
								name='name'
								type='text'
								value={formData.name}
								onChange={handleChange}
								className='border px-3 py-2 rounded-md'
							/>
						</div>

						{/* Categoría */}
						<div className='flex flex-col'>
							<label htmlFor='category'>Categoría</label>
							<select
								name='category'
								id='category'
								value={formData.category}
								onChange={handleChange}
								className='border px-3 py-2 rounded-md'>
								<option value=''>Seleccione una categoría</option>
								{categories.map((c) => (
									<option
										key={c._id}
										value={c._id}>
										{c.name}
									</option>
								))}
							</select>
						</div>

						{/* Descripción */}
						<div className='flex flex-col'>
							<label htmlFor='description'>Descripción</label>
							<input
								id='description'
								name='description'
								type='text'
								value={formData.description}
								onChange={handleChange}
								className='border px-3 py-2 rounded-md'
							/>
						</div>

						{/* Imagen */}
						<div className='flex flex-col'>
							<label htmlFor='image'>Imagen</label>
							<input
								id='image'
								name='image'
								type='file'
								accept='image/*'
								onChange={handleFileChange}
								className='border px-3 py-2 rounded-md'
							/>
						</div>

						{/* Estado */}
						<div className='flex items-center gap-3 mt-2'>
							<input
								id='status'
								name='status'
								type='checkbox'
								checked={formData.status}
								onChange={handleChange}
								className='h-4 w-4 cursor-pointer'
							/>
							<span className={formData.status ? 'text-green-600' : 'text-red-600'}>
								{formData.status ? 'Activo' : 'Inactivo'}
							</span>
						</div>
					</div>

					{/* Preview de imagen */}
					<div className='border rounded-lg flex justify-center items-center'>
						{formData.imageUrl ? (
							<img
								src={formData.imageUrl}
								alt={formData.name}
								className='max-h-64 object-contain rounded-lg'
							/>
						) : (
							<p className='text-gray-400'>Sin imagen</p>
						)}
					</div>

					{/* Botones */}
					<div className='col-span-2 flex justify-between mt-6'>
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

export default EditProductModal;
