'use client';
import {
	X,
	User,
	MapPin,
	Calendar,
	Clock,
	CheckSquare,
	Edit2,
	CheckCircle,
	Clock as ClockIcon,
} from 'lucide-react';
import { DefaultModalProps, Service, Visit } from '@/lib/types';
import React, { useEffect, useState } from 'react';

import EditVisitModal from './EditVisitModal';
import { updateElement } from '../../global/alerts';
import { useGetServices } from '@/hooks/apiHooks';

function VisitDetailsModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<Visit>) {
	const [editModal, setEditModal] = useState(false);
	const [status, setStatus] = useState(extraProps?.status || 'Pendiente');
	const [visitData, setVisitData] = useState<Visit>({
		_id: extraProps?._id || undefined,
		user: extraProps?.user!,
		address: extraProps?.address || '',
		services: extraProps?.services || [],
		status: extraProps?.status || '',
		visitDate: extraProps?.visitDate || new Date(),
	});

	// Traer servicios de la API
	const { data, isLoading: servicesLoading } = useGetServices();
	const services = data?.data || [];

	// Cuando cambie el modal, sincronizar el estado inicial
	useEffect(() => {
		if (extraProps?.status) {
			setStatus(extraProps.status);
		}
		if (extraProps) {
			setVisitData(extraProps);
		}
	}, [extraProps]);

	// Función para marcar los servicios seleccionados
	const isServiceChecked = (serviceId: string) => {
		return extraProps?.services.some((s) => s._id === serviceId);
	};

	// Obtener servicios seleccionados con detalles
	const selectedServices = services.filter((service: any) =>
		extraProps?.services.some((s: Service) => s._id === service._id)
	);

	// Formatear fecha y hora
	const formatDateTime = () => {
		if (!extraProps?.visitDate) return '';
		const date = new Date(extraProps.visitDate);
		return {
			date: date.toLocaleDateString('es-ES', {
				weekday: 'long',
				day: 'numeric',
				month: 'long',
				year: 'numeric',
			}),
			time: date.toLocaleTimeString('es-ES', {
				hour: '2-digit',
				minute: '2-digit',
			}),
		};
	};

	const formattedDateTime = formatDateTime();

	// Cambiar estado y actualizar en API
	const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newStatus = e.target.value;
		setStatus(newStatus);

		const payload = {
			...visitData,
			status: newStatus,
			visitDate: extraProps?.visitDate, // Mantener la fecha original
		};

		try {
			await updateElement('Visita', `/api/visits/${extraProps?._id}`, payload, updateList);
			setVisitData((prev) => ({ ...prev, status: newStatus }));
		} catch (err) {
			console.error('Error actualizando estado', err);
			// Revertir estado en caso de error
			setStatus(extraProps?.status || 'Pendiente');
		}
	};

	// Función para obtener el color del estado
	const getStatusColor = () => {
		switch (status) {
			case 'Terminada':
				return 'bg-green-50 border-green-200 text-green-800';
			case 'En proceso':
				return 'bg-blue-50 border-blue-200 text-blue-800';
			case 'Cancelada':
				return 'bg-red-50 border-red-200 text-red-800';
			default: // Pendiente
				return 'bg-orange-50 border-orange-200 text-orange-800';
		}
	};

	// Función para obtener el ícono del estado
	const getStatusIcon = () => {
		switch (status) {
			case 'Terminada':
				return (
					<CheckCircle
						size={16}
						className='text-green-600'
					/>
				);
			case 'En proceso':
				return (
					<ClockIcon
						size={16}
						className='text-blue-600'
					/>
				);
			case 'Cancelada':
				return (
					<X
						size={16}
						className='text-red-600'
					/>
				);
			default:
				return (
					<ClockIcon
						size={16}
						className='text-orange-600'
					/>
				);
		}
	};

	if (!isOpen) return null;

	return (
		<div className='modal-bg'>
			<div className='modal-frame w-[800px] p-6'>
				<header className='relative mb-6'>
					<button
						onClick={onClose}
						className='absolute top-0 left-0 p-1 text-gray-500 hover:text-black cursor-pointer hover:bg-gray-100 rounded-full'>
						<X size={20} />
					</button>
					<h1 className='text-2xl font-bold text-center text-gray-800'>
						Detalles de la Visita
					</h1>
					<p className='text-center text-gray-600 text-sm mt-1'>
						Información completa de la visita programada
					</p>
				</header>

				<div className='space-y-6'>
					{/* Información del cliente */}
					<div className='bg-gray-50 p-4 rounded-lg border'>
						<h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
							<User size={18} />
							Información del Cliente
						</h3>

						<div className='grid grid-cols-2 gap-4'>
							<div>
								<p className='text-sm text-gray-600 mb-1'>Nombre completo</p>
								<p className='font-medium text-gray-800'>
									{extraProps?.user?.name || 'No especificado'}
								</p>
							</div>
							<div>
								<p className='text-sm text-gray-600 mb-1'>Email</p>
								<p className='font-medium text-gray-800'>
									{extraProps?.user?.email || 'No especificado'}
								</p>
							</div>
							<div>
								<p className='text-sm text-gray-600 mb-1'>Teléfono</p>
								<p className='font-medium text-gray-800'>
									{extraProps?.user?.phone || 'No registrado'}
								</p>
							</div>
							<div>
								<p className='text-sm text-gray-600 mb-1'>ID del cliente</p>
								<p className='font-medium text-gray-800 text-sm font-mono'>
									{extraProps?.user?._id?.substring(0, 8) || 'N/A'}
								</p>
							</div>
						</div>
					</div>

					{/* Dirección de la visita */}
					<div className='bg-gray-50 p-4 rounded-lg border'>
						<h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
							<MapPin size={18} />
							Dirección de la Visita
						</h3>

						<div className='space-y-3'>
							<div>
								<p className='text-sm text-gray-600 mb-1'>Dirección completa</p>
								<p className='font-medium text-gray-800'>
									{extraProps?.address || 'No especificada'}
								</p>
							</div>
						</div>
					</div>

					{/* Fecha y hora */}
					<div className='grid grid-cols-2 gap-6'>
						<div className='bg-gray-50 p-4 rounded-lg border'>
							<h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
								<Calendar size={18} />
								Fecha programada
							</h3>

							<div className='space-y-2'>
								<div className='flex items-center gap-2'>
									<p className='text-2xl font-bold text-gray-800'>
										{new Date(extraProps?.visitDate || new Date()).getDate()}
									</p>
									<div>
										<p className='font-medium text-gray-800'>
											{formattedDateTime.date.split(',')[0]}
										</p>
										<p className='text-sm text-gray-600'>
											{formattedDateTime.date.split(',')[1]}
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className='bg-gray-50 p-4 rounded-lg border'>
							<h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
								<Clock size={18} />
								Hora programada
							</h3>

							{/* <div className='space-y-2'>
								<p className='text-2xl font-bold text-gray-800'>
									{formattedDateTime.time}
								</p>
								<div className='inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm'>
									<Clock size={14} />
									<span>Duración estimada: 1-2 horas</span>
								</div>
							</div> */}
						</div>
					</div>

					{/* Servicios */}
					<div className='bg-gray-50 p-4 rounded-lg border'>
						<h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
							<CheckSquare size={18} />
							Servicios Solicitados
						</h3>

						{servicesLoading ? (
							<div className='text-center py-4'>
								<p className='text-gray-500'>Cargando servicios...</p>
							</div>
						) : selectedServices.length > 0 ? (
							<div className='grid grid-cols-2 gap-3'>
								{selectedServices.map((service: Service) => (
									<div
										key={service._id}
										className='p-3 rounded-lg border border-gray-200 bg-white'>
										<div className='flex items-center gap-3'>
											<div className='flex items-center justify-center w-8 h-8 bg-brown/10 rounded-full'>
												<CheckSquare
													size={16}
													className='text-brown'
												/>
											</div>
											<div className='flex-1'>
												<p className='font-medium text-gray-800'>
													{service.name}
												</p>
												{service.description && (
													<p className='text-sm text-gray-600 mt-1'>
														{service.description}
													</p>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className='text-center py-6 border border-dashed border-gray-300 rounded-lg'>
								<CheckSquare
									size={24}
									className='mx-auto text-gray-400 mb-2'
								/>
								<p className='text-gray-500'>
									No hay servicios asignados a esta visita
								</p>
							</div>
						)}

						<div className='mt-4'>
							<p className='text-sm text-gray-600'>
								Total de servicios:{' '}
								<span className='font-medium'>{selectedServices.length}</span>
							</p>
						</div>
					</div>

					{/* Estado de la visita */}
					<div className='grid grid-cols-2 gap-6'>
						<div className='bg-gray-50 p-4 rounded-lg border'>
							<h3 className='font-semibold text-lg mb-3'>Estado de la visita</h3>

							<div className='flex items-center gap-3 mb-4'>
								<div
									className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor()}`}>
									{getStatusIcon()}
									<span className='font-medium'>{status}</span>
								</div>
							</div>

							<div className='space-y-2'>
								<label className='font-medium mb-1'>Cambiar estado</label>
								<select
									value={status}
									onChange={handleStatusChange}
									className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown w-full'>
									<option value='Pendiente'>Pendiente</option>
									<option value='En proceso'>En proceso</option>
									<option value='Terminada'>Terminada</option>
									<option value='Cancelada'>Cancelada</option>
								</select>
								<p className='text-xs text-gray-500 mt-1'>
									El cambio de estado se guarda automáticamente
								</p>
							</div>
						</div>

						<div className='bg-gray-50 p-4 rounded-lg border'>
							<h3 className='font-semibold text-lg mb-3'>Información adicional</h3>

							<div className='space-y-3'>
								<div>
									<p className='text-sm text-gray-600 mb-1'>ID de la visita</p>
									<p className='font-medium text-gray-800 text-sm font-mono'>
										{extraProps?._id?.substring(0, 12) || 'N/A'}
									</p>
								</div>
								<div>
									<p className='text-sm text-gray-600 mb-1'>Creado por</p>
									<p className='font-medium text-gray-800'>
										Administrador del sistema
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Resumen */}
					<div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
						<h4 className='font-semibold text-blue-800 mb-3 flex items-center gap-2'>
							Resumen de la visita
						</h4>
						<div className='grid grid-cols-2 gap-4 text-sm'>
							<div>
								<p className='text-gray-600'>Cliente:</p>
								<p className='font-medium text-gray-800'>
									{extraProps?.user?.name}
								</p>
							</div>
							<div>
								<p className='text-gray-600'>Fecha:</p>
								<p className='font-medium text-gray-800'>
									{new Date(
										extraProps?.visitDate || new Date()
									).toLocaleDateString('es-ES')}
								</p>
							</div>
							{/* <div>
								<p className='text-gray-600'>Hora:</p>
								<p className='font-medium text-gray-800'>
									{formattedDateTime.time}
								</p>
							</div> */}
							<div>
								<p className='text-gray-600'>Estado:</p>
								<p className='font-medium text-gray-800'>{status}</p>
							</div>
							<div className='col-span-2'>
								<p className='text-gray-600'>Dirección:</p>
								<p className='font-medium text-gray-800'>{extraProps?.address}</p>
							</div>
						</div>
					</div>

					{/* Botones */}
					<div className='flex justify-between pt-4 border-t'>
						<div className='flex gap-3'>
							<button
								type='button'
								onClick={onClose}
								className='px-6 py-2 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-100 transition-colors'>
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
		</div>
	);
}

export default VisitDetailsModal;
