'use client';
import { X, Plus, Minus, User, MapPin, Calendar, Package, DollarSign, Save, Calculator, AlertCircle } from 'lucide-react';
import { DefaultModalProps, Order, Service, User as UserType } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import { useGetUsers, useGetServices } from '@/hooks/apiHooks';
import { useCreateOrder } from '@/hooks/apiHooks';
import { createPortal } from 'react-dom';

function CreateOrderModal({ isOpen, onClose, updateList }: DefaultModalProps<Order>) {
	const { data: usersData, isLoading: usersLoading } = useGetUsers();
	const { data: servicesData, isLoading: servicesLoading } = useGetServices();
	const createOrderMutation = useCreateOrder();
	
	// Estados para el abono (ahora opcional)
	const [initialPayment, setInitialPayment] = useState(0);
	const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer'>('cash');

	const users = usersData?.users || [];
	const services = servicesData?.data || [];

	const [orderData, setOrderData] = useState<{
		user: string;
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
		user: '',
		status: 'En proceso',
		address: '',
		startedAt: new Date().toISOString().split('T')[0],
		items: [],
		paymentStatus: 'Pendiente',
		payments: [],
		total: 0,
	});

	const selectedUser = users.find((u: UserType) => u._id === orderData.user);
	
	const total = orderData.items.reduce((sum, item) => sum + (item.valor || 0), 0);
	const minimumRequired = total * 0.3;
	
	// Determinar el estado del pedido basado en el abono
	const getOrderStatus = () => {
		if (initialPayment >= minimumRequired) return 'En proceso';
		if (initialPayment > 0) return 'Pendiente (abono parcial)';
		return 'Pendiente';
	};

	const getPaymentStatus = () => {
		if (initialPayment >= total) return 'Pagado';
		if (initialPayment > 0) return 'Parcial';
		return 'Pendiente';
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setOrderData((prev) => ({ ...prev, [name]: value }));
	};

	const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const userId = e.target.value;
		const selectedUser = users.find((u: UserType) => u._id === userId);

		setOrderData((prev) => ({
			...prev,
			user: userId,
			address: selectedUser?.address || prev.address,
		}));
	};

	const handleItemChange = (
		index: number,
		field: 'id_servicio' | 'detalles' | 'valor',
		value: string | number,
	) => {
		const newItems = [...orderData.items];

		if (field === 'id_servicio') {
			const selectedService = services.find((s: Service) => s._id === value);
			if (selectedService) {
				newItems[index] = {
					...newItems[index],
					id_servicio: selectedService._id,
					detalles: selectedService.description || '',
					valor: selectedService.price || 0,
					service: selectedService,
				};
			} else {
				newItems[index] = { ...newItems[index], [field]: value as string };
			}
		} else if (field === 'valor') {
			newItems[index] = { ...newItems[index], [field]: Number(value) };
		} else {
			newItems[index] = { ...newItems[index], [field]: value as string };
		}

		setOrderData((prev) => ({ ...prev, items: newItems }));
	};

	const addItem = () => {
		setOrderData((prev) => ({
			...prev,
			items: [...prev.items, { id_servicio: '', detalles: '', valor: 0, service: undefined }],
		}));
	};

	const removeItem = (index: number) => {
		setOrderData((prev) => ({
			...prev,
			items: prev.items.filter((_, i) => i !== index),
		}));
	};

	useEffect(() => {
		setOrderData((prev) => ({ ...prev, total }));
	}, [total]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validaciones básicas
		if (!orderData.user) {
			const Swal = (await import('sweetalert2')).default;
			Swal.fire({
				title: 'Campo requerido',
				text: 'Por favor selecciona un cliente',
				icon: 'warning',
				background: '#1e1e1c',
				color: '#fff',
			});
			return;
		}

		if (orderData.items.length === 0) {
			const Swal = (await import('sweetalert2')).default;
			Swal.fire({
				title: 'Campo requerido',
				text: 'Por favor agrega al menos un servicio',
				icon: 'warning',
				background: '#1e1e1c',
				color: '#fff',
			});
			return;
		}

		const invalidItems = orderData.items.filter((item) => !item.valor || item.valor <= 0);
		if (invalidItems.length > 0) {
			const Swal = (await import('sweetalert2')).default;
			Swal.fire({
				title: 'Valores inválidos',
				text: 'Todos los servicios deben tener un valor mayor a 0',
				icon: 'warning',
				background: '#1e1e1c',
				color: '#fff',
			});
			return;
		}

		// Mostrar advertencia si no hay abono o es insuficiente
		if (initialPayment < minimumRequired) {
			const Swal = (await import('sweetalert2')).default;
			const result = await Swal.fire({
				title: '⚠️ Abono pendiente',
				html: `El pedido <strong>no entrará en producción</strong> hasta que se realice el abono del 30% ($${minimumRequired.toLocaleString()}).<br/><br/>¿Deseas continuar?`,
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Sí, crear pedido',
				cancelButtonText: 'Cancelar',
				confirmButtonColor: '#8B5E3C',
				cancelButtonColor: '#6b7280',
				background: '#1e1e1c',
				color: '#fff',
			});
			
			if (!result.isConfirmed) return;
		}

		try {
			// Crear el pedido
			const orderToSend = {
				user: orderData.user,
				address: orderData.address,
				startedAt: orderData.startedAt,
				items: orderData.items.map((item) => ({
					id_servicio: item.id_servicio,
					detalles: item.detalles,
					valor: item.valor,
				})),
				total: total,
				status: getOrderStatus(),
				paymentStatus: getPaymentStatus(),
				initialPayment: initialPayment > 0 ? {
					amount: initialPayment,
					method: paymentMethod === 'cash' ? 'offline_cash' : 'offline_transfer',
				} : null
			};

			await createOrderMutation.mutateAsync(orderToSend);

			const Swal = (await import('sweetalert2')).default;
			Swal.fire({
				toast: true,
				animation: false,
				timerProgressBar: true,
				showConfirmButton: false,
				title: 'Pedido creado exitosamente',
				icon: 'success',
				position: 'top-right',
				timer: 1500,
				background: '#1e1e1c',
				color: '#fff',
			});

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
			setInitialPayment(0);
			setPaymentMethod('cash');

			onClose();
			if (updateList) updateList();
		} catch (error) {
			console.error('Error al crear pedido:', error);
			const Swal = (await import('sweetalert2')).default;
			Swal.fire({
				title: 'Error',
				text: 'Error al crear el pedido. Por favor intenta nuevamente.',
				icon: 'error',
				background: '#1e1e1c',
				color: '#fff',
			});
		}
	};

	if (!isOpen) return null;

	return createPortal(
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-4'
			style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
			<div
				className='w-full max-w-[900px] rounded-2xl border border-white/10
        shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        flex flex-col max-h-[90vh]'
				style={{ background: 'rgba(30,30,28,0.95)', backdropFilter: 'blur(20px)' }}>
				
				{/* Header */}
				<header className='relative px-6 py-5 border-b border-white/10'>
					<button
						onClick={onClose}
						className='absolute right-4 top-1/2 -translate-y-1/2
              p-2 rounded-lg text-white/40 hover:text-white/70
              hover:bg-white/5 transition-all duration-200'>
						<X size={18} />
					</button>
					<h2 className='text-lg font-medium text-white text-center flex items-center justify-center gap-2'>
						<Package size={18} className='text-[#C8A882]' />
						Crear nuevo pedido
					</h2>
				</header>

				<form onSubmit={handleSubmit} className='p-6 overflow-y-auto space-y-5'>
					
					{/* Cliente */}
					<div className='space-y-2'>
						<label className='text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block'>
							Cliente *
						</label>
						<select
							name='user'
							value={orderData.user}
							onChange={handleUserChange}
							className='w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                text-sm text-white placeholder:text-white/30
                focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                transition-all duration-200 appearance-none'
							required
							disabled={usersLoading}>
							<option value='' className='bg-[#1e1e1c]'>Seleccione un cliente</option>
							{usersLoading ? (
								<option value='' disabled className='bg-[#1e1e1c]'>Cargando clientes...</option>
							) : (
								users.map((user: UserType) => (
									<option key={user._id} value={user._id} className='bg-[#1e1e1c]'>
										{user.name} - {user.email}
									</option>
								))
							)}
						</select>
						{selectedUser && (
							<div className='mt-2 p-3 rounded-xl bg-[#C8A882]/10 border border-[#C8A882]/20'>
								<p className='text-xs text-white/70'>
									<span className='text-[#C8A882]'>Cliente:</span> {selectedUser.name}
								</p>
								<p className='text-xs text-white/70 mt-1'>
									<span className='text-[#C8A882]'>Teléfono:</span> {selectedUser.phone || 'No registrado'}
								</p>
								{selectedUser.address && (
									<p className='text-xs text-white/70 mt-1'>
										<span className='text-[#C8A882]'>Dirección:</span> {selectedUser.address}
									</p>
								)}
							</div>
						)}
					</div>

					{/* Dirección */}
					<div className='space-y-2'>
						<label className='text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block'>
							Dirección del servicio *
						</label>
						<input
							name='address'
							type='text'
							placeholder='Dirección donde se realizará el servicio'
							value={orderData.address}
							onChange={handleChange}
							className='w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                text-sm text-white placeholder:text-white/30
                focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                transition-all duration-200'
							required
						/>
						{selectedUser?.address && orderData.address !== selectedUser.address && (
							<p className='text-xs text-yellow-400/70 mt-1'>
								⚠️ La dirección difiere de la registrada por el cliente
							</p>
						)}
					</div>

					{/* Fecha y pago */}
					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<label className='text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block'>
								Fecha de inicio *
							</label>
							<input
								name='startedAt'
								type='date'
								value={orderData.startedAt}
								onChange={handleChange}
								className='w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                  text-sm text-white
                  focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                  transition-all duration-200'
								required
							/>
						</div>

						<div className='space-y-2'>
							<label className='text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block'>
								Estado del pago
							</label>
							<select
								name='paymentStatus'
								value={orderData.paymentStatus}
								onChange={handleChange}
								className='w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                  text-sm text-white
                  focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                  transition-all duration-200 appearance-none'>
								<option value='Pendiente' className='bg-[#1e1e1c]'>Pendiente</option>
								<option value='Pagado' className='bg-[#1e1e1c]'>Pagado</option>
								<option value='Parcial' className='bg-[#1e1e1c]'>Parcial</option>
							</select>
						</div>
					</div>

					{/* Servicios */}
					<div className='space-y-4'>
						<div className='flex items-center justify-between'>
							<h3 className='text-sm font-medium text-white/70 flex items-center gap-2'>
								<Package size={14} className='text-[#C8A882]' />
								Servicios ({orderData.items.length})
							</h3>
							<button
								type='button'
								onClick={addItem}
								className='inline-flex items-center gap-2 px-4 py-2 rounded-lg
                  border border-[#C8A882]/30 bg-[#C8A882]/10
                  text-[#C8A882] text-xs font-medium
                  hover:bg-[#C8A882]/20 hover:border-[#C8A882]/50
                  transition-all duration-200'>
								<Plus size={14} />
								Agregar Servicio
							</button>
						</div>

						{orderData.items.length === 0 ? (
							<div className='text-center py-12 rounded-xl border border-white/10 bg-white/5'>
								<Package size={32} className='mx-auto text-white/20 mb-2' />
								<p className='text-white/40 text-sm'>No hay servicios agregados</p>
							</div>
						) : (
							<div className='space-y-3 max-h-80 overflow-y-auto pr-2'>
								{orderData.items.map((item, idx) => {
									const itemService = services.find((s: Service) => s._id === item.id_servicio);
									return (
										<div key={idx} className='rounded-xl border border-white/10 bg-white/5 p-4'>
											<div className='grid grid-cols-12 gap-3'>
												{/* Servicio */}
												<div className='col-span-4'>
													<label className='text-[10px] text-white/40 mb-1 block'>
														Servicio *
													</label>
													<select
														value={item.id_servicio}
														onChange={(e) => handleItemChange(idx, 'id_servicio', e.target.value)}
														className='w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2
                              text-xs text-white
                              focus:outline-none focus:border-[#C8A882]/50
                              transition-all duration-200'
														required>
														<option value='' className='bg-[#1e1e1c]'>Seleccionar</option>
														{servicesLoading ? (
															<option value='' disabled className='bg-[#1e1e1c]'>Cargando...</option>
														) : (
															services?.map((service: Service) => (
																<option key={service._id} value={service._id} className='bg-[#1e1e1c]'>
																	{service.name}
																</option>
															))
														)}
													</select>
													{itemService && (
														<p className='text-[10px] text-white/30 mt-1'>
															{itemService.description?.substring(0, 40)}...
														</p>
													)}
												</div>

												{/* Valor */}
												<div className='col-span-3'>
													<label className='text-[10px] text-white/40 mb-1 block'>
														Valor ($) *
													</label>
													<input
														type='number'
														min='0'
														step='1000'
														value={item.valor || ''}
														onChange={(e) => handleItemChange(idx, 'valor', e.target.value)}
														className='w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2
                              text-xs text-white
                              focus:outline-none focus:border-[#C8A882]/50
                              transition-all duration-200'
														required
													/>
													{itemService?.price && item.valor !== itemService.price && (
														<p className='text-[10px] text-yellow-400/70 mt-1'>
															⚠️ Base: ${itemService.price.toLocaleString()}
														</p>
													)}
												</div>

												{/* Detalles */}
												<div className='col-span-4'>
													<label className='text-[10px] text-white/40 mb-1 block'>
														Detalles
													</label>
													<textarea
														placeholder='Notas...'
														value={item.detalles || ''}
														onChange={(e) => handleItemChange(idx, 'detalles', e.target.value)}
														className='w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2
                              text-xs text-white placeholder:text-white/30
                              focus:outline-none focus:border-[#C8A882]/50
                              transition-all duration-200 resize-none'
														rows={2}
													/>
												</div>

												{/* Eliminar */}
												<div className='col-span-1 flex justify-center items-end pb-2'>
													<button
														type='button'
														onClick={() => removeItem(idx)}
														className='p-1.5 rounded-lg text-white/40 hover:text-red-400
                              hover:bg-white/5 transition-all duration-200'
														title='Eliminar servicio'>
														<Minus size={16} />
													</button>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>

					{/* Total */}
					<div className='p-4 rounded-xl border border-white/10 bg-white/5'>
						<div className='flex justify-between items-center'>
							<div>
								<p className='text-sm font-medium text-white'>Total del pedido</p>
								<p className='text-xs text-white/40 mt-1'>
									{orderData.items.length} {orderData.items.length === 1 ? 'servicio' : 'servicios'}
								</p>
							</div>
							<div className='text-right'>
								<span className='text-2xl font-bold text-[#C8A882]'>
									${total.toLocaleString('es-CO')}
								</span>
								<p className='text-xs text-white/40'>COP</p>
							</div>
						</div>
					</div>

					{/* 🔥 SECCIÓN DE ABONO INICIAL (OPCIONAL) */}
					<div className='mt-6 p-4 rounded-xl border border-[#C8A882]/20 bg-[#C8A882]/5'>
						<div className='flex items-center justify-between mb-4'>
							<h3 className='text-white font-medium flex items-center gap-2'>
								<Calculator size={16} className='text-[#C8A882]' />
								Abono inicial (opcional)
							</h3>
							{initialPayment < minimumRequired && initialPayment > 0 && (
								<span className='text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'>
									Abono parcial
								</span>
							)}
						</div>

						<div className='grid grid-cols-2 gap-4'>
							{/* Monto del abono */}
							<div>
								<label className='text-white/40 text-xs mb-1 block'>
									Monto a abonar
								</label>
								<div className='relative'>
									<span className='absolute left-3 top-1/2 -translate-y-1/2 text-white/40'>
										$
									</span>
									<input
										type='number'
										value={initialPayment}
										onChange={(e) => setInitialPayment(Number(e.target.value))}
										className='w-full bg-white/5 border border-white/15 rounded-xl pl-8 pr-4 py-3 text-white'
										placeholder='0'
									/>
								</div>
							</div>

							{/* Método de pago */}
							<div>
								<label className='text-white/40 text-xs mb-1 block'>
									Método de pago
								</label>
								<div className='grid grid-cols-2 gap-2'>
									<button
										type='button'
										onClick={() => setPaymentMethod('cash')}
										className={`p-3 rounded-lg border transition ${
											paymentMethod === 'cash'
												? 'border-[#C8A882] bg-[#C8A882]/10 text-white'
												: 'border-white/10 bg-white/5 text-white/40'
										}`}>
										💵 Efectivo
									</button>
									<button
										type='button'
										onClick={() => setPaymentMethod('transfer')}
										className={`p-3 rounded-lg border transition ${
											paymentMethod === 'transfer'
												? 'border-[#C8A882] bg-[#C8A882]/10 text-white'
												: 'border-white/10 bg-white/5 text-white/40'
										}`}>
										🏦 Transferencia
									</button>
								</div>
							</div>
						</div>

						{/* Barra de progreso del abono (solo si hay abono) */}
						{initialPayment > 0 && (
							<div className='mt-4'>
								<div className='flex justify-between text-sm mb-2'>
									<span className='text-white/60'>Progreso del abono</span>
									<span className='text-[#C8A882] font-medium'>
										{total > 0 ? ((initialPayment / total) * 100).toFixed(0) : 0}%
									</span>
								</div>
								<div className='h-2 bg-white/10 rounded-full overflow-hidden'>
									<div
										className='h-full bg-gradient-to-r from-[#C8A882] to-[#8B5E3C] transition-all'
										style={{
											width: `${total > 0 ? Math.min((initialPayment / total) * 100, 100) : 0}%`,
										}}
									/>
								</div>
							</div>
						)}

						{/* Mensaje informativo */}
						<div className='mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20'>
							<p className='text-xs text-blue-400 flex items-start gap-2'>
								<AlertCircle size={14} className='shrink-0 mt-0.5' />
								<span>
									<strong>Importante:</strong> El pedido no entrará en producción hasta que se complete el abono del <strong>30% (${minimumRequired.toLocaleString()})</strong>.
									{initialPayment > 0 && initialPayment < minimumRequired && (
										<span className='block mt-1 text-yellow-400'>
											Faltan ${(minimumRequired - initialPayment).toLocaleString()} para iniciar producción.
										</span>
									)}
								</span>
							</p>
						</div>
					</div>

					{/* Botones */}
					<div className='flex justify-end gap-3 pt-4 border-t border-white/10'>
						<button
							type='button'
							onClick={onClose}
							className='px-5 py-2.5 rounded-lg
                border border-white/15 bg-white/5
                text-white/70 text-sm
                hover:bg-white/10 hover:text-white
                transition-all duration-200'>
							Cancelar
						</button>
						<button
							type='submit'
							disabled={
								createOrderMutation.isPending ||
								orderData.items.length === 0 ||
								!orderData.user
							}
							className='px-5 py-2.5 rounded-lg
                bg-[#8B5E3C] hover:bg-[#6F452A]
                text-white text-sm font-medium
                shadow-lg shadow-[#8B5E3C]/20
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2
                transition-all duration-200'>
							{createOrderMutation.isPending ? (
								<>
									<span className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></span>
									Creando...
								</>
							) : (
								<>
									<Save size={14} />
									Crear Pedido
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>,
		document.body
	);
}

export default CreateOrderModal;