'use client';
import { X } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { createElement } from '@/components/admin/global/alerts';
import api from '@/components/Global/axios';
import { DefaultModalProps } from '@/lib/types';

function CreateUserModal({ isOpen, onClose, updateList }: DefaultModalProps<any>) {
	const [userData, setUserData] = useState({
		name: '',
		email: '',
		password: '',
		role: '',
	});

	const [roles, setRoles] = useState<{ _id: string; name: string }[]>([]);

	// 🔹 Cargar roles cuando se abre el modal
	useEffect(() => {
		if (!isOpen) return;

		const fetchRoles = async () => {
			const Swal = (await import('sweetalert2')).default;
			try {
				const res = await api.get('/api/roles');
				if (res.data?.ok) {
					setRoles(res.data.roles);
				} else {
					setRoles([]);
				}
			} catch (err) {
				console.error('Error al obtener roles:', err);
				Swal.fire('Error', 'No se pudieron cargar los roles', 'error');
			}
		};

		fetchRoles();
	}, [isOpen]);

	// 🔹 Limpiar modal al cerrar
	useEffect(() => {
		if (!isOpen) {
			setUserData({
				name: '',
				email: '',
				password: '',
				role: '',
			});
		}
	}, [isOpen]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setUserData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const Swal = (await import('sweetalert2')).default;

		const { name, email, password, role } = userData;

		// 🔹 Alertas por campos vacíos
		if (!name || !email || !password || !role) {
			return Swal.fire('Campos incompletos', 'Todos los campos son obligatorios', 'warning');
		}

		try {
			await createElement('usuario', '/api/users', userData, updateList!);
			onClose();
		} catch (error) {
			console.error('Error al crear usuario:', error);
			Swal.fire('Error', 'Hubo un problema al crear el usuario', 'error');
		}
	};

	if (!isOpen) return null;

	return (
		<div className='modal-bg fixed inset-0 flex items-center justify-center bg-black/20 z-50'>
			<div className='modal-frame bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative'>
				<header className='w-fit mx-auto'>
					<button
						onClick={onClose}
						className='absolute top-4 left-4 text-2xl text-gray-500 hover:text-black cursor-pointer'>
						<X />
					</button>
					<h1 className='text-xl font-semibold mb-4'>AGREGAR NUEVO USUARIO</h1>
				</header>

				<form onSubmit={handleSubmit} className='space-y-4'>
					{/* Nombre */}
					<div className='flex flex-col'>
						<label htmlFor='name'>Nombre</label>
						<input
							id='name'
							name='name'
							type='text'
							placeholder='Nombre'
							value={userData.name}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					{/* Email */}
					<div className='flex flex-col'>
						<label htmlFor='email'>Correo Electrónico</label>
						<input
							id='email'
							name='email'
							type='email'
							placeholder='Correo Electrónico'
							value={userData.email}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					{/* Password */}
					<div className='flex flex-col'>
						<label htmlFor='password'>Contraseña</label>
						<input
							id='password'
							name='password'
							type='password'
							placeholder='********'
							value={userData.password}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					{/* Rol */}
					<div className='flex flex-col'>
						<label htmlFor='role'>Rol</label>
						<select
							id='role'
							name='role'
							value={userData.role}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'>
							<option value=''>Seleccionar rol</option>
							{roles.map((role) => (
								<option key={role._id} value={role._id}>
									{role.name}
								</option>
							))}
						</select>
					</div>

					{/* Botones */}
					<div className='w-full flex justify-between mt-6'>
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

export default CreateUserModal;
