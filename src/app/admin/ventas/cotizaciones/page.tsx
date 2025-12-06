'use client';
import React, { useState } from 'react';
import { FaSearch, FaEye } from 'react-icons/fa';
import PaginatedList from '@/components/Global/Pagination';
import { useGetAllCarts } from '@/hooks/apiHooks';
import QuotationPriceModal from '@/components/admin/ventas/cotizaciones/QuotationModal';
import QuotationModal from '@/components/admin/ventas/cotizaciones/QuotationModal';

function Page() {
	const [detailsModal, setDetailsModal] = useState(false);
	const [selectedQuotation, setSelectedQuotation] = useState<any>();
	const [filterText, setFilterText] = useState('');

	const { data: quotations } = useGetAllCarts();

	// 👉 Seguridad si el fetch aún no llega
	const allQuotations = quotations?.quotations || [];

	// 👉 Filtrado (por ID o cliente)
	const filteredQuotations = allQuotations.filter(
		(q) =>
			q._id.toLowerCase().includes(filterText.toLowerCase()) ||
			q.user.name.toLowerCase().includes(filterText.toLowerCase())
	);

	return (
		<div className='px-4 md:px-20'>
			<header className='flex flex-col gap-4 md:h-40 justify-around'>
				<h1 className='text-xl md:text-2xl text-brown text-center md:text-left'>
					GESTIÓN DE COTIZACIONES
				</h1>

				{/* acciones */}
				<div className='flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center'>
					<div className='relative w-full md:w-64'>
						<FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />

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
				<PaginatedList
					data={filteredQuotations}
					itemsPerPage={5}>
					{(q) => (
						<div
							key={q._id}
							className='grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-0 place-items-center py-3 border-brown/40 md:border-b md:border-brown/10 rounded-lg p-4 md:py-2'>
							{/* MOBILE VIEW */}
							<div className='w-full md:hidden text-center space-y-2 border-b pb-4'>
								<p>
									<span className='font-semibold'>Código:</span> {q._id}
								</p>
								<p>
									<span className='font-semibold'>Cliente:</span> {q.user?.name}
								</p>
								<p>
									<span className='font-semibold'>Estado:</span> {q.status == "en_proceso" ? "En proceso" : q.status}
								</p>
								<p>
									<span className='font-semibold'>Items:</span> {q.items.length}
								</p>

								{/* acciones mobile */}
								<div className='flex gap-4 mt-2 justify-center'>
									<FaEye
										size={20}
										color='#d9b13b'
										onClick={() => {
											setDetailsModal(true);
											setSelectedQuotation(q);
										}}
										cursor='pointer'
									/>
								</div>
							</div>

							{/* DESKTOP VIEW */}
							<p className='hidden md:block'>{q._id}</p>
							<p className='hidden md:block'>{q.user.name}</p>
							<p className='hidden md:block capitalize'>{q.status == "en_proceso" ? "En proceso" : q.status}</p>
							<p className='hidden md:block'>{q.items.length}</p>

							<div className='hidden md:flex justify-evenly place-items-center w-full'>
								<FaEye
									size={20}
									color='#d9b13b'
									onClick={() => {
										setDetailsModal(true);
										setSelectedQuotation(q);
									}}
									cursor='pointer'
								/>
							</div>
						</div>
					)}
				</PaginatedList>
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
