'use client';

import AuthLayout from '@/components/auth/AuthLayout';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { useState } from 'react';
import { useForgotPassword } from '@/hooks/apiHooks';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const { mutate: forgotPassword, isPending, isSuccess, error } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      Swal.fire({ icon: 'warning', title: 'Correo requerido', text: 'Por favor ingresa tu correo electrónico.' });
      return;
    }
    forgotPassword(email);
  };

  return (
    <AuthLayout
      subtitle="Recuperar contraseña"
      illustration="/auth/Recuperar.png"
      footer={
        <Link
          href="/client/auth/login"
          className="flex items-center justify-center gap-2 text-sm text-white/40 hover:text-[#C8A882] transition-colors group"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
          Volver al inicio de sesión
        </Link>
      }
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <p className="text-sm text-white/50 leading-relaxed">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <AuthInput
          label="Correo electrónico"
          type="email"
          placeholder="ejemplo@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthButton text="Enviar enlace" type="submit" loading={isPending} />

        {isSuccess && (
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3">
            <p className="text-sm text-emerald-400 text-center">
              Si el correo existe, recibirás un enlace para restablecer tu contraseña.
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3">
            <p className="text-sm text-red-400 text-center">
              {(error as any)?.response?.data?.message || 'Error al enviar la solicitud'}
            </p>
          </div>
        )}
      </form>
    </AuthLayout>
  );
}