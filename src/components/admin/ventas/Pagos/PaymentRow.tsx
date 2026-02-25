'use client';

import { formatDateForInput } from '@/lib/formatDate';
import { PaymentDetails } from '@/lib/types';
import { Eye, MoreVertical, CreditCard, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useState } from 'react';

interface PaymentRowProps {
	p: PaymentDetails;
	onView: () => void;
}

export default function PaymentRow({ p, onView }: PaymentRowProps) {
	const [showActions, setShowActions] = useState(false);

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'aprobado':
				return <CheckCircle size={14} className="text-green-400" />;
			case 'en_revision':
				return <AlertCircle size={14} className="text-yellow-400" />;
			case 'rechazado':
				return <AlertCircle size={14} className="text-red-400" />;
			default:
				return <Clock size={14} className="text-blue-400" />;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'aprobado':
				return 'bg-green-500/10 text-green-400 border border-green-500/20';
			case 'en_revision':
				return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
			case 'rechazado':
				return 'bg-red-500/10 text-red-400 border border-red-500/20';
			default:
				return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
		}
	};

	const formatCurrency = (value: number) => {
		return `$${value.toLocaleString('es-CO')}`;
	};

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString('es-CO', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	};

	return (
		<div className='relative group'>
			{/* Versión Desktop */}
			<div className='hidden md:grid grid-cols-8 place-items-center py-3 px-4
				rounded-xl border border-white/10 bg-white/5
				hover:bg-white/8 transition-all duration-200'>
				
				{/* ID Pago */}
				<p className="text-sm text-white/60 font-mono">
					#{p.payment._id.slice(-6).toUpperCase()}
				</p>

				{/* ID Pedido */}
				<p className="text-sm text-white/60 font-mono">
					#{p.summary._id.slice(-6).toUpperCase()}
				</p>

				{/* Monto Total */}
				<p className="text-sm text-white/90 font-medium">
					{formatCurrency(p.summary.total)}
				</p>

				{/* Valor Pago */}
				<p className="text-sm text-[#C8A882] font-semibold">
					{formatCurrency(p.payment.amount)}
				</p>

				{/* Pendiente */}
				<p className={`text-sm font-medium ${
					p.summary.total - p.payment.amount > 0 
						? 'text-yellow-400' 
						: 'text-green-400'
				}`}>
					{formatCurrency(p.summary.total - p.payment.amount)}
				</p>

				{/* Fecha Pago */}
				<p className="text-sm text-white/60">
					{formatDateForInput(p.payment.paidAt)}
				</p>

				{/* Estado */}
				<div className="flex items-center gap-1.5">
					{getStatusIcon(p.payment.status)}
					<span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(p.payment.status)}`}>
						{p.payment.status}
					</span>
				</div>

				{/* Acciones */}
				<div className="flex items-center gap-2">
					<button
						onClick={onView}
						className="p-1.5 rounded-lg text-white/40 hover:text-[#C8A882]
							hover:bg-white/5 transition-all duration-200"
						title="Ver detalles">
						<Eye size={16} />
					</button>
				</div>
			</div>

			{/* Versión Mobile */}
			<div className='md:hidden rounded-xl border border-white/10 bg-white/5 p-4'>
				<div className='flex justify-between items-start mb-3'>
					<div>
						<div className="flex items-center gap-2">
							<CreditCard size={14} className="text-[#C8A882]" />
							<p className="text-xs text-white/40 font-mono">
								Pago #{p.payment._id.slice(-6).toUpperCase()}
							</p>
						</div>
						<p className="text-xs text-white/40 mt-1 font-mono">
							Pedido #{p.summary._id.slice(-6).toUpperCase()}
						</p>
						<div className="flex items-center gap-2 mt-2">
							{getStatusIcon(p.payment.status)}
							<span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusColor(p.payment.status)}`}>
								{p.payment.status}
							</span>
						</div>
					</div>

					<p className="text-lg font-bold text-[#C8A882]">{formatCurrency(p.payment.amount)}</p>
				</div>

				<div className='grid grid-cols-2 gap-2 mt-2 text-xs'>
					<div>
						<p className="text-white/40">Total:</p>
						<p className="text-white/90">{formatCurrency(p.summary.total)}</p>
					</div>
					<div>
						<p className="text-white/40">Pendiente:</p>
						<p className={p.summary.total - p.payment.amount > 0 ? 'text-yellow-400' : 'text-green-400'}>
							{formatCurrency(p.summary.total - p.payment.amount)}
						</p>
					</div>
				</div>

				<div className='flex justify-end mt-3'>
					<button
						onClick={onView}
						className="p-2 rounded-lg text-white/40 hover:text-[#C8A882]
							hover:bg-white/5 transition-all duration-200">
						<Eye size={18} />
					</button>
				</div>
			</div>
		</div>
	);
}