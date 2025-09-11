'use client';
import { DefaultModalProps, Visit } from '@/app/types';
import React, { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';

function EditVisitModal({ isOpen, onClose, extraProps }: DefaultModalProps<Visit>) {
	const [visitData, setVisitData] = useState<Visit>({
		id: 'VIS-003',
		scheduledAt: '2025-02-02',
		user: {
			id: '',
			name: 'Raúl 3',
			email: '',
			address: '',
			phone: '',
			role: {
				id: '',
				name: '',
				description: '',
				usersCount: 0,
				createdAt: '',
				permissions: [],
				status: true,
			},
			featuredProducts: [],
			registeredAt: '',
			status: true,
		},
		address: 'Mi Casa',
		services: [],
		status: 'Terminada',
	});

	// 🔹 Prellenar datos cuando se abre el modal
	useEffect(() => {
		if (extraProps) {
			setVisitData(extraProps);
		}
	}, [extraProps, isOpen]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setVisitData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Categoría actualizada:', visitData);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className='modal-bg'>
			<div className='modal-frame w-[800px]'>
				<header className='w-fit mx-auto'>
					<button
						onClick={onClose}
						className='absolute top-4 left-4 text-2xl text-gray-500 hover:text-black cursor-pointer'>
						<IoMdClose />
					</button>
					<h1 className='text-xl font-semibold mb-4'>EDITAR VISITA</h1>
				</header>
				<form onSubmit={handleSubmit}>
					{/* Cliente */}
					<div className='flex flex-col'>
						<label htmlFor='cliente'>Cliente</label>
						<input
							id='cliente'
							name='user'
							type='text'
							placeholder='Nombre del producto'
							value={visitData.user.name}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					{/* Direccion */}
					<div className='flex flex-col'>
						<label htmlFor='direccion'>Direccion</label>
						<input
							id='name'
							name='address'
							type='text'
							placeholder='Nombre del producto'
							value={visitData.address}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>
					{/* Fecha */}
					<div className='flex flex-col'>
						<label htmlFor='name'>Fecha de la visita</label>
						<input
							id='name'
							name='scheduledAt'
							type='date'
							placeholder='Nombre del producto'
							value={visitData.scheduledAt}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					{/* Servicios */}
					<div className='flex gap-2'>
						<label htmlFor='fabricacion'>Fabricacion</label>
						<input
							id='fabricacion'
							name='name'
							type='checkbox'
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					<div className='flex flex-col mt-4'>
						<label className='font-semibold'>Estado de la visita</label>
						<p
							className={`${
								extraProps?.status == 'Terminada'
									? 'bg-green/30 text-green'
									: extraProps?.status == 'Cancelada'
									? 'bg-red/30 text-red'
									: 'bg-orange/30 text-orange'
							} px-2 py-1 rounded-xl`}>
							{extraProps?.status}
						</p>
					</div>
				</form>
				<div className='w-full flex justify-between mt-10'>
					<button
						type='submit'
						className='px-10 py-2 rounded-lg border border-brown text-brown cursor-pointer'>
						Guardar
					</button>
					<button
						type='button'
						onClick={onClose}
						className='px-10 py-2 rounded-lg border border-gray bg-gray cursor-pointer'>
						Cancelar
					</button>
				</div>
			</div>
		</div>
	);
}

export default EditVisitModal;
