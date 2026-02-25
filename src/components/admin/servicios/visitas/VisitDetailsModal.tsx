'use client';
import {
	X,
	User,
	MapPin,
	Calendar,
	Clock,
	Edit2,
	CheckCircle,
	AlertCircle,
	Mail,
	Phone,
} from 'lucide-react';
import { DefaultModalProps, Visit } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import EditVisitModal from './EditVisitModal';
import { updateElement } from '../../global/alerts';
import Swal from 'sweetalert2';

function VisitDetailsModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<Visit>) {
	const [editModal, setEditModal] = useState(false);
	const [status, setStatus] = useState(extraProps?.status || 'Programada');
	const [visitData, setVisitData] = useState<Visit>({
		_id: extraProps?._id || undefined,
		user: extraProps?.user!,
		address: extraProps?.address || '',
		status: extraProps?.status || '',
		visitDate: extraProps?.visitDate || new Date(),
	});

	useEffect(() => {
		if (extraProps?.status) {
			setStatus(extraProps.status);
		}
		if (extraProps) {
			setVisitData(extraProps);
		}
	}, [extraProps]);

	const formatDateTime = () => {
		if (!extraProps?.visitDate) return { date: '', time: '' };
		const date = new Date(extraProps.visitDate);
		return {
			date: date.toLocaleDateString('es-CO', {
				weekday: 'long',
				day: 'numeric',
				month: 'long',
				year: 'numeric',
			}),
			time: date.toLocaleTimeString('es-CO', {
				hour: '2-digit',
				minute: '2-digit',
			}),
		};
	};

	const formattedDateTime = formatDateTime();

	const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newStatus = e.target.value;
		setStatus(newStatus);

		const payload = {
			...visitData,
			status: newStatus,
			visitDate: extraProps?.visitDate,
		};

		try {
			await updateElement('Visita', `/api/visits/${extraProps?._id}`, payload, updateList);
			setVisitData((prev) => ({ ...prev, status: newStatus }));
			
			Swal.fire({
				toast: true,
				animation: false,
				timerProgressBar: true,
				showConfirmButton: false,
				title: 'Estado actualizado',
				icon: 'success',
				position: 'top-right',
				timer: 1500,
				background: '#1e1e1c',
				color: '#fff',
			});
		} catch (err) {
			console.error('Error actualizando estado', err);
			setStatus(extraProps?.status || 'Programada');
		}
	};

	const getStatusColor = () => {
		switch (status) {
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

	const getStatusIcon = () => {
		switch (status) {
			case 'Terminada':
				return <CheckCircle size={16} className="text-green-400" />;
			case 'En proceso':
				return <Clock size={16} className="text-blue-400" />;
			case 'Cancelada':
				return <X size={16} className="text-red-400" />;
			default:
				return <AlertCircle size={16} className="text-yellow-400" />;
		}
	};

	if (!isOpen) return null;

	return (
		<>
			<div className='fixed top-18 left-72 inset-0 z-50 flex items-center justify-center p-4'
				style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
				
				<div className="w-full max-w-3xl rounded-2xl border border-white/10
					shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col max-h-[90vh]"
					style={{ background: 'rgba(30,30,28,0.95)', backdropFilter: 'blur(20px)' }}>
					
					{/* Header */}
					<header className="relative px-6 py-5 border-b border-white/10">
						<div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
							<button
								onClick={() => setEditModal(true)}
								className="p-2 rounded-lg text-white/40 hover:text-[#C8A882]
									hover:bg-white/5 transition-all duration-200"
								title="Editar visita">
								<Edit2 size={18} />
							</button>
							<button
								onClick={onClose}
								className="p-2 rounded-lg text-white/40 hover:text-white/70
									hover:bg-white/5 transition-all duration-200">
								<X size={18} />
							</button>
						</div>
						<h2 className="text-lg font-medium text-white text-center flex items-center justify-center gap-2">
							<MapPin size={18} className="text-[#C8A882]" />
							Detalles de la visita
						</h2>
					</header>

					<div className="p-6 overflow-y-auto space-y-6">

						{/* Información del cliente */}
						<div className="rounded-xl border border-white/10 bg-white/5 p-4">
							<h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
								<User size={16} className="text-[#C8A882]" />
								Información del cliente
							</h3>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-xs text-white/40">Nombre completo</p>
									<p className="text-sm text-white/90 mt-1">
										{extraProps?.user?.name || 'No especificado'}
									</p>
								</div>
								<div>
									<p className="text-xs text-white/40">Email</p>
									<p className="text-sm text-white/90 mt-1 flex items-center gap-1">
										<Mail size={12} className="text-white/40" />
										{extraProps?.user?.email || 'No especificado'}
									</p>
								</div>
								<div>
									<p className="text-xs text-white/40">Teléfono</p>
									<p className="text-sm text-white/90 mt-1 flex items-center gap-1">
										<Phone size={12} className="text-white/40" />
										{extraProps?.user?.phone || 'No registrado'}
									</p>
								</div>
								<div>
									<p className="text-xs text-white/40">ID del cliente</p>
									<p className="text-sm text-white/60 font-mono mt-1">
										{extraProps?.user?._id?.substring(0, 8) || 'N/A'}
									</p>
								</div>
							</div>
						</div>

						{/* Dirección */}
						<div className="rounded-xl border border-white/10 bg-white/5 p-4">
							<h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
								<MapPin size={16} className="text-[#C8A882]" />
								Dirección de la visita
							</h3>
							<p className="text-sm text-white/90">
								{extraProps?.address || 'No especificada'}
							</p>
						</div>

						{/* Fecha y hora */}
						<div className="grid grid-cols-2 gap-4">
							<div className="rounded-xl border border-white/10 bg-white/5 p-4">
								<h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
									<Calendar size={16} className="text-[#C8A882]" />
									Fecha
								</h3>
								<p className="text-sm text-white/90">
									{formattedDateTime.date}
								</p>
							</div>

							<div className="rounded-xl border border-white/10 bg-white/5 p-4">
								<h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
									<Clock size={16} className="text-[#C8A882]" />
									Hora
								</h3>
								<p className="text-2xl font-bold text-[#C8A882]">
									{formattedDateTime.time}
								</p>
							</div>
						</div>

						{/* Estado */}
						<div className="grid grid-cols-2 gap-4">
							<div className="rounded-xl border border-white/10 bg-white/5 p-4">
								<h3 className="text-sm font-medium text-white mb-3">Estado actual</h3>
								<div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getStatusColor()}`}>
									{getStatusIcon()}
									<span className="text-sm font-medium">{status}</span>
								</div>
							</div>

							<div className="rounded-xl border border-white/10 bg-white/5 p-4">
								<h3 className="text-sm font-medium text-white mb-3">Cambiar estado</h3>
								<select
									value={status}
									onChange={handleStatusChange}
									className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
										text-sm text-white
										focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
										transition-all duration-200 appearance-none">
									<option value="Programada" className="bg-[#1e1e1c]">Programada</option>
									<option value="En proceso" className="bg-[#1e1e1c]">En proceso</option>
									<option value="Terminada" className="bg-[#1e1e1c]">Terminada</option>
									<option value="Cancelada" className="bg-[#1e1e1c]">Cancelada</option>
								</select>
							</div>
						</div>

						{/* Información adicional */}
						<div className="rounded-xl border border-white/10 bg-white/5 p-4">
							<h3 className="text-sm font-medium text-white mb-3">Información adicional</h3>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-xs text-white/40">ID de la visita</p>
									<p className="text-sm text-white/60 font-mono mt-1">
										{extraProps?._id}
									</p>
								</div>
								<div>
									<p className="text-xs text-white/40">Creado por</p>
									<p className="text-sm text-white/90 mt-1">
										Administrador del sistema
									</p>
								</div>
							</div>
						</div>

						{/* Resumen */}
						<div className="p-4 rounded-xl bg-[#C8A882]/10 border border-[#C8A882]/20">
							<h4 className="text-sm font-medium text-[#C8A882] mb-3">Resumen de la visita</h4>
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<p className="text-white/40">Cliente:</p>
									<p className="text-white/90 font-medium">{extraProps?.user?.name}</p>
								</div>
								<div>
									<p className="text-white/40">Fecha:</p>
									<p className="text-white/90">
										{new Date(extraProps?.visitDate || new Date()).toLocaleDateString('es-CO')}
									</p>
								</div>
								<div>
									<p className="text-white/40">Hora:</p>
									<p className="text-white/90">{formattedDateTime.time}</p>
								</div>
								<div>
									<p className="text-white/40">Estado:</p>
									<p className="text-white/90">{status}</p>
								</div>
								<div className="col-span-2">
									<p className="text-white/40">Dirección:</p>
									<p className="text-white/90">{extraProps?.address}</p>
								</div>
							</div>
						</div>

						{/* Botón cerrar */}
						<div className="flex justify-end pt-4 border-t border-white/10">
							<button
								type="button"
								onClick={onClose}
								className="px-5 py-2.5 rounded-lg
									border border-white/15 bg-white/5
									text-white/70 text-sm
									hover:bg-white/10 hover:text-white
									transition-all duration-200">
								Cerrar
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Edit Modal */}
			<EditVisitModal
				isOpen={editModal}
				onClose={() => setEditModal(false)}
				extraProps={extraProps}
				updateList={() => {
					if (updateList) updateList();
					onClose();
				}}
			/>
		</>
	);
}

export default VisitDetailsModal;