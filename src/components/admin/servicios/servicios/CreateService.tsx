'use client';
import { X, ImagePlus, Tag, FileText } from 'lucide-react';
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
		if (!isOpen) { setServiceData(initialState); setImageFile(null); }
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
			Swal.fire({ icon: 'success', title: 'Servicio creado', timer: 1500, showConfirmButton: false });
			setServiceData(initialState);
			setImageFile(null);
			onClose();
		} catch {
			Swal.fire('Error', 'No se pudo crear el servicio', 'error');
		}
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'>
			<div className='bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col'>

				{/* Header */}
				<div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
					<h1 className='text-lg font-semibold text-gray-800'>Agregar Servicio</h1>
					<button onClick={onClose} className='p-2 rounded-full hover:bg-gray-100 text-gray-500 transition'>
						<X size={18} />
					</button>
				</div>

				{/* Body */}
				<div className='grid grid-cols-1 md:grid-cols-2 flex-1'>
					<form onSubmit={handleSubmit} className='p-6 space-y-4'>

						<div className='border border-gray-100 rounded-xl p-4 bg-gray-50'>
							<h3 className='text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2'>
								<Tag size={14} /> Nombre
							</h3>
							<input
								name='name' type='text' value={serviceData.name} onChange={handleChange}
								placeholder='Ej: Reparación de muebles'
								className='w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5A2B] focus:ring-1 focus:ring-[#8B5A2B] transition'
							/>
						</div>

						<div className='border border-gray-100 rounded-xl p-4 bg-gray-50'>
							<h3 className='text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2'>
								<FileText size={14} /> Descripción
							</h3>
							<input
								name='description' type='text' value={serviceData.description} onChange={handleChange}
								placeholder='Breve descripción del servicio'
								className='w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5A2B] focus:ring-1 focus:ring-[#8B5A2B] transition'
							/>
						</div>

						<div className='border border-gray-100 rounded-xl p-4 bg-gray-50'>
							<h3 className='text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2'>
								<ImagePlus size={14} /> Imagen
							</h3>
							<label className='flex items-center gap-3 bg-white border border-dashed border-gray-300 rounded-lg px-4 py-2.5 cursor-pointer hover:border-[#8B5A2B] transition'>
								<ImagePlus size={16} className='text-gray-400 shrink-0' />
								<span className='text-sm text-gray-500 truncate'>
									{imageFile ? imageFile.name : 'Seleccionar imagen'}
								</span>
								<input name='imageUrl' type='file' accept='image/*' onChange={handleChange} className='hidden' />
							</label>
						</div>

						<div className='border border-gray-100 rounded-xl p-4 bg-gray-50'>
							<h3 className='text-xs font-medium text-gray-500 uppercase tracking-wider mb-3'>Estado</h3>
							<button
								type='button'
								onClick={() => setServiceData((prev) => ({ ...prev, status: !prev.status }))}
								className='flex items-center gap-3'>
								<div className={`relative w-11 h-6 rounded-full transition-colors ${serviceData.status ? 'bg-green-500' : 'bg-gray-300'}`}>
									<span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${serviceData.status ? 'translate-x-5' : ''}`} />
								</div>
								<span className={`text-sm font-medium ${serviceData.status ? 'text-green-600' : 'text-gray-400'}`}>
									{serviceData.status ? 'Activo' : 'Inactivo'}
								</span>
							</button>
						</div>
					</form>

					{/* Preview */}
					<div className='bg-gray-50 border-l border-gray-100 flex flex-col items-center justify-center p-6'>
						{serviceData.imageUrl ? (
							<>
								<img src={serviceData.imageUrl} alt='Preview' className='w-full max-h-56 object-contain rounded-xl shadow' />
								<p className='text-xs text-gray-400 mt-3 flex items-center gap-1'>
									<ImagePlus size={12} /> Vista previa
								</p>
							</>
						) : (
							<div className='flex flex-col items-center gap-2 text-gray-300'>
								<ImagePlus size={48} />
								<p className='text-sm'>Sin imagen seleccionada</p>
							</div>
						)}
					</div>
				</div>

				{/* Footer */}
				<div className='px-6 py-4 border-t border-gray-100 flex justify-between'>
					<button type='button' onClick={onClose}
						className='px-5 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition'>
						Cancelar
					</button>
					<button type='submit' form='create-service-form' onClick={handleSubmit as any} disabled={addService.isPending}
						className='px-5 py-2 rounded-lg bg-[#8B5A2B] text-white text-sm hover:bg-[#6d4420] transition disabled:opacity-50'>
						{addService.isPending ? 'Guardando...' : 'Crear servicio'}
					</button>
				</div>
			</div>
		</div>
	);
}

export default CreateServiceModal;