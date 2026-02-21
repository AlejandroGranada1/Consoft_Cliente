'use client';
import { X, Edit, ImageIcon, FileText, Tag, ToggleLeft } from 'lucide-react';
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
			Swal.fire({ icon: 'success', title: 'Servicio eliminado', timer: 1500, showConfirmButton: false });
			onClose();
		} catch {
			Swal.fire('Error', 'No se pudo eliminar el servicio', 'error');
		}
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'>
			<div className='bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col'>

				{/* Header */}
				<div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
					<div className='flex items-center gap-2'>
						<h1 className='text-lg font-semibold text-gray-800'>Detalles del Servicio</h1>
						<span className={`text-xs px-2.5 py-1 rounded-full font-medium ${extraProps.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
							{extraProps.status ? 'Activo' : 'Inactivo'}
						</span>
					</div>
					<div className='flex items-center gap-2'>
						<button
							onClick={() => setEditModal(true)}
							className='p-2 rounded-full hover:bg-blue-50 text-blue-500 transition'
							title='Editar servicio'>
							<Edit size={16} />
						</button>
						<button
							onClick={onClose}
							className='p-2 rounded-full hover:bg-gray-100 text-gray-500 transition'>
							<X size={18} />
						</button>
					</div>
				</div>

				{/* Body */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-0 flex-1'>
					{/* Info */}
					<div className='p-6 space-y-4'>
						<div className='border border-gray-100 rounded-xl p-4 bg-gray-50'>
							<h3 className='text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2'>
								<Tag size={14} /> Nombre
							</h3>
							<p className='text-sm font-medium text-gray-800'>{extraProps.name}</p>
						</div>

						<div className='border border-gray-100 rounded-xl p-4 bg-gray-50'>
							<h3 className='text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2'>
								<FileText size={14} /> Descripción
							</h3>
							<p className='text-sm text-gray-700'>{extraProps.description || 'Sin descripción'}</p>
						</div>

						<div className='border border-gray-100 rounded-xl p-4 bg-gray-50'>
							<h3 className='text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2'>
								<ToggleLeft size={14} /> Estado
							</h3>
							<span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${extraProps.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
								<span className={`w-1.5 h-1.5 rounded-full ${extraProps.status ? 'bg-green-500' : 'bg-red-500'}`} />
								{extraProps.status ? 'Activo' : 'Inactivo'}
							</span>
						</div>
					</div>

					{/* Imagen */}
					<div className='bg-gray-50 border-l border-gray-100 flex flex-col items-center justify-center p-6'>
						{extraProps.imageUrl ? (
							<>
								<img
									src={extraProps.imageUrl}
									alt={extraProps.name}
									className='w-full max-h-56 object-contain rounded-xl shadow'
								/>
								<p className='text-xs text-gray-400 mt-3 flex items-center gap-1'>
									<ImageIcon size={12} /> Imagen del servicio
								</p>
							</>
						) : (
							<div className='flex flex-col items-center gap-2 text-gray-300'>
								<ImageIcon size={48} />
								<p className='text-sm'>Sin imagen</p>
							</div>
						)}
					</div>
				</div>

				{/* Footer */}
				<div className='px-6 py-4 border-t border-gray-100 flex justify-between'>
					<button
						onClick={() => setEditModal(true)}
						className='px-5 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition flex items-center gap-2'>
						<Edit size={14} /> Editar servicio
					</button>
					<button
						onClick={handleDelete}
						disabled={deleteService.isPending}
						className='px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition disabled:opacity-50'>
						{deleteService.isPending ? 'Eliminando...' : 'Eliminar servicio'}
					</button>
				</div>
			</div>

			<EditServiceModal
				isOpen={editModal}
				onClose={() => setEditModal(false)}
				extraProps={extraProps}
			/>
		</div>
	);
}

export default ServiceDetailsModal;