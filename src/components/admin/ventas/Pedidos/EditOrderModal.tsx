'use client';
import { DefaultModalProps, Order, OrderWithPartialUser, User } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import { IoMdClose, IoMdAdd, IoMdRemove } from 'react-icons/io';
import api from '@/components/Global/axios';
import { updateElement } from '../../global/alerts';
import { formatDateForInput } from '@/lib/formatDate';
import { useGetServices } from '@/hooks/apiHooks';

interface Service {
	_id: string;
	name: string;
}

function EditOrderModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<Order>) {
	const [orderData, setOrderData] = useState<OrderWithPartialUser>(
		extraProps ?? {
			_id: '',
			user: { _id: '', name: '' } as User,
			status: '',
			address: '',
			startedAt: '',
			deliveredAt: '',
			items: [],
			payments: [],
			rating: 0,
			paymentStatus: '',
		}
	);

	// Para sincronizar datos iniciales
	useEffect(() => {
		if (extraProps) {
			const withImages = extraProps.items.map((i) => ({
				...i,
				progressImage: null, // agregar campo para archivo
			}));

			setOrderData({
				...extraProps,
				items: withImages,
				user:
					typeof extraProps.user === 'object'
						? extraProps.user
						: { _id: String(extraProps.user), name: '' },
			});
		}
	}, [extraProps]);

	const { data } = useGetServices();
	const services = data?.data || [];

	// Manejar cambios de inputs generales
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;

		if (name.startsWith('user.')) {
			const field = name.split('.')[1] as keyof User;
			setOrderData((prev) => ({
				...prev,
				user: {
					...(typeof prev.user === 'object' ? prev.user : { _id: '' }),
					[field]: value,
				} as User,
			}));
		} else {
			setOrderData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	// Cambios en items
	const handleItemChange = (
		index: number,
		field: 'id_servicio' | 'detalles' | 'valor' | 'progressImage',
		value: string | number | File | null
	) => {
		const newItems = [...orderData.items];
		(newItems[index] as any)[field] = field === 'valor' ? Number(value) : value;
		setOrderData((prev) => ({ ...prev, items: newItems }));
	};

	const addItem = () => {
		setOrderData((prev) => ({
			...prev,
			items: [
				...prev.items,
				{ id_servicio: '', detalles: '', valor: 0, progressImage: null },
			],
		}));
	};

	const removeItem = (index: number) => {
		setOrderData((prev) => ({
			...prev,
			items: prev.items.filter((_, i) => i !== index),
		}));
	};

	const total = orderData.items.reduce((sum, item) => sum + (item.valor || 0), 0);

	// Guardar cambios + subir imagenes
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			// 1. Actualizar pedido sin imágenes
			const payload = {
				...orderData,
				user: typeof orderData.user === 'object' ? orderData.user._id : orderData.user,
			};

			await updateElement('Pedido', `/api/orders/${payload._id}`, payload, updateList!);

			console.log('Pedido actualizado:', payload._id);

			// 2. Subir imágenes de progreso, una por item
			for (const item of orderData.items) {
				if (item.progressImage instanceof File) {
					const formData = new FormData();
					formData.append('item_id', item._id); // vincula la imagen al item
					formData.append('product_images', item.progressImage);

					await api.post(`/api/orders/${payload._id}/attachments`, formData, {
						headers: { 'Content-Type': 'multipart/form-data' },
					});
				}
			}

			onClose();
		} catch (err) {
			console.error('Error al actualizar el pedido', err);
			alert('Error al actualizar el pedido ❌');
		}
	};
	if (!isOpen) return null;

	return (
		<div className='modal-bg'>
			<div className='modal-frame w-[800px] p-6'>
				<header className='relative mb-4'>
					<button
						onClick={onClose}
						className='absolute top-0 left-0 text-2xl text-gray-500 hover:text-black'>
						<IoMdClose />
					</button>
					<h1 className='text-xl font-semibold text-center'>Editar Pedido</h1>
				</header>

				<form
					onSubmit={handleSubmit}
					className='flex flex-col gap-4'>
					{/* Cliente */}
					<div className='flex flex-col'>
						<label>Cliente</label>
						<input
							name='user.name'
							type='text'
							placeholder='Nombre del cliente'
							value={(orderData.user as User)?.name || ''}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					{/* Dirección */}
					<div className='flex flex-col'>
						<label>Dirección</label>
						<input
							name='address'
							type='text'
							value={orderData.address || ''}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					{/* Fechas */}
					<div className='flex flex-col'>
						<label>Fecha de inicio</label>
						<input
							name='startDate'
							type='date'
							value={formatDateForInput(orderData.startedAt)}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					<div className='flex flex-col'>
						<label>Fecha de finalización</label>
						<input
							name='deliveredAt'
							type='date'
							value={formatDateForInput(orderData.deliveredAt)}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					{/* Items */}
					<div className='mt-4 h-[158px] overflow-y-scroll'>
						<div className='grid grid-cols-5 gap-2 font-semibold border-b pb-2 items-center'>
							<p>Servicios</p>
							<p>Valor</p>
							<p>Detalles</p>
							<p>Imagen</p>
							<button
								type='button'
								onClick={addItem}
								className='flex items-center justify-center border border-brown text-brown rounded-md px-2 py-1 hover:bg-brown hover:text-white'>
								<IoMdAdd />
							</button>
						</div>

						{orderData.items.map((item, idx) => (
							<div
								key={idx}
								className='grid grid-cols-5 gap-2 py-2 border-b items-center'>
								<select
									value={
										typeof item.id_servicio === 'string'
											? item.id_servicio
											: item.id_servicio?._id
									}
									onChange={(e) =>
										handleItemChange(idx, 'id_servicio', e.target.value)
									}
									className='border px-2 py-1 rounded-md'>
									<option value=''>Seleccione servicio</option>
									{services.map((s: Service) => (
										<option
											key={s._id}
											value={s._id}>
											{s.name}
										</option>
									))}
								</select>

								<input
									type='number'
									value={item.valor}
									onChange={(e) => handleItemChange(idx, 'valor', e.target.value)}
									className='border px-2 py-1 rounded-md'
								/>

								<input
									type='text'
									value={item.detalles || ''}
									onChange={(e) =>
										handleItemChange(idx, 'detalles', e.target.value)
									}
									className='border px-2 py-1 rounded-md'
								/>

								<input
									type='file'
									accept='image/*'
									onChange={(e) => {
										const file = e.target.files?.[0] || null;
										handleItemChange(idx, 'progressImage', file);
									}}
									className='border px-2 py-1 rounded-md'
								/>

								<button
									type='button'
									onClick={() => removeItem(idx)}
									className='flex items-center justify-center border border-red-400 text-red-500 rounded-md px-2 py-1 hover:bg-red-500 hover:text-white'>
									<IoMdRemove />
								</button>
							</div>
						))}
					</div>

					{/* Total */}
					<p className='mt-4 font-semibold'>
						Valor total:{' '}
						<span className='text-brown'>${total.toLocaleString('es-CO')}</span>
					</p>

					{/* Botones */}
					<div className='flex justify-between mt-6'>
						<button
							type='submit'
							className='px-6 py-2 border border-brown rounded-md text-brown hover:bg-brown hover:text-white'>
							Guardar cambios
						</button>
						<button
							type='button'
							onClick={onClose}
							className='px-6 py-2 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-200'>
							Cancelar
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default EditOrderModal;
