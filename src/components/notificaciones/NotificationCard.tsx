'use client';

import { useDecision } from '@/hooks/apiHooks';
import { formatCOP } from '@/lib/formatCOP';
import { formatDateForInput } from '@/lib/formatDate';
import { QuotationItem } from '@/lib/types';

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
	createdAt,
	items,
	refetch,
}: Props) {
	const setDesicion = useDecision();

	const rejectAlert = async () => {
		const Swal = (await import('sweetalert2')).default;

		const result = await Swal.fire({
			title: '¿Estás seguro de rechazar la cotización?',
			text: 'Esta acción no se puede deshacer.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#3085d6',
		});

		if (result.isConfirmed) {
			await setDesicion.mutateAsync({ quotationId: _id, decision: 'rejected' });
			refetch?.();
		}

		await Swal.fire({
			title: 'Cotización rechazada',
			icon: 'error',
			confirmButtonColor: '#8B5A2B',
		});
	};

	const acceptAlert = async () => {
		const Swal = (await import('sweetalert2')).default;

		const result = await Swal.fire({
			title: '¿Deseas continuar con el pedido?',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
		});

		if (result.isConfirmed) {
			await setDesicion.mutateAsync({ quotationId: _id, decision: 'accepted' });
			refetch?.();
		}

		await Swal.fire({
			title: '¡Gracias por tu respuesta!',
			icon: 'success',
			confirmButtonColor: '#8B5A2B',
		});
	};

	return (
		<div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">

			{/* ───── HEADER ───── */}
			<div>
				<h3 className="text-xl font-semibold text-[#1E293B]">
					Detalle de la cotización
				</h3>
				<p className="text-sm text-gray-500">
					{formatDateForInput(createdAt)}
				</p>
			</div>

			{/* ───── PRODUCTOS ───── */}
			<div className="space-y-4">
				{items.map(item => {
					console.log(item)
					const unitPrice = (item as any).price ?? 0;
					const subtotal = unitPrice * item.quantity;

					return (
						<div
							key={item.adminNotes}
							className="flex gap-4 border rounded-lg p-4 bg-gray-50"
						>
							{/* Imagen */}
							<img
								src={item.isCustom ? item.customDetails.referenceImage : item.product.imageUrl || '/placeholder.png'}
								alt={item.isCustom ? item.customDetails.name : item.product.name}
								className="w-20 h-20 rounded-lg object-cover border"
							/>

							{/* Info */}
							<div className="flex-1 space-y-1">
								<p className="font-medium text-[#1E293B]">
									{item.isCustom ? item.customDetails.name : item.product.name}
								</p>

								<p className="text-sm text-gray-600">
									Precio unitario:{' '}
									<span className="font-medium">
										{unitPrice
											? formatCOP(unitPrice)
											: 'Pendiente'}
									</span>
								</p>

								<p className="text-sm text-gray-600">
									Cantidad: {item.quantity}
								</p>

								{unitPrice > 0 && (
									<p className="text-sm font-medium text-gray-800">
										Subtotal: {formatCOP(subtotal)}
									</p>
								)}

								<p className="text-sm text-gray-700 mt-1">
									<span className="font-medium">Nota admin:</span>{' '}
									{item.adminNotes || 'Sin notas'}
								</p>
							</div>
						</div>
					);
				})}
			</div>

			{/* ───── TOTAL ───── */}
			<div className="border-t pt-4">
				<p className="text-sm text-gray-500">Total estimado</p>
				<p className="text-2xl font-semibold text-green-600">
					{formatCOP(totalEstimate)}
				</p>
			</div>

			{/* ───── ACCIONES ───── */}
			<div className="text-center space-y-4">
				<p className="text-gray-700 font-medium">
					¿Desea continuar con el pedido?
				</p>

				<div className="flex justify-center gap-4">
					<button
						onClick={acceptAlert}
						className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
					>
						Continuar
					</button>

					<button
						onClick={rejectAlert}
						className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
					>
						Rechazar
					</button>
				</div>
			</div>

		</div>
	);
}
