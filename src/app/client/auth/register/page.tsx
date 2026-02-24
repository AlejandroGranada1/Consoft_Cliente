'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import PasswordInput from '@/components/auth/PasswordInput';
import { useCreateUser } from '@/hooks/apiHooks';
import Swal from 'sweetalert2';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const registerUser = useCreateUser();

  const [form, setForm] = useState({ email: '', name: '', password: '', confirmPassword: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email.trim() || !form.name.trim() || !form.password.trim() || !form.confirmPassword.trim()) {
      Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor completa todos los campos.' });
      return;
    }
    if (form.password !== form.confirmPassword) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Las contraseñas no coinciden.' });
      return;
    }

    try {
      await registerUser.mutateAsync({ name: form.name, email: form.email, password: form.password });
      Swal.fire({ title: 'Registro exitoso', html: 'Por favor completa tu información de usuario para una mejor experiencia', icon: 'success', timer: 3000, showConfirmButton: false });
      router.push('/client/perfil');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Error al registrar el usuario';
      Swal.fire('Error', msg, 'error');
    }
  };

  return (
    <AuthLayout
      subtitle="Crear cuenta"
      illustration="/auth/Registrar.png"
      footer={
        <p className="text-center text-sm text-white/40">
          ¿Ya tienes cuenta?{' '}
          <Link href="/client/auth/login" className="text-[#C8A882] hover:text-white font-medium transition-colors">
            Inicia sesión
          </Link>
        </p>
      }
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <AuthInput
          label="Correo electrónico"
          type="email"
          name="email"
          value={form.email}
          placeholder="ejemplo@email.com"
          onChange={handleChange}
        />

        <AuthInput
          label="Nombre completo"
          type="text"
          name="name"
          value={form.name}
          placeholder="Tu nombre completo"
          onChange={handleChange}
        />

        <PasswordInput
          label="Contraseña"
          name="password"
          value={form.password}
          onChange={handleChange}
          showRules={true}
        />

        <PasswordInput
          label="Confirmar contraseña"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          showRules={false}
        />

        {/* Match indicator */}
        {form.confirmPassword.length > 0 && (
          <p className={`text-xs -mt-2 ${form.password === form.confirmPassword ? 'text-emerald-400' : 'text-red-400/80'}`}>
            {form.password === form.confirmPassword ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
          </p>
        )}

        <AuthButton text="Registrarme" type="submit" loading={registerUser.isPending} />
      </form>
    </AuthLayout>
  );
}