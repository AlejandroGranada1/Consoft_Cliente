'use client';
import { X, User, MapPin, Calendar, Clock, CheckSquare, Plus, Minus } from 'lucide-react';
import { DefaultModalProps, Visit, Service, User as UserType } from '@/lib/types';
import React, { useState } from 'react';
import { useGetUsers, useGetServices } from '@/hooks/apiHooks';
import { useCreateVisit } from '@/hooks/apiHooks';

// Horarios disponibles
const AVAILABLE_TIMES = [
	'08:00',
	'09:00',
	'10:00',
	'11:00',
	'12:00',
	'13:00',
	'14:00',
	'15:00',
	'16:00',
	'17:00',
	'18:00',
];

function CreateVisitModal({ isOpen, onClose, updateList }: DefaultModalProps<Visit>) {
	// Hooks para datos
	const { data: usersData, isLoading: usersLoading } = useGetUsers();
	const { data: servicesData, isLoading: servicesLoading } = useGetServices();
	const createVisitMutation = useCreateVisit();

	const users = usersData?.users || [];
	const services = servicesData?.services || [];

	// Estado del formulario
	const [visitData, setVisitData] = useState({
		user: '', // Solo ID del usuario
		address: '',
		visitDate: new Date().toISOString().split('T')[0], // Fecha actual
		scheduledTime: '10:00', // Hora por defecto
		status: 'Programada',
		notes: '',
		services: [] as string[], // IDs de servicios seleccionados
		selectedServices: [] as Array<{
			id: string;
			name: string;
			description?: string;
		}>,
	});

	// Usuario seleccionado para mostrar información
	const selectedUser = users.find((u: UserType) => u._id === visitData.user);

	// Cambiar inputs
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setVisitData((prev) => ({
			...prev,
			[name]: value,
			// Auto-completar dirección si se selecciona un usuario con dirección
			...(name === 'user' && selectedUser?.address ? { address: selectedUser.address } : {}),
		}));
	};

	// Manejar selección de servicios
	const handleServiceToggle = (serviceId: string) => {
		setVisitData((prev) => {
			const service = services.find((s: Service) => s._id === serviceId);
			if (!service) return prev;

			const isAlreadySelected = prev.services.includes(serviceId);

			if (isAlreadySelected) {
				// Remover servicio
				return {
					...prev,
					services: prev.services.filter((id) => id !== serviceId),
					selectedServices: prev.selectedServices.filter((s) => s.id !== serviceId),
				};
			} else {
				// Agregar servicio
				return {
					...prev,
					services: [...prev.services, serviceId],
					selectedServices: [
						...prev.selectedServices,
						{
							id: service._id,
							name: service.name,
							description: service.description,
						},
					],
				};
			}
		});
	};

	// Agregar servicio personalizado (si el usuario quiere escribir uno)
	const [customService, setCustomService] = useState('');
	const handleAddCustomService = () => {
		if (!customService.trim()) return;

		const customServiceObj = {
			id: `custom-${Date.now()}`,
			name: customService,
			description: 'Servicio personalizado',
		};

		setVisitData((prev) => ({
			...prev,
			services: [...prev.services, customServiceObj.id],
			selectedServices: [...prev.selectedServices, customServiceObj],
		}));

		setCustomService('');
	};

	// Remover servicio seleccionado
	const removeSelectedService = (serviceId: string) => {
		setVisitData((prev) => ({
			...prev,
			services: prev.services.filter((id) => id !== serviceId),
			selectedServices: prev.selectedServices.filter((s) => s.id !== serviceId),
		}));
	};

	// Enviar formulario
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validaciones
		if (!visitData.user) {
			alert('Por favor selecciona un cliente');
			return;
		}

		if (!visitData.address) {
			alert('Por favor ingresa una dirección');
			return;
		}

		if (!visitData.visitDate) {
			alert('Por favor selecciona una fecha');
			return;
		}

		try {
			// Combinar fecha y hora
			const scheduledDateTime = `${visitData.visitDate}T${visitData.scheduledTime}:00`;

			// Preparar datos para enviar
			const visitToCreate = {
				user: visitData.user,
				address: visitData.address,
				visitDate: scheduledDateTime,
				status: visitData.status,
				notes: visitData.notes || undefined,
				services: visitData.services,
				// Si hay servicios personalizados, enviarlos como texto
				customServices: visitData.selectedServices
					.filter((s) => s.id.startsWith('custom-'))
					.map((s) => s.name),
			};

			await createVisitMutation.mutateAsync(visitToCreate);

			// Resetear formulario
			setVisitData({
				user: '',
				address: '',
				visitDate: new Date().toISOString().split('T')[0],
				scheduledTime: '10:00',
				status: 'Programada',
				notes: '',
				services: [],
				selectedServices: [],
			});
			setCustomService('');

			// Cerrar modal y actualizar lista
			onClose();
			if (updateList) updateList();
		} catch (error) {
			console.error('Error al crear visita:', error);
			alert('Error al crear la visita. Por favor intenta nuevamente.');
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
						Programar Nueva Visita
					</h1>
					<p className='text-center text-gray-600 text-sm mt-1'>
						Programa una visita para tomar medidas o realizar servicios
					</p>
				</header>

				<form
					onSubmit={handleSubmit}
					className='space-y-6'>
					{/* Información del cliente */}
					<div className='bg-gray-50 p-4 rounded-lg border'>
						<h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
							<User size={18} />
							Información del Cliente *
						</h3>

						<div className='flex flex-col'>
							<label className='font-medium mb-1'>Seleccionar cliente</label>
							<select
								name='user'
								value={visitData.user}
								onChange={handleChange}
								className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown'
								required
								disabled={usersLoading}>
								<option value=''>Seleccione un cliente</option>
								{usersLoading ? (
									<option>Cargando clientes...</option>
								) : (
									users.map((user: UserType) => (
										<option
											key={user._id}
											value={user._id}>
											{user.name} - {user.email}
										</option>
									))
								)}
							</select>

							{selectedUser && (
								<div className='mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100'>
									<div className='grid grid-cols-2 gap-3'>
										<div>
											<p className='text-xs text-gray-600'>Nombre</p>
											<p className='font-medium'>{selectedUser.name}</p>
										</div>
										<div>
											<p className='text-xs text-gray-600'>Teléfono</p>
											<p className='font-medium'>
												{selectedUser.phone || 'No registrado'}
											</p>
										</div>
										<div className='col-span-2'>
											<p className='text-xs text-gray-600'>Email</p>
											<p className='font-medium'>{selectedUser.email}</p>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Dirección de la visita */}
					<div className='bg-gray-50 p-4 rounded-lg border'>
						<h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
							<MapPin size={18} />
							Dirección de la Visita *
						</h3>

						<div className='flex flex-col'>
							<label className='font-medium mb-1'>Dirección completa</label>
							<textarea
								name='address'
								placeholder='Ingresa la dirección completa donde se realizará la visita'
								value={visitData.address}
								onChange={handleChange}
								className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown min-h-20 resize-none'
								rows={3}
								required
							/>

							{selectedUser?.address &&
								visitData.address !== selectedUser.address && (
									<div className='mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded'>
										<p className='text-xs text-yellow-700'>
											⚠️ La dirección difiere de la registrada del cliente:{' '}
											{selectedUser.address}
										</p>
										<button
											type='button'
											onClick={() =>
												setVisitData((prev) => ({
													...prev,
													address: selectedUser.address || prev.address,
												}))
											}
											className='text-xs text-blue-600 hover:underline mt-1'>
											Usar dirección registrada
										</button>
									</div>
								)}

							<div className='mt-3'>
								<label className='font-medium mb-1'>
									Notas adicionales (opcional)
								</label>
								<textarea
									name='notes'
									placeholder='Instrucciones especiales, referencias, etc.'
									value={visitData.notes}
									onChange={handleChange}
									className='border px-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-brown min-h-4 resize-none'
									rows={2}
								/>
							</div>
						</div>
					</div>

					{/* Fecha y hora */}
					<div className='grid grid-cols-2 gap-6'>
						<div className='bg-gray-50 p-4 rounded-lg border'>
							<h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
								<Calendar size={18} />
								Fecha *
							</h3>

							<div className='flex flex-col'>
								<label className='font-medium mb-1'>Seleccionar fecha</label>
								<input
									type='date'
									name='visitDate'
									value={visitData.visitDate}
									onChange={handleChange}
									min={new Date().toISOString().split('T')[0]}
									className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown'
									required
								/>
								<p className='text-xs text-gray-500 mt-2'>
									Fecha seleccionada:{' '}
									{new Date(visitData.visitDate).toLocaleDateString('es-ES', {
										weekday: 'long',
										day: 'numeric',
										month: 'long',
										year: 'numeric',
									})}
								</p>
							</div>
						</div>

						<div className='bg-gray-50 p-4 rounded-lg border'>
							<h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
								<Clock size={18} />
								Hora *
							</h3>

							<div className='flex flex-col'>
								<label className='font-medium mb-1'>Seleccionar hora</label>
								<select
									name='scheduledTime'
									value={visitData.scheduledTime}
									onChange={handleChange}
									className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown'
									required>
									{AVAILABLE_TIMES.map((time) => (
										<option
											key={time}
											value={time}>
											{time} horas
										</option>
									))}
								</select>
								<p className='text-xs text-gray-500 mt-2'>
									Horario de trabajo: 8:00 AM - 6:00 PM
								</p>
							</div>
						</div>
					</div>

					{/* Servicios requeridos */}
					<div className='bg-gray-50 p-4 rounded-lg border'>
						<h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
							<CheckSquare size={18} />
							Servicios Requeridos
						</h3>

						<p className='text-sm text-gray-600 mb-4'>
							Selecciona los servicios que se realizarán en la visita (opcional)
						</p>

						{/* Lista de servicios disponibles */}
						{servicesLoading ? (
							<div className='text-center py-4'>
								<p className='text-gray-500'>Cargando servicios...</p>
							</div>
						) : (
							<div className='grid grid-cols-2 gap-3 mb-6'>
								{services.slice(0, 8).map((service: Service) => (
									<div
										key={service._id}
										className={`p-3 rounded-lg border cursor-pointer transition-colors ${
											visitData.services.includes(service._id!)
												? 'bg-blue-50 border-blue-300'
												: 'bg-white border-gray-200 hover:bg-gray-50'
										}`}
										onClick={() => handleServiceToggle(service._id!)}>
										<div className='flex items-center gap-2'>
											<input
												type='checkbox'
												checked={visitData.services.includes(service._id!)}
												onChange={() => {}}
												className='h-4 w-4 text-brown focus:ring-brown border-gray-300 rounded'
											/>
											<div>
												<p className='font-medium text-sm'>
													{service.name}
												</p>
												{service.description && (
													<p
														className='text-xs text-gray-500 truncate'
														title={service.description}>
														{service.description.substring(0, 50)}...
													</p>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						)}

						{/* Servicios personalizados */}
						<div className='mt-4'>
							<label className='font-medium mb-2 block'>
								Agregar servicio personalizado
							</label>
							<div className='flex gap-2'>
								<input
									type='text'
									value={customService}
									onChange={(e) => setCustomService(e.target.value)}
									placeholder='Ej: Medidas para closet, cotización mueble, etc.'
									className='flex-1 border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown'
								/>
								<button
									type='button'
									onClick={handleAddCustomService}
									disabled={!customService.trim()}
									className={`px-4 py-2 rounded-md flex items-center gap-2 ${
										!customService.trim()
											? 'bg-gray-200 text-gray-400 cursor-not-allowed'
											: 'bg-brown text-white hover:bg-brown-dark'
									}`}>
									<Plus size={16} />
									Agregar
								</button>
							</div>
						</div>

						{/* Servicios seleccionados */}
						{visitData.selectedServices.length > 0 && (
							<div className='mt-4'>
								<label className='font-medium mb-2 block'>
									Servicios seleccionados ({visitData.selectedServices.length})
								</label>
								<div className='space-y-2'>
									{visitData.selectedServices.map((service) => (
										<div
											key={service.id}
											className='flex justify-between items-center p-3 bg-white border rounded-lg'>
											<div>
												<p className='font-medium'>{service.name}</p>
												{service.description && (
													<p className='text-xs text-gray-500'>
														{service.description}
													</p>
												)}
											</div>
											<button
												type='button'
												onClick={() => removeSelectedService(service.id)}
												className='p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full'
												title='Remover servicio'>
												<Minus size={16} />
											</button>
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Estado */}
					<div className='flex flex-col'>
						<label className='font-medium mb-1'>Estado inicial de la visita</label>
						<select
							name='status'
							value={visitData.status}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown w-64'>
							<option value='Programada'>Programada</option>
							<option value='Confirmada'>Confirmada</option>
							<option value='En camino'>En camino</option>
						</select>
						<p className='text-xs text-gray-500 mt-1'>
							Puedes cambiar el estado después de crear la visita
						</p>
					</div>

					{/* Resumen */}
					<div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
						<h4 className='font-semibold text-green-800 mb-2'>Resumen de la visita</h4>
						<div className='grid grid-cols-2 gap-4 text-sm'>
							<div>
								<p className='text-gray-600'>Cliente:</p>
								<p className='font-medium'>
									{selectedUser?.name || 'No seleccionado'}
								</p>
							</div>
							<div>
								<p className='text-gray-600'>Fecha y hora:</p>
								<p className='font-medium'>
									{new Date(visitData.visitDate).toLocaleDateString('es-ES')} -{' '}
									{visitData.scheduledTime}
								</p>
							</div>
							<div className='col-span-2'>
								<p className='text-gray-600'>Dirección:</p>
								<p className='font-medium'>{visitData.address || 'No ingresada'}</p>
							</div>
							<div className='col-span-2'>
								<p className='text-gray-600'>Servicios:</p>
								<p className='font-medium'>
									{visitData.selectedServices.length > 0
										? visitData.selectedServices.map((s) => s.name).join(', ')
										: 'Ninguno seleccionado'}
								</p>
							</div>
						</div>
					</div>

					{/* Botones */}
					<div className='flex justify-between pt-4 border-t'>
						<button
							type='button'
							onClick={onClose}
							className='px-6 py-2 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-100 transition-colors'>
							Cancelar
						</button>
						<button
							type='submit'
							disabled={
								createVisitMutation.isPending ||
								!visitData.user ||
								!visitData.address ||
								!visitData.visitDate
							}
							className={`px-6 py-2 border border-brown rounded-md transition-colors flex items-center gap-2 ${
								createVisitMutation.isPending ||
								!visitData.user ||
								!visitData.address ||
								!visitData.visitDate
									? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500'
									: 'text-brown hover:bg-brown hover:text-white'
							}`}>
							{createVisitMutation.isPending ? 'Programando...' : 'Programar Visita'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default CreateVisitModal;
