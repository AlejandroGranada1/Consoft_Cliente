'use client';
import { DefaultModalProps, Order } from '@/app/types';
import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { IoMdAdd, IoMdRemove } from 'react-icons/io';

function EditOrderModal({ isOpen, onClose, extraProps }: DefaultModalProps<Order>) {
	const [orderData, setOrderData] = useState<Order>(
		extraProps ?? {
			id: '',
			user: {
				id: '',
				name: '',
				email: '',
				address: '',
				phone: '',
				password: '',
				role: {
					id: '',
					name: '',
					description: '',
					permissions: [],
					createdAt: '',
					status: true,
					usersCount: 0,
				},
				status: true,
				registeredAt: '',
				featuredProducts: [],
			},
			status: 'En proceso',
			address: '',
			startDate: '',
			endDate: '',
			items: [],
			payments: [],
			attachments: [],
		}
	);

	// Cambiar inputs generales
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setOrderData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Cambiar valores de los servicios
	const handleItemChange = (
		index: number,
		field: 'service' | 'details' | 'value',
		value: string | number
	) => {
		const newItems = [...orderData.items];
		newItems[index][field] = field === 'value' ? Number(value) : (value as string);
		setOrderData((prev) => ({ ...prev, items: newItems }));
	};

	// Agregar fila
	const addItem = () => {
		setOrderData((prev) => ({
			...prev,
			items: [...prev.items, { service: '', details: '', value: 0 }],
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
	const total = orderData.items.reduce((sum, item) => sum + item.value, 0);

	// Colores dinámicos del estado
	const getStatusClass = (status: string) => {
		return status === 'Completado'
			? 'bg-blue-500/30 text-blue-500'
			: status === 'Cancelado'
			? 'bg-red/30 text-red'
			: 'bg-orange/30 text-orange';
	};

	if (!isOpen) return null;

	return (
		<div className='modal-bg'>
			<div className='modal-frame w-[800px] p-6'>
				<header className='relative mb-4'>
					<button
						onClick={onClose}
						className='absolute top-0 left-0 text-2xl text-gray-500 hover:text-black cursor-pointer'>
						<IoMdClose />
					</button>
					<h1 className='text-xl font-semibold text-center'>Editar Pedido</h1>
				</header>

				<section className='flex flex-col gap-4'>
					{/* Cliente */}
					<div className='flex flex-col'>
						<label>Cliente</label>
						<input
							name='user'
							type='text'
							placeholder='Nombre del cliente'
							value={orderData.user.name}
							onChange={(e) =>
								setOrderData((prev) => ({
									...prev,
									user: { ...prev.user, name: e.target.value },
								}))
							}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					{/* Dirección */}
					<div className='flex flex-col'>
						<label>Dirección</label>
						<input
							name='address'
							type='text'
							placeholder='Dirección'
							value={orderData.address}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					{/* Fecha de inicio */}
					<div className='flex flex-col'>
						<label>Fecha de inicio</label>
						<input
							name='startDate'
							type='date'
							value={orderData.startDate}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					{/* Fecha de finalización */}
					<div className='flex flex-col'>
						<label>Fecha de finalización</label>
						<input
							name='endDate'
							type='date'
							value={orderData.endDate || ''}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					{/* Estado del pedido */}
					<div className='flex flex-col'>
						<label>Estado</label>
						<select
							name='status'
							value={orderData.status}
							onChange={handleChange}
							className={`border px-3 py-2 rounded-md ${getStatusClass(
								orderData.status
							)}`}>
							<option value='En proceso'>En proceso</option>
							<option value='Completado'>Completado</option>
							<option value='Cancelado'>Cancelado</option>
						</select>
					</div>

					{/* Tabla de items */}
					<div className='mt-4 h-[137px] overflow-y-scroll'>
						<div className='grid grid-cols-4 gap-2 font-semibold border-b pb-2 items-center'>
							<p>Servicios</p>
							<p>Valor del servicio</p>
							<p>Detalles del servicio</p>
							<button
								type='button'
								onClick={addItem}
								className='flex items-center justify-center border border-brown text-brown rounded-md px-2 py-1 hover:bg-brown hover:text-white transition'>
								<IoMdAdd />
							</button>
						</div>

						{orderData.items.map((item, idx) => (
							<div
								key={idx}
								className='grid grid-cols-4 gap-2 py-2 border-b items-center'>
								<input
									type='text'
									placeholder='Servicio'
									value={item.service}
									onChange={(e) =>
										handleItemChange(idx, 'service', e.target.value)
									}
									className='border px-2 py-1 rounded-md'
								/>
								<input
									type='number'
									placeholder='Valor'
									value={item.value}
									onChange={(e) => handleItemChange(idx, 'value', e.target.value)}
									className='border px-2 py-1 rounded-md'
								/>
								<input
									type='text'
									placeholder='Detalles'
									value={item.details}
									onChange={(e) =>
										handleItemChange(idx, 'details', e.target.value)
									}
									className='border px-2 py-1 rounded-md'
								/>
								<button
									type='button'
									onClick={() => removeItem(idx)}
									className='flex items-center justify-center border border-red-400 text-red-500 rounded-md px-2 py-1 hover:bg-red-500 hover:text-white transition'>
									<IoMdRemove />
								</button>
							</div>
						))}
					</div>

					{/* Total */}
					<p className='mt-4 font-semibold'>
						Valor total del pedido:{' '}
						<span className='text-brown'>${total.toLocaleString('es-CO')}</span>
					</p>

					{/* Botones */}
					<div className='flex justify-between mt-6'>
						<button
							type='submit'
							className='px-6 py-2 border border-brown rounded-md text-brown hover:bg-brown hover:text-white transition'>
							Guardar cambios
						</button>
						<button
							type='button'
							onClick={onClose}
							className='px-6 py-2 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-200 transition'>
							Cancelar
						</button>
					</div>
				</section>
			</div>
		</div>
	);
}

export default EditOrderModal;
