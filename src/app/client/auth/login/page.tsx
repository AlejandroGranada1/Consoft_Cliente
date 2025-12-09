'use client';

import AuthLayout from '@/components/auth/AuthLayout';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { useState } from 'react';
import api from '@/components/Global/axios';
import { useRouter } from 'next/navigation';
import { useUser } from '@/providers/userContext';
import { useGoogleLogin } from '@/hooks/apiHooks';

export default function LoginPage() {
	const router = useRouter();
	const googleLogin = useGoogleLogin()
	const [loginData, setLoginData] = useState({
		email: '',
		password: '',
	});

	const { loadUser } = useUser(); // 👈 Usamos loadUser, NO fetchCurrentUser

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setLoginData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await api.post('/api/auth/login', loginData);

			if (response.status === 200) {
				// 👇 AQUÍ CARGAMOS EL USUARIO DESPUÉS DE LOGIN
				await loadUser();

				router.push('/client');
			}
		} catch (error) {
			console.error(error);
		}
	};



	const handleGoogleLogin = () => {
		if (typeof window === "undefined") return;
		if (!window.google) {
			console.error("Google script not loaded yet");
			return;
		}

		window.google.accounts.id.initialize({
			client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
			callback: async (response: any) => {
				const idToken = response.credential;
				const res = await googleLogin.mutateAsync(idToken);

				if (res?.message === "Login successful") {
					window.location.reload();
				}
			},
		});

		window.google.accounts.id.prompt();
	};




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

				<button
					type="button"
					onClick={handleGoogleLogin}
					className="w-full mt-3 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-100"
				>
					<img src="/auth/Google.webp" alt="Google" className="w-5 h-5" />
					Ingresa con Google
				</button>


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
