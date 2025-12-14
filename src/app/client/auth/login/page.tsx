'use client';

import AuthInput from '@/components/auth/AuthInput';
import { useState } from 'react';
import api from '@/components/Global/axios';
import { useRouter } from 'next/navigation';
import { useUser } from '@/providers/userContext';
import { useGoogleLogin, useLogin } from '@/hooks/apiHooks';
import Script from 'next/script';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthButton from '@/components/auth/AuthButton';

export default function LoginPage() {
	const router = useRouter();
	const googleLogin = useGoogleLogin();
	const login = useLogin();
	const { loadUser } = useUser();

	const [loginData, setLoginData] = useState({
		email: '',
		password: '',
	});

	// ------------------------
	// Formularios normales
	// ------------------------

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setLoginData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await login.mutateAsync(loginData);

			if (response.status === 200) {
				await loadUser();
				router.push('/client');
			}
		} catch (error: any) {
			const Swal = (await import('sweetalert2')).default;

			const message =
				error.response?.data?.message == 'Incorrect password, please try again'
					? 'Contraseña incorrecta, intenta de nuevo'
					: `Error al iniciar sesión: ${error.response.data.message}`;

			await Swal.fire({
				icon: 'error',
				title: 'Error',
				text: message,
			});
		}
	};

	// ------------------------
	// GOOGLE LOGIN
	// ------------------------

	const initializeGoogleLogin = () => {
		if (!window.google?.accounts?.id) {
			console.error('Google script not loaded.');
			return;
		}

		// Inicializar Google Identity
		window.google.accounts.id.initialize({
			client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
			callback: async (response: any) => {
				try {
					const idToken = response.credential;
					const res = await googleLogin.mutateAsync(idToken);

					if (res?.message === 'Login successful') {
						await loadUser();
						router.push('/client');
					}
				} catch (err) {
					console.error('Google login error:', err);
				}
			},
			ux_mode: 'popup',
		});

		// Renderizar el botón
		const container = document.getElementById('google-button-container');
		if (container) {
			window.google.accounts.id.renderButton(container, {
				theme: 'filled_blue',
				size: 'large',
				width: container.offsetWidth, // Usa el ancho del contenedor
			});
		}
	};

	return (
		<>
			<Script
				src='https://accounts.google.com/gsi/client'
				strategy='afterInteractive' // Cambiado de lazyOnload
				onLoad={initializeGoogleLogin} // Se ejecuta cuando el script carga
			/>
			<AuthLayout
				title='Bienvenido a Confort & Estilo'
				subtitle='Inicia Sesión'
				illustration='/auth/Login.png'>
				<form
					className='flex flex-col gap-4'
					onSubmit={handleSubmit}>
					<AuthInput
						value={loginData.email}
						name='email'
						label='Email'
						type='email'
						placeholder='ejemplo@email.com'
						onChange={handleChange}
					/>

					<AuthInput
						name='password'
						label='Contraseña'
						type='password'
						placeholder='********'
						value={loginData.password}
						onChange={handleChange}
					/>

					<a
						href='../auth/forgot-password'
						className='text-sm text-[#1E293B]
						hover:text-[#70492F]'>
						¿Olvidaste tu contraseña?
					</a>

					<AuthButton
						text='Continuar'
						type='submit'
					/>

					{/* GOOGLE LOGIN BUTTON */}
					<div
						id='google-button-container'
						className='w-full mt-3'></div>

					<p className='text-center text-sm mt-4'>
						¿No tienes cuenta?{' '}
						<a
							href='/client/auth/register'
							className='text-[#8B5E3C] font-medium hover:underline'>
							Regístrate
						</a>
					</p>
				</form>
			</AuthLayout>
		</>
	);
}
