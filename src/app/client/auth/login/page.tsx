"use client"

import AuthLayout from "@/components/auth/AuthLayout"
import AuthInput from "@/components/auth/AuthInput"
import AuthButton from "@/components/auth/AuthButton"

export default function LoginPage() {
  return (
    <AuthLayout
      title="Bienvenido a Confort & Estilo"
      subtitle="Inicia Sesión"
      illustration="/auth/Login.png"
    >
      <form className="flex flex-col gap-4">
        <AuthInput label="Email" type="email" placeholder="ejemplo@email.com" />
        <AuthInput label="Contraseña" type="password" placeholder="********" />

        <a href="/auth/forgot-password" className="text-sm text-[#1E293B] hover:text-[#70492F]">
          ¿Olvidaste tu contraseña?
        </a>

        <AuthButton text="Continuar" />

        <button
          type="button"
          className="w-full mt-3 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-100"
        >
          <img src="/auth/Google.webp" alt="Google" className="w-5 h-5" />
          Ingresa con Google
        </button>

        <p className="text-center text-sm mt-4">
          ¿No tienes cuenta?{" "}
          <a href="/auth/register" className="text-[#8B5E3C] font-medium hover:underline">
            Regístrate
          </a>
        </p>
      </form>
    </AuthLayout>
  )
}