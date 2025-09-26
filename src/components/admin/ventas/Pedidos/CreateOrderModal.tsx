'use client';
import { DefaultModalProps, Order, Service, User } from '@/app/types';
import api from '@/components/Global/axios';
import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { IoMdAdd, IoMdRemove } from 'react-icons/io';
import { createElement } from '../../global/alerts';

function CreateOrderModal({ isOpen, onClose, updateList }: DefaultModalProps<Order>) {
	const [users, setUsers] = useState<User[]>([]);
	const [services, setServices] = useState<Service[]>([]);
	const [orderData, setOrderData] = useState<Order>({
		_id: undefined,
		user: {
			_id: '',
			name: '',
			email: '',
			address: '',
			phone: '',
			password: '',
			role: {
				_id: '',
				name: 'administrador',
				description: 'Acceso completo',
				permissions: [],
				createdAt: '',
				status: true,
				usersCount: 0,
			},
			status: true,
			registeredAt: '2025/02/02',
			featuredProducts: [],
		},
		status: 'En proceso',
		address: '',
		startedAt: '',
		items: [],
		paymentStatus: '',
		payments: [],
	});

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
		const selectedUser = users.find((u) => u._id === userId);
		if (selectedUser) {
			setOrderData((prev) => ({ ...prev, user: selectedUser }));
		}
	};

	// Cambiar valores de los servicios
	const handleItemChange = (
		index: number,
		field: 'id_servicio' | 'detalles' | 'valor',
		value: string | number
	) => {
		const newItems = [...orderData.items];
		if (field == 'valor') {
			newItems[index][field] = Number(value);
		} else {
			newItems[index][field] = value as string;
		}
		setOrderData((prev) => ({ ...prev, items: newItems }));
	};

	// Agregar fila
	const addItem = () => {
		setOrderData((prev) => ({
			...prev,
			items: [...prev.items, { id_servicio: '', detalles: '', valor: 0 }],
		}));
	};

	// Eliminar fila
	const removeItem = (index: number) => {
		setOrderData((prev) => ({
			...prev,
			items: prev.items.filter((_, i) => i !== index),
		}));
	};

	const fetchUsers = async () => {
		const response = await api.get('/api/users');
		if (response.status == 200) {
			setUsers(response.data.users);
		}
	};

	const fetchServices = async () => {
		const response = await api.get('/api/services');
		if (response.status == 200) {
			setServices(response.data);
		}
	};

	useEffect(() => {
		fetchUsers();
		fetchServices();
	}, []);

	// Calcular total
	const total = orderData.items.reduce((sum, item) => sum + item.valor, 0);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const response = await createElement('Pedido', '/api/orders', orderData, updateList);
		setOrderData({
			_id: undefined,
			user: {
				_id: '',
				name: '',
				email: '',
				address: '',
				phone: '',
				password: '',
				role: {
					_id: '',
					name: 'administrador',
					description: 'Acceso completo',
					permissions: [],
					createdAt: '',
					status: true,
					usersCount: 0,
				},
				status: true,
				registeredAt: '2025/02/02',
				featuredProducts: [],
			},
			status: 'En proceso',
			address: '',
			startedAt: '',
			items: [],
			paymentStatus: '',
			payments: [],
		});
		onClose();
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
					<h1 className='text-xl font-semibold text-center'>Agregar Pedido</h1>
				</header>

				<form
					onSubmit={handleSubmit}
					className='flex flex-col gap-4'>
					{/* Cliente */}
					<div className='flex flex-col'>
						<label>Cliente</label>
						<select
							name='user'
							id='user'
							className='border px-2 py-1 rounded-md'
							value={(orderData.user as User)._id}
							onChange={handleUserChange}>
							<option value=''>Seleccione un usuario</option>
							{users.map((user) => (
								<option
									key={user._id}
									value={user._id}>
									{user.name}
								</option>
							))}
						</select>
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

					{/* Fecha */}
					<div className='flex flex-col'>
						<label>Fecha de inicio</label>
						<input
							name='startedAt'
							type='date'
							value={orderData.startedAt}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					{/* Tabla de items */}
					<div className='mt-4 h-[138px] overflow-y-scroll'>
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
								<select
									value={item.id_servicio as string}
									onChange={(e) =>
										handleItemChange(idx, 'id_servicio', e.target.value)
									}>
									<option value=''>Seleccione un servicio</option>
									{services.map((service) => (
										<option
											key={service._id}
											value={service._id}>
											{service.name}
										</option>
									))}
								</select>
								<input
									type='number'
									placeholder='Valor'
									value={item.valor}
									onChange={(e) => handleItemChange(idx, 'valor', e.target.value)}
									className='border px-2 py-1 rounded-md'
								/>
								<input
									type='text'
									placeholder='Detalles'
									value={item.detalles}
									onChange={(e) =>
										handleItemChange(idx, 'detalles', e.target.value)
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
						Valor total del pedido:
						<span>${total.toLocaleString('es-CO')}</span>
					</p>

					{/* Botones */}
					<div className='flex justify-between mt-6'>
						<button
							type='submit'
							className='px-6 py-2 border border-brown rounded-md text-brown hover:bg-brown hover:text-white transition'>
							Guardar
						</button>
						<button
							type='button'
							onClick={onClose}
							className='px-6 py-2 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-200 transition'>
							Cancelar
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default CreateOrderModal;
