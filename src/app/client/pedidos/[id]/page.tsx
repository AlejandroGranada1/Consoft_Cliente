'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMyOrder } from '@/hooks/apiHooks';
import ItemCard from '@/components/pedidos/ItemCard';
export default function PedidoDetallePage() {
	const { id } = useParams();
	const router = useRouter();

	const { data: pedido, isLoading, error } = useMyOrder(id as string);

	if (isLoading) return <p className='p-6 text-center'>Cargando pedido...</p>;
	if (error || !pedido) return <p className='p-6 text-center'>No existe el pedido</p>;

	const productos = pedido.raw?.items ?? [];
	const attachments = pedido.raw?.attachments ?? [];

	console.log(attachments);

	return (
		<main className='p-6 bg-[#FAF4EF] min-h-screen flex flex-col justify-between'>
			<div>
				<button
					onClick={() => router.push('../pedidos')}
					className='mb-6 flex items-center gap-2 px-4 py-2 bg-[#6B4226] text-white rounded-full shadow hover:bg-[#4e2f1b] transition-colors'>
					Volver
				</button>

				<h1 className='text-center text-2xl font-bold text-[#5C3A21] mb-8'>
					Productos de {pedido.nombre}
				</h1>

				{/* Productos */}
				<div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10'>
					{productos.map((prod: any) => {
						const imagenes = attachments.filter((att: any) => att.item_id === prod._id);

						return (
							<ItemCard
								key={prod._id}
								prod={prod}
								imagenes={imagenes}
							/>
						);
					})}
				</div>

				{/* Divider */}
				<div className='flex items-center my-6'>
					<div className='flex-grow border-t border-gray-400'></div>
					<span className='px-4 text-[#8B5E3C] font-semibold'>Detalles</span>
					<div className='flex-grow border-t border-gray-400'></div>
				</div>

				{/* Info extra */}
				<div className='grid grid-cols-2 gap-6 text-lg'>
					<div>
						<p className='font-semibold text-[#8B5E3C]'>Fecha de entrega</p>
						<p>{pedido.dias}</p>
					</div>

					<div>
						<p className='font-semibold text-[#8B5E3C]'>Estado</p>
						<p>{pedido.estado}</p>
					</div>

					<div className='col-span-2'>
						<p className='font-semibold text-[#8B5E3C]'>Precio acordado</p>
						<p>{pedido.valor}</p>
					</div>
				</div>
			</div>

			{/* Acción final */}
			<div className='mt-10 flex justify-end'>
				<button
					onClick={() => router.push(`../pagos/${pedido.id}`)}
					className='px-6 py-2 bg-[#8B5E3C] text-white rounded-full shadow hover:bg-[#5C3A21] transition-colors'>
					Pagar Total / Abonar
				</button>
			</div>
		</main>
	);
}
