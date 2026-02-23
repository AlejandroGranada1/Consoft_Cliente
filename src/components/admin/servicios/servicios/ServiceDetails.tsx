'use client';
import { X, Edit, ImageIcon, FileText, Tag, ToggleLeft, Trash2, Eye, AlertCircle } from 'lucide-react';
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
			showCancelButton: true,
			confirmButtonColor: '#c0392b',
			cancelButtonColor: '#6b7280',
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar',
		});

		if (!result.isConfirmed) return;

		try {
			await deleteService.mutateAsync(extraProps._id!);
			Swal.fire({ 
				icon: 'success', 
				title: 'Servicio eliminado', 
				text: 'El servicio ha sido eliminado correctamente',
				timer: 1500, 
				showConfirmButton: false 
			});
			onClose();
		} catch {
			Swal.fire('Error', 'No se pudo eliminar el servicio', 'error');
		}
	};

	return (
		<>
			<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
				<div className='modal-frame w-full max-w-3xl flex flex-col max-h-[92vh]'>
					
					{/* Header */}
					<header className='sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-xs'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-3'>
								<h1 className='text-2xl font-bold flex items-center gap-2'>
									<Tag size={20} /> Detalles del Servicio
								</h1>
								<span className={`px-3 py-1 rounded-full text-xs font-medium ${
									extraProps.status 
										? 'bg-green-100 text-green-700' 
										: 'bg-red-100 text-red-700'
								}`}>
									{extraProps.status ? 'Activo' : 'Inactivo'}
								</span>
							</div>
							<div className='flex items-center gap-2'>
								<button
									onClick={() => setEditModal(true)}
									className='p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors'
									title='Editar servicio'>
									<Edit size={18} />
								</button>
								<button
									onClick={onClose}
									className='p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors'>
									<X size={18} />
								</button>
							</div>
						</div>
					</header>

					{/* Body - Grid de 2 columnas */}
					<div className='grid grid-cols-1 md:grid-cols-2 flex-1 overflow-y-auto'>
						
						{/* Información del servicio */}
						<div className='p-6 space-y-5'>
							
							{/* Nombre */}
							<div className='border rounded-lg p-4 bg-gray-50'>
								<h3 className='font-semibold mb-3 flex items-center gap-2'>
									<Tag size={16} />
									Nombre
								</h3>
								<p className='text-gray-800 bg-white border rounded-md px-3 py-2'>
									{extraProps.name}
								</p>
							</div>

							{/* Descripción */}
							<div className='border rounded-lg p-4 bg-gray-50'>
								<h3 className='font-semibold mb-3 flex items-center gap-2'>
									<FileText size={16} />
									Descripción
								</h3>
								<p className='text-gray-700 bg-white border rounded-md px-3 py-2 min-h-[60px]'>
									{extraProps.description || 'Sin descripción'}
								</p>
							</div>

							{/* Estado */}
							<div className='border rounded-lg p-4 bg-gray-50'>
								<h3 className='font-semibold mb-3 flex items-center gap-2'>
									<ToggleLeft size={16} />
									Estado
								</h3>
								<div className='flex items-center gap-3'>
									<span className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${
										extraProps.status 
											? 'bg-green-100 text-green-700 border border-green-200' 
											: 'bg-red-100 text-red-700 border border-red-200'
									}`}>
										<span className={`w-2 h-2 rounded-full ${
											extraProps.status ? 'bg-green-500' : 'bg-red-500'
										}`} />
										{extraProps.status ? 'Activo' : 'Inactivo'}
									</span>
									<p className='text-xs text-gray-500'>
										{extraProps.status 
											? 'El servicio está disponible en el catálogo' 
											: 'El servicio no se muestra en el catálogo'}
									</p>
								</div>
							</div>
						</div>

						{/* Imagen */}
						<div className='bg-gray-50 border-l p-6 flex flex-col items-center justify-start'>
							<h3 className='font-semibold mb-4 flex items-center gap-2 self-start'>
								<ImageIcon size={16} />
								Imagen del servicio
							</h3>
							
							{extraProps.imageUrl ? (
								<div className='w-full space-y-3'>
									<div className='border rounded-lg overflow-hidden bg-white p-2 shadow-sm'>
										<img
											src={extraProps.imageUrl}
											alt={extraProps.name}
											className='w-full max-h-64 object-contain rounded-md'
										/>
									</div>
									<p className='text-xs text-gray-500 text-center'>
										Esta imagen se muestra en el catálogo de servicios
									</p>
								</div>
							) : (
								<div className='flex flex-col items-center justify-center h-64 text-gray-300 border-2 border-dashed border-gray-200 rounded-lg w-full'>
									<ImageIcon size={48} strokeWidth={1} />
									<p className='text-sm mt-2'>Sin imagen disponible</p>
									<p className='text-xs text-center mt-1 max-w-[200px] text-gray-400'>
										Este servicio no tiene una imagen asociada
									</p>
								</div>
							)}
						</div>
					</div>

					{/* Footer */}
					<div className='sticky bottom-0 px-6 py-4 border-t bg-white flex justify-between items-center'>
						<button
							type='button'
							onClick={() => setEditModal(true)}
							className='px-6 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors flex items-center gap-2'>
							<Edit size={16} />
							Editar servicio
						</button>
						
						<div className='flex gap-3'>
							<button
								type='button'
								onClick={onClose}
								className='px-6 py-2 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-100 transition-colors'>
								Cerrar
							</button>
							<button
								type='button'
								onClick={handleDelete}
								disabled={deleteService.isPending}
								className={`px-6 py-2 border border-red-500 rounded-md transition-colors flex items-center gap-2 ${
									deleteService.isPending
										? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500'
										: 'text-red-500 hover:bg-red-500 hover:text-white'
								}`}>
								{deleteService.isPending ? (
									<>
										<span className='animate-spin rounded-full h-4 w-4 border-b-2 border-current'></span>
										Eliminando...
									</>
								) : (
									<>
										<Trash2 size={16} />
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