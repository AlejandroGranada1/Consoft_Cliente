'use client';
import { Order } from '@/app/types';
import CreateOrderModal from '@/components/admin/ventas/Pedidos/CreateOrderModal';
import OrderDetailsModal from '@/components/admin/ventas/Pedidos/OrderDetails';
import Pagination from '@mui/material/Pagination';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';

function page() {
	const [createModal, setCreateModal] = useState(false);
	const [detailsModal, setDetailsModal] = useState(false);
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
	const [order, setOrder] = useState<Order>();
	return (
		<div>
			<header className='flex flex-col h-60 justify-around px-20'>
				<h1 className='text-2xl  text-brown'>GESTION DE PEDIDOS</h1>
				{/* actions */}
				<div className='flex justify-between items-center'>
					<div className='relative w-64'>
						{/* Icono */}
						<FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />

						{/* Input */}
						<input
							type='text'
							placeholder='Buscar Pedido'
							className='pl-10 pr-4 py-2 border border-brown rounded-lg w-full text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-brown'
						/>
					</div>

					<button
						onClick={() => setCreateModal(true)}
						className='flex items-center py-2 w-fit px-10 border border-brown rounded-lg cursor-pointer text-brown'>
						<IoMdAdd size={25} /> Agregar Pedido
					</button>
				</div>
			</header>
			<section className='w-8/9 mx-auto h-[420px] flex flex-col justify-between border-t border-gray'>
				{/* Encabezado de la tabla */}
				<div>
					<div className='grid grid-cols-6 place-items-center py-6'>
						<p>Id Pedido</p>
						<p>Cliente</p>
						<p>Valor</p>
						<p>Estado</p>
						<p>Pago</p>
						<p>Items</p>
					</div>

					{/* Lista de roles */}
					<div className='mx-auto border-t border-brown pt-5 flex flex-col gap-4'>
						{orders.map((order) => (
							<div
								onClick={() => {
									setDetailsModal(true);
									setOrder(order);
								}}
								key={order.id}
								className='grid grid-cols-6 place-items-center py-3 border border-brown rounded-lg cursor-pointer'>
								<p>{order.id}</p>
								<p>{order.user.name}</p>
								<p>
									{order.items
										.reduce((total, item) => total + item.value, 0)
										.toLocaleString('es-CO', {
											style: 'currency',
											currency: 'COP',
										})}
								</p>
								<p
									className={`${
										order.status == 'Completado'
											? 'bg-blue-500/30 text-blue-500'
											: order.status == 'Cancelado'
											? 'bg-red/30 text-red'
											: 'bg-orange/30 text-orange'
									} px-2 py-1 rounded-xl`}>
									{order.status}
								</p>
								{/* //TODO PENSAR COMO APLICAR PAGOS */}
								<p></p>
								<p>{order.items.length}</p>
							</div>
						))}
					</div>
				</div>

				{/* Paginación al fondo */}
				<div className='w-full flex justify-center mt-5'>
					<Pagination count={Math.ceil(orders.length / 10)} />
				</div>
			</section>
			<CreateOrderModal
				isOpen={createModal}
				onClose={() => setCreateModal(false)}
			/>
      <OrderDetailsModal
      isOpen={detailsModal}
      onClose={()=> setDetailsModal(false)}
      extraProps={order}
      />
		</div>
	);
}

export default page;
