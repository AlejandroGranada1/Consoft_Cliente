"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import api from "@/components/Global/axios";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthButton from "@/components/auth/AuthButton";
import PasswordInput from "@/components/auth/PasswordInput";
import Link from "next/link";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [message, setMessage]   = useState("");
  const [type, setType]         = useState<"success" | "error" | "">("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("El token no es válido o expiró.");
      setType("error");
      return;
    }
    if (password !== confirm) {
      setMessage("Las contraseñas no coinciden.");
      setType("error");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/api/auth/reset-password", { token, newPassword: password });
      setMessage(data.message || "Contraseña actualizada correctamente.");
      setType("success");
      setTimeout(() => router.push("/client"), 1500);
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Error al cambiar contraseña.");
      setType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      subtitle="Restablecer contraseña"
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <p className="text-sm text-white/50 leading-relaxed">
          Elige una nueva contraseña segura para tu cuenta.
        </p>

        <PasswordInput
          label="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showRules={true}
        />

        <PasswordInput
          label="Confirmar contraseña"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          showRules={false}
        />

        {/* Match indicator */}
        {confirm.length > 0 && (
          <p className={`text-xs -mt-2 ${password === confirm ? 'text-emerald-400' : 'text-red-400/80'}`}>
            {password === confirm ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
          </p>
        )}

        <AuthButton
          text="Cambiar contraseña"
          type="submit"
          loading={loading}
        />

        {/* Feedback */}
        {message && (
          <div className={`rounded-xl border px-4 py-3 text-sm text-center transition-all ${
            type === 'success'
              ? 'border-emerald-400/20 bg-emerald-400/5 text-emerald-400'
              : 'border-red-400/20 bg-red-400/5 text-red-400'
          }`}>
            {message}
          </div>
        )}
      </form>
    </AuthLayout>
  );
}