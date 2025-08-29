"use client"

import AuthLayout from "@/components/auth/AuthLayout"
import AuthInput from "@/components/auth/AuthInput"
import AuthButton from "@/components/auth/AuthButton"

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Bienvenido a Confort & Estilo"
      subtitle="Recupera tu contraseña"
      illustration="/auth/Recuperar.png"
    >
      <form className="flex flex-col gap-4">
        <p className="text-sm text-[#1E293B] mb-2">
          Te enviamos un código a tu correo electrónico
        </p>

        <AuthInput label="Correo" type="email" placeholder="correo@ejemplo.com" />
        <AuthInput label="Código" type="text" placeholder="123456" />

        <AuthButton text="Enviar" />
      </form>
    </AuthLayout>
  )
}