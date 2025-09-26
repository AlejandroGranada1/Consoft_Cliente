'use client';
import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { DefaultModalProps, Order, Service, User } from '@/app/types';
import EditOrderModal from './EditOrderModal';



function OrderDetailsModal({ isOpen, onClose, extraProps }: DefaultModalProps<Order>) {
	const [editModal, setEditModal] = useState(false);
	console.log(extraProps)
	if (!isOpen || !extraProps) return null;

	// Colores dinámicos del estado
	const getStatusClass = (status: string) => {
		return status === 'Completado'
			? 'bg-blue-500/30 text-blue-500'
			: status === 'Cancelado'
			? 'bg-red/30 text-red'
			: 'bg-orange/30 text-orange';
	};

	// Calcular total
	const total = extraProps.items.reduce((sum, item) => sum + item.valor, 0);

	return (
		<div className='modal-bg'>
			<div className='modal-frame w-[800px] p-6'>
				<header className='relative mb-4'>
					<button
						onClick={onClose}
						className='absolute top-0 left-0 text-2xl text-gray-500 hover:text-black cursor-pointer'>
						<IoMdClose />
					</button>
					<h1 className='text-xl font-semibold text-center'>DETALLES DEL PEDIDO</h1>
				</header>

				<section className='flex flex-col gap-4'>
					{/* Cliente */}
					<div className='flex flex-col'>
						<label className='font-semibold'>Cliente</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{(extraProps.user as User).name}
						</p>
					</div>

					{/* Dirección */}
					<div className='flex flex-col'>
						<label className='font-semibold'>Dirección</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{extraProps.address}
						</p>
					</div>

					{/* Fecha de inicio */}
					<div className='flex flex-col'>
						<label className='font-semibold'>Fecha de inicio</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{new Date(extraProps.startedAt).toLocaleDateString('es-CO')}
						</p>
					</div>

					{/* Fecha de finalización */}
					<div className='flex flex-col'>
						<label className='font-semibold'>Fecha de finalización</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{extraProps.deliveredAt
								? new Date(extraProps.deliveredAt).toLocaleDateString('es-CO')
								: 'No definida'}
						</p>
					</div>

					{/* Estado */}
					<div className='flex flex-col'>
						<label className='font-semibold'>Estado</label>
						<p
							className={`px-3 py-2 rounded-md w-fit ${getStatusClass(
								extraProps.status
							)}`}>
							{extraProps.status}
						</p>
					</div>

					{/* Tabla de items */}
					<div className='mt-4'>
						<div className='grid grid-cols-3 gap-2 font-semibold border-b pb-2 items-center'>
							<p>Servicios</p>
							<p>Valor del servicio</p>
							<p>Detalles del servicio</p>
						</div>

						{extraProps.items.map((item) => (
							<div
								key={item._id}
								className='grid grid-cols-3 gap-2 py-2 border-b items-center'>
								<p className='border px-2 py-1 rounded-md bg-gray-100'>
									{(item.id_servicio as Service).name}
								</p>
								<p className='border px-2 py-1 rounded-md bg-gray-100'>
									${item.valor.toLocaleString('es-CO')}
								</p>
								<p className='border px-2 py-1 rounded-md bg-gray-100'>
									{item.detalles || 'Sin detalles'}
								</p>
							</div>
						))}
					</div>

					{/* Total */}
					<p className='mt-4 font-semibold'>
						Valor total del pedido:{' '}
						<span className='text-brown'>${total.toLocaleString('es-CO')}</span>
					</p>
				</section>
			</div>

			{/* Modal de edición */}
			<EditOrderModal
				isOpen={editModal}
				onClose={() => setEditModal(false)}
				extraProps={extraProps}
			/>
		</div>
	);
}

export default OrderDetailsModal;
