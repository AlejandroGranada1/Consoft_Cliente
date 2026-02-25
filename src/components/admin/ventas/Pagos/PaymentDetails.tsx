'use client';

import { 
	X, 
	CreditCard, 
	Hash, 
	Package, 
	Coins, 
	Clock, 
	Calendar, 
	CheckCircle, 
	AlertCircle,
	ArrowLeft,
	Save
} from 'lucide-react';
import { DefaultModalProps, Payment, PaymentDetails } from '@/lib/types';
import api from '@/components/Global/axios';
import React, { useState } from 'react';
import { updateElement } from '../../global/alerts';
import { formatDateForInput } from '@/lib/formatDate';

function PaymentDetailsModal({
	isOpen,
	onClose,
	extraProps,
	updateList,
}: DefaultModalProps<PaymentDetails>) {
	if (!isOpen) return null;

	const payment = extraProps?.payment;
	const order = extraProps?.summary;

	const [paymentData, setPaymentData] = useState<Payment>({
		_id: payment?._id || '',
		amount: payment?.amount || 0,
		method: payment?.method || '',
		paidAt: payment?.paidAt || new Date(),
		restante: order ? order.total - (payment?.amount || 0) : 0,
		status: payment?.status || '',
	});

	const [updating, setUpdating] = useState(false);

	const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newStatus = e.target.value;
		setPaymentData((prev) => ({ ...prev, status: newStatus }));
	};

	const handleSubmit = async () => {
		const payload = { ...paymentData, status: paymentData.status, paymentId: paymentData._id };

		setUpdating(true);
		try {
			await updateElement('Pago', `/api/payments/${order?._id}`, payload, updateList);
			const Swal = (await import('sweetalert2')).default;
			Swal.fire({
				toast: true,
				animation: false,
				timerProgressBar: true,
				showConfirmButton: false,
				title: 'Estado actualizado exitosamente',
				icon: 'success',
				position: 'top-right',
				timer: 1500,
				background: '#1e1e1c',
				color: '#fff',
			});
			onClose();
		} catch (err) {
			console.error('Error al actualizar el pago', err);
			const Swal = (await import('sweetalert2')).default;
			Swal.fire({
				title: 'Error',
				text: 'No se pudo actualizar el estado del pago',
				icon: 'error',
				background: '#1e1e1c',
				color: '#fff',
			});
		} finally {
			setUpdating(false);
		}
	};

	const getStatusBadge = (status: string) => {
		switch(status) {
			case 'aprobado':
				return <span className='bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1'><CheckCircle size={12} /> Aprobado</span>;
			case 'en_revision':
				return <span className='bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1'><AlertCircle size={12} /> En revisión</span>;
			case 'rechazado':
				return <span className='bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1'><AlertCircle size={12} /> Rechazado</span>;
			default:
				return <span className='bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-medium'>{status}</span>;
		}
	};

	const formatCurrency = (value: number) => {
		return `$${value.toLocaleString('es-CO')} COP`;
	};

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString('es-CO', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	return (
		<div className='fixed top-18 left-72 inset-0 z-50 flex items-center justify-center p-4'
			style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
			
			<div className="w-full max-w-[800px] rounded-2xl border border-white/10
				shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col max-h-[90vh]"
				style={{ background: 'rgba(30,30,28,0.95)', backdropFilter: 'blur(20px)' }}>
				
				{/* Header */}
				<header className="relative px-6 py-5 border-b border-white/10">
					<button
						onClick={onClose}
						className="absolute right-4 top-1/2 -translate-y-1/2
							p-2 rounded-lg text-white/40 hover:text-white/70
							hover:bg-white/5 transition-all duration-200">
						<X size={18} />
					</button>
					<h2 className="text-lg font-medium text-white text-center flex items-center justify-center gap-2">
						<CreditCard size={18} className="text-[#C8A882]" />
						Detalles del Pago
					</h2>
				</header>

				<div className="p-6 overflow-y-auto space-y-6">
					
					{/* IDs */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
								ID Pago
							</label>
							<div className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
								text-sm text-white/90 font-mono">
								{payment?._id}
							</div>
						</div>

						<div className="space-y-2">
							<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
								ID Pedido
							</label>
							<div className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
								text-sm text-white/90 font-mono">
								{order?._id}
							</div>
						</div>
					</div>

					{/* Montos */}
					<div className="grid grid-cols-3 gap-4">
						{/* Monto Total */}
						<div className="space-y-2">
							<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
								Monto Total
							</label>
							<div className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
								text-sm text-white/90 font-medium">
								{formatCurrency(order?.total || 0)}
							</div>
						</div>

						{/* Valor del pago */}
						<div className="space-y-2">
							<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
								Valor Pagado
							</label>
							<div className="w-full rounded-xl border border-white/15 bg-[#C8A882]/10 px-4 py-3
								text-sm text-[#C8A882] font-semibold">
								{formatCurrency(payment?.amount || 0)}
							</div>
						</div>

						{/* Valor pendiente */}
						<div className="space-y-2">
							<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
								Valor Pendiente
							</label>
							<div className={`w-full rounded-xl border border-white/15 px-4 py-3
								text-sm font-semibold
								${(order?.total! - payment?.amount!) > 0 
									? 'bg-yellow-500/10 text-yellow-400' 
									: 'bg-green-500/10 text-green-400'
								}`}>
								{formatCurrency(order?.total! - payment?.amount!)}
							</div>
						</div>
					</div>

					{/* Método y Estado */}
					<div className="grid grid-cols-2 gap-4">
						{/* Método */}
						<div className="space-y-2">
							<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
								Método de pago
							</label>
							<div className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
								text-sm text-white/90">
								{payment?.method === 'cash' && 'Efectivo'}
								{payment?.method === 'card' && 'Tarjeta de crédito/débito'}
								{payment?.method === 'transfer' && 'Transferencia bancaria'}
								{payment?.method === 'other' && 'Otro'}
								{!['cash', 'card', 'transfer', 'other'].includes(payment?.method || '') && payment?.method}
							</div>
						</div>

						{/* Estado */}
						<div className="space-y-2">
							<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
								Estado del pago
							</label>
							<div className="flex gap-3">
								<select
									value={paymentData.status}
									onChange={handleChange}
									className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-3
										text-sm text-white
										focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
										transition-all duration-200 appearance-none"
									disabled={updating}>
									<option value="aprobado" className="bg-[#1e1e1c]">Aprobado</option>
									<option value="en_revision" className="bg-[#1e1e1c]">En revisión</option>
									<option value="pendiente" className="bg-[#1e1e1c]">Pendiente</option>
									<option value="rechazado" className="bg-[#1e1e1c]">Rechazado</option>
								</select>
							</div>
						</div>
					</div>

					{/* Fecha de pago */}
					<div className="space-y-2">
						<label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
							Fecha de pago
						</label>
						<div className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
							text-sm text-white/70">
							{payment?.paidAt ? formatDateForInput(payment.paidAt) : '-'}
						</div>
					</div>

					{/* Resumen */}
					<div className="p-4 rounded-xl border border-white/10 bg-white/5">
						<div className="flex justify-between items-center mb-3">
							<p className="text-sm font-medium text-white">Resumen del pago</p>
							{getStatusBadge(paymentData.status)}
						</div>
						<div className="grid grid-cols-3 gap-4 text-xs">
							<div>
								<p className="text-white/40">Pago #</p>
								<p className="text-white/90 font-mono mt-1">{payment?._id.slice(-6)}</p>
							</div>
							<div>
								<p className="text-white/40">Pedido #</p>
								<p className="text-white/90 font-mono mt-1">{order?._id.slice(-6)}</p>
							</div>
							<div>
								<p className="text-white/40">Método</p>
								<p className="text-white/90 mt-1 capitalize">{payment?.method}</p>
							</div>
						</div>
					</div>

					{/* Botones */}
					<div className="flex justify-end gap-3 pt-4 border-t border-white/10">
						<button
							type="button"
							onClick={onClose}
							className="px-5 py-2.5 rounded-lg
								border border-white/15 bg-white/5
								text-white/70 text-sm
								hover:bg-white/10 hover:text-white
								transition-all duration-200
								flex items-center gap-2">
							<ArrowLeft size={14} />
							Cerrar
						</button>
						{paymentData.status !== payment?.status && (
							<button
								type="button"
								onClick={handleSubmit}
								disabled={updating}
								className="px-5 py-2.5 rounded-lg
									bg-[#8B5E3C] hover:bg-[#6F452A]
									text-white text-sm font-medium
									shadow-lg shadow-[#8B5E3C]/20
									disabled:opacity-50 disabled:cursor-not-allowed
									flex items-center gap-2
									transition-all duration-200">
								{updating ? (
									<>
										<span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
										Guardando...
									</>
								) : (
									<>
										<Save size={14} />
										Guardar Cambios
									</>
								)}
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default PaymentDetailsModal;