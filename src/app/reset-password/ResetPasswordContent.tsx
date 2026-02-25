"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import api from "@/components/Global/axios";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthButton from "@/components/auth/AuthButton";
import PasswordInput from "@/components/auth/PasswordInput";
import Link from "next/link";

export default function ResetPasswordContent() {
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
      const { data } = await api.post("/api/auth/reset-password", {
        token,
        newPassword: password,
      });

      setMessage(data.message || "Contraseña actualizada correctamente.");
      setType("success");
      setTimeout(() => router.push("/client"), 1500);
    } catch (err: any) {
      setMessage(
        err?.response?.data?.message || "Error al cambiar contraseña."
      );
      setType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      subtitle="Restablecer contraseña"
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
      {/* tu JSX exactamente igual */}
    </AuthLayout>
  );
}