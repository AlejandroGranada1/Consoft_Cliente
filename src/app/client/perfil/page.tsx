'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, User, Lock, Camera } from 'lucide-react';
import { useGetProfile, useUpdateUser, useChangePassword } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
	const router = useRouter();
	const { user, loading } = useUser();

	const { data, isLoading } = useGetProfile();
	const updateUser = useUpdateUser();
	const changePassword = useChangePassword();
	const dbUser = data?.user;

	const [form, setForm] = useState({ name: '', email: '', document: '', address: '', phone: '' });
	const [profilePreview, setProfilePreview] = useState<string | null>(null);
	const [profileFile, setProfileFile] = useState<File | null>(null);

	const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
	const [showCurrent, setShowCurrent] = useState(false);
	const [showNew, setShowNew] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	useEffect(() => {
		if (loading) return;
		if (user === null) {
			(async () => {
				const Swal = (await import('sweetalert2')).default;
				await Swal.fire({ icon: 'warning', title: 'Inicia sesión', text: 'Debes iniciar sesión para acceder a tu perfil' });
				router.push('/client/auth/login');
			})();
		}
	}, [user, router, loading]);

	useEffect(() => {
		if (dbUser) {
			setForm({ name: dbUser.name ?? '', email: dbUser.email ?? '', document: dbUser.document ?? '', address: dbUser.address ?? '', phone: dbUser.phone ?? '' });
			setProfilePreview(dbUser.profile_picture ?? null);
		}
	}, [dbUser]);

	if (isLoading || !dbUser) return <p className='p-10 text-center text-sm text-gray-400'>Cargando...</p>;

	const handleUpdateProfile = async () => {
		const Swal = (await import('sweetalert2')).default;
		if (!form.name || !form.document || !form.address || !form.phone)
			return Swal.fire({ icon: 'error', title: 'Campos incompletos', text: 'Completa todos los campos' });

		try {
			const formData = new FormData();
			formData.append('name', form.name);
			formData.append('document', form.document);
			formData.append('address', form.address);
			formData.append('phone', form.phone);
			if (profileFile) formData.append('profile_picture', profileFile);

			await updateUser.mutateAsync({ _id: dbUser._id, formData });
			Swal.fire({ icon: 'success', title: 'Perfil actualizado', timer: 1500, showConfirmButton: false });
		} catch {
			Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar el perfil' });
		}
	};

	const handleChangePassword = async () => {
		const Swal = (await import('sweetalert2')).default;

		if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword)
			return Swal.fire({ icon: 'error', title: 'Campos incompletos', text: 'Completa todos los campos' });
		if (passwordForm.newPassword !== passwordForm.confirmPassword)
			return Swal.fire({ icon: 'error', title: 'Contraseñas no coinciden' });
		if (passwordForm.currentPassword === passwordForm.newPassword)
			return Swal.fire({ icon: 'error', title: 'Contraseña inválida', text: 'La nueva contraseña no puede ser igual a la actual' });

		const hasUpper = /[A-Z]/.test(passwordForm.newPassword);
		const hasNumber = /\d/.test(passwordForm.newPassword);
		const hasSpecial = /[^A-Za-z0-9]/.test(passwordForm.newPassword);
		const validLength = passwordForm.newPassword.length >= 8;

		if (!hasUpper || !hasNumber || !hasSpecial || !validLength)
			return Swal.fire({ icon: 'error', title: 'Contraseña débil', html: `<ul class="text-left ml-4"><li>• Una letra mayúscula</li><li>• Un número</li><li>• Un carácter especial</li><li>• Mínimo 8 caracteres</li></ul>` });

		try {
			Swal.fire({ title: 'Actualizando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
			await changePassword.mutateAsync({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
			Swal.fire({ icon: 'success', title: 'Contraseña actualizada', timer: 1500, showConfirmButton: false });
			setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
		} catch (error: any) {
			Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'No se pudo cambiar la contraseña' });
		}
	};

	if (!user) return null;

	const inputClass = 'w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#6e4424] focus:ring-1 focus:ring-[#6e4424] transition';

	return (
		<main className='min-h-screen bg-[#F5ECD7] py-10 px-6'>
			<div className='max-w-4xl mx-auto space-y-6'>

				<h1 className='text-xl font-semibold text-gray-800'>Mi perfil</h1>

				{/* PERFIL */}
				<div className='bg-white rounded-2xl shadow-sm overflow-hidden'>
					{/* Header de sección */}
					<div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
						<h2 className='text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2'>
							<User size={14} /> Información personal
						</h2>
					</div>

					<div className='grid md:grid-cols-3 gap-0'>
						{/* Avatar */}
						<div className='bg-gray-50 border-r border-gray-100 flex flex-col items-center justify-center p-8 gap-4'>
							<div className='relative'>
								<Image
									src={profilePreview || '/default-user.png'}
									alt='Perfil'
									width={120}
									height={120}
									className='rounded-full border-4 border-white shadow-md object-cover'
								/>
								<label className='absolute bottom-0 right-0 bg-[#6e4424] text-white p-2 rounded-full cursor-pointer hover:bg-[#5a3519] transition shadow'>
									<Camera size={14} />
									<input type='file' accept='image/*' className='hidden'
										onChange={(e) => {
											const file = e.target.files?.[0];
											if (file) { setProfileFile(file); setProfilePreview(URL.createObjectURL(file)); }
										}}
									/>
								</label>
							</div>
							<div className='text-center'>
								<p className='font-medium text-gray-800 text-sm'>{form.name || 'Sin nombre'}</p>
								<p className='text-xs text-gray-400 mt-0.5'>{form.email}</p>
							</div>
						</div>

						{/* Campos */}
						<div className='md:col-span-2 p-6 space-y-4'>
							<div className='grid md:grid-cols-2 gap-4'>
								{[
									{ key: 'name', ph: 'Nombre completo' },
									{ key: 'document', ph: 'Documento' },
									{ key: 'address', ph: 'Dirección' },
									{ key: 'phone', ph: 'Teléfono' },
								].map((f) => (
									<div key={f.key} className='border border-gray-100 rounded-xl p-3 bg-gray-50'>
										<label className='text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1.5'>
											{f.ph}
										</label>
										<input
											value={(form as any)[f.key]}
											onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
											placeholder={f.ph}
											className={inputClass}
										/>
									</div>
								))}

								<div className='border border-gray-100 rounded-xl p-3 bg-gray-50'>
									<label className='text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1.5'>
										Correo electrónico
									</label>
									<input value={form.email} readOnly className={`${inputClass} bg-gray-100 cursor-not-allowed`} />
								</div>
							</div>

							<div className='flex justify-end pt-2'>
								<button
									onClick={handleUpdateProfile}
									disabled={updateUser.isPending}
									className='px-5 py-2 rounded-lg bg-[#6e4424] text-white text-sm hover:bg-[#5a3519] transition disabled:opacity-50'>
									{updateUser.isPending ? 'Guardando...' : 'Guardar cambios'}
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* CONTRASEÑA */}
				<div className='bg-white rounded-2xl shadow-sm overflow-hidden'>
					<div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
						<h2 className='text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2'>
							<Lock size={14} /> Seguridad
						</h2>
					</div>

					<div className='p-6 space-y-4'>
						<div className='grid md:grid-cols-3 gap-4'>
							{[
								{ key: 'currentPassword', label: 'Contraseña actual', show: showCurrent, setShow: setShowCurrent },
								{ key: 'newPassword', label: 'Nueva contraseña', show: showNew, setShow: setShowNew },
								{ key: 'confirmPassword', label: 'Confirmar contraseña', show: showConfirm, setShow: setShowConfirm },
							].map((f) => (
								<div key={f.key} className='border border-gray-100 rounded-xl p-3 bg-gray-50'>
									<label className='text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1.5'>
										{f.label}
									</label>
									<div className='relative'>
										<input
											type={f.show ? 'text' : 'password'}
											placeholder={f.label}
											value={(passwordForm as any)[f.key]}
											onChange={(e) => setPasswordForm({ ...passwordForm, [f.key]: e.target.value })}
											className={`${inputClass} pr-10`}
										/>
										<button type='button' onClick={() => f.setShow(!f.show)}
											className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition'>
											{f.show ? <EyeOff size={16} /> : <Eye size={16} />}
										</button>
									</div>
								</div>
							))}
						</div>

						<div className='flex justify-end pt-2'>
							<button
								onClick={handleChangePassword}
								disabled={changePassword.isPending}
								className='px-5 py-2 rounded-lg bg-[#1E293B] text-white text-sm hover:bg-[#0f172a] transition disabled:opacity-50'>
								{changePassword.isPending ? 'Actualizando...' : 'Actualizar contraseña'}
							</button>
						</div>
					</div>
				</div>

			</div>
		</main>
	);
}