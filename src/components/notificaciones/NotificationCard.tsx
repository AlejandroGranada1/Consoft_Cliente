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
			title: 'Aceptaste la cotización',
			html: 'Se asignó tu cotización a un pedido, estaremos trabajando en ello',
			icon: 'success',
			confirmButtonColor: '#8B5A2B',
		});
	};

	return (
		<div className="border border-white/[0.07] rounded-2xl bg-[#1a1917] overflow-hidden">

			{/* ── TOP ACCENT ── */}
			<div className="h-0.5 bg-gradient-to-r from-[#8B5E3C] via-[#c4945a] to-transparent" />

			<div className="p-6 flex flex-col gap-6">

				{/* ── HEADER ── */}
				<div className="flex items-start justify-between">
					<div>
						<p className="text-[11px] font-medium tracking-widest uppercase text-[#8B5E3C] mb-1">
							Detalle
						</p>
						<h3 className="font-serif text-xl font-medium text-[#f0e8d8]">
							Cotización #{_id.slice(-5)}
						</h3>
						<p className="text-xs text-[#6b5b4e] mt-0.5">
							{formatDateForInput(createdAt)}
						</p>
					</div>

					{totalEstimate > 0 && (
						<div className="text-right">
							<p className="text-[11px] text-[#6b5b4e] mb-0.5">Total estimado</p>
							<p className="font-serif text-2xl font-medium text-[#c4945a]">
								{formatCOP(totalEstimate)}
							</p>
						</div>
					)}
				</div>

				<div className="h-px bg-white/5" />

				{/* ── PRODUCTOS ── */}
				<div className="flex flex-col gap-3">
					{items.map(item => {
						const unitPrice = (item as any).price ?? 0;
						const subtotal = unitPrice * item.quantity;
						const name = item.isCustom ? item.customDetails.name : item.product.name;
						const image = item.isCustom
							? item.customDetails.referenceImage
							: item.product.imageUrl || '/placeholder.png';

						return (
							<div
								key={item.adminNotes}
								className="flex gap-4 border border-white/[0.06] rounded-xl bg-[#151413] p-4"
							>
								{/* Imagen */}
								<img
									src={image}
									alt={name}
									className="w-20 h-20 rounded-lg object-cover border border-white/[0.06] flex-shrink-0"
								/>

								{/* Info */}
								<div className="flex-1 flex flex-col gap-1 min-w-0">
									<p className="font-medium text-[#e8e0d5] truncate">{name}</p>

									<div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-0.5">
										<span className="text-xs text-[#6b5b4e]">
											Precio unitario:{' '}
											<span className="text-[#c4b8a8]">
												{unitPrice ? formatCOP(unitPrice) : 'Pendiente'}
											</span>
										</span>
										<span className="text-xs text-[#6b5b4e]">
											Cantidad:{' '}
											<span className="text-[#c4b8a8]">{item.quantity}</span>
										</span>
										{unitPrice > 0 && (
											<span className="text-xs text-[#6b5b4e]">
												Subtotal:{' '}
												<span className="text-[#c4945a] font-medium">{formatCOP(subtotal)}</span>
											</span>
										)}
									</div>

									{item.adminNotes && (
										<p className="text-xs text-[#6b5b4e] mt-1 border-l-2 border-[#8B5E3C]/40 pl-2">
											{item.adminNotes}
										</p>
									)}
								</div>
							</div>
						);
					})}
				</div>

				<div className="h-px bg-white/5" />

				{/* ── ACCIONES ── */}
				<div className="flex flex-col gap-3">
					<p className="text-sm text-[#b0a090] text-center">
						¿Deseas continuar con este pedido?
					</p>

					<div className="flex gap-3">
						<button
							onClick={acceptAlert}
							className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#a06840] text-white text-sm font-medium hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200"
						>
							<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
								<path d="M3 8l4 4 6-7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
							Continuar
						</button>

						<button
							onClick={rejectAlert}
							className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-red-900/40 bg-red-900/10 text-red-400/80 text-sm font-medium hover:bg-red-900/20 hover:-translate-y-0.5 transition-all duration-200"
						>
							<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
								<path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
							</svg>
							Rechazar
						</button>
					</div>
				</div>

			</div>
		</div>
	);
}