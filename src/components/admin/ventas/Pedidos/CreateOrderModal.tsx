'use client';
import { X, Plus, Minus } from 'lucide-react';
import { DefaultModalProps, Order, Service, User } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import { useGetUsers, useGetServices } from '@/hooks/apiHooks';
import { useCreateOrder } from '@/hooks/apiHooks';

function CreateOrderModal({ isOpen, onClose, updateList }: DefaultModalProps<Order>) {
	// Usar hooks de React Query
	const { data: usersData, isLoading: usersLoading } = useGetUsers();
	const { data: servicesData, isLoading: servicesLoading } = useGetServices();
	const createOrderMutation = useCreateOrder();

	console.log(servicesData)
	const users = usersData?.users || [];
	const services = servicesData?.data || [];

	// Estado inicial corregido - solo guardar el ID del usuario
	const [orderData, setOrderData] = useState<{
		user: string; // Solo ID del usuario
		status: string;
		address: string;
		startedAt: string;
		items: Array<{
			id_servicio: string;
			detalles: string;
			valor: number;
			service?: Service;
		}>;
		paymentStatus: string;
		payments: any[];
		total: number;
	}>({
		user: '', // Solo ID, no objeto completo
		status: 'En proceso',
		address: '',
		startedAt: new Date().toISOString().split('T')[0], // Fecha actual por defecto
		items: [],
		paymentStatus: 'Pendiente',
		payments: [],
		total: 0,
	});

	// Obtener el usuario seleccionado completo para mostrar información
	const selectedUser = users.find((u: User) => u._id === orderData.user);

	// Cambiar inputs generales
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setOrderData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const userId = e.target.value;
		const selectedUser = users.find((u: User) => u._id === userId);

		setOrderData((prev) => ({
			...prev,
			user: userId,
			// Auto-completar dirección si el usuario tiene una
			address: selectedUser?.address || prev.address,
		}));
	};

	// Cambiar valores de los servicios
	const handleItemChange = (
		index: number,
		field: 'id_servicio' | 'detalles' | 'valor',
		value: string | number
	) => {
		const newItems = [...orderData.items];

		if (field === 'id_servicio') {
			// Cuando se selecciona un servicio, auto-completar nombre y valor si está disponible
			const selectedService = services.find((s: Service) => s._id === value);
			if (selectedService) {
				newItems[index] = {
					...newItems[index],
					id_servicio: selectedService._id,
					detalles: selectedService.description || '',
					valor: selectedService.price || 0,
					service: selectedService, // Guardar el objeto completo para referencia
				};
			} else {
				newItems[index] = { ...newItems[index], [field]: value as string };
			}
		} else if (field === 'valor') {
			newItems[index] = { ...newItems[index], [field]: Number(value) };
		} else {
			newItems[index] = { ...newItems[index], [field]: value as string };
		}

		setOrderData((prev) => ({
			...prev,
			items: newItems,
		}));
	};

	// Agregar fila
	const addItem = () => {
		setOrderData((prev) => ({
			...prev,
			items: [
				...prev.items,
				{
					id_servicio: '',
					detalles: '',
					valor: 0,
					service: undefined,
				},
			],
		}));
	};

	// Eliminar fila
	const removeItem = (index: number) => {
		setOrderData((prev) => ({
			...prev,
			items: prev.items.filter((_, i) => i !== index),
		}));
	};

	// Calcular total
	const total = orderData.items.reduce((sum, item) => sum + (item.valor || 0), 0);

	// Actualizar total cuando cambian los items
	useEffect(() => {
		setOrderData((prev) => ({ ...prev, total }));
	}, [total]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validaciones básicas
		if (!orderData.user) {
			alert('Por favor selecciona un cliente');
			return;
		}

		if (orderData.items.length === 0) {
			alert('Por favor agrega al menos un servicio');
			return;
		}

		// Verificar que todos los servicios tengan valor
		const invalidItems = orderData.items.filter((item) => !item.valor || item.valor <= 0);
		if (invalidItems.length > 0) {
			alert('Todos los servicios deben tener un valor mayor a 0');
			return;
		}

		try {
			// Preparar datos para enviar
			const orderToSend = {
				user: orderData.user, // Solo el ID del usuario
				address: orderData.address,
				startedAt: orderData.startedAt,
				items: orderData.items.map((item) => ({
					id_servicio: item.id_servicio,
					detalles: item.detalles,
					valor: item.valor,
				})),
				total: total,
				status: orderData.status,
				paymentStatus: orderData.paymentStatus,
			};

			await createOrderMutation.mutateAsync(orderToSend);

			// Resetear formulario
			setOrderData({
				user: '',
				status: 'En proceso',
				address: '',
				startedAt: new Date().toISOString().split('T')[0],
				items: [],
				paymentStatus: 'Pendiente',
				payments: [],
				total: 0,
			});

			// Cerrar modal y actualizar lista
			onClose();
			if (updateList) updateList();
		} catch (error) {
			console.error('Error al crear pedido:', error);
			alert('Error al crear el pedido. Por favor intenta nuevamente.');
		}
	};

	if (!isOpen) return null;

	return (
		<div className='modal-bg'>
			<div className='modal-frame w-[800px] p-6'>
				<header className='relative mb-4'>
					<button
						onClick={onClose}
						className='absolute top-0 left-0 text-2xl text-gray-500 hover:text-black cursor-pointer'>
						<X />
					</button>
					<h1 className='text-xl font-semibold text-center'>Crear Nuevo Pedido</h1>
				</header>

				<form
					onSubmit={handleSubmit}
					className='flex flex-col gap-4'>
					{/* Cliente */}
					<div className='flex flex-col'>
						<label className='font-medium mb-1'>Cliente *</label>
						<select
							name='user'
							className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown'
							value={orderData.user}
							onChange={handleUserChange}
							required
							disabled={usersLoading}>
							<option value=''>Seleccione un cliente</option>
							{usersLoading ? (
								<option>Cargando clientes...</option>
							) : (
								users.map((user: User) => (
									<option
										key={user._id}
										value={user._id}>
										{user.name} - {user.email}
									</option>
								))
							)}
						</select>
						{selectedUser && (
							<div className='mt-2 p-2 bg-blue-50 rounded text-sm'>
								<p>
									<strong>Cliente:</strong> {selectedUser.name}
								</p>
								<p>
									<strong>Teléfono:</strong>{' '}
									{selectedUser.phone || 'No registrado'}
								</p>
								{selectedUser.address && (
									<p>
										<strong>Dirección registrada:</strong>{' '}
										{selectedUser.address}
									</p>
								)}
							</div>
						)}
					</div>

					{/* Dirección */}
					<div className='flex flex-col'>
						<label className='font-medium mb-1'>Dirección del servicio *</label>
						<input
							name='address'
							type='text'
							placeholder='Dirección donde se realizará el servicio'
							value={orderData.address}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown'
							required
						/>
						{selectedUser?.address && orderData.address !== selectedUser.address && (
							<p className='text-xs text-gray-500 mt-1'>
								⚠️ La dirección difiere de la registrada por el cliente
							</p>
						)}
					</div>

					<div className='grid grid-cols-2 gap-4'>
						{/* Fecha */}
						<div className='flex flex-col'>
							<label className='font-medium mb-1'>Fecha de inicio *</label>
							<input
								name='startedAt'
								type='date'
								value={orderData.startedAt}
								onChange={handleChange}
								className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown'
								required
							/>
						</div>

						{/* Estado del pago */}
						<div className='flex flex-col'>
							<label className='font-medium mb-1'>Estado del pago</label>
							<select
								name='paymentStatus'
								value={orderData.paymentStatus}
								onChange={handleChange}
								className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown'>
								<option value='Pendiente'>Pendiente</option>
								<option value='Pagado'>Pagado</option>
								<option value='Parcial'>Parcial</option>
							</select>
						</div>
					</div>

					{/* Tabla de servicios */}
					<div className='mt-4'>
						<div className='flex justify-between items-center mb-3'>
							<h3 className='font-semibold text-lg'>Servicios *</h3>
							<button
								type='button'
								onClick={addItem}
								className='flex items-center gap-2 px-4 py-2 border border-brown text-brown rounded-md hover:bg-brown hover:text-white transition-colors'>
								<Plus size={18} />
								Agregar Servicio
							</button>
						</div>

						<div className='h-[200px] overflow-y-auto border rounded-lg p-2'>
							{orderData.items.length === 0 ? (
								<div className='text-center py-8 text-gray-500'>
									No hay servicios agregados. Agrega el primer servicio.
								</div>
							) : (
								<div className='space-y-3'>
									{orderData.items.map((item, idx) => {
										const itemService = services.find(
											(s: Service) => s._id === item.id_servicio
										);

										return (
											<div
												key={idx}
												className='grid grid-cols-12 gap-3 p-3 bg-gray-50 rounded-lg items-center'>
												<div className='col-span-4'>
													<label className='text-xs text-gray-600 mb-1 block'>
														Servicio
													</label>
													<select
														value={item.id_servicio}
														onChange={(e) =>
															handleItemChange(
																idx,
																'id_servicio',
																e.target.value
															)
														}
														className='w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brown'
														required>
														<option value=''>
															Seleccione un servicio
														</option>
														{servicesLoading ? (
															<option>Cargando servicios...</option>
														) : (
															services?.map((service: Service) => (
																<option
																	key={service._id}
																	value={service._id}>
																	{service.name}
																</option>
															))
														)}
													</select>
													{itemService && (
														<p className='text-xs text-gray-500 mt-1'>
															{itemService.description?.substring(
																0,
																50
															)}
															...
														</p>
													)}
												</div>

												<div className='col-span-3'>
													<label className='text-xs text-gray-600 mb-1 block'>
														Valor ($)
													</label>
													<input
														type='number'
														placeholder='Valor'
														min='0'
														step='1000'
														value={item.valor || ''}
														onChange={(e) =>
															handleItemChange(
																idx,
																'valor',
																e.target.value
															)
														}
														className='w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brown'
														required
													/>
													{itemService?.price &&
														item.valor !== itemService.price && (
															<p className='text-xs text-yellow-600 mt-1'>
																⚠️ Diferente del precio base ($
																{itemService.price.toLocaleString()}
																)
															</p>
														)}
												</div>

												<div className='col-span-4'>
													<label className='text-xs text-gray-600 mb-1 block'>
														Detalles/Notas
													</label>
													<textarea
														placeholder='Detalles específicos del servicio'
														value={item.detalles || ''}
														onChange={(e) =>
															handleItemChange(
																idx,
																'detalles',
																e.target.value
															)
														}
														className='w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brown h-16 resize-none'
														rows={2}
													/>
												</div>

												<div className='col-span-1 flex justify-center'>
													<button
														type='button'
														onClick={() => removeItem(idx)}
														className='p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors'
														title='Eliminar servicio'>
														<Minus size={18} />
													</button>
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>
					</div>

					{/* Total */}
					<div className='mt-4 p-4 bg-gray-50 rounded-lg'>
						<div className='flex justify-between items-center'>
							<div>
								<span className='font-semibold text-lg'>Total del pedido:</span>
								<p className='text-sm text-gray-600'>
									{orderData.items.length}{' '}
									{orderData.items.length === 1 ? 'servicio' : 'servicios'}
								</p>
							</div>
							<div className='text-right'>
								<span className='text-2xl font-bold text-brown'>
									${total.toLocaleString('es-CO')} COP
								</span>
								{orderData.paymentStatus !== 'Pendiente' && (
									<p className='text-sm text-green-600'>
										Estado pago: {orderData.paymentStatus}
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Botones */}
					<div className='flex justify-between mt-6 pt-4 border-t'>
						<button
							type='button'
							onClick={onClose}
							className='px-6 py-2 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-100 transition-colors'>
							Cancelar
						</button>
						<button
							type='submit'
							disabled={
								createOrderMutation.isPending ||
								orderData.items.length === 0 ||
								!orderData.user
							}
							className={`px-6 py-2 border border-brown rounded-md transition-colors ${
								createOrderMutation.isPending ||
								orderData.items.length === 0 ||
								!orderData.user
									? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500'
									: 'text-brown hover:bg-brown hover:text-white'
							}`}>
							{createOrderMutation.isPending ? 'Creando...' : 'Crear Pedido'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default CreateOrderModal;
