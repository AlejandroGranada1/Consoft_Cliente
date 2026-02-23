'use client';
import { 
	X, 
	Package, 
	Tag, 
	FileText, 
	ImagePlus, 
	FolderTree, 
	ToggleLeft, 
	Save,
	Eye,
	AlertCircle 
} from 'lucide-react';
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
	const [isPending, setIsPending] = useState(false);
	const [isLoadingCategories, setIsLoadingCategories] = useState(false);

	/* 🔹 Cargar categorías */
	useEffect(() => {
		const fetchCategories = async () => {
			setIsLoadingCategories(true);
			try {
				const res = await api.get('/api/categories');
				setCategories(res.data.categories);
			} catch (err) {
				console.error('Error al cargar categorías', err);
				Swal.fire('Error', 'No se pudieron cargar las categorías', 'error');
			} finally {
				setIsLoadingCategories(false);
			}
		};

		if (isOpen) fetchCategories();
	}, [isOpen]);

	/* 🔹 Limpiar modal al cerrar */
	useEffect(() => {
		if (!isOpen) {
			setFormData(initialState);
			setIsPending(false);
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

		setIsPending(true);

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
				Swal.fire({
					icon: 'success',
					title: 'Producto creado',
					text: 'El producto se ha agregado correctamente',
					timer: 1500,
					showConfirmButton: false
				});
				
				updateList && updateList();
				onClose();
				setFormData(initialState);
			}
		} catch (err) {
			console.error('Error al crear producto', err);
			Swal.fire('Error', 'No se pudo crear el producto', 'error');
		} finally {
			setIsPending(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
			<div className='modal-frame w-full max-w-3xl flex flex-col max-h-[92vh]'>
				
				<header className='sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-xs'>
					<button
						onClick={onClose}
						className='absolute top-0 left-0 p-5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors'>
						<X size={20} />
					</button>
					<h1 className='text-2xl font-bold text-center flex items-center justify-center gap-2'>
						<Package size={20} /> Crear Producto
					</h1>
				</header>

				<form onSubmit={handleSubmit} className='grid grid-cols-2 gap-6 p-6 overflow-y-auto'>
					
					{/* Columna izquierda - Formulario */}
					<div className='space-y-5'>
						
						{/* Nombre */}
						<div className='border rounded-lg p-4 bg-gray-50'>
							<h3 className='font-semibold mb-3 flex items-center gap-2'>
								<Tag size={16} />
								Nombre *
							</h3>
							<input
								id='name'
								name='name'
								type='text'
								placeholder='Ej: Mesa de comedor'
								value={formData.name}
								onChange={handleChange}
								className='w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown bg-white'
								required
							/>
						</div>

						{/* Categoría */}
						<div className='border rounded-lg p-4 bg-gray-50'>
							<h3 className='font-semibold mb-3 flex items-center gap-2'>
								<FolderTree size={16} />
								Categoría *
							</h3>
							<select
								name='category'
								id='category'
								value={formData.category?._id || ''}
								onChange={handleChange}
								className='w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown bg-white'
								disabled={isLoadingCategories}
								required>
								<option value=''>
									{isLoadingCategories ? 'Cargando categorías...' : 'Seleccione una categoría'}
								</option>
								{categories.map((c) => (
									<option key={c._id} value={c._id}>
										{c.name}
									</option>
								))}
							</select>
						</div>

						{/* Descripción */}
						<div className='border rounded-lg p-4 bg-gray-50'>
							<h3 className='font-semibold mb-3 flex items-center gap-2'>
								<FileText size={16} />
								Descripción *
							</h3>
							<input
								id='description'
								name='description'
								type='text'
								placeholder='Descripción del producto'
								value={formData.description}
								onChange={handleChange}
								className='w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown bg-white'
								required
							/>
						</div>

						{/* Imagen */}
						<div className='border rounded-lg p-4 bg-gray-50'>
							<h3 className='font-semibold mb-3 flex items-center gap-2'>
								<ImagePlus size={16} />
								Imagen *
							</h3>
							<label className='flex items-center gap-3 border border-dashed border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:border-brown transition bg-white'>
								<ImagePlus size={18} className='text-gray-400' />
								<span className='text-sm text-gray-600 truncate'>
									{formData.imageFile ? formData.imageFile.name : 'Seleccionar imagen (JPG, PNG)'}
								</span>
								<input
									id='image'
									type='file'
									accept='image/*'
									onChange={handleFileChange}
									className='hidden'
								/>
							</label>
							{!formData.imageFile && (
								<p className='text-xs text-yellow-600 mt-2 flex items-center gap-1'>
									<AlertCircle size={12} />
									La imagen es obligatoria
								</p>
							)}
						</div>

						{/* Estado */}
						<div className='border rounded-lg p-4 bg-gray-50'>
							<h3 className='font-semibold mb-3 flex items-center gap-2'>
								<ToggleLeft size={16} />
								Estado
							</h3>
							<button
								type='button'
								onClick={() => setFormData((prev: any) => ({ ...prev, status: !prev.status }))}
								className='flex items-center gap-3'>
								<div className={`relative w-11 h-6 rounded-full transition-colors ${formData.status ? 'bg-green-500' : 'bg-gray-300'}`}>
									<span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${formData.status ? 'translate-x-5' : ''}`} />
								</div>
								<span className={`text-sm font-medium ${formData.status ? 'text-green-600' : 'text-gray-500'}`}>
									{formData.status ? 'Activo' : 'Inactivo'}
								</span>
							</button>
							<p className='text-xs text-gray-500 mt-2'>
								Los productos inactivos no se muestran en el catálogo
							</p>
						</div>
					</div>

					{/* Columna derecha - Preview */}
					<div className='bg-gray-50 border rounded-lg p-6 flex flex-col items-center justify-start'>
						<h3 className='font-semibold mb-4 flex items-center gap-2 self-start'>
							<Eye size={16} />
							Vista previa
						</h3>
						
						{formData.imageUrl ? (
							<div className='w-full space-y-3'>
								<div className='border rounded-lg overflow-hidden bg-white p-2 shadow-sm'>
									<img
										src={formData.imageUrl}
										alt={formData.name}
										className='w-full max-h-64 object-contain rounded-md'
									/>
								</div>
								<p className='text-xs text-gray-500 text-center'>
									{formData.name || 'Producto sin nombre'}
								</p>
								{formData.category?.name && (
									<p className='text-xs text-gray-400 text-center'>
										Categoría: {formData.category.name}
									</p>
								)}
							</div>
						) : (
							<div className='flex flex-col items-center justify-center h-64 text-gray-300 border-2 border-dashed border-gray-200 rounded-lg w-full'>
								<ImagePlus size={48} strokeWidth={1} />
								<p className='text-sm mt-2'>Sin imagen</p>
								<p className='text-xs text-center mt-1 max-w-[200px]'>
									La imagen se mostrará aquí cuando la selecciones
								</p>
							</div>
						)}
					</div>

					{/* Botones - ocupan ambas columnas */}
					<div className='col-span-2 flex justify-between pt-4 border-t'>
						<button
							type='button'
							onClick={onClose}
							className='px-6 py-2 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-100 transition-colors'>
							Cancelar
						</button>
						<button
							type='submit'
							disabled={isPending || !formData.name.trim() || !formData.description.trim() || !formData.category?._id || !formData.imageFile}
							className={`px-6 py-2 border border-brown rounded-md transition-colors flex items-center gap-2 ${
								isPending || !formData.name.trim() || !formData.description.trim() || !formData.category?._id || !formData.imageFile
									? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500'
									: 'text-brown hover:bg-brown hover:text-white'
							}`}>
							{isPending ? (
								<>
									<span className='animate-spin rounded-full h-4 w-4 border-b-2 border-current'></span>
									Creando...
								</>
							) : (
								<>
									<Save size={16} />
									Crear Producto
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default CreateProductModal;