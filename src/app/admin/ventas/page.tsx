'use client';
import { Eye, Search } from 'lucide-react';
import { Sale } from '@/lib/types';
import api from '@/components/Global/axios';
import React, { useEffect, useState } from 'react';

import PaginatedList from '@/components/Global/Pagination';
import Pagination from '@/components/Global/Pagination';
import SaleRow from '@/components/admin/ventas/Ventas/SaleRow';

function SalesPage() {
	const [sales, setSales] = useState<Sale[]>([]);
	const [Sale, setSale] = useState<Sale>();
	const [detailsModal, setDetailsModal] = useState(false);
	const [filterText, setFilterText] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

	useEffect(() => {
		const fetchSales = async () => {
			const response = await api.get('/api/sales');
			setSales(response.data.sales);
		};
		fetchSales();
	}, []);

	console.log(sales);
	const filteredSales = sales.filter(
		(s) =>
			s.order._id?.toLowerCase().includes(filterText.toLowerCase()) ||
			s.user?.name.toLowerCase().includes(filterText.toLowerCase())
	);

	const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentSales = filteredSales.slice(startIndex, endIndex);

	useEffect(() => {
		setCurrentPage(1);
	}, [filterText]);

	return (
		<div className='px-4 md:px-20'>
			<header className='flex flex-col gap-4 md:h-60 justify-around'>
				<h1 className='text-xl md:text-2xl text-brown text-center md:text-left'>
					GESTIÓN DE VENTAS
				</h1>

				{/* buscador */}
				<div className='relative w-full md:w-64'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
					<input
						type='text'
						placeholder='Buscar Venta'
						value={filterText}
						onChange={(e) => setFilterText(e.target.value)}
						className='pl-10 pr-4 py-2 border border-brown rounded-lg w-full text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-brown'
					/>
				</div>
			</header>

			<section className='w-full mx-auto mt-6 flex flex-col justify-between border-t border-gray'>
				{/* encabezado tabla solo desktop */}
				<div className='hidden md:grid grid-cols-6 place-items-center py-6 font-semibold'>
					<p>Id Venta</p>
					<p>Cliente</p>
					<p>Total</p>
					<p>Pagado</p>
					<p>Estado</p>
					<p>Acciones</p>
				</div>

				{/* listado con paginación */}
				{currentSales.length > 0 ? (
					currentSales.map((sale) => (
						<SaleRow
							key={sale.order._id}
							sale={sale}
							onView={() => {
								setDetailsModal(true);
								setSale(sale);
							}}
						/>
					))
				) : (
					<div className='text-center py-8 text-gray-500'>No hay ventas para mostrar</div>
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
		</div>
	);
}

export default SalesPage;
