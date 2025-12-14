'use client';
import { Search, Eye } from 'lucide-react';
import { Payment, PaymentDetails, PaymentSummary } from '@/lib/types';
import PaymentDetailsModal from '@/components/admin/ventas/Pagos/PaymentDetails';
import api from '@/components/Global/axios';
import React, { useEffect, useState } from 'react';

import PaginatedList from '@/components/Global/Pagination';
import Pagination from '@/components/Global/Pagination';
import PaymentRow from '@/components/admin/ventas/Pagos/PaymentRow';

function Page() {
	const [detailsModal, setDetailsModal] = useState(false);
	const [selectedPayment, setSelectedPayment] = useState<PaymentDetails>();
	const [payments, setPayments] = useState<PaymentSummary[]>([]);
	const [filterText, setFilterText] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

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
		.map((order) => order.payments.map((payment: any) => ({ summary: order, payment })))
		.flat()
		.filter(
			(p) =>
				p.payment._id.toLowerCase().includes(filterText.toLowerCase()) ||
				p.summary._id.toLowerCase().includes(filterText.toLowerCase())
		);

	const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentPayments = filteredPayments.slice(startIndex, endIndex);

	useEffect(() => {
		setCurrentPage(1);
	}, [filterText]);

	console.log(currentPayments);

	return (
		<div className='px-4 md:px-20'>
			<header className='flex flex-col gap-4 md:h-40 justify-around'>
				<h1 className='text-xl md:text-2xl text-brown text-center md:text-left'>
					GESTIÓN DE PAGOS
				</h1>

				{/* acciones */}
				<div className='flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center'>
					<div className='relative w-full md:w-64'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />

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

				{currentPayments.length > 0 ? (
					currentPayments.map((p) => (
						<PaymentRow
							key={p.payment._id}
							p={p}
							onView={() => {
								setDetailsModal(true);
								setSelectedPayment(p);
							}}
						/>
					))
				) : (
					<div className='text-center py-8 text-gray-500'>No hay Pagos para mostrar</div>
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
