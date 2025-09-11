'use client';
import { Order, PaymentDetails } from '@/app/types';
import PaymentDetailsModal from '@/components/admin/ventas/Pagos/PaymentDetails';
import Pagination from '@mui/material/Pagination';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

function Page() {
	const [detailsModal, setDetailsModal] = useState(false);
	const [selectedPayment, setSelectedPayment] = useState<PaymentDetails>();
	const [order, setOrder] = useState<Order>();

	const [orders, setOrders] = useState<Order[]>([
		{
			id: 'ORD-001',
			user: {
				id: 'askdljaklsdajklsd',
				name: 'Mark Wilson',
				email: 'Markwilson@gmail.com',
				address: 'Medellin',
				phone: '12344556778',
				password: 'aslkdlkasjkld',
				role: {
					id: '',
					name: 'administrador',
					description: 'Acceso completo',
					permissions: [],
					createdAt: '',
					status: true,
					usersCount: 0,
				},
				status: true,
				registeredAt: '2025/02/02',
				featuredProducts: [],
			},
			status: 'Completado',
			address: 'Mi Casa',
			startDate: '',
			endDate: '',
			items: [
				{
					service: 'Fabricacion',
					details: 'Fabricar mueble 2 plazas',
					value: 2300000,
				},
			],
			payments: [
				{
					id: 'PAY-001',
					amount: 300000,
					method: 'Transferencia',
					paymentDate: '2025-02-05',
					status: 'Aprobado',
				},
				{
					id: 'PAY-002',
					amount: 300000,
					method: 'Transferencia',
					paymentDate: '2025-02-06',
					status: 'Aprobado',
				},
			],
		},
	]);

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
						{orders.map((order) => {
							const total = order.items.reduce((sum, item) => sum + item.value, 0);
							return order.payments.map((payment) => (
								<div
									onClick={() => {
										const total = order.items.reduce(
											(sum, item) => sum + item.value,
											0
										);
										setDetailsModal(true);
										setSelectedPayment({
											order,
											payment,
											total,
										});
									}}
									key={payment.id}
									className='grid grid-cols-7 place-items-center py-3 border border-brown rounded-lg cursor-pointer'>
									<p>{payment.id}</p>
									<p>{order.id}</p>
									<p>${total.toLocaleString('es-CO')}</p>
									<p>${payment.amount.toLocaleString('es-CO')}</p>
									<p>${(total - payment.amount).toLocaleString('es-CO')}</p>
									<p>{payment.paymentDate || '---'}</p>
									<p
										className={`${
											payment.status == 'Aprobado'
												? 'bg-green/30 text-green'
												: order.status == 'Rechazado'
												? 'bg-red/30 text-red'
												: 'bg-orange/30 text-orange'
										} px-2 py-1 rounded-xl`}>
										{payment.status}
									</p>
								</div>
							));
						})}
					</div>
				</div>

				{/* Paginación al fondo */}
				<div className='w-full flex justify-center mt-5'>
					<Pagination count={Math.ceil(orders.length / 10)} />
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
