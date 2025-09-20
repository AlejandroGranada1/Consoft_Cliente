'use client';
import { Order, PaymentDetails, PaymentSummary } from '@/app/types';
import PaymentDetailsModal from '@/components/admin/ventas/Pagos/PaymentDetails';
import api from '@/components/Global/axios';
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

function Page() {
	const [detailsModal, setDetailsModal] = useState(false);
	const [selectedPayment, setSelectedPayment] = useState<PaymentDetails>();
	const [order, setOrder] = useState();

	const [payments, setPayments] = useState<PaymentSummary[]>([]);

	useEffect(() => {
		const fetchPayments = async () => {
			const response = await api.get('/api/payments');
			console.log(response.data);
			setPayments(response.data.payments); // 👈 usamos el array "payments" del backend
		};
		fetchPayments();
	}, []);

	return (
		<div>
			<header className='flex flex-col h-60 justify-around px-20'>
				<h1 className='text-2xl  text-brown'>GESTIÓN DE PAGOS</h1>
				{/* actions */}
				<div className='flex justify-between items-center'>
					<div className='relative w-64'>
						{/* Icono */}
						<FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />

						{/* Input */}
						<input
							type='text'
							placeholder='Buscar Pago'
							className='pl-10 pr-4 py-2 border border-brown rounded-lg w-full text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-brown'
						/>
					</div>
				</div>
			</header>

			<section className='w-8/9 mx-auto h-[420px] flex flex-col justify-between border-t border-gray'>
				{/* Encabezado de la tabla */}
				<div>
					<div className='grid grid-cols-7 place-items-center py-6 font-semibold'>
						<p>Id Pago</p>
						<p>Pedido</p>
						<p>Monto Total</p>
						<p>Valor de Pago</p>
						<p>Pendiente</p>
						<p>Fecha de Pago</p>
						<p>Estado</p>
					</div>

					{/* Lista de pagos */}
					<div className='mx-auto border-t border-brown pt-5 flex flex-col gap-4'>
						{payments.map((order) =>
							order.payments.map((payment) => (
								<div
									key={payment._id}
									onClick={() => {
										setDetailsModal(true);
										setSelectedPayment({
											summary: order,
											payment,
										});
									}}
									className='grid grid-cols-7 place-items-center py-3 border border-brown rounded-lg cursor-pointer'>
									<p className='truncate w-20'>{payment._id}</p>
									<p className='truncate w-20'>{order._id}</p>
									<p>
										{order.total.toLocaleString('es-CO', {
											style: 'currency',
											currency: 'COP',
										})}
									</p>
									<p>
										{payment.amount.toLocaleString('es-CO', {
											style: 'currency',
											currency: 'COP',
										})}
									</p>
									<p>
										{payment.restante.toLocaleString('es-CO', {
											style: 'currency',
											currency: 'COP',
										})}
									</p>
									<p>{new Date(payment.paidAt).toLocaleDateString('es-CO')}</p>
									<p
										className={`${
											payment.status.toLowerCase() === 'aprobado'
												? 'bg-green/30 text-green'
												: 'bg-orange/30 text-orange'
										} px-2 py-1 rounded-xl`}>
										{payment.status}
									</p>
								</div>
							))
						)}
					</div>
				</div>

				{/* Paginación al fondo */}
				<div className='w-full flex justify-center mt-5'>
					<Pagination count={Math.ceil(payments.length / 10)} />
				</div>
			</section>
			<PaymentDetailsModal
				isOpen={detailsModal}
				onClose={() => setDetailsModal(false)}
				extraProps={selectedPayment}
			/>
		</div>
	);
}

export default Page;
