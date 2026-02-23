'use client';
import { X, User, Mail, Phone, MapPin, UserCircle, Info, Save, Check } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { DefaultModalProps, Role } from '@/lib/types';
import api from '@/components/Global/axios';
import { updateElement } from '../global/alerts';

function EditUserModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<any>) {
	const [userData, setUserData] = useState<any | null>(null);
	const [roles, setRoles] = useState<Role[]>([]);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);

	// 🔹 Cargar roles al abrir modal
	useEffect(() => {
		if (!isOpen) return;

		const fetchRoles = async () => {
			setLoading(true);
			try {
				const res = await api.get('/api/roles');
				setRoles(res.data.roles || []);
			} catch (error) {
				console.error('Error al obtener roles:', error);
				const Swal = (await import('sweetalert2')).default;
				Swal.fire('Error', 'No se pudieron cargar los roles', 'error');
			} finally {
				setLoading(false);
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
				status: extraProps.status ?? true,
				featuredProducts: extraProps.featuredProducts || [],
				document: extraProps.document || '',
				id: extraProps.id || '',
				profile_picture: extraProps.profile_picture || '',
			});
		}
	}, [extraProps, isOpen]);

	// 🔹 Limpiar modal al cerrar
	useEffect(() => {
		if (!isOpen) setUserData(null);
	}, [isOpen]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUserData((prev: any) => (prev ? { ...prev, [name]: value } : prev));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!userData) return;

		if (!userData.name || !userData.email || !userData.role) {
			const Swal = (await import('sweetalert2')).default;
			return Swal.fire(
				'Campos incompletos',
				'Nombre, correo y rol son obligatorios',
				'warning',
			);
		}

		setSaving(true);
		try {
			await updateElement('Usuario', `/api/users/${userData._id}`, userData, updateList!);
			onClose();
		} catch (error) {
			console.error('Error al actualizar usuario:', error);
		} finally {
			setSaving(false);
		}
	};

	if (!isOpen || !userData) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
			<div className='modal-frame w-full max-w-[600px] flex flex-col max-h-[92vh]'>
				<header className='sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-xs'>
					<button
						onClick={onClose}
						className='absolute top-0 left-0 p-5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors'>
						<X size={20} />
					</button>
					<h1 className='text-2xl font-bold text-center flex items-center justify-center gap-2'>
						<User size={20} /> Editar Usuario
					</h1>
				</header>

				<form
					onSubmit={handleSubmit}
					className='space-y-5 p-6 overflow-y-auto'>
					{/* Información principal */}
					<div className='grid grid-cols-2 gap-6'>
						{/* Nombre */}
						<div className='flex flex-col'>
							<label className='font-medium mb-1 flex items-center gap-2'>
								<User size={16} />
								Nombre *
							</label>
							<input
								name='name'
								value={userData.name}
								onChange={handleChange}
								placeholder='Ej: Juan Pérez'
								className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown w-full'
								required
							/>
						</div>

						{/* Estado */}
						<div className='flex flex-col'>
							<label className='font-medium mb-1 flex items-center gap-2'>
								<Info size={16} />
								Estado
							</label>
							<div className='flex items-center h-10'>
								<label className='flex items-center gap-2 cursor-pointer'>
									<input
										type='checkbox'
										checked={userData.status}
										onChange={(e) =>
											setUserData((prev: any) =>
												prev ? { ...prev, status: e.target.checked } : prev,
											)
										}
										className='rounded border-gray-300 text-brown focus:ring-brown focus:ring-1'
									/>
									<span
										className={`px-3 py-1 rounded-full text-sm font-medium ${
											userData.status
												? 'bg-green-100 text-green-700'
												: 'bg-red-100 text-red-700'
										}`}>
										{userData.status ? 'Activo' : 'Inactivo'}
									</span>
								</label>
							</div>
						</div>
					</div>

					{/* Email */}
					<div className='flex flex-col'>
						<label className='font-medium mb-1 flex items-center gap-2'>
							<Mail size={16} />
							Correo Electrónico *
						</label>
						<input
							name='email'
							type='email'
							value={userData.email}
							onChange={handleChange}
							placeholder='ejemplo@correo.com'
							className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown w-full'
							required
						/>
					</div>

					{/* Teléfono y Dirección en grid */}
					<div className='grid grid-cols-2 gap-6'>
						{/* Teléfono */}
						<div className='flex flex-col'>
							<label className='font-medium mb-1 flex items-center gap-2'>
								<Phone size={16} />
								Teléfono
							</label>
							<input
								name='phone'
								value={userData.phone}
								onChange={handleChange}
								placeholder='+57 300 123 4567'
								className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown w-full'
							/>
						</div>

						{/* Rol */}
						<div className='flex flex-col'>
							<label className='font-medium mb-1 flex items-center gap-2'>
								<UserCircle size={16} />
								Rol *
							</label>
							<select
								value={(userData.role as Role)?._id || ''}
								onChange={(e) => {
									const selectedRole = roles.find(
										(r) => r._id === e.target.value,
									);
									setUserData((prev: any) =>
										prev
											? {
													...prev,
													role: selectedRole || '',
												}
											: prev,
									);
								}}
								className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown w-full bg-white'
								required
								disabled={loading}>
								<option value=''>Seleccionar rol</option>
								{loading ? (
									<option
										value=''
										disabled>
										Cargando roles...
									</option>
								) : (
									roles.map((role) => (
										<option
											key={role._id}
											value={role._id}>
											{role.name}
										</option>
									))
								)}
							</select>
						</div>
					</div>

					{/* Dirección */}
					<div className='flex flex-col'>
						<label className='font-medium mb-1 flex items-center gap-2'>
							<MapPin size={16} />
							Dirección
						</label>
						<input
							name='address'
							value={userData.address}
							onChange={handleChange}
							placeholder='Calle 123 #45-67, Ciudad'
							className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown w-full'
						/>
					</div>

					{/* Documento de identidad (campo adicional que estaba en el tipo) */}
					{userData.document !== undefined && (
						<div className='flex flex-col'>
							<label className='font-medium mb-1 flex items-center gap-2'>
								<DocumentIcon size={16} />
								Documento de identidad
							</label>
							<input
								name='document'
								value={userData.document}
								onChange={handleChange}
								placeholder='123456789'
								className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown w-full'
							/>
						</div>
					)}

					{/* Resumen de cambios */}
					<div className='p-4 bg-gray-50 rounded-lg border'>
						<div className='flex justify-between items-center'>
							<div>
								<span className='font-semibold text-sm'>Resumen de cambios:</span>
								<p className='text-xs text-gray-600 mt-1'>{userData.name}</p>
								<p className='text-xs text-gray-600'>{userData.email}</p>
							</div>
							<div className='text-right'>
								{userData.role && (
									<span className='text-xs font-medium text-brown bg-brown/10 px-3 py-1 rounded-full'>
										{(userData.role as Role)?.name || 'Rol seleccionado'}
									</span>
								)}
							</div>
						</div>
						{userData.status !== extraProps?.status && (
							<p className='text-xs text-yellow-600 mt-2 flex items-center gap-1'>
								<Info size={12} />
								El estado cambiará de {extraProps?.status
									? 'Activo'
									: 'Inactivo'} a {userData.status ? 'Activo' : 'Inactivo'}
							</p>
						)}
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
							disabled={saving || !userData.name || !userData.email || !userData.role}
							className={`px-6 py-2 border border-brown rounded-md transition-colors flex items-center gap-2 ${
								saving || !userData.name || !userData.email || !userData.role
									? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500'
									: 'text-brown hover:bg-brown hover:text-white'
							}`}>
							{saving ? (
								<>
									<span className='animate-spin rounded-full h-4 w-4 border-b-2 border-current'></span>
									Guardando...
								</>
							) : (
								<>
									<Save size={16} />
									Guardar Cambios
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

// Icono para documento (no disponible en lucide-react)
const DocumentIcon = ({ size }: { size: number }) => (
	<svg
		width={size}
		height={size}
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'>
		<path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
		<polyline points='14 2 14 8 20 8' />
		<line
			x1='16'
			y1='13'
			x2='8'
			y2='13'
		/>
		<line
			x1='16'
			y1='17'
			x2='8'
			y2='17'
		/>
		<polyline points='10 9 9 9 8 9' />
	</svg>
);

export default EditUserModal;
