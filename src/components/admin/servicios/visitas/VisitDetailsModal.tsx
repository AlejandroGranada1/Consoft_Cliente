'use client';
import { DefaultModalProps, Service, Visit } from '@/app/types';
import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import EditVisitModal from './EditVisitModal';
import api from '@/components/Global/axios';
import { updateElement } from '../../global/alerts';

function VisitDetailsModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<Visit>) {
	const [editModal, setEditModal] = useState(false);
	const [services, setServices] = useState<Service[]>([]);
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
	useEffect(() => {
		const fetchServices = async () => {
			try {
				const response = await api.get('/api/services');
				setServices(response.data);
			} catch (err) {
				console.error('Error cargando servicios', err);
			}
		};
		fetchServices();
	}, []);

	// Cuando cambie el modal, sincronizar el estado inicial
	useEffect(() => {
		if (extraProps?.status) {
			setStatus(extraProps.status);
		}
	}, [extraProps]);

	// Función para marcar los servicios seleccionados
	const isServiceChecked = (serviceId: string) => {
		return extraProps?.services.some((s) => s._id === serviceId);
	};

	// Cambiar estado y actualizar en API
	const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newStatus = e.target.value;
		setVisitData((prev) => ({ ...prev, status: newStatus }));

		const payload = { ...visitData, status: newStatus };
		try {
			await updateElement('Visita', `/api/visits/${extraProps?._id}`, payload, updateList);
			onClose();
		} catch (err) {
			console.error('Error actualizando estado', err);
		}
	};

	if (!isOpen) return null;

	return (
		<div className='modal-bg'>
			<div className='modal-frame w-[600px]'>
				<header className='w-fit mx-auto'>
					<button
						onClick={onClose}
						className='absolute top-4 left-4 text-2xl text-gray-500 hover:text-black cursor-pointer'>
						<IoMdClose />
					</button>
					<h1 className='text-xl font-semibold mb-4'>DETALLES DE LA VISITA</h1>
				</header>

				<div className='flex flex-col gap-4'>
					{/* Cliente */}
					<div className='flex flex-col'>
						<label className='font-semibold'>Cliente</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{extraProps?.user.name}
						</p>
					</div>

					{/* Dirección */}
					<div className='flex flex-col'>
						<label className='font-semibold'>Dirección</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{extraProps?.address}
						</p>
					</div>

					{/* Fecha */}
					<div className='flex flex-col'>
						<label className='font-semibold'>Fecha de la visita</label>
						<p className='border px-3 py-2 rounded-md bg-gray-100'>
							{new Date(extraProps?.visitDate!).toLocaleDateString()}
						</p>
					</div>

					{/* Estado (Select) */}
					<div className='flex flex-col'>
						<label className='font-semibold'>Estado de la visita</label>
						<select
							value={status}
							onChange={handleStatusChange}
							className={`px-3 py-2 rounded-md border ${
								status === 'Terminada'
									? 'bg-green/30 text-green'
									: 'bg-orange/30 text-orange'
							}`}>
							<option value='Pendiente'>Pendiente</option>
							<option value='Terminada'>Terminada</option>
						</select>
					</div>

					{/* Servicios */}
					<div className='flex flex-col gap-2 mt-4'>
						<label className='font-semibold'>Servicios</label>
						<div className='flex flex-wrap gap-4'>
							{services.map((service) => (
								<div
									key={service._id}
									className='flex items-center gap-2'>
									<input
										type='checkbox'
										checked={isServiceChecked(service._id!)}
										disabled
										className='cursor-not-allowed'
									/>
									<span>{service.name}</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Botones */}
				<div className='w-full flex justify-between mt-10'>
					<button
						onClick={() => setEditModal(true)}
						className='px-10 py-2 rounded-lg border border-brown text-brown cursor-pointer'>
						Editar Visita
					</button>
					<button
						onClick={onClose}
						className='px-10 py-2 rounded-lg border border-gray bg-gray cursor-pointer'>
						Cerrar
					</button>
				</div>
			</div>

			{/* Edit Modal */}
			<EditVisitModal
				isOpen={editModal}
				onClose={() => setEditModal(false)}
				extraProps={extraProps}
			/>
		</div>
	);
}

export default VisitDetailsModal;
