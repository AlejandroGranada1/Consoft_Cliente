'use client';
import { Order, User } from '@/app/types';
import CreateOrderModal from '@/components/admin/ventas/Pedidos/CreateOrderModal';
import OrderDetailsModal from '@/components/admin/ventas/Pedidos/OrderDetails';
import { deleteElement } from '@/components/admin/global/alerts';
import api from '@/components/Global/axios';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaEye, FaSearch, FaTrash } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import PaginatedList from '@/components/Global/Pagination';
import EditOrderModal from '@/components/admin/ventas/Pedidos/EditOrderModal';

function Page() {
	const [createModal, setCreateModal] = useState(false);
	const [detailsModal, setDetailsModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [order, setOrder] = useState<Order>();

	const [orders, setOrders] = useState<Order[]>([]);
	const [filterText, setFilterText] = useState('');

	const fetchOrders = async () => {
		try {
			const response = await api.get('/api/orders');
			setOrders(response.data);
		} catch (err) {
			console.error('Error al traer pedidos', err);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);
	console.log(orders);

	// 📌 Filtrar pedidos
	const filteredOrders = orders.filter(
		(o) =>
			o._id?.toLowerCase().includes(filterText.toLowerCase()) ||
			(o.user as User).name.toLowerCase().includes(filterText.toLowerCase())
	);

	return (
		<div className='px-4 md:px-20'>
			<header className='flex flex-col gap-4 md:h-40 justify-around'>
				<h1 className='text-xl md:text-2xl text-brown text-center md:text-left'>
					GESTIÓN DE PEDIDOS
				</h1>

				{/* acciones */}
				<div className='flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center'>
					<div className='relative w-full md:w-64'>
						<FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />

						<datalist id='orders'>
							{orders.map((o) => (
								<option
									key={o._id}
									value={o._id}></option>
							))}
						</datalist>

						<input
							type='text'
							list='orders'
							placeholder='Buscar Pedido'
							value={filterText}
							onChange={(e) => setFilterText(e.target.value)}
							className='pl-10 pr-4 py-2 border border-brown rounded-lg w-full text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-brown'
						/>
					</div>

					<button
						onClick={() => setCreateModal(true)}
						className='flex items-center justify-center py-2 px-6 md:px-10 border border-brown rounded-lg cursor-pointer text-brown w-full md:w-fit'>
						<IoMdAdd
							size={25}
							className='mr-2'
						/>{' '}
						Agregar Pedido
					</button>
				</div>
			</header>

			<section className='w-full mx-auto mt-6 flex flex-col justify-between border-t border-gray'>
				{/* encabezado tabla - solo en desktop */}
				<div className='hidden md:grid grid-cols-7 place-items-center py-6 font-semibold'>
					<p>Id Pedido</p>
					<p>Cliente</p>
					<p>Valor</p>
					<p>Estado</p>
					<p>Pago</p>
					<p>Items</p>
					<p>Acciones</p>
				</div>

				{/* listado con paginación */}
				<PaginatedList
					data={filteredOrders}
					itemsPerPage={5}>
					{(o: Order) => (
						<div
							key={o._id}
							className='grid grid-cols-1 md:grid-cols-7 gap-2 md:gap-0 place-items-center py-3 border-brown/40 md:border-b md:border-brown/10 rounded-lg p-4 md:py-2'>
							{/* 📱 Vista mobile */}
							<div className='w-full md:hidden text-center space-y-2 border-b pb-4'>
								<p>
									<span className='font-semibold'>Id Pedido:</span> {o._id}
								</p>
								<p>
									<span className='font-semibold'>Cliente:</span> {(o.user as User).name}
								</p>
								<p>
									<span className='font-semibold'>Valor:</span>{' '}
									{o.items
										.reduce((total, item) => total + item.valor, 0)
										.toLocaleString('es-CO', {
											style: 'currency',
											currency: 'COP',
										})}
								</p>
								<p>
									<span className='font-semibold'>Estado:</span>{' '}
									<span
										className={`${
											o.status == 'Completado'
												? 'text-blue-500'
												: o.status == 'Cancelado'
												? 'text-red'
												: 'text-orange'
										}`}>
										{o.status}
									</span>
								</p>
								<p>
									<span className='font-semibold'>Pago:</span>{' '}
									<span
										className={`${
											o.paymentStatus === 'Pagado'
												? 'text-green-500'
												: 'text-orange'
										}`}>
										{o.paymentStatus}
									</span>
								</p>
								<p>
									<span className='font-semibold'>Items:</span> {o.items.length}
								</p>

								{/* 👁️ acciones */}
								<div className='flex gap-4 mt-2 justify-center'>
									<FaEye
										size={20}
										color='#d9b13b'
										onClick={() => {
											setDetailsModal(true);
											setOrder(o);
										}}
										cursor='pointer'
									/>
									<FaEdit
										size={20}
										color='#7588f0'
										onClick={() => {
											setEditModal(true);
											setOrder(o);
										}}
										cursor='pointer'
									/>
									<FaTrash
										size={19}
										color='#fa4334'
										onClick={() =>
											deleteElement('Pedido', `/api/orders/${o._id}`, () =>
												fetchOrders()
											)
										}
										cursor='pointer'
									/>
								</div>
							</div>

							{/* 💻 Vista desktop */}
							<p className='hidden md:block truncate w-20'>{o._id}</p>
							<p className='hidden md:block'>{(o.user as User).name}</p>
							<p className='hidden md:block'>
								{o.items
									.reduce((total, item) => total + item.valor, 0)
									.toLocaleString('es-CO', {
										style: 'currency',
										currency: 'COP',
									})}
							</p>
							<p
								className={`hidden md:block ${
									o.status == 'Completado'
										? 'text-blue-500'
										: o.status == 'Cancelado'
										? 'text-red'
										: 'text-orange'
								}`}>
								{o.status}
							</p>
							<p
								className={`hidden md:block ${
									o.paymentStatus === 'Pagado' ? 'text-green-500' : 'text-orange'
								}`}>
								{o.paymentStatus}
							</p>
							<p className='hidden md:block'>{o.items.length}</p>

							<div className='hidden md:flex justify-evenly place-items-center w-full'>
								<div className='flex gap-4 mt-2 justify-center'>
									<FaEye
										size={20}
										color='#d9b13b'
										onClick={() => {
											setDetailsModal(true);
											setOrder(o);
										}}
										cursor='pointer'
									/>
									<FaEdit
										size={20}
										color='#7588f0'
										onClick={() => {
											setEditModal(true);
											setOrder(o);
										}}
										cursor='pointer'
									/>
									<FaTrash
										size={19}
										color='#fa4334'
										onClick={() =>
											deleteElement('Pedido', `/api/orders/${o._id}`, () =>
												fetchOrders()
											)
										}
										cursor='pointer'
									/>
								</div>
							</div>
						</div>
					)}
				</PaginatedList>
			</section>

			{/* modales */}
			<CreateOrderModal
				isOpen={createModal}
				onClose={() => setCreateModal(false)}
				updateList={() => fetchOrders()}
			/>
			<OrderDetailsModal
				isOpen={detailsModal}
				onClose={() => setDetailsModal(false)}
				extraProps={order}
			/>
			<EditOrderModal
				isOpen={editModal}
				onClose={() => setEditModal(false)}
				extraProps={order}
				updateList={() => fetchOrders()}
			/>
		</div>
	);
}

export default Page;
