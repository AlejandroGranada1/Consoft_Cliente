'use client';
import { DefaultModalProps, Category, Product } from '@/lib/types';
import React, { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import api from '@/components/Global/axios';
import { createElement } from '../../global/alerts';

function CreateProductModal({
	isOpen,
	onClose,
	updateList,
}: DefaultModalProps<Product> & { updateList?: () => void }) {
	const [formData, setFormData] = useState<any>({
		_id: undefined,
		name: '',
		description: '',
		category: {
			_id: '',
			name: '',
			description: '',
			products: [],
		},
		imageUrl: '',   // preview
		imageFile: null, // file real que se enviará al backend
		status: true,
	});

	const [categories, setCategories] = useState<Category[]>([]);

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

	// 📌 Manejar cambios de texto/select
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

	// 📌 Manejar archivo (imagen)
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFormData((prev: any) => ({
				...prev,
				imageFile: file,
				imageUrl: URL.createObjectURL(file), // preview
			}));
		}
	};

	// 📌 Guardar producto
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			// Construimos el FormData REAL
			const fd = new FormData();
			fd.append('name', formData.name);
			fd.append('description', formData.description);
			fd.append('category', formData.category._id);
			fd.append('status', String(formData.status));

			if (formData.imageFile) {
				fd.append('image', formData.imageFile); // <-- así se envía la imagen real
			}

			const confirm = await createElement('Producto', '/api/products', fd, updateList);

			if (confirm) {
				updateList && updateList();
				onClose();

				// Reset form
				setFormData({
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
					imageFile: null,
					status: true,
				});
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
						<IoMdClose />
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
								onChange={(e) =>
									setFormData((prev: any) => ({
										...prev,
										status: e.target.checked,
									}))
								}
								className='h-4 w-4 cursor-pointer'
							/>
							<span className={formData.status ? 'text-green-600' : 'text-red-600'}>
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

export default CreateProductModal;
