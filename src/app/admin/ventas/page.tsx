'use client';
import { Order, Sale } from '@/app/types';
import api from '@/components/Global/axios';
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

function SalesPage() {
	const [sales, setSales] = useState<Sale[]>([]);

	useEffect(() => {
		const fetchSales = async () => {
			const response = await api.get('/api/sales');
			console.log(response.data)
			setSales(response.data.sales);
		};
		fetchSales();
	}, []);

	return (
		<div>
			<header className='flex flex-col h-60 justify-around px-20'>
				<h1 className='text-2xl text-brown'>GESTIÓN DE VENTAS</h1>
				<div className='flex justify-between items-center'>
					<div className='relative w-64'>
						<FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
						<input
							type='text'
							placeholder='Buscar Venta'
							className='pl-10 pr-4 py-2 border border-brown rounded-lg w-full text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-brown'
						/>
					</div>
				</div>
			</header>

			<section className='w-8/9 mx-auto h-[420px] flex flex-col justify-between border-t border-gray'>
				<div>
					{/* Encabezado de tabla */}
					<div className='grid grid-cols-5 place-items-center py-6 font-semibold'>
						<p>Id Venta</p>
						<p>Cliente</p>
						<p>Total</p>
						<p>Pagado</p>
						<p>Estado</p>
					</div>

					{/* Lista de ventas */}
					<div className='mx-auto border-t border-brown pt-5 flex flex-col gap-4'>
						{sales?.map((sale) => (
							<div
								key={sale._id}
								className='grid grid-cols-5 place-items-center py-3 border border-brown rounded-lg'>
								<p className='truncate w-20'>{sale._id}</p>
								<p>{sale.user?.name || '---'}</p>
								<p>
									{sale.total.toLocaleString('es-CO', {
										style: 'currency',
										currency: 'COP',
									})}
								</p>
								<p>
									{sale.paid.toLocaleString('es-CO', {
										style: 'currency',
										currency: 'COP',
									})}
								</p>
								<p
									className={`${
										sale.restante === 0
											? 'bg-green/30 text-green'
											: 'bg-orange/30 text-orange'
									} px-2 py-1 rounded-xl`}>
									{sale.restante === 0 ? 'Pagado' : 'Pendiente'}
								</p>
							</div>
						))}
					</div>
				</div>

				{/* Paginación */}
				<div className='w-full flex justify-center mt-5'>
					<Pagination count={Math.ceil(sales?.length / 10)} />
				</div>
			</section>
		</div>
	);
}

export default SalesPage;
