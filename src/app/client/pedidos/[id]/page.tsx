'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMyOrder } from '@/hooks/apiHooks';
import ItemCard from '@/components/pedidos/ItemCard';
import { useUser } from '@/providers/userContext';
import { useEffect } from 'react';

export default function PedidoDetallePage() {
	const { user, loading } = useUser();
	const router = useRouter();
	const { id } = useParams();

	/* ───────── PROTEGER RUTA ───────── */
	useEffect(() => {
		if (loading) return;

		if (user === null) {
			(async () => {
				const Swal = (await import('sweetalert2')).default;

				await Swal.fire({
					icon: 'warning',
					title: 'Inicia sesión',
					text: 'Debes iniciar sesión para ver el detalle del pedido.',
				});

				router.push('/client/auth/login');
			})();
		}
	}, [user, loading, router]);

	if (user === undefined) {
		return <p className="p-6 text-center text-gray-500">Validando sesión...</p>;
	}

	if (user === null) return null;

	/* ───────── DATA ───────── */
	const { data: pedido, isLoading, error } = useMyOrder(id as string);

	if (isLoading) {
		return <p className="p-6 text-center text-gray-500">Cargando pedido...</p>;
	}

	if (error || !pedido) {
		return (
			<p className="p-6 text-center text-gray-500">
				No se pudo cargar el pedido
			</p>
		);
	}

	const productos = pedido.raw?.items ?? [];
	const attachments = pedido.raw?.attachments ?? [];

	/* ───────── UI ───────── */
	return (
		<main className="min-h-screen bg-white p-6 flex flex-col justify-between">
			<div className="max-w-6xl mx-auto w-full">

				{/* VOLVER */}
				<button
					onClick={() => router.push('/client/pedidos')}
					className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full
						bg-[#8B5E3C] text-white shadow hover:bg-[#6B4226] transition"
				>
					← Volver
				</button>

				{/* TITULO */}
				<h1 className="text-2xl font-semibold text-[#0F172A] text-center mb-8">
					Productos de {pedido.nombre}
				</h1>

				{/* PRODUCTOS */}
				{productos.length === 0 ? (
					<p className="text-center text-gray-500">
						Este pedido no tiene productos asociados
					</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
						{productos.map((prod: any) => {
							const imagenes = attachments.filter(
								(att: any) => att.item_id === prod._id
							);

							return (
								<ItemCard
									key={prod._id}
									prod={prod}
									imagenes={imagenes}
								/>
							);
						})}
					</div>
				)}

				{/* DIVISOR */}
				<div className="flex items-center my-10">
					<div className="flex-grow border-t border-gray-200" />
					<span className="px-4 text-sm font-semibold text-gray-500">
						Detalles del pedido
					</span>
					<div className="flex-grow border-t border-gray-200" />
				</div>

				{/* DETALLES */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
					<div className="bg-[#F9FAFB] p-4 rounded-lg border">
						<p className="font-semibold text-[#0F172A]">
							Fecha de entrega
						</p>
						<p>{pedido.dias}</p>
					</div>

					<div className="bg-[#F9FAFB] p-4 rounded-lg border">
						<p className="font-semibold text-[#0F172A]">
							Estado
						</p>
						<p>{pedido.estado}</p>
					</div>

					<div className="sm:col-span-2 bg-[#F9FAFB] p-4 rounded-lg border">
						<p className="font-semibold text-[#0F172A]">
							Precio acordado
						</p>
						<p className="text-lg font-bold text-[#8B5E3C]">
							{pedido.valor}
						</p>
					</div>
				</div>
			</div>

			{/* ACCIÓN PRINCIPAL */}
			<div className="mt-10 flex justify-end max-w-6xl mx-auto w-full">
				<button
					onClick={() => router.push(`/client/pagos/${pedido.id}`)}
					className="px-6 py-3 rounded-full bg-[#8B5E3C] text-white
						shadow hover:bg-[#6B4226] transition"
				>
					Pagar / Abonar
				</button>
			</div>
		</main>
	);
}
