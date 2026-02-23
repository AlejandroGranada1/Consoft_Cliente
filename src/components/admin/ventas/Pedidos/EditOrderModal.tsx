'use client';
import {
	X,
	Plus,
	Minus,
	User,
	MapPin,
	Calendar,
	Package,
	Upload,
	Image as ImageIcon,
} from 'lucide-react';
import { DefaultModalProps, Order, Service, User as UserType } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import { useGetServices, useGetUsers, useUpdateOrder } from '@/hooks/apiHooks';
import api from '@/components/Global/axios';

interface EditOrderData {
	_id: string;
	user: string;
	status: string;
	address: string;
	startedAt: string;
	deliveredAt?: string;
	items: Array<{
		id_servicio: string;
		detalles: string;
		valor: number;
		progressImage?: File | null;
		imagePreview?: string | null;
		_id?: string;
		existingImages?: string[];
	}>;
	paymentStatus: string;
	total: number;
}

function EditOrderModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<Order>) {
	const { data: servicesData, isLoading: servicesLoading } = useGetServices();
	const { data: usersData, isLoading: usersLoading } = useGetUsers();
	const updateOrderMutation = useUpdateOrder();

	const services = servicesData?.data || [];
	const users = usersData?.users || [];

	const [orderData, setOrderData] = useState<EditOrderData>({
		_id: '',
		user: '',
		status: 'En proceso',
		address: '',
		startedAt: new Date().toISOString().split('T')[0],
		items: [],
		paymentStatus: 'Pendiente',
		total: 0,
	});

	const [uploadingImages, setUploadingImages] = useState(false);

	const selectedUser = users.find((u: UserType) => u._id === orderData.user);

	useEffect(() => {
		if (!extraProps) return;

		const userId =
			typeof extraProps.user === 'object'
				? (extraProps.user as UserType)._id
				: (extraProps.user as string);

		const processedItems = (extraProps.items || []).map((item: any) => ({
			id_servicio:
				typeof item.id_servicio === 'object'
					? (item.id_servicio as Service)._id
					: item.id_servicio,
			detalles: item.detalles || '',
			valor: item.valor || 0,
			progressImage: null,
			imagePreview: null,
			_id: item._id,
			existingImages: item.images || [],
		}));

		setOrderData({
			_id: extraProps._id || '',
			user: userId!,
			status: extraProps.status || 'En proceso',
			address: extraProps.address || '',
			startedAt: extraProps.startedAt
				? new Date(extraProps.startedAt).toISOString().split('T')[0]
				: new Date().toISOString().split('T')[0],
			deliveredAt: extraProps.deliveredAt
				? new Date(extraProps.deliveredAt).toISOString().split('T')[0]
				: undefined,
			items: processedItems,
			paymentStatus: extraProps.paymentStatus || 'Pendiente',
			total: processedItems.reduce((s: number, i: any) => s + i.valor, 0),
		});
	}, [extraProps]);

	const total = orderData.items.reduce((s, i) => s + (i.valor || 0), 0);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setOrderData((p) => ({ ...p, [name]: value }));
	};

	const handleItemChange = (
		index: number,
		field: 'id_servicio' | 'detalles' | 'valor',
		value: string | number,
	) => {
		const newItems = [...orderData.items];

		if (field === 'id_servicio') {
			const s = services.find((x: Service) => x._id === value);
			if (s)
				newItems[index] = {
					...newItems[index],
					id_servicio: s._id,
					detalles: s.description || '',
					valor: s.price || 0,
				};
		} else if (field === 'valor')
			newItems[index] = { ...newItems[index], valor: Number(value) };
		else newItems[index] = { ...newItems[index], detalles: value as string };

		setOrderData((p) => ({ ...p, items: newItems }));
	};

	const handleImageChange = (index: number, file: File | null) => {
		const newItems = [...orderData.items];
		if (file)
			newItems[index] = {
				...newItems[index],
				progressImage: file,
				imagePreview: URL.createObjectURL(file),
			};
		else newItems[index] = { ...newItems[index], progressImage: null, imagePreview: null };
		setOrderData((p) => ({ ...p, items: newItems }));
	};

	const addItem = () =>
		setOrderData((p) => ({
			...p,
			items: [...p.items, { id_servicio: '', detalles: '', valor: 0 }],
		}));
	const removeItem = (i: number) =>
		setOrderData((p) => ({ ...p, items: p.items.filter((_, x) => x !== i) }));

	const uploadImages = async (orderId: string) => {
		const imgs = orderData.items.filter((i) => i.progressImage instanceof File);
		if (!imgs.length) return;
		setUploadingImages(true);
		try {
			for (const i of imgs) {
				const fd = new FormData();
				fd.append('product_images', i.progressImage as File);
				await api.post(`/api/orders/${orderId}/attachments`, fd);
			}
		} finally {
			setUploadingImages(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!orderData._id) return;

		await updateOrderMutation.mutateAsync({
			id: orderData._id,
			data: { ...orderData, total },
		});

		await uploadImages(orderData._id);
		onClose();
		updateList?.();
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
			<div className='modal-frame w-full max-w-[920px] flex flex-col max-h-[92vh]'>
				<header className='sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-xs'>
					<button
						onClick={onClose}
						className='absolute top-0 left-0 p-5 text-gray-500 hover:bg-gray-100 rounded-full'>
						<X size={20} />
					</button>
					<h1 className='text-2xl font-bold text-center'>Editar Pedido</h1>
				</header>

				<form
					onSubmit={handleSubmit}
					className='space-y-6 p-6'>
					{/* Información principal */}
					<div className='grid grid-cols-2 gap-6'>
						{/* Selección de cliente */}
						<div className='flex flex-col'>
							<label className='font-medium mb-1 flex items-center gap-2'>
								<User size={16} />
								Cliente *
							</label>
							<select
								name='user'
								value={orderData.user}
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

						{/* Estado y pago */}
						<div className='grid grid-cols-2 gap-4'>
							<div className='flex flex-col'>
								<label className='font-medium mb-1'>Estado</label>
								<select
									name='status'
									value={orderData.status}
									onChange={handleChange}
									className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown'>
									<option value='En proceso'>En proceso</option>
									<option value='Completado'>Completado</option>
									<option value='Cancelado'>Cancelado</option>
									<option value='Pendiente'>Pendiente</option>
								</select>
							</div>

							<div className='flex flex-col'>
								<label className='font-medium mb-1'>Estado pago</label>
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
					</div>

					{/* Dirección */}
					<div className='flex flex-col'>
						<label className='font-medium mb-1 flex items-center gap-2'>
							<MapPin size={16} />
							Dirección del servicio *
						</label>
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
							<p className='text-xs text-yellow-600 mt-1'>
								⚠️ La dirección difiere de la registrada por el cliente
							</p>
						)}
					</div>

					{/* Fechas */}
					<div className='grid grid-cols-2 gap-6'>
						<div className='flex flex-col'>
							<label className='font-medium mb-1 flex items-center gap-2'>
								<Calendar size={16} />
								Fecha de inicio *
							</label>
							<input
								name='startedAt'
								type='date'
								value={orderData.startedAt}
								onChange={handleChange}
								className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown'
								required
							/>
						</div>

						<div className='flex flex-col'>
							<label className='font-medium mb-1'>Fecha de finalización</label>
							<input
								name='deliveredAt'
								type='date'
								value={orderData.deliveredAt || ''}
								onChange={handleChange}
								className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown'
							/>
							{orderData.deliveredAt && (
								<p className='text-xs text-gray-500 mt-1'>Marcar como completado</p>
							)}
						</div>
					</div>

					{/* Servicios */}
					<div className='border rounded-lg p-4'>
						<div className='flex justify-between items-center mb-4'>
							<h3 className='font-semibold text-lg flex items-center gap-2'>
								<Package size={18} />
								Servicios ({orderData.items.length})
							</h3>
							<button
								type='button'
								onClick={addItem}
								className='flex items-center gap-2 px-4 py-2 border border-brown text-brown rounded-md hover:bg-brown hover:text-white transition-colors'>
								<Plus size={18} />
								Agregar Servicio
							</button>
						</div>

						{orderData.items.length === 0 ? (
							<div className='text-center py-8 text-gray-500 bg-gray-50 rounded-lg'>
								No hay servicios agregados. Agrega el primer servicio.
							</div>
						) : (
							<div className='space-y-4 max-h-80 overflow-y-auto p-2'>
								{orderData.items.map((item, idx) => {
									const itemService = services.find(
										(s: Service) => s._id === item.id_servicio,
									);

									return (
										<div
											key={idx}
											className='bg-gray-50 p-4 rounded-lg border'>
											<div className='grid grid-cols-12 gap-4 items-center'>
												{/* Servicio */}
												<div className='col-span-4'>
													<label className='text-xs text-gray-600 mb-1 block'>
														Servicio *
													</label>
													<select
														value={item.id_servicio}
														onChange={(e) =>
															handleItemChange(
																idx,
																'id_servicio',
																e.target.value,
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
																50,
															)}
															...
														</p>
													)}
												</div>

												{/* Valor */}
												<div className='col-span-3'>
													<label className='text-xs text-gray-600 mb-1 block'>
														Valor ($) *
													</label>
													<input
														type='number'
														min='0'
														step='1000'
														value={item.valor || ''}
														onChange={(e) =>
															handleItemChange(
																idx,
																'valor',
																e.target.value,
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

												{/* Detalles */}
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
																e.target.value,
															)
														}
														className='w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brown h-16 resize-none'
														rows={2}
													/>
												</div>

												{/* Eliminar */}
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

											{/* Imágenes del servicio */}
											<div className='mt-3 pt-3 border-t'>
												<label className='text-xs font-medium text-gray-700 mb-2 flex items-center gap-1'>
													<ImageIcon size={14} />
													Imágenes del servicio
												</label>

												{/* Imágenes existentes */}
												{item.existingImages &&
													item.existingImages.length > 0 && (
														<div className='mb-3'>
															<p className='text-xs text-gray-500 mb-2'>
																Imágenes existentes:
															</p>
															<div className='flex flex-wrap gap-2'>
																{item.existingImages.map(
																	(imgUrl, imgIdx) => (
																		<div
																			key={imgIdx}
																			className='relative'>
																			<img
																				src={imgUrl}
																				alt={`Imagen ${
																					imgIdx + 1
																				}`}
																				className='w-16 h-16 object-cover rounded border'
																			/>
																			<span className='absolute -top-1 -right-1 bg-gray-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
																				{imgIdx + 1}
																			</span>
																		</div>
																	),
																)}
															</div>
														</div>
													)}

												{/* Subir nueva imagen */}
												<div>
													<label className='text-xs text-gray-600 mb-1 flex items-center gap-1'>
														<Upload size={12} />
														Agregar nueva imagen (opcional)
													</label>
													<div className='flex items-center gap-3'>
														<input
															type='file'
															accept='image/*'
															onChange={(e) => {
																const file =
																	e.target.files?.[0] || null;
																handleImageChange(idx, file);
															}}
															className='flex-1 text-sm border px-3 py-2 rounded-md'
														/>
														{item.imagePreview && (
															<div className='relative'>
																<img
																	src={item.imagePreview}
																	alt='Vista previa'
																	className='w-12 h-12 object-cover rounded border'
																/>
																<button
																	type='button'
																	onClick={() =>
																		handleImageChange(idx, null)
																	}
																	className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600'>
																	✕
																</button>
															</div>
														)}
													</div>
													{item.progressImage && (
														<p className='text-xs text-green-600 mt-1'>
															✓ Nueva imagen seleccionada:{' '}
															{item.progressImage.name}
														</p>
													)}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>

					{/* Total */}
					<div className='p-4 bg-gray-50 rounded-lg border'>
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
								updateOrderMutation.isPending ||
								uploadingImages ||
								orderData.items.length === 0 ||
								!orderData.user
							}
							className={`px-6 py-2 border border-brown rounded-md transition-colors flex items-center gap-2 ${
								updateOrderMutation.isPending ||
								uploadingImages ||
								orderData.items.length === 0 ||
								!orderData.user
									? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500'
									: 'text-brown hover:bg-brown hover:text-white'
							}`}>
							{uploadingImages ? (
								<>
									<span className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></span>
									Subiendo imágenes...
								</>
							) : updateOrderMutation.isPending ? (
								'Guardando...'
							) : (
								'Guardar Cambios'
							)}
						</button>
					</div>
				</form>

			</div>
		</div>
	);
}

export default EditOrderModal;
