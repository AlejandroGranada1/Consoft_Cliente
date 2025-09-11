'use client';
import { DefaultModalProps, Visit } from '@/app/types';
import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import EditVisitModal from './EditVisitModal';

function VisitDetailsModal({ isOpen, onClose, extraProps }: DefaultModalProps<Visit>) {
	const [editModal, setEditModal] = useState(false);

	if (!isOpen || !extraProps) return null;

	return (
		<div className='modal-bg'>
			<div className='modal-frame w-[600px]'>
				<header className='w-fit mx-auto'>
					<button
						onClick={onClose}
						className='absolute top-4 left-4 text-2xl text-gray-500 hover:text-black cursor-pointer'>
						<IoMdClose />
					</button>
					<h1 className='text-xl font-semibold mb-4'>DETALLES DE LA VIISTA</h1>
				</header>
				<div>
					{/* Nombre */}
					<div className='flex flex-col'>
						<label className='font-semibold'>Cliente</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{extraProps.user.name}
						</p>
					</div>

					{/* Direccion */}
					<div className='flex flex-col mt-4'>
						<label className='font-semibold'>Dirección</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{extraProps.address}
						</p>
					</div>
					{/* Fecha de la visita */}
					<div className='flex flex-col mt-4'>
						<label className='font-semibold'>Fecha de la visita</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{extraProps.scheduledAt}
						</p>
					</div>
					{/* Estado */}
					<div className='flex flex-col mt-4'>
						<label className='font-semibold'>Estado de la visita</label>
						<p
							className={`${
								extraProps.status == 'Terminada'
									? 'bg-green/30 text-green'
									: extraProps.status == 'Cancelada'
									? 'bg-red/30 text-red'
									: 'bg-orange/30 text-orange'
							} px-2 py-1 rounded-xl`}>
							{extraProps.status}
						</p>
					</div>
				</div>
				{/* Servicios */}
				<div className='flex gap-2'>
					<label htmlFor='fabricacion'>Fabricacion</label>
					<input
						id='fabricacion'
						name='name'
						type='checkbox'
						className='border px-3 py-2 rounded-md'
					/>
				</div>
				<div className='flex gap-2'>
					<label htmlFor='fabricacion'>Reparacion</label>
					<input
						id='fabricacion'
						name='name'
						type='checkbox'
						className='border px-3 py-2 rounded-md'
					/>
				</div>
				<div className='w-full flex justify-between mt-10'>
					<button
						onClick={() => setEditModal(true)}
						className='px-10 py-2 rounded-lg border border-brown text-brown cursor-pointer'>
						Editar Visita
					</button>
					<button
						onClick={onClose}
						className='px-10 py-2 rounded-lg border border-gray bg-gray cursor-pointer'>
						Cerrar
					</button>
				</div>
			</div>

			{/* Edit Modal */}
			<EditVisitModal
				isOpen={editModal}
				onClose={() => setEditModal(false)}
				extraProps={extraProps}
			/>
		</div>
	);
}

export default VisitDetailsModal;
