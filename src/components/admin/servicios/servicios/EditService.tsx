'use client';
import { X, ImagePlus, Tag, FileText, Save, Eye, AlertCircle, ToggleLeft } from 'lucide-react';
import { DefaultModalProps, Service } from '@/lib/types';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useUpdateService } from '@/hooks/apiHooks';

const initialState: Service = { _id: '', name: '', description: '', imageUrl: '', status: true };

function EditServiceModal({ isOpen, onClose, extraProps }: DefaultModalProps<Service>) {
	const [serviceData, setServiceData] = useState<Service>(initialState);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const updateService = useUpdateService();

	useEffect(() => {
		if (isOpen && extraProps) setServiceData(extraProps);
		if (!isOpen) { 
			setServiceData(initialState); 
			setImageFile(null); 
		}
	}, [isOpen, extraProps]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, files } = e.target;
		if (name === 'imageUrl' && files?.[0]) {
			setImageFile(files[0]);
			setServiceData((prev) => ({ ...prev, imageUrl: URL.createObjectURL(files[0]) }));
		} else {
			setServiceData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!serviceData.name.trim() || !serviceData.description?.trim())
			return Swal.fire('Campos incompletos', 'Nombre y descripción son obligatorios', 'warning');
		if (!serviceData._id)
			return Swal.fire('Error', 'No se pudo identificar el servicio', 'error');

		const fd = new FormData();
		fd.append('name', serviceData.name);
		fd.append('description', serviceData.description ?? '');
		fd.append('status', String(serviceData.status));
		if (imageFile) fd.append('image', imageFile);

		try {
			await updateService.mutateAsync({ _id: serviceData._id, formData: fd });
			Swal.fire({ 
				icon: 'success', 
				title: 'Servicio actualizado', 
				text: 'Los cambios han sido guardados correctamente',
				timer: 1500, 
				showConfirmButton: false 
			});
			onClose();
		} catch {
			Swal.fire('Error', 'No se pudo actualizar el servicio', 'error');
		}
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
			<div className='modal-frame w-full max-w-3xl flex flex-col max-h-[92vh]'>
				
				{/* Header */}
				<header className='sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-xs'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-3'>
							<h1 className='text-2xl font-bold flex items-center gap-2'>
								<Tag size={20} /> Editar Servicio
							</h1>
							<span className={`px-3 py-1 rounded-full text-xs font-medium ${
								serviceData.status 
									? 'bg-green-100 text-green-700' 
									: 'bg-red-100 text-red-700'
							}`}>
								{serviceData.status ? 'Activo' : 'Inactivo'}
							</span>
						</div>
						<button
							onClick={onClose}
							className='p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors'>
							<X size={18} />
						</button>
					</div>
				</header>

				{/* Body - Grid de 2 columnas */}
				<div className='grid grid-cols-1 md:grid-cols-2 flex-1 overflow-y-auto'>
					
					{/* Formulario */}
					<form id='edit-service-form' onSubmit={handleSubmit} className='p-6 space-y-5'>

						{/* Nombre */}
						<div className='border rounded-lg p-4 bg-gray-50'>
							<h3 className='font-semibold mb-3 flex items-center gap-2'>
								<Tag size={16} />
								Nombre *
							</h3>
							<input
								name='name'
								type='text'
								value={serviceData.name}
								onChange={handleChange}
								placeholder='Ej: Reparación de muebles'
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
								name='description'
								type='text'
								value={serviceData.description}
								onChange={handleChange}
								placeholder='Breve descripción del servicio'
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
									{imageFile ? imageFile.name : 'Seleccionar nueva imagen (opcional)'}
								</span>
								<input
									name='imageUrl'
									type='file'
									accept='image/*'
									onChange={handleChange}
									className='hidden'
								/>
							</label>
							{!imageFile && serviceData.imageUrl && (
								<p className='text-xs text-gray-500 mt-2 flex items-center gap-1'>
									<AlertCircle size={12} />
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
								onClick={() => setServiceData((prev) => ({ ...prev, status: !prev.status }))}
								className='flex items-center gap-3'>
								<div className={`relative w-11 h-6 rounded-full transition-colors ${serviceData.status ? 'bg-green-500' : 'bg-gray-300'}`}>
									<span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${serviceData.status ? 'translate-x-5' : ''}`} />
								</div>
								<span className={`text-sm font-medium ${serviceData.status ? 'text-green-600' : 'text-gray-500'}`}>
									{serviceData.status ? 'Activo' : 'Inactivo'}
								</span>
							</button>
							<p className='text-xs text-gray-500 mt-2'>
								Los servicios inactivos no se mostrarán en el catálogo público
							</p>
						</div>

						{/* Resumen de cambios */}
						{(serviceData.name !== extraProps?.name || 
						  serviceData.description !== extraProps?.description || 
						  serviceData.status !== extraProps?.status ||
						  imageFile) && (
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
					</form>

					{/* Preview de imagen */}
					<div className='bg-gray-50 border-l p-6 flex flex-col items-center justify-start'>
						<h3 className='font-semibold mb-4 flex items-center gap-2 self-start'>
							<Eye size={16} />
							Vista previa
						</h3>
						
						{serviceData.imageUrl ? (
							<div className='w-full space-y-3'>
								<div className='border rounded-lg overflow-hidden bg-white p-2 shadow-sm'>
									<img
										src={serviceData.imageUrl}
										alt='Preview'
										className='w-full max-h-64 object-contain rounded-md'
									/>
								</div>
								<p className='text-xs text-gray-500 text-center'>
									{imageFile ? 'Nueva imagen seleccionada' : 'Imagen actual del servicio'}
								</p>
								{imageFile && (
									<p className='text-xs text-green-600 text-center'>
										✓ Se reemplazará la imagen al guardar
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
				</div>

				{/* Footer */}
				<div className='sticky bottom-0 px-6 py-4 border-t bg-white flex justify-between items-center'>
					<button
						type='button'
						onClick={onClose}
						className='px-6 py-2 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-100 transition-colors'>
						Cancelar
					</button>
					<button
						type='submit'
						form='edit-service-form'
						disabled={updateService.isPending || !serviceData.name.trim() || !serviceData.description?.trim()}
						className={`px-6 py-2 border border-brown rounded-md transition-colors flex items-center gap-2 ${
							updateService.isPending || !serviceData.name.trim() || !serviceData.description?.trim()
								? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500'
								: 'text-brown hover:bg-brown hover:text-white'
						}`}>
						{updateService.isPending ? (
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
			</div>
		</div>
	);
}

export default EditServiceModal;