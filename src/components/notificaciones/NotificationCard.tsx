'use client';

import { useUserDesicion } from '@/hooks/apiHooks';
import { formatCOP } from '@/lib/formatCOP';
import { formatDateForInput } from '@/lib/formatDate';
import { QuotationItem } from '@/lib/types';
import Swal from 'sweetalert2';

interface Props {
	_id: string;
	totalEstimate: number;
	createdAt: string;
	items: QuotationItem[];
	adminNotes?: string;
	status: string;
	refetch?: () => void;
}

export default function NotificationCard({
	_id,
	totalEstimate,
	status,
	createdAt,
	items,
	adminNotes,
	refetch,
}: Props) {
	const setDesicion = useUserDesicion();

	console.log(items);

	const rejectAlert = async () => {
		const result = await Swal.fire({
			title: '¿Estás seguro de rechazar la cotización?',
			text: 'Esta acción no se puede deshacer.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#3085d6',
		});

		if (result.isConfirmed) {
			await setDesicion.mutateAsync({ quotationId: _id, decision: 'reject' });
			refetch?.();
		}

		Swal.fire({
			title: 'Cotización rechazada',
			text: 'Has rechazado la cotización.',
			icon: 'error',
			confirmButtonColor: '#8B5A2B',
		});
	};

	const acceptAlert = async () => {
		const result = await Swal.fire({
			title: '¿Deseas continuar con el pedido?',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
		});

		if (result.isConfirmed) {
			await setDesicion.mutateAsync({ quotationId: _id, decision: 'accept' });
			refetch?.();
		}

		Swal.fire({
			title: '¡Gracias por tu respuesta!',
			text: 'Nos pondremos en contacto contigo pronto.',
			icon: 'success',
			confirmButtonColor: '#8B5A2B',
		});
	};

	return (
		<div className='flex flex-col justify-evenly gap-4 bg-white shadow-sm rounded-xl p-4 border border-[#E5E5E5] hover:shadow-md transition'>
			<h3 className='text-2xl font-semibold text-[#1E293B] mb-2'>
				Informe del estado de la cotizacion {/*  */}
			</h3>
			{items.map((item) => (
				<div
					key={item.product._id}
					className='border-b border-gray-400 py-2'>
					<details className='cursor-pointer'>
						<summary>
							{item.product.name} - Cantidad: {item.quantity}
						</summary>
						<p className='text-gray-800 text-sm'>
							{item.adminNotes ? item.adminNotes : 'No hay notas del administrador para este producto'}
						</p>
					</details>
				</div>
			))}

			<section>
				<p className='text-lg font-medium text-[#1E293B]'>Total estimado: </p>
				<p className='text-xl font-semibold text-green'>{formatCOP(totalEstimate)}</p>
			</section>
			<p className='text-center'>¿Desea continuar con el pedido?</p>
			<div className='flex justify-evenly py-4 mt-2'>
				<button
					onClick={acceptAlert}
					className='px-6 py-2 rounded-lg bg-green hover:bg-green-700 text-white transition-colors cursor-pointer'>
					Continuar
				</button>
				<button
					onClick={rejectAlert}
					className='px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer'>
					Rechazar
				</button>
			</div>
			<span className='text-sm text-[#8B5E3C] mt-2 block'>
				{formatDateForInput(createdAt)}
			</span>
		</div>
	);
}
