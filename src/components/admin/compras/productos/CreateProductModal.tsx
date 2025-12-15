'use client';
import { X } from 'lucide-react';
import { DefaultModalProps, Category, Product } from '@/lib/types';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

import api from '@/components/Global/axios';
import { createElement } from '../../global/alerts';

const initialState = {
	_id: undefined,
	name: '',
	description: '',
	category: {
		_id: '',
		name: '',
		description: '',
		products: [],
	},
	imageUrl: '',
	imageFile: null as File | null,
	status: true,
};

function CreateProductModal({
	isOpen,
	onClose,
	updateList,
}: DefaultModalProps<Product> & { updateList?: () => void }) {
	const [formData, setFormData] = useState<any>(initialState);
	const [categories, setCategories] = useState<Category[]>([]);

	/* 🔹 Cargar categorías */
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

	/* 🔹 Limpiar modal al cerrar */
	useEffect(() => {
		if (!isOpen) {
			setFormData(initialState);
		}
	}, [isOpen]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;

		if (name === 'category') {
			const selected = categories.find((c) => c._id === value);
			if (selected) {
				setFormData((prev: any) => ({ ...prev, category: selected }));
			}
			return;
		}

		setFormData((prev: any) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFormData((prev: any) => ({
				...prev,
				imageFile: file,
				imageUrl: URL.createObjectURL(file),
			}));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		/* 🔹 VALIDACIONES */
		if (!formData.name.trim() || !formData.description.trim()) {
			return Swal.fire(
				'Campos incompletos',
				'Nombre y descripción son obligatorios',
				'warning'
			);
		}

		if (!formData.category?._id) {
			return Swal.fire(
				'Categoría requerida',
				'Debe seleccionar una categoría',
				'warning'
			);
		}

		if (!formData.imageFile) {
			return Swal.fire(
				'Imagen requerida',
				'Debe seleccionar una imagen para el producto',
				'warning'
			);
		}

		try {
			const fd = new FormData();
			fd.append('name', formData.name);
			fd.append('description', formData.description);
			fd.append('category', formData.category._id);
			fd.append('status', String(formData.status));
			fd.append('image', formData.imageFile);

			const confirm = await createElement(
				'Producto',
				'/api/products',
				fd,
				updateList
			);

			if (confirm) {
				updateList && updateList();
				onClose();
				setFormData(initialState);
			}
		} catch (err) {
			console.error('Error al crear producto', err);
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
						<X />
					</button>
					<h1 className='text-xl font-semibold mb-4'>AGREGAR PRODUCTO</h1>
				</header>

				<form onSubmit={handleSubmit} className='grid grid-cols-2 gap-6'>
					<div className='flex flex-col gap-4'>
						{/* Nombre */}
						<div className='flex flex-col'>
							<label htmlFor='name'>Producto</label>
							<input
								id='name'
								name='name'
								type='text'
								placeholder='Nombre del producto'
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
								value={formData.category?._id || ''}
								onChange={handleChange}
								className='border px-3 py-2 rounded-md'>
								<option value=''>Seleccione una categoría</option>
								{categories.map((c) => (
									<option key={c._id} value={c._id}>
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
								placeholder='Descripción del producto'
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
								type='file'
								accept='image/*'
								onChange={handleFileChange}
								className='border px-3 py-2 rounded-md'
							/>
						</div>

						{/* Estado */}
						<div className='flex items-center gap-3 mt-2'>
							<input
								type='checkbox'
								checked={formData.status}
								onChange={(e) =>
									setFormData((prev: any) => ({
										...prev,
										status: e.target.checked,
									}))
								}
								className='h-4 w-4 cursor-pointer'
							/>
							<span
								className={
									formData.status ? 'text-green-600' : 'text-red-600'
								}>
								{formData.status ? 'Activo' : 'Inactivo'}
							</span>
						</div>
					</div>

					{/* Preview */}
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

export default CreateProductModal;
