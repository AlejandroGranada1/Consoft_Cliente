'use client';
import { X, ImagePlus, Tag, FileText, Save, Eye, AlertCircle } from 'lucide-react';
import { DefaultModalProps, Service } from '@/lib/types';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useAddService } from '@/hooks/apiHooks';

const initialState: Service = { _id: undefined, name: '', description: '', imageUrl: '', status: true };

function CreateServiceModal({ isOpen, onClose }: DefaultModalProps<Service>) {
	const [serviceData, setServiceData] = useState<Service>(initialState);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const addService = useAddService();

	useEffect(() => {
		if (!isOpen) { 
			setServiceData(initialState); 
			setImageFile(null); 
		}
	}, [isOpen]);

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
			return Swal.fire('Campos incompletos', 'Todos los campos son obligatorios', 'warning');
		if (!imageFile)
			return Swal.fire('Imagen requerida', 'Debes seleccionar una imagen', 'warning');

		const fd = new FormData();
		fd.append('name', serviceData.name);
		fd.append('description', serviceData.description ?? '');
		fd.append('status', String(serviceData.status));
		fd.append('image', imageFile);

		try {
			await addService.mutateAsync(fd);
			Swal.fire({ 
				icon: 'success', 
				title: 'Servicio creado', 
				text: 'El servicio se ha agregado correctamente',
				timer: 1500, 
				showConfirmButton: false 
			});
			setServiceData(initialState);
			setImageFile(null);
			onClose();
		} catch {
			Swal.fire('Error', 'No se pudo crear el servicio', 'error');
		}
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
			<div className='modal-frame w-full max-w-3xl flex flex-col max-h-[92vh]'>
				
				{/* Header */}
				<header className='sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-xs'>
					<button
						onClick={onClose}
						className='absolute top-0 left-0 p-5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors'>
						<X size={20} />
					</button>
					<h1 className='text-2xl font-bold text-center flex items-center justify-center gap-2'>
						<Tag size={20} /> Crear Servicio
					</h1>
				</header>

				{/* Body - Grid de 2 columnas */}
				<div className='grid grid-cols-1 md:grid-cols-2 flex-1 overflow-y-auto'>
					
					{/* Formulario */}
					<form id='create-service-form' onSubmit={handleSubmit} className='p-6 space-y-5'>

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
								Imagen *
							</h3>
							<label className='flex items-center gap-3 border border-dashed border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:border-brown transition bg-white'>
								<ImagePlus size={18} className='text-gray-400' />
								<span className='text-sm text-gray-600 truncate'>
									{imageFile ? imageFile.name : 'Seleccionar imagen (JPG, PNG)'}
								</span>
								<input
									name='imageUrl'
									type='file'
									accept='image/*'
									onChange={handleChange}
									className='hidden'
								/>
							</label>
							{!imageFile && (
								<p className='text-xs text-yellow-600 mt-2 flex items-center gap-1'>
									<AlertCircle size={12} />
									La imagen es obligatoria
								</p>
							)}
						</div>

						{/* Estado */}
						<div className='border rounded-lg p-4 bg-gray-50'>
							<h3 className='font-semibold mb-3'>Estado</h3>
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

						{/* Resumen */}
						{serviceData.name && serviceData.description && (
							<div className='p-4 bg-gray-50 rounded-lg border'>
								<div className='flex justify-between items-center'>
									<div>
										<span className='font-semibold text-sm'>Resumen:</span>
										<p className='text-xs text-gray-600 mt-1'>
											{serviceData.name}
										</p>
										<p className='text-xs text-gray-600'>
											{serviceData.description.substring(0, 50)}
											{serviceData.description.length > 50 ? '...' : ''}
										</p>
									</div>
									<div className='text-right'>
										<span className={`text-xs px-2 py-1 rounded-full ${
											serviceData.status 
												? 'bg-green-100 text-green-700' 
												: 'bg-gray-100 text-gray-700'
										}`}>
											{serviceData.status ? 'Activo' : 'Inactivo'}
										</span>
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
								<div className='border rounded-lg overflow-hidden bg-white p-2'>
									<img
										src={serviceData.imageUrl}
										alt='Preview'
										className='w-full max-h-64 object-contain rounded-md'
									/>
								</div>
								<p className='text-xs text-gray-500 text-center'>
									La imagen se mostrará así en la página de servicios
								</p>
							</div>
						) : (
							<div className='flex flex-col items-center justify-center h-64 text-gray-300 border-2 border-dashed border-gray-200 rounded-lg w-full'>
								<ImagePlus size={48} strokeWidth={1} />
								<p className='text-sm mt-2'>Sin imagen seleccionada</p>
								<p className='text-xs text-center mt-1 max-w-[200px]'>
									Sube una imagen para ver la vista previa
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
						form='create-service-form'
						disabled={addService.isPending || !serviceData.name.trim() || !serviceData.description?.trim() || !imageFile}
						className={`px-6 py-2 border border-brown rounded-md transition-colors flex items-center gap-2 ${
							addService.isPending || !serviceData.name.trim() || !serviceData.description?.trim() || !imageFile
								? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500'
								: 'text-brown hover:bg-brown hover:text-white'
						}`}>
						{addService.isPending ? (
							<>
								<span className='animate-spin rounded-full h-4 w-4 border-b-2 border-current'></span>
								Guardando...
							</>
						) : (
							<>
								<Save size={16} />
								Crear Servicio
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}

export default CreateServiceModal;