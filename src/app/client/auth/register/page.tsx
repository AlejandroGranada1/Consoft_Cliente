'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { useCreateUser } from '@/hooks/apiHooks';
import Swal from 'sweetalert2';

export default function RegisterPage() {
  const router = useRouter();
  const registerUser = useCreateUser();

  const [form, setForm] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 🔍 reglas SOLO visuales
  const rules = {
    length: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    number: /\d/.test(form.password),
    special: /[^A-Za-z0-9]/.test(form.password),
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.email.trim() ||
      !form.name.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos.',
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
      });
      return;
    }

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
      };

      await registerUser.mutateAsync(payload);

      Swal.fire({
        title: 'Registro exitoso',
        html: 'Por favor completa tu información de usuario para una mejor experiencia',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
      });

      router.push('/client/perfil');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Error al registrar el usuario';

      Swal.fire('Error', msg, 'error');
    }
  };

  return (
    <AuthLayout
      title="Bienvenido a Confort & Estilo"
      subtitle="Registro"
      illustration="/auth/Registrar.png"
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <AuthInput
          label="Correo Electrónico"
          type="email"
          name="email"
          value={form.email}
          placeholder="ejemplo@email.com"
          onChange={handleChange}
        />

        <AuthInput
          label="Nombre"
          type="text"
          name="name"
          value={form.name}
          placeholder="Tu nombre completo"
          onChange={handleChange}
        />

        {/* PASSWORD */}
        <div className="relative">
          <AuthInput
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            placeholder="********"
            onChange={handleChange}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-10 text-sm"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {/* CONFIRM */}
        <div className="relative">
          <AuthInput
            label="Confirmar Contraseña"
            type={showConfirm ? 'text' : 'password'}
            name="confirmPassword"
            value={form.confirmPassword}
            placeholder="********"
            onChange={handleChange}
          />

          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-10 text-sm"
          >
            {showConfirm ? '🙈' : '👁️'}
          </button>
        </div>

		        {/* REGLAS */}
        <ul className="text-sm ml-1 space-y-1">
          <li className={rules.length ? 'text-green-600' : 'text-gray-400'}>
            ✔ Mínimo 8 caracteres
          </li>
          <li className={rules.uppercase ? 'text-green-600' : 'text-gray-400'}>
            ✔ Una letra mayúscula
          </li>
          <li className={rules.number ? 'text-green-600' : 'text-gray-400'}>
            ✔ Un número
          </li>
          <li className={rules.special ? 'text-green-600' : 'text-gray-400'}>
            ✔ Un carácter especial
          </li>
        </ul>

        <AuthButton text="Registrarme" type="submit" />
      </form>
    </AuthLayout>
  );
}
