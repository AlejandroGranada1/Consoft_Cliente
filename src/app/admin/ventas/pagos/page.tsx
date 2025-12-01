'use client';
import { PaymentDetails, PaymentSummary } from '@/app/types';
import PaymentDetailsModal from '@/components/admin/ventas/Pagos/PaymentDetails';
import api from '@/components/Global/axios';
import React, { useEffect, useState } from 'react';
import { FaSearch, FaEye } from 'react-icons/fa';
import PaginatedList from '@/components/Global/Pagination';

function Page() {
	const [detailsModal, setDetailsModal] = useState(false);
	const [selectedPayment, setSelectedPayment] = useState<PaymentDetails>();
	const [payments, setPayments] = useState<PaymentSummary[]>([]);
	const [filterText, setFilterText] = useState('');

	const fetchPayments = async () => {
		try {
			const response = await api.get('/api/payments');
			setPayments(response.data.payments);
		} catch (err) {
			console.error('Error al traer pagos', err);
		}
	};

	useEffect(() => {
		fetchPayments();
	}, []);

	// 📌 Filtrar pagos
	const filteredPayments = payments
		.map((order) => order.payments.map((payment) => ({ summary: order, payment })))
		.flat()
		.filter(
			(p) =>
				p.payment._id.toLowerCase().includes(filterText.toLowerCase()) ||
				p.summary._id.toLowerCase().includes(filterText.toLowerCase())
		);

	return (
		<div className='px-4 md:px-20'>
			<header className='flex flex-col gap-4 md:h-40 justify-around'>
				<h1 className='text-xl md:text-2xl text-brown text-center md:text-left'>
					GESTIÓN DE PAGOS
				</h1>

				{/* acciones */}
				<div className='flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center'>
					<div className='relative w-full md:w-64'>
						<FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />

						<input
							type='text'
							placeholder='Buscar Pago'
							value={filterText}
							onChange={(e) => setFilterText(e.target.value)}
							className='pl-10 pr-4 py-2 border border-brown rounded-lg w-full text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-brown'
						/>
					</div>
				</div>
			</header>

			<section className='w-full mx-auto mt-6 flex flex-col justify-between border-t border-gray'>
				{/* encabezado tabla - solo desktop */}
				<div className='hidden md:grid grid-cols-8 place-items-center py-6 font-semibold'>
					<p>Id Pago</p>
					<p>Pedido</p>
					<p>Monto Total</p>
					<p>Valor de Pago</p>
					<p>Pendiente</p>
					<p>Fecha de Pago</p>
					<p>Estado</p>
					<p>Acciones</p>
				</div>

				{/* listado con paginación */}
				<PaginatedList
					data={filteredPayments}
					itemsPerPage={5}>
					{(p) => (
						<div
							key={p.payment._id}
							className='grid grid-cols-1 md:grid-cols-8 gap-2 md:gap-0 place-items-center py-3 border-brown/40 md:border-b md:border-brown/10 rounded-lg p-4 md:py-2'>
							{/* 📱 Vista mobile */}
							<div className='w-full md:hidden text-center space-y-2 border-b pb-4'>
								<p>
									<span className='font-semibold'>Id Pago:</span> {p.payment._id}
								</p>
								<p>
									<span className='font-semibold'>Pedido:</span> {p.summary._id}
								</p>
								<p>
									<span className='font-semibold'>Monto Total:</span>{' '}
									{p.summary.total.toLocaleString('es-CO', {
										style: 'currency',
										currency: 'COP',
									})}
								</p>
								<p>
									<span className='font-semibold'>Valor de Pago:</span>{' '}
									{p.payment.amount.toLocaleString('es-CO', {
										style: 'currency',
										currency: 'COP',
									})}
								</p>
								<p>
									<span className='font-semibold'>Pendiente:</span>{' '}
									{p.payment.restante.toLocaleString('es-CO', {
										style: 'currency',
										currency: 'COP',
									})}
								</p>
								<p>
									<span className='font-semibold'>Fecha de Pago:</span>{' '}
									{new Date(p.payment.paidAt).toLocaleDateString('es-CO')}
								</p>
								<p>
									<span className='font-semibold'>Estado:</span>{' '}
									<span
										className={`${
											p.payment.status.toLowerCase() === 'aprobado'
												? 'text-green-500'
												: 'text-orange'
										}`}>
										{p.payment.status}
									</span>
								</p>
								{/* 👁️ acciones mobile */}
								<div className='flex gap-4 mt-2 justify-center'>
									<FaEye
										size={20}
										color='#d9b13b'
									/>
								</div>
							</div>

							{/* 💻 Vista desktop */}
							<p className='hidden md:block truncate w-20'>{p.payment._id}</p>
							<p className='hidden md:block truncate w-20'>{p.summary._id}</p>
							<p className='hidden md:block'>
								{p.summary.total.toLocaleString('es-CO', {
									style: 'currency',
									currency: 'COP',
								})}
							</p>
							<p className='hidden md:block'>
								{p.payment.amount.toLocaleString('es-CO', {
									style: 'currency',
									currency: 'COP',
								})}
							</p>
							<p className='hidden md:block'>
								{p.payment.restante.toLocaleString('es-CO', {
									style: 'currency',
									currency: 'COP',
								})}
							</p>
							<p className='hidden md:block'>
								{new Date(p.payment.paidAt).toLocaleDateString('es-CO')}
							</p>
							<p
								className={`hidden md:block ${
									p.payment.status.toLowerCase() === 'aprobado'
										? 'text-green-500'
										: 'text-orange'
								}`}>
								{p.payment.status}
							</p>
							<div className='hidden md:flex justify-evenly place-items-center w-full'>
								<FaEye
									size={20}
									color='#d9b13b'
									onClick={() => {
										setDetailsModal(true);
										setSelectedPayment(p);
									}}
									cursor='pointer'
								/>
							</div>
						</div>
					)}
				</PaginatedList>
			</section>

			<PaymentDetailsModal
				isOpen={detailsModal}
				onClose={() => setDetailsModal(false)}
				extraProps={selectedPayment}
				updateList={() => fetchPayments()}
			/>
		</div>
	);
}

export default Page;
