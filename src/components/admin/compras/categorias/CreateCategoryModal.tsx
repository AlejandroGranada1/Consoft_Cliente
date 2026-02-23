'use client';
import { X, Tag, FileText, Save, Layers, AlertCircle } from 'lucide-react';
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
	const [isPending, setIsPending] = useState(false);

	/* 🔹 LIMPIAR AL CERRAR (MISMO PATRÓN) */
	useEffect(() => {
		if (!isOpen) {
			setCategoryData(initialState);
			setIsPending(false);
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

		setIsPending(true);

		try {
			const confirm = await createElement(
				'categoría',
				'/api/categories',
				categoryData,
				updateList
			);

			if (confirm) {
				Swal.fire({
					icon: 'success',
					title: 'Categoría creada',
					text: 'La categoría se ha agregado correctamente',
					timer: 1500,
					showConfirmButton: false
				});
				
				if (updateList) await updateList();
				onClose();
				setCategoryData(initialState);
			}
		} catch (error) {
			console.error('Error al crear categoría:', error);
			Swal.fire('Error', 'No se pudo crear la categoría', 'error');
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
						<Layers size={20} /> Crear Categoría
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

					{/* Información adicional (productos) - solo informativo */}
					<div className='border rounded-lg p-4 bg-gray-50'>
						<h3 className='font-semibold mb-3 flex items-center gap-2'>
							<Layers size={16} />
							Información
						</h3>
						<div className='bg-white border rounded-md p-4'>
							<p className='text-sm text-gray-600 flex items-center gap-2'>
								<AlertCircle size={14} className='text-gray-400' />
								Los productos se pueden asignar a esta categoría después de crearla
							</p>
						</div>
					</div>

					{/* Resumen */}
					{categoryData.name && categoryData.description && (
						<div className='p-4 bg-gray-50 rounded-lg border'>
							<div className='flex justify-between items-center'>
								<div>
									<span className='font-semibold text-sm'>Resumen:</span>
									<p className='text-xs text-gray-600 mt-1'>
										{categoryData.name}
									</p>
									<p className='text-xs text-gray-600'>
										{categoryData.description.substring(0, 50)}
										{categoryData.description.length > 50 ? '...' : ''}
									</p>
								</div>
								<div className='text-right'>
									<span className='text-xs font-medium text-brown bg-brown/10 px-3 py-1 rounded-full'>
										Nueva categoría
									</span>
								</div>
							</div>
						</div>
					)}

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
							disabled={isPending || !categoryData.name.trim() || !categoryData.description?.trim()}
							className={`px-6 py-2 border border-brown rounded-md transition-colors flex items-center gap-2 ${
								isPending || !categoryData.name.trim() || !categoryData.description?.trim()
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
									Crear Categoría
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default CreateCategoryModal;