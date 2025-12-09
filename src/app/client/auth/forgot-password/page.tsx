"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import { useState } from "react";
import { useForgotPassword } from "@/hooks/apiHooks";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const { mutate: forgotPassword, isPending, isSuccess, error } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPassword(email);
  };

  return (
    <AuthLayout
      title="Bienvenido a Confort & Estilo"
      subtitle="Recupera tu contraseña"
      illustration="/auth/Recuperar.png"
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <p className="text-sm text-[#1E293B] mb-2">
          Te enviaremos un enlace de recuperación a tu correo electrónico.
        </p>

        <AuthInput
          label="Correo"
          type="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthButton text={isPending ? "Enviando..." : "Enviar"} type="submit" />

        {isSuccess && (
          <p className="text-sm text-center text-green-700">
            Si el correo existe, se envió un enlace para restablecer la contraseña.
          </p>
        )}

        {error && (
          <p className="text-sm text-center text-red-700">
            {(error as any)?.response?.data?.message || "Error al enviar la solicitud"}
          </p>
        )}
      </form>
    </AuthLayout>
  );
}