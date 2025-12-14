'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useGetProfile, useUpdateUser, useChangePassword } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
	const router = useRouter();
	const { user, loading } = useUser();

	// Hooks SIEMPRE arriba
	const { data, isLoading } = useGetProfile();
	const updateUser = useUpdateUser();
	const dbUser = data?.user;
	const changePassword = useChangePassword();

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

	// Redirección si no hay sesión
	useEffect(() => {
		if (loading) return; // ⛔ aún validando sesión

		if (user === null) {
			(async () => {
				const Swal = (await import('sweetalert2')).default;

				await Swal.fire({
					icon: 'warning',
					title: 'Inicia sesión',
					text: 'Debes registrarte o iniciar sesión para agendar una cita.',
				});

				router.push('/client/auth/login');
			})();
		}
	}, [user, router]);

	// Cargar datos del perfil en el formulario
	useEffect(() => {
		if (dbUser) {
			setForm({
				name: dbUser.name ?? '',
				email: dbUser.email ?? '',
				document: dbUser.document ?? '',
				address: dbUser.address ?? '',
				phone: dbUser.phone ?? '',
			});

			setProfilePreview(dbUser.profile_picture ?? null);
		}
	}, [dbUser]);

	if (isLoading || !dbUser) {
		return <p className='p-10 text-center'>Cargando...</p>;
	}

	const handleUpdateProfile = async () => {
		const Swal = (await import('sweetalert2')).default;

		try {
			const formData = new FormData();
			formData.append('name', form.name);
			formData.append('document', form.document);
			formData.append('address', form.address);
			formData.append('phone', form.phone);

			if (profileFile) {
				formData.append('profile_picture', profileFile);
			}

			await updateUser.mutateAsync({
				_id: dbUser._id,
				formData,
			});

			Swal.fire({
				icon: 'success',
				title: 'Perfil actualizado',
				text: 'Tu información ha sido guardada correctamente',
				confirmButtonColor: 'brown',
			});
		} catch {
			Swal.fire('Error', 'No se pudo actualizar el perfil', 'error');
		}
	};

	// Primero, necesitas importar el hook de cambio de contraseña
	// Agrega esto en tus imports:

	// Luego, en tu componente, agrega el hook después de los otros:

	// Ahora la función completa:
	const handleChangePassword = async () => {
		const Swal = (await import('sweetalert2')).default;

		// Validación 1: Campos vacíos
		if (
			!passwordForm.currentPassword ||
			!passwordForm.newPassword ||
			!passwordForm.confirmPassword
		) {
			await Swal.fire({
				icon: 'error',
				title: 'Campos incompletos',
				text: 'Por favor, completa todos los campos',
				confirmButtonColor: 'brown',
			});
			return;
		}

		// Validación 2: Coincidencia de contraseñas
		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			await Swal.fire({
				icon: 'error',
				title: 'Contraseñas no coinciden',
				text: 'La nueva contraseña y la confirmación deben ser iguales',
				confirmButtonColor: 'brown',
			});
			return;
		}

		// Validación 3: Misma contraseña actual
		if (passwordForm.currentPassword === passwordForm.newPassword) {
			await Swal.fire({
				icon: 'error',
				title: 'Contraseña inválida',
				text: 'La nueva contraseña no puede ser igual a la actual',
				confirmButtonColor: 'brown',
			});
			return;
		}

		// Validación 4: Cumplir con requisitos del backend
		const hasUppercase = /[A-Z]/.test(passwordForm.newPassword);
		const hasNumber = /\d/.test(passwordForm.newPassword);
		const hasSpecial = /[^A-Za-z0-9]/.test(passwordForm.newPassword);
		const isValidLength = passwordForm.newPassword.length >= 8;

		if (!hasUppercase || !hasNumber || !hasSpecial) {
			await Swal.fire({
				icon: 'error',
				title: 'Contraseña débil',
				html: `
				La contraseña debe cumplir con:
				<ul class="text-left mt-2 ml-4">
					li>• Al menos una letra mayúscula</li>
					<li>• Al menos un número</li>
					<li>• Al menos un carácter especial</li>
					<li>• Mínimo 8 caracteres</li>
				</ul>
			`,
				confirmButtonColor: 'brown',
			});
			return;
		}

		if (!isValidLength) {
			await Swal.fire({
				icon: 'error',
				title: 'Contraseña corta',
				text: 'La contraseña debe tener al menos 8 caracteres',
				confirmButtonColor: 'brown',
			});
			return;
		}

		try {
			// Mostrar loading
			Swal.fire({
				title: 'Cambiando contraseña...',
				text: 'Por favor espera',
				allowOutsideClick: false,
				didOpen: () => {
					Swal.showLoading();
				},
			});

			// Llamar a la API
			await changePassword.mutateAsync({
				currentPassword: passwordForm.currentPassword,
				newPassword: passwordForm.newPassword,
			});

			// Éxito
			await Swal.fire({
				icon: 'success',
				title: '¡Contraseña actualizada!',
				text: 'Tu contraseña ha sido cambiada exitosamente',
				confirmButtonColor: 'brown',
			});

			// Limpiar formulario
			setPasswordForm({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			});
		} catch (error: any) {
			console.error('Error al cambiar contraseña:', error);

			let errorMessage = 'Error al cambiar la contraseña';

			// Manejo de errores específicos del backend
			if (error.response?.data?.message) {
				const backendMessage = error.response.data.message;

				if (backendMessage.includes('Current password is incorrect')) {
					errorMessage = 'La contraseña actual es incorrecta';
				} else if (backendMessage.includes('Password must include')) {
					errorMessage = 'La nueva contraseña no cumple con los requisitos de seguridad';
				} else {
					errorMessage = backendMessage;
				}
			}

			await Swal.fire({
				icon: 'error',
				title: 'Error',
				text: errorMessage,
				confirmButtonColor: 'brown',
			});
		}
	};

	if (user === undefined || user === null) return null;

	return (
		<div className='max-w-4xl mx-auto p-6'>
			<h1 className='text-3xl font-bold text-gray-800 mb-6'>Mi Perfil</h1>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{/* Foto de perfil */}
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

				{/* Información personal */}
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

			{/* Cambiar contraseña */}
			<div className='bg-white shadow p-6 rounded-lg mt-6'>
				<h2 className='text-xl font-semibold mb-4'>Cambiar Contraseña</h2>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<input
						type='password'
						placeholder='Contraseña actual'
						value={passwordForm.currentPassword}
						onChange={(e) =>
							setPasswordForm({
								...passwordForm,
								currentPassword: e.target.value,
							})
						}
						className='input'
					/>

					<input
						type='password'
						placeholder='Nueva contraseña'
						value={passwordForm.newPassword}
						onChange={(e) =>
							setPasswordForm({
								...passwordForm,
								newPassword: e.target.value,
							})
						}
						className='input'
					/>

					<input
						type='password'
						placeholder='Confirmar contraseña'
						value={passwordForm.confirmPassword}
						onChange={(e) =>
							setPasswordForm({
								...passwordForm,
								confirmPassword: e.target.value,
							})
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
