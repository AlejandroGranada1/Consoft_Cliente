'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { useGetProfile, useUpdateUser } from '@/hooks/apiHooks';

export default function ProfilePage() {
	const { data, isLoading } = useGetProfile();
	const user = data?.user;

	const updateUser = useUpdateUser();

	const [form, setForm] = useState({
		name: '',
		email: '',
		document: '',
		address: '',
		phone: '',
	});

	const [profilePreview, setProfilePreview] = useState<string | null>(null);
	const [profileFile, setProfileFile] = useState<File | null>(null);

	const [passwordForm, setPasswordForm] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	/* -------------------- CARGA INICIAL DEL USUARIO -------------------- */
	useEffect(() => {
		if (user) {
			setForm({
				name: user.name ?? '',
				email: user.email ?? '',
				document: user.document ?? '',
				address: user.address ?? '',
				phone: user.phone ?? '',
			});

			setProfilePreview(user.profile_picture ?? null);
		}
	}, [user]);

	if (isLoading || !user) return <p className='p-10 text-center'>Cargando...</p>;

	/* ------------------------ ACTUALIZAR INFORMACIÓN ------------------------ */
	const handleUpdateProfile = async () => {
		try {
			const formData = new FormData();
			formData.append('name', form.name);
			formData.append('document', form.document ?? '');
			formData.append('address', form.address ?? '');
			formData.append('phone', form.phone ?? '');

			if (profileFile) {
				formData.append('profile_picture', profileFile);
			}

			// 👉 Enviar directamente el FormData
			await updateUser.mutateAsync({
				_id: user._id,
				formData, // <-- AQUÍ CAMBIA
			});

			Swal.fire({
				icon: 'success',
				title: 'Perfil actualizado',
				text: 'Tu información ha sido guardada correctamente',
				confirmButtonColor: 'brown',
			});
		} catch (error) {
			console.error(error);
			Swal.fire('Error', 'No se pudo actualizar el perfil', 'error');
		}
	};

	/* ------------------------ CAMBIAR CONTRASEÑA ------------------------ */
	const handleChangePassword = async () => {
		/* 		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			return Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
		}

		try {
			const res = await api.put('/api/user/change-password', passwordForm);

			if (res.status === 200) {
				Swal.fire({
					icon: 'success',
					title: 'Contraseña actualizada',
					confirmButtonColor: 'brown',
				});

				setPasswordForm({
					currentPassword: '',
					newPassword: '',
					confirmPassword: '',
				});
			}
		} catch (error) {
			console.error(error);
			Swal.fire('Error', 'No se pudo cambiar la contraseña', 'error');
		} */
	};

	return (
		<div className='max-w-4xl mx-auto p-6'>
			<h1 className='text-3xl font-bold text-gray-800 mb-6'>Mi Perfil</h1>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{/* FOTO DE PERFIL */}
				<div className='flex flex-col items-center bg-white shadow p-5 rounded-lg'>
					<Image
						src={profilePreview || '/default-user.png'}
						alt='Foto de perfil'
						width={150}
						height={150}
						className='rounded-full object-cover border shadow'
					/>

					<label className='mt-4 cursor-pointer bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 text-sm'>
						Cambiar foto
						<input
							type='file'
							accept='image/*'
							className='hidden'
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) {
									setProfileFile(file);
									setProfilePreview(URL.createObjectURL(file));
								}
							}}
						/>
					</label>
				</div>

				{/* INFORMACIÓN PERSONAL */}
				<div className='md:col-span-2 bg-white shadow p-6 rounded-lg'>
					<h2 className='text-xl font-semibold mb-4'>Información Personal</h2>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<input
							type='text'
							value={form.name}
							onChange={(e) => setForm({ ...form, name: e.target.value })}
							placeholder='Nombre'
							className='input'
						/>

						<input
							type='text'
							value={form.document}
							onChange={(e) => setForm({ ...form, document: e.target.value })}
							placeholder='Documento'
							className='input'
						/>

						<input
							type='text'
							value={form.address}
							onChange={(e) => setForm({ ...form, address: e.target.value })}
							placeholder='Dirección'
							className='input'
						/>

						<input
							type='text'
							value={form.phone}
							onChange={(e) => setForm({ ...form, phone: e.target.value })}
							placeholder='Teléfono'
							className='input'
						/>

						<input
							type='text'
							value={form.email}
							readOnly
							className='input bg-gray-100 cursor-not-allowed'
						/>
					</div>

					<button
						onClick={handleUpdateProfile}
						className='mt-4 bg-[#5C3A21] text-white px-5 py-2 rounded-md hover:bg-[#472D19]'>
						Guardar Cambios
					</button>
				</div>
			</div>

			{/* CAMBIAR CONTRASEÑA */}
			<div className='bg-white shadow p-6 rounded-lg mt-6'>
				<h2 className='text-xl font-semibold mb-4'>Cambiar Contraseña</h2>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<input
						type='password'
						placeholder='Contraseña actual'
						value={passwordForm.currentPassword}
						onChange={(e) =>
							setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
						}
						className='input'
					/>

					<input
						type='password'
						placeholder='Nueva contraseña'
						value={passwordForm.newPassword}
						onChange={(e) =>
							setPasswordForm({ ...passwordForm, newPassword: e.target.value })
						}
						className='input'
					/>

					<input
						type='password'
						placeholder='Confirmar contraseña'
						value={passwordForm.confirmPassword}
						onChange={(e) =>
							setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
						}
						className='input'
					/>
				</div>

				<button
					onClick={handleChangePassword}
					className='mt-4 bg-[#1E293B] text-white px-5 py-2 rounded-md hover:bg-[#162034]'>
					Actualizar contraseña
				</button>
			</div>
		</div>
	);
}
