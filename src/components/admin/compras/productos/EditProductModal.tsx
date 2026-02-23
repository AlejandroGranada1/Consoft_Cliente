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
	AlertCircle,
	RefreshCw
} from 'lucide-react';
import { DefaultModalProps, Category, Product } from '@/lib/types';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '@/components/Global/axios';
import { updateElement } from '../../global/alerts';

const initialState = {
	_id: '',
	name: '',
	description: '',
	category: '',
	imageUrl: '',
	status: true,
	imageFile: undefined as File | undefined,
};

function EditProductModal({
	isOpen,
	onClose,
	extraProps,
	updateList,
}: DefaultModalProps<Product>) {
	const [formData, setFormData] = useState(initialState);
	const [categories, setCategories] = useState<Category[]>([]);
	const [isPending, setIsPending] = useState(false);
	const [isLoadingCategories, setIsLoadingCategories] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);

	/* 🔹 Prellenar datos */
	useEffect(() => {
		if (extraProps && isOpen) {
			setFormData({
				_id: extraProps._id!,
				name: extraProps.name,
				description: extraProps.description || '',
				category: extraProps.category?._id || '',
				imageUrl: extraProps.imageUrl || '',
				status: extraProps.status,
				imageFile: undefined,
			});
			setHasChanges(false);
		}
	}, [extraProps, isOpen]);

	/* 🔹 Limpiar modal al cerrar */
	useEffect(() => {
		if (!isOpen) {
			setFormData(initialState);
			setIsPending(false);
			setHasChanges(false);
		}
	}, [isOpen]);

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

	// Detectar cambios
	useEffect(() => {
		if (!extraProps || !formData._id) return;
		
		const changed = 
			formData.name !== extraProps.name ||
			formData.description !== extraProps.description ||
			formData.category !== extraProps.category?._id ||
			formData.status !== extraProps.status ||
			formData.imageFile !== undefined;
		
		setHasChanges(changed);
	}, [formData, extraProps]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value, type } = e.target as HTMLInputElement;
		const checked = (e.target as HTMLInputElement).checked;

		setFormData((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFormData((prev) => ({
				...prev,
				imageFile: file,
				imageUrl: URL.createObjectURL(file),
			}));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		/* 🔹 VALIDACIONES (igual patrón) */
		if (!formData.name.trim() || !formData.description.trim()) {
			return Swal.fire(
				'Campos incompletos',
				'Nombre y descripción son obligatorios',
				'warning'
			);
		}

		if (!formData.category) {
			return Swal.fire(
				'Categoría requerida',
				'Debe seleccionar una categoría',
				'warning'
			);
		}

		setIsPending(true);

		try {
			const confirm = await updateElement(
				'Producto',
				`/api/products/${formData._id}`,
				formData,
				updateList
			);

			if (confirm) {
				Swal.fire({
					icon: 'success',
					title: 'Producto actualizado',
					text: 'Los cambios han sido guardados correctamente',
					timer: 1500,
					showConfirmButton: false
				});
				
				onClose();
				setFormData(initialState);
			}
		} catch (err) {
			console.error('Error al actualizar producto', err);
			Swal.fire('Error', 'No se pudo actualizar el producto', 'error');
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
						<Package size={20} /> Editar Producto
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
								id='category'
								name='category'
								value={formData.category}
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
								Imagen
							</h3>
							<label className='flex items-center gap-3 border border-dashed border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:border-brown transition bg-white'>
								<ImagePlus size={18} className='text-gray-400' />
								<span className='text-sm text-gray-600 truncate'>
									{formData.imageFile ? formData.imageFile.name : 'Seleccionar nueva imagen (opcional)'}
								</span>
								<input
									id='image'
									type='file'
									accept='image/*'
									onChange={handleFileChange}
									className='hidden'
								/>
							</label>
							{!formData.imageFile && formData.imageUrl && (
								<p className='text-xs text-gray-500 mt-2 flex items-center gap-1'>
									<RefreshCw size={12} />
									Se mantendrá la imagen actual si no seleccionas una nueva
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
								onClick={() => setFormData((prev) => ({ ...prev, status: !prev.status }))}
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
									{formData.imageFile ? 'Nueva imagen seleccionada' : 'Imagen actual del producto'}
								</p>
								{formData.imageFile && (
									<p className='text-xs text-green-600 text-center'>
										✓ Se reemplazará al guardar
									</p>
								)}
								{formData.name && (
									<p className='text-xs text-gray-600 text-center font-medium'>
										{formData.name}
									</p>
								)}
							</div>
						) : (
							<div className='flex flex-col items-center justify-center h-64 text-gray-300 border-2 border-dashed border-gray-200 rounded-lg w-full'>
								<ImagePlus size={48} strokeWidth={1} />
								<p className='text-sm mt-2'>Sin imagen</p>
								<p className='text-xs text-center mt-1 max-w-[200px]'>
									Selecciona una imagen para ver la vista previa
								</p>
							</div>
						)}
					</div>

					{/* Indicador de cambios sin guardar */}
					{hasChanges && (
						<div className='col-span-2 p-4 bg-yellow-50 rounded-lg border border-yellow-200'>
							<div className='flex items-start gap-2'>
								<AlertCircle size={16} className='text-yellow-600 shrink-0 mt-0.5' />
								<div>
									<span className='font-semibold text-sm text-yellow-800'>Cambios sin guardar</span>
									<p className='text-xs text-yellow-700 mt-1'>
										Hay modificaciones que no se han guardado
									</p>
								</div>
							</div>
						</div>
					)}

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
							disabled={isPending || !formData.name.trim() || !formData.description.trim() || !formData.category || !hasChanges}
							className={`px-6 py-2 border border-brown rounded-md transition-colors flex items-center gap-2 ${
								isPending || !formData.name.trim() || !formData.description.trim() || !formData.category || !hasChanges
									? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500'
									: 'text-brown hover:bg-brown hover:text-white'
							}`}>
							{isPending ? (
								<>
									<span className='animate-spin rounded-full h-4 w-4 border-b-2 border-current'></span>
									Guardando...
								</>
							) : (
								<>
									<Save size={16} />
									Guardar Cambios
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default EditProductModal;