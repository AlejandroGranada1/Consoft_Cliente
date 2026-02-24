'use client';

import { Service } from '@/lib/types';
import { Eye, Edit, Trash2, MoreVertical, Wrench, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

interface ServiceRowProps {
	service: Service;
	onView: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

export default function ServiceRow({ service, onView, onEdit, onDelete }: ServiceRowProps) {
	const [showActions, setShowActions] = useState(false);

	return (
		<div className='relative group'>
			{/* Versión Desktop */}
			<div className='hidden md:grid grid-cols-4 place-items-center py-3 px-4
				rounded-xl border border-white/10 bg-white/5
				hover:bg-white/8 transition-all duration-200'>
				
				{/* Servicio */}
				<div className="text-center">
					<p className="text-sm text-white/90 font-medium">
						{service.name}
					</p>
					{service.description && (
						<p className="text-xs text-white/40 mt-0.5 max-w-[200px] truncate">
							{service.description}
						</p>
					)}
				</div>

				{/* Descripción (en desktop) */}
				<p className="text-sm text-white/60 max-w-[250px] truncate">
					{service.description || 'Sin descripción'}
				</p>

				{/* Estado */}
				<div className="flex items-center gap-1.5">
					{service.status ? (
						<CheckCircle size={14} className="text-green-400" />
					) : (
						<XCircle size={14} className="text-red-400" />
					)}
					<span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
						service.status 
							? 'bg-green-500/10 text-green-400 border border-green-500/20' 
							: 'bg-red-500/10 text-red-400 border border-red-500/20'
					}`}>
						{service.status ? 'Activo' : 'Inactivo'}
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
					<button
						onClick={onEdit}
						className="p-1.5 rounded-lg text-white/40 hover:text-[#C8A882]
							hover:bg-white/5 transition-all duration-200"
						title="Editar">
						<Edit size={16} />
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
							<Wrench size={14} className="text-[#C8A882]" />
							<p className="text-xs text-white/40 font-mono">
								ID: #{service._id?.slice(-6).toUpperCase()}
							</p>
						</div>
						<h3 className="text-white font-medium text-sm mt-2">{service.name}</h3>
						{service.description && (
							<p className="text-xs text-white/40 mt-1 max-w-[200px]">
								{service.description}
							</p>
						)}
					</div>

					<div className="flex items-center gap-1.5">
						{service.status ? (
							<CheckCircle size={14} className="text-green-400" />
						) : (
							<XCircle size={14} className="text-red-400" />
						)}
						<span className={`text-[10px] px-2 py-0.5 rounded-full ${
							service.status 
								? 'bg-green-500/10 text-green-400 border border-green-500/20' 
								: 'bg-red-500/10 text-red-400 border border-red-500/20'
						}`}>
							{service.status ? 'Activo' : 'Inactivo'}
						</span>
					</div>
				</div>

				<div className='flex justify-end mt-3'>
					<button
						onClick={() => setShowActions(!showActions)}
						className='p-2 rounded-lg text-white/40 hover:text-white
							hover:bg-white/5 transition-all'>
						<MoreVertical size={18} />
					</button>

					{showActions && (
						<div className='absolute right-4 mt-8 w-32 rounded-lg
							border border-white/10 bg-[#252320] shadow-lg z-10'>
							<button
								onClick={() => { onView(); setShowActions(false); }}
								className='w-full px-4 py-2 text-left text-sm text-white/70
									hover:bg-white/5 first:rounded-t-lg
									flex items-center gap-2'>
								<Eye size={14} /> Ver
							</button>
							<button
								onClick={() => { onEdit(); setShowActions(false); }}
								className='w-full px-4 py-2 text-left text-sm text-white/70
									hover:bg-white/5
									flex items-center gap-2'>
								<Edit size={14} /> Editar
							</button>
							<button
								onClick={() => { onDelete(); setShowActions(false); }}
								className='w-full px-4 py-2 text-left text-sm text-red-400
									hover:bg-white/5 last:rounded-b-lg
									flex items-center gap-2'>
								<Trash2 size={14} /> Eliminar
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}