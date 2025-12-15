"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	// Reglas (solo UI)
	const rules = {
		length: password.length >= 8,
		uppercase: /[A-Z]/.test(password),
		number: /\d/.test(password),
		special: /[^A-Za-z0-9]/.test(password),
	};

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

					{/* PASSWORD */}
					<div>
						<label className="text-sm font-semibold text-[#4b2e1a]">
							Nueva contraseña
						</label>

						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								placeholder="Ingresa tu nueva contraseña"
								className="w-full p-3 mt-1 border border-[#dabfad] rounded-lg pr-12 focus:border-[#4b2e1a] focus:ring-2 focus:ring-[#d9c3b4] outline-none transition"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>

							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4b2e1a]"
							>
								{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</button>
						</div>
					</div>

					{/* CONFIRM */}
					<div>
						<label className="text-sm font-semibold text-[#4b2e1a]">
							Confirmar contraseña
						</label>

						<div className="relative">
							<input
								type={showConfirm ? "text" : "password"}
								placeholder="Confirma tu nueva contraseña"
								className="w-full p-3 mt-1 border border-[#dabfad] rounded-lg pr-12 focus:border-[#4b2e1a] focus:ring-2 focus:ring-[#d9c3b4] outline-none transition"
								value={confirm}
								onChange={(e) => setConfirm(e.target.value)}
								required
							/>

							<button
								type="button"
								onClick={() => setShowConfirm(!showConfirm)}
								className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4b2e1a]"
							>
								{showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
							</button>

							{/* REGLAS */}
							<ul className="mt-3 space-y-1 text-sm">
								<li className={rules.length ? "text-green-600" : "text-gray-400"}>
									✔ Mínimo 8 caracteres
								</li>
								<li className={rules.uppercase ? "text-green-600" : "text-gray-400"}>
									✔ Una letra mayúscula
								</li>
								<li className={rules.number ? "text-green-600" : "text-gray-400"}>
									✔ Un número
								</li>
								<li className={rules.special ? "text-green-600" : "text-gray-400"}>
									✔ Un carácter especial
								</li>
							</ul>
						</div>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full p-3 bg-[#4b2e1a] hover:bg-[#3a2314] text-white rounded-full transition font-semibold shadow-md"
					>
						{loading ? "Procesando..." : "Cambiar contraseña"}
					</button>
				</form>

				{/* ALERTAS */}
				{message && (
					<div
						className={`mt-5 p-3 text-center rounded-lg transition-all ${
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
