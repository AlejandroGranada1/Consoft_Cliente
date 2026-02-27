'use client';

import { Sale } from '@/lib/types';
import { Eye, MoreVertical, TrendingUp, CheckCircle, Clock, AlertCircle, DollarSign } from 'lucide-react';
import { useState } from 'react';

interface SaleRowProps {
	sale: Sale;
	onView: () => void;
}

export default function SaleRow({ sale, onView }: SaleRowProps) {
	const [showActions, setShowActions] = useState(false);

	const totalPagado = sale.paid ?? sale.payments?.reduce((sum, p) => sum + p.amount, 0) ?? sale.order?.payments?.reduce((sum, p) => sum + p.amount, 0) ?? 0;
	const porcentajePagado = (totalPagado / sale.total) * 100;

	const getStatusIcon = () => {
		if (porcentajePagado >= 100) return <CheckCircle size={14} className="text-green-400" />;
		if (porcentajePagado > 0) return <Clock size={14} className="text-yellow-400" />;
		return <AlertCircle size={14} className="text-red-400" />;
	};

	const getStatusText = () => {
		if (porcentajePagado >= 100) return 'Pagado';
		if (porcentajePagado > 0) return 'Parcial';
		return 'Pendiente';
	};

	const getStatusColor = () => {
		if (porcentajePagado >= 100) return 'bg-green-500/10 text-green-400 border border-green-500/20';
		if (porcentajePagado > 0) return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
		return 'bg-red-500/10 text-red-400 border border-red-500/20';
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

	const getOrderStatusStyle = (status: string | undefined) => {
		switch (status?.toLowerCase()) {
			case 'pendiente':
				return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
			case 'en proceso':
				return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
			case 'completado':
				return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
			case 'cancelado':
				return 'bg-red-500/10 text-red-400 border-red-500/20';
			default:
				return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
		}
	};

	return (
		<div className='relative group'>
			{/* Versión Desktop */}
			<div className='hidden md:grid grid-cols-7 place-items-center py-3 px-4
				rounded-xl border border-white/10 bg-white/5
				hover:bg-white/8 transition-all duration-200'>

				{/* ID Venta */}
				<p className="min-w-0 w-full truncate text-center text-sm text-white/60 font-mono">
					#{sale.order._id?.slice(-6).toUpperCase()}
				</p>

				{/* Cliente */}
				<div className="text-center min-w-0 w-full">
					<p className="text-sm text-white/90 font-medium truncate">
						{sale.user?.name || 'N/A'}
					</p>
				</div>

				{/* Total */}
				<p className="min-w-0 w-full truncate text-center text-sm text-[#C8A882] font-semibold">
					{formatCurrency(sale.total)}
				</p>

				{/* Pagado */}
				<div className="text-center min-w-0 w-full">
					<p className="text-sm text-white/90 font-medium truncate">
						{formatCurrency(totalPagado)}
					</p>
					<p className="text-xs text-white/40 mt-0.5 truncate">
						{porcentajePagado.toFixed(0)}%
					</p>
				</div>

				{/* Estado del pago */}
				<div className="flex items-center gap-1.5 min-w-0 truncate justify-center">
					{getStatusIcon()}
					<span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor()}`}>
						{getStatusText()}
					</span>
				</div>

				{/* Estado del pedido */}
				<div className="flex items-center gap-1.5 min-w-0 truncate justify-center">
					<span className={`px-2 py-0.5 rounded-full text-[10px] border font-medium ${getOrderStatusStyle(sale.order?.status)}`}>
						{sale.order?.status || 'Pendiente'}
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
							<TrendingUp size={14} className="text-[#C8A882]" />
							<p className="text-xs text-white/40 font-mono">
								Venta #{sale.order._id?.slice(-6).toUpperCase()}
							</p>
						</div>
						<h3 className="text-white font-medium text-sm mt-2">{sale.user?.name}</h3>
					</div>

					<p className="text-lg font-bold text-[#C8A882]">{formatCurrency(sale.total)}</p>
				</div>

				<div className='grid grid-cols-3 gap-2 mt-2 text-xs'>
					<div>
						<p className="text-white/40">Pagado:</p>
						<p className="text-white/90">{formatCurrency(totalPagado)}</p>
					</div>
					<div>
						<p className="text-white/40">Pago:</p>
						<div className="flex items-center gap-1 mt-1">
							{getStatusIcon()}
							<span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusColor()}`}>
								{getStatusText()}
							</span>
						</div>
					</div>
					<div>
						<p className="text-white/40">Pedido:</p>
						<div className="flex items-center gap-1 mt-1">
							<span className={`text-[10px] px-2 py-0.5 rounded-full border ${getOrderStatusStyle(sale.order?.status)}`}>
								{sale.order?.status || 'Pendiente'}
							</span>
						</div>
					</div>
				</div>

				{/* Barra de progreso */}
				<div className="mt-3">
					<div className="flex justify-between text-[10px] text-white/40 mb-1">
						<span>Progreso de pago</span>
						<span>{porcentajePagado.toFixed(0)}%</span>
					</div>
					<div className="w-full bg-white/10 rounded-full h-1.5">
						<div
							className={`h-1.5 rounded-full ${porcentajePagado === 100 ? 'bg-green-500' : 'bg-[#C8A882]'
								}`}
							style={{ width: `${porcentajePagado}%` }}
						/>
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