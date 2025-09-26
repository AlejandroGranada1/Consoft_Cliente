'use client';

import { DefaultModalProps, Payment, PaymentDetails } from '@/app/types';
import api from '@/components/Global/axios';
import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { updateElement } from '../../global/alerts';

function PaymentDetailsModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<PaymentDetails>) {
	if (!isOpen) return null;

	const payment = extraProps?.payment;
	const order = extraProps?.summary;

	const [paymentData, setPaymentData] = useState<Payment>({
		_id: payment?._id || '',
		amount: payment?.amount || 0,
		method: payment?.method || '',
		paidAt: payment?.paidAt || new Date,
		restante: order ? order.total - (payment?.amount || 0) : 0,
		status: payment?.status || '',
	});

	console.log(extraProps);

	const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newStatus = e.target.value;

		// Actualizar estado local
		setPaymentData((prev) => ({ ...prev, status: newStatus }));

		// Preparamos el objeto que la API espera
		const payload = { ...paymentData, status: newStatus, paymentId: paymentData._id };

		try {
			await updateElement('Pago', `/api/payments/${order?._id}`, payload, updateList );
			onClose()
		} catch (err) {
			console.error('Error al actualizar el pago', err);
		}
	};

	return (
		<div className='modal-bg'>
			<div className='modal-frame w-[800px]'>
				<header className='relative mb-4'>
					<button
						onClick={onClose}
						className='absolute top-0 left-0 text-2xl text-gray-500 hover:text-black cursor-pointer'>
						<IoMdClose />
					</button>
					<h1 className='text-xl font-semibold text-center'>DETALLES DEL PAGO</h1>
				</header>
				<section className='grid grid-cols-2 gap-8'>
					{/* Id Pago */}
					<div className='flex flex-col'>
						<label className='font-semibold'>ID Pago</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>{payment?._id}</p>
					</div>

					{/* Id Pedido */}
					<div className='flex flex-col'>
						<label className='font-semibold'>ID Pedido</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>{order?._id}</p>
					</div>

					{/* Monto Total */}
					<div className='flex flex-col'>
						<label className='font-semibold'>Monto Total</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{order?.total?.toLocaleString('es-CO', {
								style: 'currency',
								currency: 'COP',
							})}
						</p>
					</div>

					{/* Valor del pago */}
					<div className='flex flex-col'>
						<label className='font-semibold'>Valor del pago</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{payment?.amount?.toLocaleString('es-CO', {
								style: 'currency',
								currency: 'COP',
							})}
						</p>
					</div>

					{/* Valor pendiente */}
					<div className='flex flex-col'>
						<label className='font-semibold'>Valor pendiente</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{(order?.total! - payment?.amount!)?.toLocaleString('es-CO', {
								style: 'currency',
								currency: 'COP',
							})}
						</p>
					</div>

					{/* Metodo */}
					<div className='flex flex-col'>
						<label className='font-semibold'>Método de pago</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>{payment?.method}</p>
					</div>

					{/* Estado del pago */}
					<div className='flex flex-col'>
						<label className='font-semibold'>Estado del pago</label>
						<select
							className='border px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-brown'
							value={payment?.status} // valor actual
							onChange={handleChange}>
							<option value='aprobado'>Aprobado</option>
							<option value='En revision'>En revisión</option>
						</select>
					</div>

					{/* Fecha de pago */}
					<div className='flex flex-col'>
						<label className='font-semibold'>Fecha de pago</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{payment?.paidAt
								? new Date(payment.paidAt).toLocaleDateString('es-CO')
								: '-'}
						</p>
					</div>

					<button
						type='button'
						onClick={onClose}
						className='px-6 py-2 border border-brown rounded-md text-brown hover:bg-brown hover:text-white transition col-span-2'>
						Volver
					</button>
				</section>
			</div>
		</div>
	);
}

export default PaymentDetailsModal;
