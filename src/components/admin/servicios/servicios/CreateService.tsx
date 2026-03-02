'use client';
import { X, ImagePlus, Tag, FileText, Save, Eye, AlertCircle, Wrench } from 'lucide-react';
import { DefaultModalProps, Service } from '@/lib/types';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useAddService } from '@/hooks/apiHooks';
import { createPortal } from 'react-dom';

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
		if (!serviceData.name.trim() || !serviceData.description?.trim()) {
			return Swal.fire({
				title: 'Campos incompletos',
				text: 'Todos los campos son obligatorios',
				icon: 'warning',
				background: '#1e1e1c',
				color: '#fff',
			});
		}
		if (!imageFile) {
			return Swal.fire({
				title: 'Imagen requerida',
				text: 'Debes seleccionar una imagen',
				icon: 'warning',
				background: '#1e1e1c',
				color: '#fff',
			});
		}

		const fd = new FormData();
		fd.append('name', serviceData.name);
		fd.append('description', serviceData.description ?? '');
		fd.append('status', String(serviceData.status));
		fd.append('image', imageFile);

		try {
			await addService.mutateAsync(fd);
			Swal.fire({
				toast: true,
				animation: false,
				timerProgressBar: true,
				showConfirmButton: false,
				title: 'Servicio creado exitosamente',
				icon: 'success',
				position: 'top-right',
				timer: 1500,
				background: '#1e1e1c',
				color: '#fff',
			});
			setServiceData(initialState);
			setImageFile(null);
			onClose();
		} catch {
			Swal.fire({
				title: 'Error',
				text: 'No se pudo crear el servicio',
				icon: 'error',
				background: '#1e1e1c',
				color: '#fff',
			});
		}
	};

	if (!isOpen) return null;

	return createPortal(
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-4'
			style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>

			<div className="w-full max-w-3xl rounded-2xl border border-white/10
				shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col max-h-[90vh]"
				style={{ background: 'rgba(30,30,28,0.95)', backdropFilter: 'blur(20px)' }}>

				{/* Header */}
				<header className="relative px-6 py-5 border-b border-white/10">
					<button
						onClick={onClose}
						className="absolute right-4 top-1/2 -translate-y-1/2
							p-2 rounded-lg text-white/40 hover:text-white/70
							hover:bg-white/5 transition-all duration-200">
						<X size={18} />
					</button>
					<h2 className="text-lg font-medium text-white text-center flex items-center justify-center gap-2">
						<Wrench size={18} className="text-[#C8A882]" />
						Crear nuevo servicio
					</h2>
				</header>

				{/* Body - Grid de 2 columnas */}
				<div className="grid grid-cols-1 md:grid-cols-2 flex-1 overflow-y-auto">

					{/* Formulario */}
					<form id="create-service-form" onSubmit={handleSubmit} className="p-6 space-y-5">

						{/* Nombre */}
						<div className="space-y-2">
							<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
								Nombre del servicio *
							</label>
							<input
								name="name"
								type="text"
								value={serviceData.name}
								onChange={handleChange}
								placeholder="Ej: Reparación de muebles"
								className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
									text-sm text-white placeholder:text-white/30
									focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
									transition-all duration-200"
								required
							/>
						</div>

						{/* Descripción */}
						<div className="space-y-2">
							<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
								Descripción *
							</label>
							<input
								name="description"
								type="text"
								value={serviceData.description}
								onChange={handleChange}
								placeholder="Breve descripción del servicio"
								className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
									text-sm text-white placeholder:text-white/30
									focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
									transition-all duration-200"
								required
							/>
						</div>

						{/* Imagen */}
						<div className="space-y-2">
							<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
								Imagen del servicio *
							</label>
							<label className="flex items-center gap-3 border border-dashed border-white/15 rounded-xl px-4 py-3 cursor-pointer hover:border-[#C8A882]/50 transition bg-white/5">
								<ImagePlus size={18} className="text-white/40" />
								<span className="text-sm text-white/60 truncate">
									{imageFile ? imageFile.name : 'Seleccionar imagen (JPG, PNG)'}
								</span>
								<input
									name="imageUrl"
									type="file"
									accept="image/*"
									onChange={handleChange}
									className="hidden"
								/>
							</label>
							{!imageFile && (
								<p className="text-xs text-yellow-400/70 mt-2 flex items-center gap-1">
									<AlertCircle size={12} />
									La imagen es obligatoria
								</p>
							)}
						</div>

						{/* Estado */}
						<div className="space-y-2">
							<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
								Estado
							</label>
							<button
								type="button"
								onClick={() => setServiceData((prev) => ({ ...prev, status: !prev.status }))}
								className="flex items-center gap-3">
								<div className={`relative w-11 h-6 rounded-full transition-colors ${serviceData.status ? 'bg-green-500/50' : 'bg-white/20'}`}>
									<span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${serviceData.status ? 'translate-x-5' : ''}`} />
								</div>
								<span className={`text-sm font-medium ${serviceData.status ? 'text-green-400' : 'text-white/40'}`}>
									{serviceData.status ? 'Activo' : 'Inactivo'}
								</span>
							</button>
							<p className="text-xs text-white/30 mt-2">
								Los servicios inactivos no se mostrarán en el catálogo público
							</p>
						</div>

						{/* Resumen */}
						{serviceData.name && serviceData.description && (
							<div className="p-4 rounded-xl border border-white/10 bg-white/5">
								<div className="flex justify-between items-center">
									<div>
										<p className="text-xs font-medium text-white/70">Resumen</p>
										<p className="text-xs text-white/40 mt-1">
											{serviceData.name}
										</p>
										<p className="text-xs text-white/40">
											{serviceData.description.substring(0, 50)}
											{serviceData.description.length > 50 ? '...' : ''}
										</p>
									</div>
									<div className="text-right">
										<span className={`text-[10px] px-2 py-1 rounded-full ${serviceData.status
												? 'bg-green-500/10 text-green-400 border border-green-500/20'
												: 'bg-white/10 text-white/40 border border-white/20'
											}`}>
											{serviceData.status ? 'Activo' : 'Inactivo'}
										</span>
									</div>
								</div>
							</div>
						)}
					</form>

					{/* Preview de imagen */}
					<div className="bg-white/5 border-l border-white/10 p-6 flex flex-col items-center justify-start">
						<h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2 self-start">
							<Eye size={16} className="text-[#C8A882]" />
							Vista previa
						</h3>

						{serviceData.imageUrl ? (
							<div className="w-full space-y-3">
								<div className="rounded-xl border border-white/10 overflow-hidden bg-white/5 p-2">
									<img
										src={serviceData.imageUrl}
										alt="Preview"
										className="w-full max-h-64 object-contain rounded-lg"
									/>
								</div>
								<p className="text-xs text-white/30 text-center">
									La imagen se mostrará así en el catálogo
								</p>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center h-64 text-white/20 border-2 border-dashed border-white/10 rounded-xl w-full">
								<ImagePlus size={48} strokeWidth={1} />
								<p className="text-sm mt-2 text-white/30">Sin imagen seleccionada</p>
								<p className="text-xs text-center mt-1 max-w-[200px] text-white/20">
									Sube una imagen para ver la vista previa
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Footer */}
				<div className="sticky bottom-0 px-6 py-4 border-t border-white/10 flex justify-end gap-3"
					style={{ background: 'rgba(30,30,28,0.95)', backdropFilter: 'blur(20px)' }}>
					<button
						type="button"
						onClick={onClose}
						className="px-5 py-2.5 rounded-lg
							border border-white/15 bg-white/5
							text-white/70 text-sm
							hover:bg-white/10 hover:text-white
							transition-all duration-200">
						Cancelar
					</button>
					<button
						type="submit"
						form="create-service-form"
						disabled={addService.isPending || !serviceData.name.trim() || !serviceData.description?.trim() || !imageFile}
						className="px-5 py-2.5 rounded-lg
							bg-[#8B5E3C] hover:bg-[#6F452A]
							text-white text-sm font-medium
							shadow-lg shadow-[#8B5E3C]/20
							disabled:opacity-50 disabled:cursor-not-allowed
							flex items-center gap-2
							transition-all duration-200">
						{addService.isPending ? (
							<>
								<span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
								Guardando...
							</>
						) : (
							<>
								<Save size={14} />
								Crear Servicio
							</>
						)}
					</button>
				</div>
			</div>
		</div>,
		document.body
	);
}

export default CreateServiceModal;