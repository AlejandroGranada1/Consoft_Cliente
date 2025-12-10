'use client';

import AuthLayout from '@/components/auth/AuthLayout';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { useState, useEffect } from 'react';
import api from '@/components/Global/axios';
import { useRouter } from 'next/navigation';
import { useUser } from '@/providers/userContext';
import { useGoogleLogin } from '@/hooks/apiHooks';

export default function LoginPage() {
	const router = useRouter();
	const googleLogin = useGoogleLogin();
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
			const response = await api.post('/api/auth/login', loginData);

			if (response.status === 200) {
				await loadUser();
				router.push('/client');
			}
		} catch (error) {
			console.error(error);
		}
	};

	// ------------------------
	// GOOGLE LOGIN
	// ------------------------

	// ------------------------
	// GOOGLE LOGIN CORRECTO
	// ------------------------

	useEffect(() => {
		if (typeof window === 'undefined') return;

		// Verificar que Google cargó
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
					console.log(idToken)
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
			});
		}
	}, []); // 👈 se ejecuta solo una vez cuando carga el componente

	// ------------------------

	return (
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
					className='text-sm text-[#1E293B] hover:text-[#70492F]'>
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
						href='/auth/register'
						className='text-[#8B5E3C] font-medium hover:underline'>
						Regístrate
					</a>
				</p>
			</form>
		</AuthLayout>
	);
}
