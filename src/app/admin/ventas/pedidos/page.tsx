'use client';
import { Pencil, Eye, Search, Trash2, Plus } from 'lucide-react';
import { Order, User } from '@/lib/types';
import CreateOrderModal from '@/components/admin/ventas/Pedidos/CreateOrderModal';
import OrderDetailsModal from '@/components/admin/ventas/Pedidos/OrderDetails';
import { deleteElement } from '@/components/admin/global/alerts';
import api from '@/components/Global/axios';
import React, { useEffect, useState } from 'react';

import PaginatedList from '@/components/Global/Pagination';
import EditOrderModal from '@/components/admin/ventas/Pedidos/EditOrderModal';
import Pagination from '@/components/Global/Pagination';
import OrderRow from '@/components/admin/ventas/Pedidos/OrderRow';
import { useDeleteOrder, useGetOrders } from '@/hooks/useOrders';

function Page() {
	const [createModal, setCreateModal] = useState(false);
	const [detailsModal, setDetailsModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [order, setOrder] = useState<Order>();
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

	const [filterText, setFilterText] = useState('');
	const deleteOrder = useDeleteOrder();
	const { data: orders, refetch } = useGetOrders();

	// 📌 Filtrar pedidos
	const filteredOrders = orders?.filter(
		(o: Order) =>
			o._id?.toLowerCase().includes(filterText.toLowerCase()) ||
			(o.user as User).name.toLowerCase().includes(filterText.toLowerCase())
	);

	const totalPages = Math.ceil(filteredOrders?.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentOrders = filteredOrders?.slice(startIndex, endIndex);

	useEffect(() => {
		setCurrentPage(1);
	}, [filterText]);

	const handleDeleteOrder = async (id: string) => {
		const Swal = (await import('sweetalert2')).default;
		try {
			Swal.fire({
				title: '¿Estas seguro de eliminar este pedido?',
				text: 'Esta accion es irreversible',
				icon: 'warning',
				showCancelButton: true,
				showConfirmButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: 'lightgreen',
				cancelButtonText: 'Cancelar',
			}).then(async (response) => {
				if (response.isConfirmed) {
					await deleteOrder.mutateAsync(id);
					Swal.fire({
						toast: true,
						animation: false,
						timerProgressBar: true,
						showConfirmButton: false,
						title: 'Pedido eliminado exitosamente',
						icon: 'success',
						position: 'top-right',
						timer: 1500,
						customClass: {
							timerProgressBar: 'swal2-progress-bar',
						},
					});
					refetch();
				}
			});
		} catch (error: any) {
			Swal.fire({
				title: 'Error',
				text: error.message,
			});
		}
	};

	return (
		<div className='px-4 md:px-20'>
			<header className='flex flex-col gap-4 md:h-40 justify-around'>
				<h1 className='text-xl md:text-2xl text-brown text-center md:text-left'>
					GESTIÓN DE PEDIDOS
				</h1>

				{/* acciones */}
				<div className='flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center'>
					<div className='relative w-full md:w-64'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />

						<datalist id='orders'>
							{orders?.map((o: Order) => (
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
						<Plus
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

				{currentOrders?.length > 0 ? (
					currentOrders?.map((o: Order) => (
						<OrderRow
							key={o._id}
							order={o}
							onDelete={() => handleDeleteOrder(o._id!)}
							onEdit={() => {
								setEditModal(true);
								setOrder(o);
							}}
							onView={() => {
								setDetailsModal(true);
								setOrder(o);
							}}
						/>
					))
				) : (
					<div className='text-center py-8 text-gray-500'>
						No hay pedidos para mostrar
					</div>
				)}

				{totalPages > 1 && (
					<Pagination
						count={totalPages}
						page={currentPage}
						onChange={(_, newPage) => setCurrentPage(newPage)}
						className='mt-6'
					/>
				)}
			</section>

			{/* modales */}
			<CreateOrderModal
				isOpen={createModal}
				onClose={() => setCreateModal(false)}
				updateList={() => refetch()}
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
				updateList={() => refetch()}
			/>
		</div>
	);
}

export default Page;
