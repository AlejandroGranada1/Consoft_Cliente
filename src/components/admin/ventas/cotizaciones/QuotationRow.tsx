'use client';

import { Eye, MoreVertical, FileText, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface QuotationRowProps {
	q: any;
	onView: () => void;
}

export default function QuotationRow({ q, onView }: QuotationRowProps) {
	const [showActions, setShowActions] = useState(false);

	const itemsCount = q.items?.length || 0;
	const status = q.status || 'Solicitada';

	const getStatusIcon = () => {
		switch (status.toLowerCase()) {
			case 'solicitada':
				return <Clock size={14} className="text-yellow-400" />;
			case 'aprobada':
				return <CheckCircle size={14} className="text-green-400" />;
			case 'rechazada':
				return <AlertCircle size={14} className="text-red-400" />;
			default:
				return <Clock size={14} className="text-blue-400" />;
		}
	};

	const getStatusColor = () => {
		switch (status.toLowerCase()) {
			case 'solicitada':
				return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
			case 'aprobada':
				return 'bg-green-500/10 text-green-400 border border-green-500/20';
			case 'rechazada':
				return 'bg-red-500/10 text-red-400 border border-red-500/20';
			default:
				return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
		}
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
			<div className='hidden md:grid grid-cols-5 place-items-center py-3 px-4
				rounded-xl border border-white/10 bg-white/5
				hover:bg-white/8 transition-all duration-200'>

				{/* Código */}
				<p className="text-sm text-white/60 font-mono">
					#{q._id?.slice(-6).toUpperCase()}
				</p>

				{/* Cliente */}
				<div className="text-center min-w-0 w-full">
					<p className="text-sm text-white/90 font-medium truncate">
						{q.user?.name || 'N/A'}
					</p>
					<p className="text-xs text-white/40 mt-0.5 truncate">
						{formatDate(q.createdAt)}
					</p>
				</div>

				{/* Estado */}
				<div className="flex items-center gap-1.5">
					{getStatusIcon()}
					<span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor()}`}>
						{status}
					</span>
				</div>

				{/* Items */}
				<div className="flex items-center gap-1.5">
					<Package size={12} className="text-white/40" />
					<p className="text-sm text-white/60">{itemsCount}</p>
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
							<FileText size={14} className="text-[#C8A882]" />
							<p className="text-xs text-white/40 font-mono">
								#{q._id?.slice(-6).toUpperCase()}
							</p>
						</div>
						<h3 className="text-white font-medium text-sm mt-2">{q.user?.name}</h3>
						<p className="text-xs text-white/40 mt-1">{formatDate(q.createdAt)}</p>
					</div>

					<div className="flex items-center gap-1.5">
						{getStatusIcon()}
						<span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusColor()}`}>
							{status}
						</span>
					</div>
				</div>

				<div className='flex items-center gap-2 mt-2'>
					<Package size={12} className="text-white/40" />
					<p className="text-xs text-white/60">{itemsCount} productos</p>
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