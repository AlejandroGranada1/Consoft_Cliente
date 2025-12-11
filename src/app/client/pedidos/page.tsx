'use client';

import Link from 'next/link';
import { useMyOrders } from '@/hooks/apiHooks';
import { PedidoUI } from '@/lib/types';

export default function PedidosPage() {
	const { data, isLoading, error } = useMyOrders();
	const pedidos: PedidoUI[] = data ?? [];

	console.log(pedidos);

	return (
		<main className='p-6 bg-[#fff9f4] min-h-screen'>
			<h1 className='text-2xl font-bold text-center text-[#8B5E3C] mb-8'>
				Mis pedidos
			</h1>

			{/* Loading */}
			{isLoading && (
				<div className='bg-yellow-50 border border-yellow-200 rounded-xl p-10 text-center text-[#8B5E3C] text-lg shadow-sm'>
					Cargando pedidos...
				</div>
			)}

			{/* Error */}
			{error && (
				<div className='bg-red-50 border border-red-200 rounded-xl p-10 text-center text-red-700 text-lg shadow-sm'>
					Error cargando pedidos
				</div>
			)}

			{/* Sin pedidos */}
			{!isLoading && !error && pedidos.length === 0 && (
				<div className='bg-yellow-50 border border-yellow-200 rounded-xl p-10 text-center text-[#8B5E3C] text-lg shadow-sm'>
					Aún no tienes pedidos
				</div>
			)}

			{/* Tabla de pedidos */}
			{pedidos.length > 0 && (
				<div className='overflow-x-auto shadow-lg rounded-xl border border-gray-200'>
					<table className='min-w-full text-sm text-center bg-white rounded-lg'>
						<thead className='bg-[#8B5E3C] text-white'>
							<tr>
								<th className='py-3 px-4'>Pedido</th>
								<th className='py-3 px-4'>Estado</th>
								<th className='py-3 px-4'>Valor Acordado</th>
								<th className='py-3 px-4'>Días Restantes</th>
								<th className='py-3 px-4'>Restante</th>
								<th className='py-3 px-4'>Acción</th>
							</tr>
						</thead>
						<tbody>
							{pedidos.map((p: PedidoUI) => (
								<tr
									key={p.id}
									className='border-b hover:bg-yellow-50 transition-colors'
								>
									<td className='py-3 px-4 font-medium text-[#1E293B]'>
										{p.nombre}
									</td>

									<td className='py-3 px-4'>
										<span
											className={`px-3 py-1 rounded-full text-xs font-semibold ${
												p.estado === 'Listo'
													? 'bg-green-100 text-green-700'
													: 'bg-yellow-100 text-yellow-700'
											}`}
										>
											{p.estado}
										</span>
									</td>

									<td className='py-3 px-4'>{p.valor}</td>
									<td className='py-3 px-4'>{p.dias}</td>
											
									<td className='py-3 px-4'>${p.restante}</td>

									<td className='py-3 px-4'>
										<Link
											href={`/client/pedidos/${p.id}`}
											className='inline-block px-4 py-1 bg-[#8B5E3C] text-white rounded-full text-xs font-medium shadow hover:bg-[#5C3A21] transition-colors'
										>
											Ver más
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</main>
	);
}
