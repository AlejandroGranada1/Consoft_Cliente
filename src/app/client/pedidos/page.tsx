'use client';

import Link from 'next/link';
import { useMyOrders } from '@/hooks/apiHooks';
import { PedidoUI } from '@/lib/types';
import { useUser } from '@/providers/userContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PedidosPage() {
	const { user, loading } = useUser();
	const router = useRouter();
	const { data, isLoading, error } = useMyOrders();

	console.log(data?.raw)

	/* ───────── PROTEGER RUTA ───────── */
	useEffect(() => {
		if (loading) return;

		if (user === null) {
			(async () => {
				const Swal = (await import('sweetalert2')).default;

				await Swal.fire({
					icon: 'warning',
					title: 'Inicia sesión',
					text: 'Debes iniciar sesión para ver tus pedidos.',
				});

				router.push('/client/auth/login');
			})();
		}
	}, [user, loading, router]);

	if (user === undefined) {
		return <p className='p-6 text-center text-gray-500'>Validando sesión...</p>;
	}

	if (user === null) return null;

	/* ───────── DATA ───────── */
	const pedidos: PedidoUI[] = data ?? [];

	/* ───────── UI ───────── */
	return (
		<main className='min-h-screen bg-white p-6'>
			<div className='max-w-6xl mx-auto'>
				{/* TITULO */}
				<h1 className='text-2xl font-semibold text-[#0F172A] text-center mb-8'>
					Mis pedidos
				</h1>

				{/* LOADING */}
				{isLoading && (
					<div className='bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-500'>
						Cargando pedidos...
					</div>
				)}

				{/* ERROR */}
				{error && (
					<div className='bg-red-50 border border-red-200 rounded-xl p-8 text-center text-red-600'>
						Ocurrió un error cargando tus pedidos
					</div>
				)}

				{/* EMPTY */}
				{!isLoading && !error && pedidos.length === 0 && (
					<div className='bg-gray-50 border border-gray-200 rounded-xl p-10 text-center'>
						<p className='text-gray-600 mb-4'>Aún no tienes pedidos registrados</p>
						<Link
							href='/client/productos'
							className='inline-block px-6 py-2 rounded-full bg-[#8B5E3C] text-white hover:bg-[#6B4226] transition'>
							Explorar productos
						</Link>
					</div>
				)}

				{/* TABLA */}
				{pedidos.length > 0 && (
					<div className='overflow-x-auto border border-gray-200 rounded-xl shadow-sm'>
						<table className='min-w-full text-sm bg-white'>
							<thead className='bg-[#8B5E3C] text-white'>
								<tr>
									<th className='py-3 px-4 text-left'>Pedido</th>
									<th className='py-3 px-4 text-center'>Estado</th>
									<th className='py-3 px-4 text-center'>Valor</th>
									<th className='py-3 px-4 text-center'>Entrega</th>
									<th className='py-3 px-4 text-center'>Restante</th>
									<th className='py-3 px-4 text-right'>Acción</th>
								</tr>
							</thead>

							<tbody>
								{pedidos.map((p: PedidoUI) => (
									<tr
										key={p.id}
										className='border-b last:border-none hover:bg-gray-50 transition'>
										<td className='py-3 px-4 font-medium text-[#0F172A]'>
											{p.nombre}
										</td>

										<td className='py-3 px-4 text-center'>
											<span
												className={`px-3 py-1 rounded-full text-xs font-semibold
													${p.estado === 'Listo' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
												{p.estado}
											</span>
										</td>

										<td className='py-3 px-4 text-center'>{p.valor}</td>

										<td className='py-3 px-4 text-center'>{p.dias}</td>

										<td className='py-3 px-4 text-center'>${p.restante}</td>

										<td className='py-3 px-4 text-right'>
											<Link
												href={`/client/pedidos/${p.id}`}
												className='inline-block px-4 py-2 rounded-full bg-[#8B5E3C]
													text-white text-xs font-medium hover:bg-[#6B4226] transition'>
												Ver detalle
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</main>
	);
}
