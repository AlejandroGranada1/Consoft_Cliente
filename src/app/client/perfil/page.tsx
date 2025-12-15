'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { useGetProfile, useUpdateUser, useChangePassword } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
	const router = useRouter();
	const { user, loading } = useUser();

	// Hooks
	const { data, isLoading } = useGetProfile();
	const updateUser = useUpdateUser();
	const changePassword = useChangePassword();
	const dbUser = data?.user;

	// Estados perfil
	const [form, setForm] = useState({
		name: '',
		email: '',
		document: '',
		address: '',
		phone: '',
	});

	const [profilePreview, setProfilePreview] = useState<string | null>(null);
	const [profileFile, setProfileFile] = useState<File | null>(null);

	// Estados contraseña
	const [passwordForm, setPasswordForm] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const [showCurrent, setShowCurrent] = useState(false);
	const [showNew, setShowNew] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	// Redirección si no hay sesión
	useEffect(() => {
		if (loading) return;

		if (user === null) {
			(async () => {
				const Swal = (await import('sweetalert2')).default;

				await Swal.fire({
					icon: 'warning',
					title: 'Inicia sesión',
					text: 'Debes iniciar sesión para acceder a tu perfil',
				});

				router.push('/client/auth/login');
			})();
		}
	}, [user, router, loading]);

	// Cargar datos
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
		return <p className="p-10 text-center">Cargando...</p>;
	}

	// Guardar perfil
	const handleUpdateProfile = async () => {
		const Swal = (await import('sweetalert2')).default;

		if (!form.name || !form.document || !form.address || !form.phone) {
			await Swal.fire({
				icon: 'error',
				title: 'Campos incompletos',
				text: 'Completa todos los campos',
			});
			return;
		}

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

			await Swal.fire({
				icon: 'success',
				title: 'Perfil actualizado',
				text: 'Información guardada correctamente',
			});
		} catch {
			await Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'No se pudo actualizar el perfil',
			});
		}
	};

	// Cambiar contraseña
	const handleChangePassword = async () => {
		const Swal = (await import('sweetalert2')).default;

		if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
			await Swal.fire({
				icon: 'error',
				title: 'Campos incompletos',
				text: 'Completa todos los campos',
			});
			return;
		}

		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			await Swal.fire({
				icon: 'error',
				title: 'Contraseñas no coinciden',
			});
			return;
		}

		if (passwordForm.currentPassword === passwordForm.newPassword) {
			await Swal.fire({
				icon: 'error',
				title: 'Contraseña inválida',
				text: 'La nueva contraseña no puede ser igual a la actual',
			});
			return;
		}

		const hasUpper = /[A-Z]/.test(passwordForm.newPassword);
		const hasNumber = /\d/.test(passwordForm.newPassword);
		const hasSpecial = /[^A-Za-z0-9]/.test(passwordForm.newPassword);
		const validLength = passwordForm.newPassword.length >= 8;

		if (!hasUpper || !hasNumber || !hasSpecial || !validLength) {
			await Swal.fire({
				icon: 'error',
				title: 'Contraseña débil',
				html: `
					<ul class="text-left ml-4">
						<li>• Una letra mayúscula</li>
						<li>• Un número</li>
						<li>• Un carácter especial</li>
						<li>• Mínimo 8 caracteres</li>
					</ul>
				`,
			});
			return;
		}

		try {
			Swal.fire({
				title: 'Actualizando...',
				allowOutsideClick: false,
				didOpen: () => Swal.showLoading(),
			});

			await changePassword.mutateAsync({
				currentPassword: passwordForm.currentPassword,
				newPassword: passwordForm.newPassword,
			});

			await Swal.fire({
				icon: 'success',
				title: 'Contraseña actualizada',
			});

			setPasswordForm({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			});
		} catch (error: any) {
			await Swal.fire({
				icon: 'error',
				title: 'Error',
				text: error.response?.data?.message || 'No se pudo cambiar la contraseña',
			});
		}
	};

	if (!user) return null;

	return (
		<main className="min-h-screen bg-[#FAF4EF] py-10 px-6">
			<div className="max-w-4xl mx-auto space-y-8">

				<h1 className="text-2xl font-semibold">Mi perfil</h1>

				{/* PERFIL */}
				<div className="grid md:grid-cols-3 gap-6">
					<div className="bg-white border rounded-xl p-6 flex flex-col items-center">
						<Image
							src={profilePreview || '/default-user.png'}
							alt="Perfil"
							width={140}
							height={140}
							className="rounded-full border object-cover"
						/>

						<label className="mt-4 cursor-pointer text-sm px-4 py-2 rounded-full bg-[#F3E8D5]">
							Cambiar foto
							<input
								type="file"
								accept="image/*"
								className="hidden"
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

					<div className="md:col-span-2 bg-white border rounded-xl p-6 space-y-4">
						<h2 className="font-semibold">Información personal</h2>

						<div className="grid md:grid-cols-2 gap-4">
							{[
								{ key: 'name', ph: 'Nombre' },
								{ key: 'document', ph: 'Documento' },
								{ key: 'address', ph: 'Dirección' },
								{ key: 'phone', ph: 'Teléfono' },
							].map((f) => (
								<input
									key={f.key}
									value={(form as any)[f.key]}
									onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
									placeholder={f.ph}
									className="px-4 py-2 border rounded-lg"
								/>
							))}
							<input value={form.email} readOnly className="px-4 py-2 border rounded-lg bg-gray-100" />
						</div>

						<div className="flex justify-end pt-4">
							<button onClick={handleUpdateProfile} className="px-6 py-2 rounded-full bg-[#8B5E3C] text-white">
								Guardar cambios
							</button>
						</div>
					</div>
				</div>

				{/* CONTRASEÑA */}
				<div className="bg-white border rounded-xl p-6 space-y-4">
					<h2 className="font-semibold">Seguridad</h2>

					<div className="grid md:grid-cols-3 gap-4">
						{[
							{ key: 'currentPassword', label: 'Contraseña actual', show: showCurrent, setShow: setShowCurrent },
							{ key: 'newPassword', label: 'Nueva contraseña', show: showNew, setShow: setShowNew },
							{ key: 'confirmPassword', label: 'Confirmar contraseña', show: showConfirm, setShow: setShowConfirm },
						].map((f) => (
							<div key={f.key} className="relative">
								<input
									type={f.show ? 'text' : 'password'}
									placeholder={f.label}
									value={(passwordForm as any)[f.key]}
									onChange={(e) => setPasswordForm({ ...passwordForm, [f.key]: e.target.value })}
									className="w-full px-4 py-2 pr-10 border rounded-lg"
								/>
								<button type="button" onClick={() => f.setShow(!f.show)} className="absolute right-3 top-1/2 -translate-y-1/2">
									{f.show ? <EyeOff size={18} /> : <Eye size={18} />}
								</button>
							</div>
						))}
					</div>

					<div className="flex justify-end pt-4">
						<button onClick={handleChangePassword} className="px-6 py-2 rounded-full bg-[#1E293B] text-white">
							Actualizar contraseña
						</button>
					</div>
				</div>

			</div>
		</main>
	);
}
