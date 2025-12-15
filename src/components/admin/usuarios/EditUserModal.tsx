'use client';
import { X } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { DefaultModalProps, Role, User } from '@/lib/types';
import api from '@/components/Global/axios';
import { updateElement } from '../global/alerts';

function EditUserModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<User>) {
	const [userData, setUserData] = useState<User | null>(null);
	const [roles, setRoles] = useState<Role[]>([]);

	// 🔹 Cargar roles al abrir modal
	useEffect(() => {
		if (!isOpen) return;

		const fetchRoles = async () => {
			try {
				const res = await api.get('/api/roles');
				setRoles(res.data.roles || []);
			} catch (error) {
				console.error('Error al obtener roles:', error);
			}
		};

		fetchRoles();
	}, [isOpen]);

	// 🔹 Prellenar datos
	useEffect(() => {
		if (extraProps && isOpen) {
			setUserData({
				_id: extraProps._id,
				name: extraProps.name || '',
				address: extraProps.address || '',
				email: extraProps.email || '',
				phone: extraProps.phone || '',
				registeredAt: extraProps.registeredAt || new Date().toISOString(),
				role: extraProps.role || '',
				status: extraProps.status ?? false,
				featuredProducts: extraProps.featuredProducts || [],
				document: '',
				id: '',
				profile_picture: '',
			});
		}
	}, [extraProps, isOpen]);

	// 🔹 Limpiar modal al cerrar
	useEffect(() => {
		if (!isOpen) setUserData(null);
	}, [isOpen]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUserData((prev) => (prev ? { ...prev, [name]: value } : prev));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!userData) return;

		if (!userData.name || !userData.email || !userData.role) {
			const Swal = (await import('sweetalert2')).default;
			return Swal.fire(
				'Campos incompletos',
				'Nombre, correo y rol son obligatorios',
				'warning'
			);
		}

		await updateElement(
			'Usuario',
			`/api/users/${userData._id}`,
			userData,
			updateList!
		);

		onClose();
	};

	if (!isOpen || !userData) return null;

	return (
		<div className='modal-bg fixed inset-0 flex items-center justify-center bg-black/20 z-50'>
			<div className='modal-frame bg-white rounded-xl shadow-lg p-6 w-full max-w-[600px] relative'>
				<header className='w-fit mx-auto'>
					<button
						onClick={onClose}
						className='absolute top-4 left-4 text-2xl text-gray-500 hover:text-black cursor-pointer'>
						<X />
					</button>
					<h1 className='text-xl font-semibold mb-4'>EDITAR USUARIO</h1>
				</header>

				<form onSubmit={handleSubmit}>
					{/* Nombre */}
					<div className='flex flex-col'>
						<label>Nombre</label>
						<input
							name='name'
							value={userData.name}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					{/* Email */}
					<div className='flex flex-col mt-4'>
						<label>Correo</label>
						<input
							name='email'
							type='email'
							value={userData.email}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					{/* Teléfono */}
					<div className='flex flex-col mt-4'>
						<label>Teléfono</label>
						<input
							name='phone'
							value={userData.phone}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					{/* Dirección */}
					<div className='flex flex-col mt-4'>
						<label>Dirección</label>
						<input
							name='address'
							value={userData.address}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					{/* Rol */}
					<div className='flex flex-col mt-4'>
						<label>Rol</label>
						<select
							value={(userData.role as Role)?._id || ''}
							onChange={(e) =>
								setUserData((prev) =>
									prev
										? {
												...prev,
												role: {
													_id: e.target.value,
													name: e.target.options[e.target.selectedIndex].text,
												} as Role,
										  }
										: prev
								)
							}
							className='border px-3 py-2 rounded-md'>
							<option value=''>Seleccionar rol</option>
							{roles.map((role) => (
								<option key={role._id} value={role._id}>
									{role.name}
								</option>
							))}
						</select>
					</div>

					{/* Estado */}
					<div className='flex items-center gap-3 mt-4'>
						<input
							type='checkbox'
							checked={userData.status}
							onChange={(e) =>
								setUserData((prev) =>
									prev ? { ...prev, status: e.target.checked } : prev
								)
							}
						/>
						<span className={userData.status ? 'text-green-600' : 'text-red-600'}>
							{userData.status ? 'Activo' : 'Inactivo'}
						</span>
					</div>

					{/* Botones */}
					<div className='w-full flex justify-between mt-10'>
						<button
							type='button'
							onClick={onClose}
							className='px-10 py-2 rounded-lg border border-gray bg-gray cursor-pointer'>
							Cancelar
						</button>

						<button
							type='submit'
							className='px-10 py-2 rounded-lg border border-brown text-brown cursor-pointer'>
							Guardar
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default EditUserModal;
