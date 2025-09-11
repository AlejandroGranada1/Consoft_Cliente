'use client';
import { Order } from '@/app/types';
import Pagination from '@mui/material/Pagination';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

function page() {
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
			status: 'Entregado',
			address: 'Mi Casa',
			startDate: '',
			endDate: '2025-02-02',
			items: [
				{
					service: 'Fabricacion',
					details: 'Fabricar mueble 2 plazas',
					value: 2323,
				},
			],
			payments: [
				{
					id: '',
					amount: 20,
					method: 'slakdlkl',
					paymentDate: '',
					status: 'Aprobado',
				},
			],
		},
	]);
	const [detailsModal, setDetailsModal] = useState(false);
	const [order, setOrder] = useState<Order>();

	const sales = orders
		.filter((order) => order.status === 'Entregado')
		.map((order) => {
			const total = order.items.reduce((sum, item) => sum + item.value, 0);
			return { order, total };
		});

	return (
		<div>
			<header className='flex flex-col h-60 justify-around px-20'>
				<h1 className='text-2xl  text-brown'>GESTION DE VENTAS</h1>
				{/* actions */}
				<div className='flex justify-between items-center'>
					<div className='relative w-64'>
						{/* Icono */}
						<FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />

						{/* Input */}
						<input
							type='text'
							placeholder='Buscar Venta'
							className='pl-10 pr-4 py-2 border border-brown rounded-lg w-full text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-brown'
						/>
					</div>
				</div>
			</header>

			<section className='w-8/9 mx-auto h-[420px] flex flex-col justify-between border-t border-gray'>
				{/* Encabezado de la tabla */}
				<div>
					<div className='grid grid-cols-4 place-items-center py-6'>
						<p>Id Venta</p>
						<p>Cliente</p>
						<p>Valor de Venta</p>
						<p>Fecha de entrega</p>
					</div>

					{/* Lista de roles */}
					<div className='mx-auto border-t border-brown pt-5 flex flex-col gap-4'>
						{sales.map((sale) => (
							<div
								key={sale.order.id}
								className='grid grid-cols-4 place-items-center py-3 border border-brown rounded-lg cursor-pointer'>
								<p>{sale?.order.id}</p>
								<p>{sale?.order.user.name}</p>
								<p>
									{sale?.total.toLocaleString('es-Co', {
										style: 'currency',
										currency: 'COP',
									})}
								</p>
								<p>{sale?.order.endDate}</p>
							</div>
						))}
					</div>
				</div>

				{/* Paginación al fondo */}
				<div className='w-full flex justify-center mt-5'>
					<Pagination count={Math.ceil(orders.length / 10)} />
				</div>
			</section>
		</div>
	);
}

export default page;
