'use client';
import { X, Edit, ImageIcon, FileText, Tag, Wrench, Trash2, Eye, AlertCircle } from 'lucide-react';
import { DefaultModalProps, Service } from '@/lib/types';
import React, { useState } from 'react';
import EditServiceModal from './EditService';
import { useDeleteService } from '@/hooks/apiHooks';
import Swal from 'sweetalert2';

function ServiceDetailsModal({ isOpen, onClose, extraProps }: DefaultModalProps<Service>) {
	const [editModal, setEditModal] = useState(false);
	const deleteService = useDeleteService();

	if (!isOpen || !extraProps) return null;

	const handleDelete = async () => {
		const result = await Swal.fire({
			title: '¿Eliminar servicio?',
			text: `"${extraProps.name}" será eliminado permanentemente`,
			icon: 'warning',
			background: '#1e1e1c',
			color: '#fff',
			showCancelButton: true,
			confirmButtonColor: '#8B5E3C',
			cancelButtonColor: '#4a4a4a',
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar',
		});

		if (!result.isConfirmed) return;

		try {
			await deleteService.mutateAsync(extraProps._id!);
			Swal.fire({
				toast: true,
				animation: false,
				timerProgressBar: true,
				showConfirmButton: false,
				title: 'Servicio eliminado correctamente',
				icon: 'success',
				position: 'top-right',
				timer: 1500,
				background: '#1e1e1c',
				color: '#fff',
			});
			onClose();
		} catch {
			Swal.fire({
				title: 'Error',
				text: 'No se pudo eliminar el servicio',
				icon: 'error',
				background: '#1e1e1c',
				color: '#fff',
			});
		}
	};

	return (
		<>
			<div className='fixed top-18 left-72 inset-0 z-50 flex items-center justify-center p-4'
				style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
				
				<div className="w-full max-w-3xl rounded-2xl border border-white/10
					shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col max-h-[90vh]"
					style={{ background: 'rgba(30,30,28,0.95)', backdropFilter: 'blur(20px)' }}>
					
					{/* Header */}
					<header className="relative px-6 py-5 border-b border-white/10">
						<div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
							<button
								onClick={() => setEditModal(true)}
								className="p-2 rounded-lg text-white/40 hover:text-[#C8A882]
									hover:bg-white/5 transition-all duration-200"
								title="Editar servicio">
								<Edit size={18} />
							</button>
							<button
								onClick={onClose}
								className="p-2 rounded-lg text-white/40 hover:text-white/70
									hover:bg-white/5 transition-all duration-200">
								<X size={18} />
							</button>
						</div>
						<h2 className="text-lg font-medium text-white text-center flex items-center justify-center gap-2">
							<Wrench size={18} className="text-[#C8A882]" />
							Detalles del servicio
						</h2>
						<span className={`absolute left-4 top-1/2 -translate-y-1/2 px-2 py-1 rounded-full text-[10px] font-medium ${
							extraProps.status 
								? 'bg-green-500/10 text-green-400 border border-green-500/20' 
								: 'bg-red-500/10 text-red-400 border border-red-500/20'
						}`}>
							{extraProps.status ? 'Activo' : 'Inactivo'}
						</span>
					</header>

					{/* Body - Grid de 2 columnas */}
					<div className="grid grid-cols-1 md:grid-cols-2 flex-1 overflow-y-auto">
						
						{/* Información del servicio */}
						<div className="p-6 space-y-5">
							
							{/* Nombre */}
							<div className="space-y-2">
								<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
									Nombre del servicio
								</label>
								<div className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
									text-sm text-white/90">
									{extraProps.name}
								</div>
							</div>

							{/* Descripción */}
							<div className="space-y-2">
								<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
									Descripción
								</label>
								<div className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
									text-sm text-white/70 min-h-[60px]">
									{extraProps.description || 'Sin descripción'}
								</div>
							</div>

							{/* Estado */}
							<div className="space-y-2">
								<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
									Estado
								</label>
								<div className="flex items-center gap-3">
									<div className="flex items-center gap-2">
										<span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
											extraProps.status 
												? 'bg-green-500/10 text-green-400 border border-green-500/20' 
												: 'bg-red-500/10 text-red-400 border border-red-500/20'
										}`}>
											<span className={`w-2 h-2 rounded-full ${
												extraProps.status ? 'bg-green-400' : 'bg-red-400'
											}`} />
											{extraProps.status ? 'Activo' : 'Inactivo'}
										</span>
									</div>
									<p className="text-xs text-white/30">
										{extraProps.status 
											? 'Visible en el catálogo' 
											: 'Oculto del catálogo'}
									</p>
								</div>
							</div>
						</div>

						{/* Imagen */}
						<div className="bg-white/5 border-l border-white/10 p-6 flex flex-col items-center justify-start">
							<h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2 self-start">
								<ImageIcon size={16} className="text-[#C8A882]" />
								Imagen del servicio
							</h3>
							
							{extraProps.imageUrl ? (
								<div className="w-full space-y-3">
									<div className="rounded-xl border border-white/10 overflow-hidden bg-white/5 p-2">
										<img
											src={extraProps.imageUrl}
											alt={extraProps.name}
											className="w-full max-h-64 object-contain rounded-lg"
										/>
									</div>
									<p className="text-xs text-white/30 text-center">
										Esta imagen se muestra en el catálogo
									</p>
								</div>
							) : (
								<div className="flex flex-col items-center justify-center h-64 text-white/20 border-2 border-dashed border-white/10 rounded-xl w-full">
									<ImageIcon size={48} strokeWidth={1} />
									<p className="text-sm mt-2 text-white/30">Sin imagen disponible</p>
								</div>
							)}
						</div>
					</div>

					{/* Footer */}
					<div className="sticky bottom-0 px-6 py-4 border-t border-white/10 flex justify-between items-center"
						style={{ background: 'rgba(30,30,28,0.95)', backdropFilter: 'blur(20px)' }}>
						<button
							type="button"
							onClick={() => setEditModal(true)}
							className="px-5 py-2.5 rounded-lg
								border border-[#C8A882]/30 bg-[#C8A882]/10
								text-[#C8A882] text-sm font-medium
								hover:bg-[#C8A882]/20 hover:border-[#C8A882]/50
								flex items-center gap-2
								transition-all duration-200">
							<Edit size={14} />
							Editar servicio
						</button>
						
						<div className="flex gap-3">
							<button
								type="button"
								onClick={onClose}
								className="px-5 py-2.5 rounded-lg
									border border-white/15 bg-white/5
									text-white/70 text-sm
									hover:bg-white/10 hover:text-white
									transition-all duration-200">
								Cerrar
							</button>
							<button
								type="button"
								onClick={handleDelete}
								disabled={deleteService.isPending}
								className="px-5 py-2.5 rounded-lg
									border border-red-500/30 bg-red-500/10
									text-red-400 text-sm font-medium
									hover:bg-red-500/20 hover:border-red-500/50
									disabled:opacity-50 disabled:cursor-not-allowed
									flex items-center gap-2
									transition-all duration-200">
								{deleteService.isPending ? (
									<>
										<span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></span>
										Eliminando...
									</>
								) : (
									<>
										<Trash2 size={14} />
										Eliminar
									</>
								)}
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Modal de edición */}
			<EditServiceModal
				isOpen={editModal}
				onClose={() => setEditModal(false)}
				extraProps={extraProps}
			/>
		</>
	);
}

export default ServiceDetailsModal;