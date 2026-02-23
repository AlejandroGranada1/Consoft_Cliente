'use client';

import Link from 'next/link';
import { useMyOrders } from '@/hooks/apiHooks';
import { PedidoUI } from '@/lib/types';
import { useUser } from '@/providers/userContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PackageOpen, ChevronRight } from 'lucide-react';

const getStatusStyle = (estado: string) => {
	switch (estado?.toLowerCase()) {
		case 'listo':
		case 'completado':
			return 'bg-green-100 text-green-700';
		case 'cancelado':
			return 'bg-red-100 text-red-700';
		case 'en proceso':
			return 'bg-blue-100 text-blue-700';
		default:
			return 'bg-yellow-100 text-yellow-700';
	}
};

export default function PedidosPage() {
	const { user, loading } = useUser();
	const router = useRouter();
	const { data, isLoading, error } = useMyOrders();

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

	if (user === undefined)
		return <p className='p-6 text-center text-sm text-gray-400'>Validando sesión...</p>;
	if (user === null) return null;

	const pedidos: PedidoUI[] = data ?? [];

	return (
		<main className='min-h-screen bg-[#F5ECD7] py-10 px-6'>
			<div className='max-w-5xl mx-auto space-y-6'>
				<h1 className='text-xl font-semibold text-gray-800'>Mis pedidos</h1>

				{/* LOADING */}
				{isLoading && (
					<div className='bg-white rounded-2xl shadow-sm p-10 text-center'>
						<div className='animate-spin rounded-full h-6 w-6 border-2 border-[#6e4424] border-t-transparent mx-auto' />
						<p className='text-sm text-gray-400 mt-3'>Cargando pedidos...</p>
					</div>
				)}

				{/* ERROR */}
				{error && (
					<div className='bg-white rounded-2xl shadow-sm p-10 text-center'>
						<p className='text-sm text-red-500'>
							Ocurrió un error cargando tus pedidos
						</p>
					</div>
				)}

				{/* EMPTY */}
				{!isLoading && !error && pedidos.length === 0 && (
					<div className='bg-white rounded-2xl shadow-sm p-12 flex flex-col items-center gap-3 text-gray-300'>
						<PackageOpen size={48} />
						<p className='text-sm text-gray-400'>Aún no tienes pedidos registrados</p>
						<Link
							href='/client/productos'
							className='mt-2 px-5 py-2 rounded-xl bg-[#6e4424] text-white text-sm hover:bg-[#5a3519] transition'>
							Explorar productos
						</Link>
					</div>
				)}

				{/* TABLA */}
				{pedidos.length > 0 && (
					<div className='bg-white rounded-2xl shadow-sm overflow-hidden'>
						{/* Header */}
						<div className='px-6 py-4 border-b border-gray-100'>
							<h2 className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
								{pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''} encontrado
								{pedidos.length !== 1 ? 's' : ''}
							</h2>
						</div>

						{/* Desktop table */}
						<div className='hidden md:block overflow-x-auto'>
							<table className='min-w-full text-sm'>
								<thead>
									<tr className='border-b border-gray-100'>
										<th className='py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
											Pedido
										</th>
										<th className='py-3 px-6 text-center text-xs font-medium text-gray-400 uppercase tracking-wider'>
											Estado
										</th>
										<th className='py-3 px-6 text-center text-xs font-medium text-gray-400 uppercase tracking-wider'>
											Valor
										</th>
										<th className='py-3 px-6 text-center text-xs font-medium text-gray-400 uppercase tracking-wider'>
											Entrega
										</th>
										<th className='py-3 px-6 text-center text-xs font-medium text-gray-400 uppercase tracking-wider'>
											Restante
										</th>
										<th className='py-3 px-6' />
									</tr>
								</thead>
								<tbody className='divide-y divide-gray-50'>
									{pedidos.map((p: PedidoUI) => (
										<tr
											key={p.id}
											className='hover:bg-gray-50 transition'>
											<td className='py-4 px-6'>
												<p className='font-medium text-gray-800'>
													{p.nombre}
												</p>
												<p className='text-xs text-gray-400 mt-0.5'>
													#{p.id?.slice(-8).toUpperCase()}
												</p>
											</td>
											<td className='py-4 px-6 text-center'>
												<span
													className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(p.estado)}`}>
													{p.estado}
												</span>
											</td>
											<td className='py-4 px-6 text-center text-sm font-medium text-gray-800'>
												{p.valor}
											</td>
											<td className='py-4 px-6 text-center text-sm text-gray-600'>
												{p.dias}
											</td>
											<td className='py-4 px-6 text-center text-sm text-gray-600'>
												${p.restante}
											</td>
											<td className='py-4 px-6 text-right'>
												<Link
													href={`/client/pedidos/${p.id}`}
													className='inline-flex items-center gap-1 px-4 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-[#6e4424] hover:text-white hover:border-[#6e4424] transition'>
													Ver detalle <ChevronRight size={12} />
												</Link>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* Mobile cards */}
						<div className='md:hidden divide-y divide-gray-50'>
							{pedidos.map((p: PedidoUI) => (
								<div
									key={p.id}
									className='px-4 py-4 space-y-3'>
									<div className='flex items-start justify-between'>
										<div>
											<p className='font-medium text-gray-800 text-sm'>
												{p.nombre}
											</p>
											<p className='text-xs text-gray-400 mt-0.5'>
												#{p.id?.slice(-8).toUpperCase()}
											</p>
										</div>
										<span
											className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(p.estado)}`}>
											{p.estado}
										</span>
									</div>
									<div className='grid grid-cols-3 gap-2 text-center'>
										{[
											{ label: 'Valor', value: p.valor },
											{ label: 'Entrega', value: p.dias },
											{ label: 'Restante', value: `$${p.restante}` },
										].map((item) => (
											<div
												key={item.label}
												className='bg-gray-50 rounded-lg p-2'>
												<p className='text-xs text-gray-400'>
													{item.label}
												</p>
												<p className='text-xs font-medium text-gray-700 mt-0.5'>
													{item.value}
												</p>
											</div>
										))}
									</div>
									<Link
										href={`/client/pedidos/${p.id}`}
										className='flex items-center justify-center gap-1 w-full py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-[#6e4424] hover:text-white hover:border-[#6e4424] transition'>
										Ver detalle <ChevronRight size={12} />
									</Link>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
