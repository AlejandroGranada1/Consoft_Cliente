'use client';

import { formatDateForInput } from '@/lib/formatDate';
import { PaymentDetails } from '@/lib/types';
import { Eye, CreditCard, CheckCircle, AlertCircle, Clock, TrendingDown } from 'lucide-react';
import { useState } from 'react';

interface PaymentRowProps {
	p: PaymentDetails;
	onView: () => void;
}

export default function PaymentRow({ p, onView }: PaymentRowProps) {
	const getStatusIcon = (status: string) => {
		const s = status?.toLowerCase();
		if (['aprobado', 'approved', 'confirmado', 'pagado', 'paid'].includes(s))
			return <CheckCircle size={14} className="text-green-400" />;
		if (['rechazado', 'rejected'].includes(s))
			return <AlertCircle size={14} className="text-red-400" />;
		return <Clock size={14} className="text-yellow-400" />;
	};

	const getStatusColor = (status: string) => {
		const s = status?.toLowerCase();
		if (['aprobado', 'approved', 'confirmado', 'pagado', 'paid'].includes(s))
			return 'bg-green-500/10 text-green-400 border border-green-500/20';
		if (['rechazado', 'rejected'].includes(s))
			return 'bg-red-500/10 text-red-400 border border-red-500/20';
		return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
	};

	const formatCurrency = (value: number) => {
		return `$${value.toLocaleString('es-CO')}`;
	};

	const total = p.summary.total || 0;
	const totalPaid = Number(p.summary.paidTotal || 0);
	const paidApproved = Number(p.summary.paidApproved || 0);

	const isApproved = ['aprobado', 'approved', 'confirmado', 'pagado', 'paid'].includes(p.payment.status?.toLowerCase());

	const progressPercentage = total > 0 ? Math.min(100, Math.round((totalPaid / total) * 100)) : 0;
	const approvedPercentage = total > 0 ? Math.min(100, Math.round((paidApproved / total) * 100)) : 0;

	const remainingWithPending = Math.max(0, total - totalPaid);
	const realRestante = Math.max(0, total - paidApproved);

	return (
		<div className='relative group'>
			{/* Desktop Version */}
			<div className='hidden md:grid grid-cols-7 items-center py-4 px-6
				rounded-2xl border border-white/10 bg-white/[0.03]
				hover:bg-white/[0.07] hover:border-[#C8A882]/30 
				transition-all duration-300 backdrop-blur-sm'>

				{/* Order ID */}
				<div className='flex items-center gap-3'>
					<div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-[#C8A882] transition-colors">
						<CreditCard size={14} />
					</div>
					<div>
						<p className="text-[10px] text-white/30 uppercase tracking-widest font-medium">Pedido</p>
						<p className="text-sm text-white/90 font-mono font-bold tracking-tight">
							#{p.summary._id.slice(-6).toUpperCase()}
						</p>
					</div>
				</div>

				{/* Payment Info / Progress */}
				<div className='col-span-2 px-8 flex flex-col gap-2'>
					<div className='flex justify-between items-end'>
						<span className='text-[10px] text-white/40 uppercase tracking-widest font-medium'>Progreso Pago</span>
						<span className='text-xs text-[#C8A882] font-black'>
							{progressPercentage}%
						</span>
					</div>

					<div className='h-2 w-full bg-white/10 rounded-full overflow-hidden relative'>
						{/* Real Progress (Green) */}
						<div
							className='absolute h-full bg-green-500 transition-all duration-1000 z-10'
							style={{ width: `${approvedPercentage}%` }}
						/>
						{/* Projected Progress */}
						<div
							className='absolute h-full bg-[#C8A882]/30 transition-all duration-1000'
							style={{ width: `${progressPercentage}%` }}
						/>
					</div>

					<div className='flex justify-between items-center text-[10px]'>
						<div className='flex flex-col'>
							<span className='text-white/20 uppercase tracking-tighter'>Pagado</span>
							<span className='text-green-400 font-bold'>{formatCurrency(totalPaid)}</span>
						</div>
						<div className='flex flex-col text-right'>
							<span className='text-[10px] text-white/30 uppercase tracking-widest font-medium'>
								Deuda Actual
							</span>
							<span className="text-xs font-bold text-white">
								{formatCurrency(total - paidApproved)}
							</span>
						</div>
					</div>
				</div>

				{/* Individual Payment Value */}
				<div className='flex flex-col items-center justify-center text-center'>
					<p className="text-base font-black text-white group-hover:text-[#C8A882] transition-all duration-300">
						{formatCurrency(p.payment.amount)}
					</p>
				</div>

				{/* Date */}
				<div className="flex flex-col items-center justify-center">
					<p className="text-[10px] text-white/20 uppercase tracking-widest font-medium mb-1">Fecha Pago</p>
					<p className="text-xs text-white/70 font-semibold tabular-nums">
						{formatDateForInput(p.payment.paidAt)}
					</p>
				</div>

				{/* Status and Warning */}
				<div className="flex flex-col items-center justify-center gap-2">
					<div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(p.payment.status)}`}>
						{getStatusIcon(p.payment.status)}
						{p.payment.status}
					</div>
					{p.summary.payments?.length === 1 && p.payment.amount < p.summary.total * 0.3 ? (
						<span className='flex items-center gap-1 text-[9px] text-yellow-500/80 font-bold italic tracking-tight animate-pulse'>
							<AlertCircle size={10} />
							Anticipo insuficiente
						</span>
					) : null}
				</div>

				{/* Actions */}
				<div className="flex items-center justify-end">
					<button
						onClick={onView}
						className="w-10 h-10 rounded-2xl flex items-center justify-center text-white/20 
							hover:text-[#C8A882] hover:bg-[#C8A882]/10 hover:border-[#C8A882]/30
							border border-transparent transition-all duration-300 active:scale-95"
						title="Ver detalles">
						<Eye size={20} />
					</button>
				</div>
			</div>

			{/* Mobile Card - Redesigned for Vertical Space */}
			<div className='md:hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-lg shadow-2xl space-y-4'>
				<div className='flex justify-between items-start'>
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#C8A882]">
							<CreditCard size={18} />
						</div>
						<div>
							<p className="text-[10px] text-white/30 uppercase font-black">Ref #{p.payment._id.slice(-6).toUpperCase()}</p>
							<p className="text-xs font-bold text-white/90">Pedido #{p.summary._id.slice(-6).toUpperCase()}</p>
						</div>
					</div>
					<div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${getStatusColor(p.payment.status)}`}>
						{p.payment.status}
					</div>
				</div>

				<div className="flex justify-between items-end bg-white/5 p-4 rounded-xl border border-white/5">
					<div className="flex flex-col">
						<span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Valor</span>
						<span className="text-2xl font-black text-[#C8A882]">{formatCurrency(p.payment.amount)}</span>
					</div>
					<div className="flex flex-col text-right">
						<span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Deuda Actual</span>
						<span className="text-xs font-mono font-bold text-white">{formatCurrency(total - paidApproved)}</span>
					</div>
				</div>

				<div className="space-y-2">
					<div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/20">
						<span>Progreso Real vs Proyectado</span>
						<span>{progressPercentage}%</span>
					</div>
					<div className='h-2 w-full bg-white/10 rounded-full overflow-hidden relative'>
						<div className='absolute h-full bg-green-500 z-10' style={{ width: `${approvedPercentage}%` }} />
						<div className='absolute h-full bg-[#C8A882]/30' style={{ width: `${progressPercentage}%` }} />
					</div>
				</div>

				<button
					onClick={onView}
					className="w-full py-3 rounded-xl bg-[#C8A882] text-white text-xs font-black uppercase tracking-widest
						hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C8A882]/20">
					<Eye size={16} />
					Detalles del Pago
				</button>
			</div>
		</div>
	);
}