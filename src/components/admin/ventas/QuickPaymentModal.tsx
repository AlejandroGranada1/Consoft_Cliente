// components/admin/ventas/QuickPaymentModal.tsx
'use client';

import { X, DollarSign, Receipt, Camera } from 'lucide-react';
import { useState } from 'react';

export default function QuickPaymentModal({ order, onClose, onSuccess }) {
	const [amount, setAmount] = useState(order.total * 0.3); // 30% por defecto
	const [method, setMethod] = useState<'offline_cash' | 'offline_transfer'>('offline_cash');
	const [notes, setNotes] = useState('');
	const [proofImage, setProofImage] = useState<File | null>(null);

	const handleSubmit = async () => {
		// Registrar pago offline
		await api.post(`/api/orders/${order._id}/payments`, {
			amount,
			method,
			notes:
				notes ||
				`Pago offline - ${method === 'offline_cash' ? 'Efectivo' : 'Transferencia'}`,
			status: 'approved', // Se aprueba automáticamente porque el admin lo recibe
			registeredBy: adminId,
			// Si hay imagen, subirla
		});

		// Actualizar estado del pedido si ya alcanzó el mínimo
		if (calculateTotalPaid(order) + amount >= order.total * 0.3) {
			await api.patch(`/api/orders/${order._id}`, {
				status: 'En proceso',
				paymentStatus: 'Parcial',
			});
		}

		onSuccess();
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40'>
			<div className='bg-[#252320] rounded-xl border border-white/10 p-6 max-w-md w-full'>
				<h2 className='text-white text-lg font-medium mb-4'>Registrar pago offline</h2>

				<div className='space-y-4'>
					{/* Monto */}
					<div>
						<label className='text-white/40 text-xs mb-1 block'>Monto recibido *</label>
						<input
							type='number'
							value={amount}
							onChange={(e) => setAmount(Number(e.target.value))}
							className='w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2 text-white'
						/>
						<p className='text-xs text-white/30 mt-1'>
							Mínimo requerido: ${(order.total * 0.3).toLocaleString()}
						</p>
					</div>

					{/* Método */}
					<div>
						<label className='text-white/40 text-xs mb-1 block'>Método de pago *</label>
						<div className='grid grid-cols-2 gap-2'>
							<button
								onClick={() => setMethod('offline_cash')}
								className={`p-3 rounded-lg border transition ${
									method === 'offline_cash'
										? 'border-[#C8A882] bg-[#C8A882]/10 text-white'
										: 'border-white/10 bg-white/5 text-white/40'
								}`}>
								💵 Efectivo
							</button>
							<button
								onClick={() => setMethod('offline_transfer')}
								className={`p-3 rounded-lg border transition ${
									method === 'offline_transfer'
										? 'border-[#C8A882] bg-[#C8A882]/10 text-white'
										: 'border-white/10 bg-white/5 text-white/40'
								}`}>
								🏦 Transferencia
							</button>
						</div>
					</div>

					{/* Notas */}
					<div>
						<label className='text-white/40 text-xs mb-1 block'>Notas (opcional)</label>
						<textarea
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder='Ej: Recibido en efectivo en tienda física'
							className='w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2 text-white text-sm'
							rows={2}
						/>
					</div>

					{/* Comprobante (opcional) */}
					<div>
						<label className='text-white/40 text-xs mb-1 block'>
							Comprobante (opcional)
						</label>
						<label className='flex items-center gap-2 p-3 border border-dashed border-white/15 rounded-lg cursor-pointer hover:border-[#C8A882]/40'>
							<Camera
								size={18}
								className='text-white/40'
							/>
							<span className='text-sm text-white/60'>
								{proofImage ? proofImage.name : 'Subir foto del comprobante'}
							</span>
							<input
								type='file'
								className='hidden'
								onChange={(e) => setProofImage(e.target.files?.[0] || null)}
							/>
						</label>
					</div>

					{/* Botones */}
					<div className='flex gap-3 pt-4'>
						<button
							onClick={onClose}
							className='flex-1 px-4 py-2 border border-white/15 rounded-lg text-white/60 hover:text-white'>
							Cancelar
						</button>
						<button
							onClick={handleSubmit}
							className='flex-1 px-4 py-2 bg-[#8B5E3C] rounded-lg text-white hover:bg-[#6F452A]'>
							Registrar pago
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
