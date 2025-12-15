'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSendPayment } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';
import QR from '@/components/pagos/QR';

export default function PagoPage() {
	const router = useRouter();
	const { id: pedidoId } = useParams();
	const sendPayment = useSendPayment();

	const { user, loading } = useUser();

	const [metodo, setMetodo] = useState<'Nequi' | 'Bancolombia' | null>(null);
	const [tipoPago, setTipoPago] = useState<'abono' | 'final' | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);

	/* ───────── AUTH ───────── */
	useEffect(() => {
		if (loading) return;

		if (!user) {
			(async () => {
				const Swal = (await import('sweetalert2')).default;

				await Swal.fire({
					icon: 'warning',
					title: 'Inicia sesión',
					text: 'Debes iniciar sesión para realizar un pago.',
				});

				router.push('/client/auth/login');
			})();
		}
	}, [user, loading, router]);

	if (!user) return null;

	/* ───────── FILE ───────── */
	const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0];
		if (!f) return;

		setFile(f);
		setPreview(URL.createObjectURL(f));
	};

	/* ───────── CONFIRM ───────── */
	const confirmarPago = async () => {
		const Swal = (await import('sweetalert2')).default;

		if (!metodo) {
			return Swal.fire({
				icon: 'warning',
				title: 'Selecciona un método de pago',
			});
		}

		if (!file) {
			return Swal.fire({
				icon: 'warning',
				title: 'Falta el comprobante',
				text: 'Debes subir el comprobante del pago.',
			});
		}

		if (!tipoPago) {
			return Swal.fire({
				icon: 'warning',
				title: 'Selecciona el tipo de pago',
			});
		}

		const confirm = await Swal.fire({
			title: '¿Confirmar pago?',
			text: 'El comprobante será enviado para verificación.',
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'Confirmar',
			cancelButtonText: 'Cancelar',
			reverseButtons: true, // ✅ confirmar a la derecha
		});

		if (!confirm.isConfirmed) return;

		sendPayment.mutate(
			{
				orderId: pedidoId as string,
				payment_image: file,
				tipoPago,
			},
			{
				onSuccess: async () => {
					await Swal.fire({
						icon: 'success',
						title: 'Pago enviado',
						text: 'Tu comprobante está en verificación.',
					});

					router.push('/client/pedidos');
				},
				onError: () => {
					Swal.fire({
						icon: 'error',
						title: 'Error al enviar el pago',
						text: 'Intenta nuevamente.',
					});
				},
			}
		);
	};

	/* ───────── UI ───────── */
	return (
		<main className="min-h-screen bg-white p-6 flex justify-center">
			<div className="w-full max-w-xl space-y-8">

				{/* HEADER */}
				<div className="flex items-center justify-between">
					<button
						onClick={() => router.back()}
						className="px-4 py-2 rounded-full bg-[#8B5E3C] text-white text-sm hover:bg-[#6B4226] transition"
					>
						Volver
					</button>

					<h1 className="text-xl font-semibold text-[#0F172A]">
						Realizar pago
					</h1>

					<div className="w-16" />
				</div>

				{/* MÉTODO */}
				<div>
					<p className="font-medium text-gray-700 mb-3">
						Método de pago
					</p>

					<div className="grid grid-cols-2 gap-4">
						{['Nequi', 'Bancolombia'].map(m => (
							<button
								key={m}
								onClick={() => setMetodo(m as any)}
								className={`p-4 rounded-xl border transition
									${metodo === m
										? 'border-[#8B5E3C] bg-[#F9F5F1]'
										: 'border-gray-200 bg-white hover:bg-gray-50'
									}`}
							>
								<p className="font-semibold text-[#0F172A]">
									{m}
								</p>
							</button>
						))}
					</div>
				</div>

				{/* QR */}
				{metodo && (
					<div className="flex justify-center border border-gray-200 rounded-xl p-4">
						<QR type={metodo} />
					</div>
				)}

				{/* COMPROBANTE */}
				<div>
					<p className="font-medium text-gray-700 mb-2">
						Comprobante
					</p>

					<div className="border border-gray-200 rounded-xl bg-white p-3">
						{preview ? (
							<img
								src={preview}
								alt="Comprobante"
								className="w-full h-52 object-contain rounded-lg"
							/>
						) : (
							<div className="h-52 flex items-center justify-center text-gray-400">
								Sin archivo seleccionado
							</div>
						)}
					</div>

					<input
						type="file"
						accept="image/*"
						onChange={handleFile}
						className="mt-3 w-full text-sm"
					/>
				</div>

				{/* TIPO */}
				<div>
					<p className="font-medium text-gray-700 mb-3">
						Tipo de pago
					</p>

					<div className="grid grid-cols-2 gap-4">
						{['abono', 'final'].map(t => (
							<button
								key={t}
								onClick={() => setTipoPago(t as any)}
								className={`p-3 rounded-xl border transition
									${tipoPago === t
										? 'border-[#8B5E3C] bg-[#F9F5F1]'
										: 'border-gray-200 bg-white hover:bg-gray-50'
									}`}
							>
								{t === 'abono' ? 'Abono' : 'Pago final'}
							</button>
						))}
					</div>
				</div>

				{/* CONFIRM */}
				<div className="flex justify-end pt-4">
					<button
						onClick={confirmarPago}
						disabled={sendPayment.isPending}
						className="px-6 py-3 rounded-full bg-[#8B5E3C] text-white font-medium hover:bg-[#6B4226] disabled:opacity-50 transition"
					>
						{sendPayment.isPending ? 'Enviando…' : 'Confirmar pago'}
					</button>
				</div>

			</div>
		</main>
	);
}
