'use client';
import { Search, Eye } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import PaginatedList from '@/components/Global/Pagination';
import { useGetAllCarts } from '@/hooks/apiHooks';
import QuotationPriceModal from '@/components/admin/ventas/cotizaciones/QuotationModal';
import QuotationModal from '@/components/admin/ventas/cotizaciones/QuotationModal';
import Pagination from '@/components/Global/Pagination';
import QuotationRow from '@/components/admin/ventas/cotizaciones/QuotationRow';
import { Quotation } from '@/lib/types';

function Page() {
	const [detailsModal, setDetailsModal] = useState(false);
	const [selectedQuotation, setSelectedQuotation] = useState<Quotation>();
	const [filterText, setFilterText] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

	const { data: quotations } = useGetAllCarts();

	// 👉 Seguridad si el fetch aún no llega
	const allQuotations = quotations?.quotations || [];

	// 👉 Filtrado (por ID o cliente)
	const filteredQuotations = allQuotations.filter(
		(q: any) =>
			q._id.toLowerCase().includes(filterText.toLowerCase()) ||
			q.user.name.toLowerCase().includes(filterText.toLowerCase())
	);

	const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentQuotations = filteredQuotations.slice(startIndex, endIndex);

	useEffect(() => {
		setCurrentPage(1);
	}, [filterText]);

	return (
		<div className='px-4 md:px-20'>
			<header className='flex flex-col gap-4 md:h-40 justify-around'>
				<h1 className='text-xl md:text-2xl text-brown text-center md:text-left'>
					GESTIÓN DE COTIZACIONES
				</h1>

				{/* acciones */}
				<div className='flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center'>
					<div className='relative w-full md:w-64'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />

						<input
							type='text'
							placeholder='Buscar Cotización'
							value={filterText}
							onChange={(e) => setFilterText(e.target.value)}
							className='pl-10 pr-4 py-2 border border-brown rounded-lg w-full text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-brown'
						/>
					</div>
				</div>
			</header>

			<section className='w-full mx-auto mt-6 flex flex-col justify-between border-t border-gray'>
				{/* encabezado tabla - solo desktop */}
				<div className='hidden md:grid grid-cols-5 place-items-center py-6 font-semibold'>
					<p>Código</p>
					<p>Cliente</p>
					<p>Estado</p>
					<p>Items</p>
					<p>Acciones</p>
				</div>

				{/* listado con paginación */}
				{currentQuotations.length > 0 ? (
					currentQuotations.map((q: any) => (
						<QuotationRow
							key={q._id}
							q={q}
							onView={() => {
								setDetailsModal(true);
								setSelectedQuotation(q);
							}}
						/>
					))
				) : (
					<div className='text-center py-8 text-gray-500'>
						No hay cotizaciones para mostrar
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

			{/* MODAL DE DETALLES */}
			<QuotationModal
				isOpen={detailsModal}
				onClose={() => setDetailsModal(false)}
				extraProps={selectedQuotation}
			/>
		</div>
	);
}

export default Page;
