'use client';
import { X, Tag, FileText, Save, Layers, AlertCircle } from 'lucide-react';
import { DefaultModalProps, Category } from '@/lib/types';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { updateElement } from '../../global/alerts';

const initialState: Category = {
	_id: '',
	name: '',
	description: '',
	products: [],
};

function EditCategoryModal({
	isOpen,
	onClose,
	extraProps,
	updateList,
}: DefaultModalProps<Category>) {
	const [categoryData, setCategoryData] = useState<Category>(initialState);
	const [isPending, setIsPending] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);

	/* 🔹 PRELLENAR / LIMPIAR (MISMO QUE SERVICES) */
	useEffect(() => {
		if (isOpen && extraProps) {
			setCategoryData(extraProps);
			setHasChanges(false);
		}

		if (!isOpen) {
			setCategoryData(initialState);
			setIsPending(false);
			setHasChanges(false);
		}
	}, [isOpen, extraProps]);

	// Detectar cambios
	useEffect(() => {
		if (!extraProps || !categoryData._id) return;
		
		const changed = 
			categoryData.name !== extraProps.name ||
			categoryData.description !== extraProps.description;
		
		setHasChanges(changed);
	}, [categoryData, extraProps]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setCategoryData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		/* 🔹 VALIDACIONES */
		if (!categoryData.name.trim() || !categoryData.description?.trim()) {
			return Swal.fire(
				'Campos incompletos',
				'Nombre y descripción son obligatorios',
				'warning'
			);
		}

		setIsPending(true);

		try {
			await updateElement(
				'Categoría',
				`/api/categories/${categoryData._id}`,
				{
					name: categoryData.name,
					description: categoryData.description,
				},
				updateList
			);

			Swal.fire({
				icon: 'success',
				title: 'Categoría actualizada',
				text: 'Los cambios han sido guardados correctamente',
				timer: 1500,
				showConfirmButton: false
			});

			onClose();
		} catch (error) {
			console.error('Error al actualizar categoría:', error);
			Swal.fire('Error', 'No se pudo actualizar la categoría', 'error');
		} finally {
			setIsPending(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
			<div className='modal-frame w-full max-w-[600px] flex flex-col max-h-[92vh]'>
				
				<header className='sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-xs'>
					<button
						onClick={onClose}
						className='absolute top-0 left-0 p-5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors'>
						<X size={20} />
					</button>
					<h1 className='text-2xl font-bold text-center flex items-center justify-center gap-2'>
						<Layers size={20} /> Editar Categoría
					</h1>
				</header>

				<form onSubmit={handleSubmit} className='space-y-5 p-6 overflow-y-auto'>
					
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
							placeholder='Ej: Muebles de sala'
							value={categoryData.name}
							onChange={handleChange}
							className='w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown bg-white'
							required
						/>
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
							placeholder='Breve descripción de la categoría'
							value={categoryData.description}
							onChange={handleChange}
							className='w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown bg-white'
							required
						/>
					</div>

					{/* Información de productos (solo lectura) */}
					{categoryData.products && categoryData.products.length > 0 && (
						<div className='border rounded-lg p-4 bg-gray-50'>
							<h3 className='font-semibold mb-3 flex items-center gap-2'>
								<Layers size={16} />
								Productos asociados
							</h3>
							<div className='bg-white border rounded-md p-3'>
								<p className='text-sm text-gray-600'>
									Esta categoría tiene <span className='font-bold text-brown'>{categoryData.products.length}</span> producto{categoryData.products.length !== 1 ? 's' : ''} asociado{categoryData.products.length !== 1 ? 's' : ''}.
								</p>
							</div>
						</div>
					)}

					{/* Indicador de cambios sin guardar */}
					{hasChanges && (
						<div className='p-4 bg-yellow-50 rounded-lg border border-yellow-200'>
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

					{/* Resumen */}
					<div className='p-4 bg-gray-50 rounded-lg border'>
						<div className='flex justify-between items-center'>
							<div>
								<span className='font-semibold text-sm'>Resumen:</span>
								<p className='text-xs text-gray-600 mt-1'>
									{categoryData.name}
								</p>
								<p className='text-xs text-gray-600'>
									{categoryData.description?.substring(0, 50)}
									{categoryData.description?.length! > 50 ? '...' : ''}
								</p>
							</div>
							<div className='text-right'>
								<span className='text-xs font-medium text-brown bg-brown/10 px-3 py-1 rounded-full'>
									{categoryData.products?.length || 0} producto{(categoryData.products?.length || 0) !== 1 ? 's' : ''}
								</span>
							</div>
						</div>
					</div>

					{/* Botones */}
					<div className='flex justify-between pt-4 border-t'>
						<button
							type='button'
							onClick={onClose}
							className='px-6 py-2 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-100 transition-colors'>
							Cancelar
						</button>
						<button
							type='submit'
							disabled={isPending || !categoryData.name.trim() || !categoryData.description?.trim() || !hasChanges}
							className={`px-6 py-2 border border-brown rounded-md transition-colors flex items-center gap-2 ${
								isPending || !categoryData.name.trim() || !categoryData.description?.trim() || !hasChanges
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

export default EditCategoryModal;