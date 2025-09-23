import { DefaultModalProps, Permission, Role } from '@/app/types';
import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import EditRoleModal from './EditRoleModal';
import { deleteElement } from '../global/alerts';
import Swal from 'sweetalert2';

function RoleDetailsModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<Role>) {
	const [editModal, setEditModal] = useState(false);

	if (!isOpen || !extraProps) return null;

	// 📌 Agrupar permisos por módulo
	const modules = Array.from(new Set(extraProps.permissions?.map((p) => p.module)));

	return (
		<div className='modal-bg'>
			<div className='modal-frame w-[600px]'>
				<header className='w-fit mx-auto'>
					<button
						onClick={onClose}
						className='absolute top-4 left-4 text-2xl text-gray-500 hover:text-black cursor-pointer'>
						<IoMdClose />
					</button>
					<h1 className='text-xl font-semibold mb-4'>DETALLES DEL ROL</h1>
				</header>

				<div>
					{/* Nombre */}
					<div className='flex flex-col'>
						<label className='font-semibold'>Rol</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>{extraProps.name}</p>
					</div>

					{/* Descripción */}
					<div className='flex flex-col mt-4'>
						<label className='font-semibold'>Descripción</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{extraProps.description || 'Sin descripción'}
						</p>
					</div>

					{/* Estado */}
					<div className='flex flex-col mt-4'>
						<label className='font-semibold'>Estado</label>
						<p
							className={`px-3 py-2 rounded-md w-fit ${
								extraProps.status
									? 'bg-green-100 text-green-700'
									: 'bg-red-100 text-red-700'
							}`}>
							{extraProps.status ? 'Activo' : 'Inactivo'}
						</p>
					</div>

					{/* Permisos */}
					<section className='mt-10 h-50 overflow-y-scroll'>
						{modules.map((module) => {
							const moduloPerms = extraProps.permissions?.filter(
								(p) => p.module === module
							);

							return (
								<div
									key={module}
									className='border rounded-lg p-4 mb-4 bg-gray-50'>
									<h3 className='font-semibold mb-2'>{module}</h3>
									<div className='grid grid-cols-2 gap-2'>
										{moduloPerms?.map((permission) => (
											<label
												key={permission._id}
												className='flex items-center gap-2'>
												<input
													type='checkbox'
													checked
													disabled // 👈 solo lectura
												/>
												{permission.action === 'view' && 'Ver'}
												{permission.action === 'create' && 'Crear'}
												{permission.action === 'update' && 'Actualizar'}
												{permission.action === 'delete' && 'Eliminar'}
											</label>
										))}
									</div>
								</div>
							);
						})}
					</section>
				</div>
			</div>
			<EditRoleModal
				isOpen={editModal}
				onClose={() => setEditModal(false)}
				extraProps={extraProps}
				updateList={updateList}
			/>
		</div>
	);
}

export default RoleDetailsModal;
