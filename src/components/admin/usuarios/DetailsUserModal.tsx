import { X, User, Mail, Phone, MapPin, UserCircle, Info, Edit, Trash2 } from 'lucide-react';
import { DefaultModalProps, Role} from '@/lib/types';
import React, { useState } from 'react';
import EditUserModal from './EditUserModal';
import { deleteElement } from '../global/alerts';

function DetailsUserModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<any>) {
	const [editModal, setEditModal] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);

	const handleDeleteUser = async () => {
		if (!extraProps?._id) return;
		
		setDeleteLoading(true);
		const result = await deleteElement('Usuario', `/api/users/${extraProps._id}`, updateList!);
		setDeleteLoading(false);
		
		if (result) {
			onClose();
		}
	};

	if (!isOpen || !extraProps) return null;

	return (
		<>
			<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
				<div className='modal-frame w-full max-w-[600px] flex flex-col max-h-[92vh]'>
					
					<header className='sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-xs'>
						<button
							onClick={onClose}
							className='absolute top-0 left-0 p-5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors'>
							<X size={20} />
						</button>
						<h1 className='text-2xl font-bold text-center flex items-center justify-center gap-2'>
							<User size={20} /> Detalles del Usuario
						</h1>
					</header>

					<div className='space-y-6 p-6 overflow-y-auto'>
						
						{/* Información principal del usuario */}
						<div className='grid grid-cols-2 gap-6'>
							{/* Nombre */}
							<div className='flex flex-col'>
								<label className='font-medium mb-1 flex items-center gap-2'>
									<User size={16} />
									Nombre
								</label>
								<p className='border px-3 py-2 rounded-md bg-gray-50 text-gray-700'>
									{extraProps.name}
								</p>
							</div>

							{/* Estado */}
							<div className='flex flex-col'>
								<label className='font-medium mb-1 flex items-center gap-2'>
									<Info size={16} />
									Estado
								</label>
								<div className='flex items-center h-10'>
									<span
										className={`px-3 py-1 rounded-full text-sm font-medium ${
											extraProps.status
												? 'bg-green-100 text-green-700'
												: 'bg-red-100 text-red-700'
										}`}>
										{extraProps.status ? 'Activo' : 'Inactivo'}
									</span>
								</div>
							</div>
						</div>

						{/* Correo */}
						<div className='flex flex-col'>
							<label className='font-medium mb-1 flex items-center gap-2'>
								<Mail size={16} />
								Correo Electrónico
							</label>
							<p className='border px-3 py-2 rounded-md bg-gray-50 text-gray-700'>
								{extraProps.email}
							</p>
						</div>

						{/* Teléfono y Dirección en grid */}
						<div className='grid grid-cols-2 gap-6'>
							{/* Teléfono */}
							<div className='flex flex-col'>
								<label className='font-medium mb-1 flex items-center gap-2'>
									<Phone size={16} />
									Teléfono
								</label>
								<p className='border px-3 py-2 rounded-md bg-gray-50 text-gray-700'>
									{extraProps.phone || 'No registrado'}
								</p>
							</div>

							{/* Rol */}
							<div className='flex flex-col'>
								<label className='font-medium mb-1 flex items-center gap-2'>
									<UserCircle size={16} />
									Rol
								</label>
								<p className='border px-3 py-2 rounded-md bg-gray-50 text-gray-700'>
									{(extraProps.role as Role)?.name || 'Sin rol'}
								</p>
							</div>
						</div>

						{/* Dirección */}
						<div className='flex flex-col'>
							<label className='font-medium mb-1 flex items-center gap-2'>
								<MapPin size={16} />
								Dirección
							</label>
							<p className='border px-3 py-2 rounded-md bg-gray-50 text-gray-700 min-h-[42px]'>
								{extraProps.address || 'No registrada'}
							</p>
						</div>

						{/* Metadata adicional - similar a otros modales */}
						<div className='grid grid-cols-2 gap-6'>
							<div className='flex flex-col'>
								<label className='font-medium mb-1 text-xs text-gray-500'>
									Fecha de registro
								</label>
								<p className='text-sm'>
									{extraProps.createdAt 
										? new Date(extraProps.createdAt).toLocaleDateString('es-CO', {
											year: 'numeric',
											month: 'long',
											day: 'numeric'
										})
										: 'No disponible'}
								</p>
							</div>
							<div className='flex flex-col'>
								<label className='font-medium mb-1 text-xs text-gray-500'>
									Última actualización
								</label>
								<p className='text-sm'>
									{extraProps.updatedAt 
										? new Date(extraProps.updatedAt).toLocaleDateString('es-CO', {
											year: 'numeric',
											month: 'long',
											day: 'numeric'
										})
										: 'No disponible'}
								</p>
							</div>
						</div>

						{/* Resumen del usuario */}
						<div className='p-4 bg-gray-50 rounded-lg border'>
							<div className='flex justify-between items-center'>
								<div>
									<span className='font-semibold text-lg'>Resumen del usuario:</span>
									<p className='text-sm text-gray-600 mt-1'>
										{extraProps.name}
									</p>
									<p className='text-sm text-gray-600'>
										{extraProps.email}
									</p>
								</div>
								<div className='text-right'>
									<span className='text-sm font-medium text-brown bg-brown/10 px-3 py-1 rounded-full'>
										{(extraProps.role as Role)?.name || 'Sin rol'}
									</span>
								</div>
							</div>
						</div>

						{/* Botones de acción */}
						<div className='flex justify-between pt-4 border-t'>
							<div className='flex gap-3'>
								<button
									type='button'
									onClick={onClose}
									className='px-6 py-2 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-100 transition-colors'>
									Cerrar
								</button>
								<button
									type='button'
									onClick={() => setEditModal(true)}
									className='px-6 py-2 border border-brown text-brown rounded-md hover:bg-brown hover:text-white transition-colors flex items-center gap-2'>
									<Edit size={16} />
									Editar Usuario
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Modal de edición */}
			<EditUserModal
				isOpen={editModal}
				onClose={() => setEditModal(false)}
				extraProps={extraProps}
				updateList={updateList}
			/>
		</>
	);
}

export default DetailsUserModal;