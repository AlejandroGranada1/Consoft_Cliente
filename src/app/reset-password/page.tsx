"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/components/Global/axios";

export default function ResetPasswordPage() {
	const params = useSearchParams();
	const router = useRouter();
	const token = params.get("token");

	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [message, setMessage] = useState("");
	const [type, setType] = useState<"success" | "error" | "">("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: any) => {
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

			// ⏳ Redirigir después de 2.5 segundos
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
		<div className="flex items-center justify-center min-h-screen bg-[#fff9f6] px-4">
			<div className="w-full max-w-md p-8 bg-white border border-[#e6d5cb] rounded-2xl shadow-lg">
				
				<h1 className="text-3xl font-bold text-center text-[#4b2e1a] mb-6">
					Restablecer Contraseña
				</h1>

				<form onSubmit={handleSubmit} className="space-y-4">
					
					<div>
						<label className="text-sm font-semibold text-[#4b2e1a]">
							Nueva contraseña
						</label>
						<input
							type="password"
							placeholder="Ingresa tu nueva contraseña"
							className="w-full p-3 mt-1 border border-[#dabfad] rounded-lg focus:border-[#4b2e1a] focus:ring-2 focus:ring-[#d9c3b4] outline-none transition"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					<div>
						<label className="text-sm font-semibold text-[#4b2e1a]">
							Confirmar contraseña
						</label>
						<input
							type="password"
							placeholder="Confirma tu nueva contraseña"
							className="w-full p-3 mt-1 border border-[#dabfad] rounded-lg focus:border-[#4b2e1a] focus:ring-2 focus:ring-[#d9c3b4] outline-none transition"
							value={confirm}
							onChange={(e) => setConfirm(e.target.value)}
							required
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full p-3 bg-[#4b2e1a] hover:bg-[#3a2314] text-white rounded-full transition font-semibold shadow-md"
					>
						{loading ? "Procesando..." : "Cambiar contraseña"}
					</button>
				</form>

				{/* Alertas */}
				{message && (
					<div
						className={`mt-5 p-3 text-center rounded-lg transition-all duration-300 ${
							type === "success"
								? "bg-green-100 border border-green-400 text-green-700"
								: "bg-red-100 border border-red-400 text-red-700"
						}`}
					>
						{message}
					</div>
				)}
			</div>
		</div>
	);
}
