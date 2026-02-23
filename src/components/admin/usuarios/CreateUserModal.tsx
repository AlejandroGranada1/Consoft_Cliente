'use client';
import { X, User, Mail, Lock, UserCircle, Save } from 'lucide-react';
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
	const [loading, setLoading] = useState(false);

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

		setLoading(true);
		try {
			await createElement('usuario', '/api/users', userData, updateList!);
			onClose();
		} catch (error) {
			console.error('Error al crear usuario:', error);
			Swal.fire('Error', 'Hubo un problema al crear el usuario', 'error');
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
			<div className='modal-frame w-full max-w-[500px] flex flex-col max-h-[92vh]'>
				
				<header className='sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-xs'>
					<button
						onClick={onClose}
						className='absolute top-0 left-0 p-5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors'>
						<X size={20} />
					</button>
					<h1 className='text-2xl font-bold text-center flex items-center justify-center gap-2'>
						<UserCircle size={20} /> Crear Usuario
					</h1>
				</header>

				<form onSubmit={handleSubmit} className='space-y-5 p-6 overflow-y-auto'>

					{/* Nombre */}
					<div className='flex flex-col'>
						<label htmlFor='name' className='font-medium mb-1 flex items-center gap-2'>
							<User size={16} />
							Nombre completo *
						</label>
						<input
							id='name'
							name='name'
							type='text'
							placeholder='Ej: Juan Pérez'
							value={userData.name}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown w-full'
							required
						/>
					</div>

					{/* Email */}
					<div className='flex flex-col'>
						<label htmlFor='email' className='font-medium mb-1 flex items-center gap-2'>
							<Mail size={16} />
							Correo Electrónico *
						</label>
						<input
							id='email'
							name='email'
							type='email'
							placeholder='ejemplo@correo.com'
							value={userData.email}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown w-full'
							required
						/>
					</div>

					{/* Password */}
					<div className='flex flex-col'>
						<label htmlFor='password' className='font-medium mb-1 flex items-center gap-2'>
							<Lock size={16} />
							Contraseña *
						</label>
						<input
							id='password'
							name='password'
							type='password'
							placeholder='••••••••'
							value={userData.password}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown w-full'
							required
						/>
						<p className='text-xs text-gray-500 mt-1'>
							Mínimo 6 caracteres
						</p>
					</div>

					{/* Rol */}
					<div className='flex flex-col'>
						<label htmlFor='role' className='font-medium mb-1 flex items-center gap-2'>
							<UserCircle size={16} />
							Rol *
						</label>
						<select
							id='role'
							name='role'
							value={userData.role}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown w-full bg-white'
							required>
							<option value=''>Seleccionar rol</option>
							{roles.length === 0 ? (
								<option value='' disabled>Cargando roles...</option>
							) : (
								roles.map((role) => (
									<option key={role._id} value={role._id}>
										{role.name}
									</option>
								))
							)}
						</select>
					</div>

					{/* Resumen de información */}
					<div className='p-4 bg-gray-50 rounded-lg border mt-4'>
						<div className='flex justify-between items-center'>
							<div>
								<span className='font-semibold text-sm'>Resumen:</span>
								<p className='text-xs text-gray-600 mt-1'>
									{userData.name ? userData.name : 'Nombre no especificado'}
								</p>
								<p className='text-xs text-gray-600'>
									{userData.email ? userData.email : 'Email no especificado'}
								</p>
							</div>
							<div className='text-right'>
								{userData.role && roles.find(r => r._id === userData.role) && (
									<span className='text-xs font-medium text-brown bg-brown/10 px-3 py-1 rounded-full'>
										{roles.find(r => r._id === userData.role)?.name}
									</span>
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
							disabled={loading || !userData.name || !userData.email || !userData.password || !userData.role}
							className={`px-6 py-2 border border-brown rounded-md transition-colors flex items-center gap-2 ${
								loading || !userData.name || !userData.email || !userData.password || !userData.role
									? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500'
									: 'text-brown hover:bg-brown hover:text-white'
							}`}>
							{loading ? (
								<>
									<span className='animate-spin rounded-full h-4 w-4 border-b-2 border-current'></span>
									Creando...
								</>
							) : (
								<>
									<Save size={16} />
									Crear Usuario
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default CreateUserModal;