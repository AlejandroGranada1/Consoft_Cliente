'use client';

import { 
	X, 
	CreditCard, 
	Hash, 
	Package, 
	Coins, 
	Clock, 
	Calendar, 
	CheckCircle, 
	AlertCircle,
	ArrowLeft
} from 'lucide-react';
import { DefaultModalProps, Payment, PaymentDetails } from '@/lib/types';
import api from '@/components/Global/axios';
import React, { useState } from 'react';
import { updateElement } from '../../global/alerts';

function PaymentDetailsModal({
	isOpen,
	onClose,
	extraProps,
	updateList,
}: DefaultModalProps<PaymentDetails>) {
	if (!isOpen) return null;

	const payment = extraProps?.payment;
	const order = extraProps?.summary;

	const [paymentData, setPaymentData] = useState<Payment>({
		_id: payment?._id || '',
		amount: payment?.amount || 0,
		method: payment?.method || '',
		paidAt: payment?.paidAt || new Date(),
		restante: order ? order.total - (payment?.amount || 0) : 0,
		status: payment?.status || '',
	});

	const [updating, setUpdating] = useState(false);

	const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newStatus = e.target.value;

		// Actualizar estado local
		setPaymentData((prev) => ({ ...prev, status: newStatus }));

		// Preparamos el objeto que la API espera
		const payload = { ...paymentData, status: newStatus, paymentId: paymentData._id };

		setUpdating(true);
		try {
			await updateElement('Pago', `/api/payments/${order?._id}`, payload, updateList);
			onClose();
		} catch (err) {
			console.error('Error al actualizar el pago', err);
			const Swal = (await import('sweetalert2')).default;
			Swal.fire('Error', 'No se pudo actualizar el estado del pago', 'error');
		} finally {
			setUpdating(false);
		}
	};

	const getStatusBadge = (status: string) => {
		switch(status) {
			case 'Aprobado':
				return <span className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1'><CheckCircle size={14} /> Aprobado</span>;
			case 'En revision':
				return <span className='bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1'><AlertCircle size={14} /> En revisión</span>;
			default:
				return <span className='bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium'>{status}</span>;
		}
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
			<div className='modal-frame w-full max-w-[800px] flex flex-col max-h-[92vh]'>
				
				<header className='sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-xs'>
					<button
						onClick={onClose}
						className='absolute top-0 left-0 p-5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors'>
						<X size={20} />
					</button>
					<h1 className='text-2xl font-bold text-center flex items-center justify-center gap-2'>
						<CreditCard size={20} /> Detalles del Pago
					</h1>
				</header>

				<div className='space-y-6 p-6 overflow-y-auto'>
					
					{/* Cabecera con IDs */}
					<div className='grid grid-cols-2 gap-6'>
						<div className='flex flex-col'>
							<label className='font-medium mb-1 flex items-center gap-2'>
								<Hash size={16} />
								ID Pago
							</label>
							<p className='border px-3 py-2 rounded-md bg-gray-50 text-gray-700 font-mono text-sm'>
								{payment?._id}
							</p>
						</div>

						<div className='flex flex-col'>
							<label className='font-medium mb-1 flex items-center gap-2'>
								<Package size={16} />
								ID Pedido
							</label>
							<p className='border px-3 py-2 rounded-md bg-gray-50 text-gray-700 font-mono text-sm'>
								{order?._id}
							</p>
						</div>
					</div>

					{/* Información de montos */}
					<div className='grid grid-cols-3 gap-6'>
						{/* Monto Total */}
						<div className='flex flex-col'>
							<label className='font-medium mb-1 flex items-center gap-2'>
								<Coins size={16} />
								Monto Total
							</label>
							<p className='border px-3 py-2 rounded-md bg-gray-50 text-gray-700 font-semibold'>
								{order?.total?.toLocaleString('es-CO', {
									style: 'currency',
									currency: 'COP',
								})}
							</p>
						</div>

						{/* Valor del pago */}
						<div className='flex flex-col'>
							<label className='font-medium mb-1 flex items-center gap-2'>
								<CreditCard size={16} />
								Valor del pago
							</label>
							<p className='border px-3 py-2 rounded-md bg-green-50 text-green-700 font-semibold'>
								{payment?.amount?.toLocaleString('es-CO', {
									style: 'currency',
									currency: 'COP',
								})}
							</p>
						</div>

						{/* Valor pendiente */}
						<div className='flex flex-col'>
							<label className='font-medium mb-1 flex items-center gap-2'>
								<Clock size={16} />
								Valor pendiente
							</label>
							<p className={`border px-3 py-2 rounded-md font-semibold ${
								(order?.total! - payment?.amount!) > 0 
									? 'bg-yellow-50 text-yellow-700' 
									: 'bg-green-50 text-green-700'
							}`}>
								{(order?.total! - payment?.amount!)?.toLocaleString('es-CO', {
									style: 'currency',
									currency: 'COP',
								})}
							</p>
						</div>
					</div>

					{/* Información adicional */}
					<div className='grid grid-cols-2 gap-6'>
						{/* Metodo */}
						<div className='flex flex-col'>
							<label className='font-medium mb-1 flex items-center gap-2'>
								<CreditCard size={16} />
								Método de pago
							</label>
							<p className='border px-3 py-2 rounded-md bg-gray-50 text-gray-700'>
								{payment?.method === 'cash' && 'Efectivo'}
								{payment?.method === 'card' && 'Tarjeta de crédito/débito'}
								{payment?.method === 'transfer' && 'Transferencia bancaria'}
								{payment?.method === 'other' && 'Otro'}
								{!['cash', 'card', 'transfer', 'other'].includes(payment?.method || '') && payment?.method}
							</p>
						</div>

						{/* Estado del pago */}
						<div className='flex flex-col'>
							<label className='font-medium mb-1 flex items-center gap-2'>
								<AlertCircle size={16} />
								Estado del pago
							</label>
							<div className='flex items-center gap-3'>
								<select
									className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown flex-1'
									value={payment?.status}
									onChange={handleChange}
									disabled={updating}>
									<option value='Aprobado'>Aprobado</option>
									<option value='En revision'>En revisión</option>
									<option value='Pendiente'>Pendiente</option>
									<option value='Rechazado'>Rechazado</option>
								</select>
								{updating && (
									<span className='animate-spin rounded-full h-5 w-5 border-b-2 border-brown'></span>
								)}
							</div>
						</div>
					</div>

					{/* Fecha de pago */}
					<div className='flex flex-col'>
						<label className='font-medium mb-1 flex items-center gap-2'>
							<Calendar size={16} />
							Fecha de pago
						</label>
						<p className='border px-3 py-2 rounded-md bg-gray-50 text-gray-700'>
							{payment?.paidAt
								? new Date(payment.paidAt).toLocaleDateString('es-CO', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
									hour: '2-digit',
									minute: '2-digit'
								})
								: '-'}
						</p>
					</div>

					{/* Resumen del pago */}
					<div className='p-4 bg-gray-50 rounded-lg border'>
						<div className='flex justify-between items-center'>
							<div>
								<span className='font-semibold text-lg'>Resumen del pago:</span>
								<p className='text-sm text-gray-600 mt-1'>
									Pago #{payment?._id?.slice(-6)} para pedido #{order?._id?.slice(-6)}
								</p>
							</div>
							<div className='text-right'>
								{getStatusBadge(payment?.status || '')}
							</div>
						</div>
						<div className='grid grid-cols-3 gap-4 mt-3 text-sm'>
							<div>
								<span className='text-gray-500'>Método:</span>
								<p className='font-medium'>
									{payment?.method === 'cash' && 'Efectivo'}
									{payment?.method === 'card' && 'Tarjeta'}
									{payment?.method === 'transfer' && 'Transferencia'}
									{payment?.method === 'other' && 'Otro'}
								</p>
							</div>
							<div>
								<span className='text-gray-500'>Pagado:</span>
								<p className='font-medium text-green-600'>
									{payment?.amount?.toLocaleString('es-CO', {
										style: 'currency',
										currency: 'COP',
									})}
								</p>
							</div>
							<div>
								<span className='text-gray-500'>Pendiente:</span>
								<p className={`font-medium ${
									(order?.total! - payment?.amount!) > 0 ? 'text-yellow-600' : 'text-green-600'
								}`}>
									{(order?.total! - payment?.amount!)?.toLocaleString('es-CO', {
										style: 'currency',
										currency: 'COP',
									})}
								</p>
							</div>
						</div>
					</div>

					{/* Botón de volver */}
					<div className='flex justify-center pt-4 border-t'>
						<button
							type='button'
							onClick={onClose}
							className='px-8 py-2 border border-brown rounded-md text-brown hover:bg-brown hover:text-white transition-colors flex items-center gap-2'>
							<ArrowLeft size={16} />
							Volver
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PaymentDetailsModal;