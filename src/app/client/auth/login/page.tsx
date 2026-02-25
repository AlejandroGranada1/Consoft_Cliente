'use client';

import AuthInput from '@/components/auth/AuthInput';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/providers/userContext';
import { useGoogleLogin, useLogin } from '@/hooks/apiHooks';
import Script from 'next/script';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthButton from '@/components/auth/AuthButton';
import PasswordInput from '@/components/auth/PasswordInput';
import Swal from 'sweetalert2';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const googleLogin = useGoogleLogin();
  const login = useLogin();
  const { loadUser } = useUser();

  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email.trim() || !loginData.password.trim()) {
      await Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor ingresa tu correo y contraseña.' });
      return;
    }
    try {
      const response = await login.mutateAsync(loginData);
      if (response.status === 200) {
        await loadUser();
        router.push('/client');
      }
    } catch (error: any) {
      const message = error.response?.data?.message === 'Incorrect password, please try again'
        ? 'Contraseña incorrecta, intenta de nuevo'
        : `Error al iniciar sesión: ${error.response?.data?.message}`;
      await Swal.fire({ icon: 'error', title: 'Error', text: message });
    }
  };

  const initializeGoogleLogin = () => {
    if (!window.google?.accounts?.id) return;
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: async (response: any) => {
        try {
          const res = await googleLogin.mutateAsync(response.credential);
          if (res?.message === 'Login successful') { await loadUser(); router.push('/client'); }
        } catch (err) { console.error('Google login error:', err); }
      },
      ux_mode: 'popup',
    });
    const container = document.getElementById('google-button-container');
    if (container) window.google.accounts.id.renderButton(container, { theme: 'filled_black', size: 'large', width: container.offsetWidth });
  };

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={initializeGoogleLogin} />

      <AuthLayout
        subtitle="Inicia sesión"
        illustration="/auth/Login.png"
        footer={
          <p className="text-center text-sm text-white/40">
            ¿No tienes cuenta?{' '}
            <Link href="/client/auth/register" className="text-[#C8A882] hover:text-white font-medium transition-colors">
              Regístrate
            </Link>
          </p>
        }
      >
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <AuthInput
            value={loginData.email}
            name="email"
            label="Correo electrónico"
            type="email"
            placeholder="ejemplo@email.com"
            onChange={handleChange}
          />

          <PasswordInput
            name="password"
            label="Contraseña"
            value={loginData.password}
            onChange={handleChange}
            showRules={false}
          />

          <div className="flex justify-end -mt-2">
            <Link href="../auth/forgot-password" className="text-xs text-white/40 hover:text-[#C8A882] transition-colors">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <AuthButton text="Continuar" type="submit" loading={login.isPending} />

          {/* Divisor Google */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[11px] text-white/25 uppercase tracking-wider">o continúa con</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="flex justify-center">
            <div id="google-button-container" />
          </div>
        </form>
      </AuthLayout>
    </>
  );
}