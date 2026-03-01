'use client';

import { Visit } from '@/lib/types';
import { Eye, Trash2, MoreVertical, MapPin, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Edit2 } from 'lucide-react';
import { useState } from 'react';

interface VisitRowProps {
	visit: Visit;
	onView: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

export default function VisitRow({ visit, onView, onEdit, onDelete }: VisitRowProps) {
	const [showActions, setShowActions] = useState(false);

	const getStatusIcon = () => {
		switch (visit.status) {
			case 'Terminada':
				return <CheckCircle size={14} className="text-green-400" />;
			case 'En proceso':
				return <Clock size={14} className="text-blue-400" />;
			case 'Cancelada':
				return <XCircle size={14} className="text-red-400" />;
			case 'Programada':
				return <Calendar size={14} className="text-yellow-400" />;
			default:
				return <AlertCircle size={14} className="text-orange-400" />;
		}
	};

	const getStatusColor = () => {
		switch (visit.status) {
			case 'Terminada':
				return 'bg-green-500/10 text-green-400 border border-green-500/20';
			case 'En proceso':
				return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
			case 'Cancelada':
				return 'bg-red-500/10 text-red-400 border border-red-500/20';
			case 'Programada':
				return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
			default:
				return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
		}
	};

	const formatDate = (date: string | Date) => {
		return new Date(date).toLocaleDateString('es-CO', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	};

	const formatTime = (date: string | Date) => {
		return new Date(date).toLocaleTimeString('es-CO', {
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	return (
		<div className='relative group'>
			{/* Versión Desktop */}
			<div className='hidden md:grid grid-cols-5 place-items-center py-3 px-4
				rounded-xl border border-white/10 bg-white/5
				hover:bg-white/8 transition-all duration-200'>

				{/* ID Visita */}
				<p className="text-sm text-white/60 font-mono">
					#{visit._id?.slice(-6).toUpperCase()}
				</p>

				{/* Fecha */}
				<div className="text-center">
					<p className="text-sm text-white/90 font-medium">
						{formatDate(visit.visitDate)}
					</p>
					<p className="text-xs text-white/40 mt-0.5">
						{formatTime(visit.visitDate)}
					</p>
				</div>

				{/* Cliente */}
				<div className='min-w-0 w-full text-center'>
					<p className="text-sm text-white/90 font-medium truncate">
						{visit.user?.name || 'N/A'}
					</p>
				</div>

				{/* Estado */}
				<div className="flex items-center gap-1.5">
					{getStatusIcon()}
					<span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor()}`}>
						{visit.status}
					</span>
				</div>

				{/* Acciones */}
				<div className="flex items-center gap-2">
					<button
						onClick={onEdit}
						className="p-1.5 rounded-lg text-white/40 hover:text-[#C8A882]
							hover:bg-white/5 transition-all duration-200"
						title="Reprogramar">
						<Edit2 size={16} />
					</button>
					<button
						onClick={onView}
						className="p-1.5 rounded-lg text-white/40 hover:text-[#C8A882]
							hover:bg-white/5 transition-all duration-200"
						title="Ver detalles">
						<Eye size={16} />
					</button>
					<button
						onClick={onDelete}
						className="p-1.5 rounded-lg text-white/40 hover:text-red-400
							hover:bg-white/5 transition-all duration-200"
						title="Eliminar">
						<Trash2 size={16} />
					</button>
				</div>
			</div>

			{/* Versión Mobile */}
			<div className='md:hidden rounded-xl border border-white/10 bg-white/5 p-4'>
				<div className='flex justify-between items-start mb-3'>
					<div>
						<div className="flex items-center gap-2">
							<MapPin size={14} className="text-[#C8A882]" />
							<p className="text-xs text-white/40 font-mono">
								#{visit._id?.slice(-6).toUpperCase()}
							</p>
						</div>
						<h3 className="text-white font-medium text-sm mt-2">{visit.user?.name}</h3>
						<div className="flex items-center gap-2 mt-1">
							<Calendar size={12} className="text-white/40" />
							<p className="text-xs text-white/60">{formatDate(visit.visitDate)}</p>
							<Clock size={12} className="text-white/40 ml-1" />
							<p className="text-xs text-white/60">{formatTime(visit.visitDate)}</p>
						</div>
					</div>

					<div className="flex items-center gap-1.5">
						{getStatusIcon()}
						<span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusColor()}`}>
							{visit.status}
						</span>
					</div>
				</div>

				<div className='flex justify-between items-center mt-3'>
					<p className="text-xs text-white/40 truncate max-w-[200px]">
						{visit.address}
					</p>
					<div className='flex gap-2'>
						<button
							onClick={onView}
							className="p-2 rounded-lg text-white/40 hover:text-[#C8A882]
								hover:bg-white/5 transition-all duration-200">
							<Eye size={18} />
						</button>
						<button
							onClick={() => setShowActions(!showActions)}
							className='p-2 rounded-lg text-white/40 hover:text-white
								hover:bg-white/5 transition-all'>
							<MoreVertical size={18} />
						</button>
					</div>
				</div>

				{showActions && (
					<div className='absolute right-4 mt-2 w-32 rounded-lg
						border border-white/10 bg-[#252320] shadow-lg z-10'>
						<button
							onClick={() => { onEdit(); setShowActions(false); }}
							className='w-full px-4 py-2 text-left text-sm text-white/70
								hover:bg-white/5 rounded-lg
								flex items-center gap-2'>
							<Edit2 size={14} /> Reprogramar
						</button>
						<button
							onClick={() => { onDelete(); setShowActions(false); }}
							className='w-full px-4 py-2 text-left text-sm text-red-400
								hover:bg-white/5 rounded-lg
								flex items-center gap-2'>
							<Trash2 size={14} /> Eliminar
						</button>
					</div>
				)}
			</div>
		</div>
	);
}