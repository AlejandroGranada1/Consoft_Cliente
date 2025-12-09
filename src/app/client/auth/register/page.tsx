'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import Swal from 'sweetalert2';
import api from '@/components/Global/axios';
import { useCreateUser } from '@/hooks/apiHooks';

export default function RegisterPage() {
	const router = useRouter();

	const registerUser = useCreateUser();
	const [form, setForm] = useState({
		email: '',
		name: '',
		password: '',
		confirmPassword: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (form.password !== form.confirmPassword) {
			return Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
		}

		try {
			const payload = {
				name: form.name,
				email: form.email,
				password: form.password,
			};

			// 1️⃣ Registrar usuario
			await registerUser.mutateAsync(payload);
			// 2️⃣ Redirigir al login
			Swal.fire({
				title: 'Registro exitoso',
				html: 'Por favor completa tu informacion de usuario para una mejor experiencia',
				icon: 'success',
				timer: 3000,
			});

			router.push('/client/perfil');
		} catch (err: any) {
			console.error(err);

			const msg =
				err?.response?.data?.message ||
				err?.response?.data?.error ||
				'Error al registrar el usuario';

			Swal.fire('Error', msg, 'error');
		}
	};

	return (
		<AuthLayout
			title='Bienvenido a Confort & Estilo'
			subtitle='Registro'
			illustration='/auth/Registrar.png'>
			<form
				className='flex flex-col gap-4'
				onSubmit={handleSubmit}>
				<AuthInput
					label='Correo Electrónico'
					type='email'
					name='email'
					value={form.email}
					placeholder='ejemplo@email.com'
					onChange={handleChange}
				/>

				<AuthInput
					label='Nombre'
					type='text'
					name='name'
					value={form.name}
					placeholder='Tu nombre'
					onChange={handleChange}
				/>

				<AuthInput
					label='Contraseña'
					type='password'
					name='password'
					value={form.password}
					placeholder=''
					onChange={handleChange}
				/>

				<AuthInput
					label='Confirmar Contraseña'
					type='password'
					name='confirmPassword'
					value={form.confirmPassword}
					placeholder=''
					onChange={handleChange}
				/>

				<AuthButton
					text='Registrarme'
					type='submit'
				/>
			</form>
		</AuthLayout>
	);
}
