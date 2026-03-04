'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOcrReceipt, useSendPayment, useMyOrder } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';
import QR from '@/components/pagos/QR';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
export default function PagoPage() {
	const router = useRouter();
	const { id: pedidoId } = useParams();
	const sendPayment = useSendPayment();
	const { user, loading } = useUser();
	const ocr = useOcrReceipt();

	// Obtener datos del pedido
	const { data: orderData } = useMyOrder(pedidoId as string);

	const [metodo, setMetodo] = useState<'Nequi' | 'Bancolombia' | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [dragOver, setDragOver] = useState(false);
	const [montoManual, setMontoManual] = useState<number>(0);

	// Sincronizar monto manual con el OCR cuando termine de cargar
	useEffect(() => {
		if (ocr.data?.detectedAmount) {
			setMontoManual(ocr.data.detectedAmount);
		}
	}, [ocr.data?.detectedAmount]);

	// Calcular información del abono
	const totalPedido = orderData?.raw?.total || 0;
	const pagosRealizados = orderData?.raw?.payments?.reduce((sum: number, p: any) => {
		// Solo sumamos los ya registrados para calcular el restante real antes de este pago
		if (['aprobado', 'approved', 'confirmado', 'pagado', 'paid'].includes(p.status?.toLowerCase())) {
			return sum + (p.amount || 0);
		}
		return sum;
	}, 0) || 0;
	const abonoInicial = orderData?.raw?.initialPayment?.amount || 0;
	const porcentajeAbono = totalPedido > 0 ? (abonoInicial / totalPedido) * 100 : 0;
	const necesitaAbono = abonoInicial < totalPedido * 0.3;
	const restanteActual = totalPedido - pagosRealizados - abonoInicial;
	const restanteDespuesDePago = Math.max(0, restanteActual - montoManual);

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
	const handleFile = (f: File) => {
		setFile(f);
		setPreview(URL.createObjectURL(f));
		ocr.reset();
		ocr.analyze(pedidoId as string, f);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0];
		if (f) handleFile(f);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setDragOver(false);
		const f = e.dataTransfer.files?.[0];
		if (f && f.type.startsWith('image/')) handleFile(f);
	};

	/* ───────── CONFIRM ───────── */
	const confirmarPago = async () => {
		const Swal = (await import('sweetalert2')).default;

		if (!metodo) return Swal.fire({ icon: 'warning', title: 'Selecciona un método de pago' });
		if (!file) return Swal.fire({ icon: 'warning', title: 'Falta el comprobante', text: 'Debes subir el comprobante del pago.' });

		const confirm = await Swal.fire({
			title: '¿Confirmar pago?',
			text: 'El comprobante será enviado para verificación.',
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'Confirmar',
			cancelButtonText: 'Cancelar',
			reverseButtons: true,
		});

		if (!confirm.isConfirmed) return;

		sendPayment.mutate(
			{
				orderId: pedidoId as string,
				amount: montoManual,
				receiptUrl: ocr.data?.receipt?.receiptUrl,
				ocrText: ocr.data?.receipt?.ocrText,
				method: metodo,
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
				onError: (error: any) => {
					Swal.fire({
						icon: 'error',
						title: 'Error',
						text: error.response?.data?.message || 'Error desconocido',
					});
				},
			}
		);
	};

	/* ───────── UI ───────── */
	return (
		<main className="min-h-screen bg-[#111110] text-[#e8e0d5] px-24 py-30 flex justify-center">
			<div className="w-full max-w-5xl flex flex-col gap-8">

				{/* ── HEADER ── */}
				<div className="flex items-center justify-between">
					<button
						onClick={() => router.back()}
						className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-[#b0a090] text-sm hover:border-[#8B5E3C] hover:text-[#e8d8c4] transition-colors"
					>
						<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
							<path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						Volver
					</button>

					<h1 className="font-serif text-xl font-medium text-[#f0e8d8] tracking-wide">
						Realizar pago
					</h1>

					{/* Progress dots */}
					<div className="flex gap-1.5 items-center">
						{[!!metodo, !!file].map((done, i) => (
							<span
								key={i}
								className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${done ? 'bg-[#8B5E3C]' : 'bg-white/10'}`}
							/>
						))}
					</div>
				</div>

				{/* 🔥 BANNER DE ABONO INICIAL */}
				{necesitaAbono && (
					<div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 flex items-start gap-3">
						<AlertCircle size={20} className="text-yellow-400 shrink-0 mt-0.5" />
						<div>
							<p className="text-sm font-medium text-yellow-400">Abono inicial pendiente</p>
							<p className="text-xs text-white/60 mt-1">
								Has abonado <span className="text-yellow-400 font-medium">${abonoInicial.toLocaleString('es-CO')}</span> ({porcentajeAbono.toFixed(0)}%).
								Para iniciar producción necesitas completar el <span className="text-white/80 font-medium">30% (${(totalPedido * 0.3).toLocaleString('es-CO')})</span>.
								{restanteActual > 0 && (
									<span className="block mt-1 text-white/40">
										Saldo total pendiente: ${restanteActual.toLocaleString('es-CO')}
									</span>
								)}
							</p>
						</div>
					</div>
				)}

				{/* ── STEP INDICATOR ── */}
				<div className="flex items-center">
					{[
						{ num: 1, label: 'Método de pago', done: !!metodo },
						{ num: 2, label: 'Comprobante', done: !!file },
					].map((s, i, arr) => (
						<div key={s.num} className="flex items-center gap-2 shrink-0 mr2">
							<div key={s.num} className="flex items-center gap-2 shrink-0">
								<div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border transition-all duration-300
									${s.done ? 'bg-[#8B5E3C] border-[#8B5E3C] text-white' : 'border-white/10 text-[#6b5b4e]'}`}>
									{s.done ? (
										<svg width="10" height="10" viewBox="0 0 12 12" fill="none">
											<path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									) : s.num}
								</div>
								<span className={`text-xs transition-colors duration-300 ${s.done ? 'text-[#c4a882]' : 'text-[#6b5b4e]'}`}>
									{s.label}
								</span>
							</div>
							{i < arr.length - 1 && (
								<div key={`line-${i}`} className="flex-1 h-px bg-white/5 mx-4" />
							)}
						</div>
					))}
				</div>

				<div className="h-px bg-white/5" />

				{/* ── MAIN TWO-COLUMN GRID ── */}
				<div className="grid grid-cols-2 gap-6 items-start">

					{/* ── LEFT COLUMN: Método + QR ── */}
					<div className="flex flex-col gap-4">

						<p className="text-[11px] font-medium tracking-widest uppercase text-[#8B5E3C]">
							Método de pago
						</p>

						<div className="flex flex-col gap-3">
							{[
								{ id: 'Nequi', icon: <img src="/pagos/icono_nequi.png" className="w-12 h-12 object-contain rounded-lg" alt="Nequi" />, sub: 'Transferencia instantánea' },

								{ id: 'Bancolombia', icon: <img src="/pagos/icono_bancolombia.jfif" className="w-12 h-12 object-contain rounded-lg" alt="Bancolombia" />, sub: 'PSE / transferencia' },
							].map(m => (
								<button
									key={m.id}
									onClick={() => setMetodo(m.id as any)}
									className={`relative flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all duration-200
										${metodo === m.id
											? 'border-[#8B5E3C] bg-[#1e1c1a]'
											: 'border-white/[0.07] bg-[#1a1917] hover:border-[#8B5E3C]/40 hover:bg-[#1e1c1a]'
										}`}
								>
									{metodo === m.id && (
										<span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#8B5E3C] flex items-center justify-center">
											<svg width="8" height="8" viewBox="0 0 12 12" fill="none">
												<path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</span>
									)}
									<span className="text-2xl">{m.icon}</span>
									<div>
										<p className="font-serif text-base font-medium text-[#e8e0d5]">{m.id}</p>
										<p className="text-[11px] text-[#6b5b4e] mt-0.5">{m.sub}</p>
									</div>
								</button>
							))}
						</div>

						{/* QR */}
						<div className={`flex flex-col items-center gap-3 border rounded-2xl bg-[#1a1917] p-6 transition-all duration-300
							${metodo ? 'border-white/[0.07] opacity-100' : 'border-dashed border-white/5 opacity-40'}`}>
							{metodo ? (
								<>
									<QR type={metodo} />
									<p className="text-xs text-[#6b5b4e] text-center">
										Escanea con tu app de {metodo}
									</p>
								</>
							) : (
								<div className="h-32 flex flex-col items-center justify-center gap-2 text-[#3a3028]">
									<svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="opacity-40">
										<rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
										<rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
										<rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
										<path d="M14 14h2v2h-2zM18 14h3M14 18h2M18 18h3v3M14 21h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
									</svg>
									<p className="text-xs">Selecciona un método</p>
								</div>
							)}
						</div>
					</div>

					{/* ── RIGHT COLUMN: Comprobante + OCR ── */}
					<div className="flex flex-col gap-4">

						<p className="text-[11px] font-medium tracking-widest uppercase text-[#8B5E3C]">
							Comprobante de pago
						</p>

						{/* Drop zone */}
						<div
							className={`relative rounded-2xl border overflow-hidden transition-all duration-200 cursor-pointer
								${dragOver
									? 'border-[#8B5E3C] bg-[#8B5E3C]/5'
									: preview
										? 'border-white/[0.07] bg-[#1a1917]'
										: 'border-dashed border-white/10 bg-[#1a1917] hover:border-[#8B5E3C]/40'
								}`}
							onDragOver={e => { e.preventDefault(); setDragOver(true); }}
							onDragLeave={() => setDragOver(false)}
							onDrop={handleDrop}
						>
							{preview ? (
								<div className="relative">
									<img
										src={preview}
										alt="Comprobante"
										className={`w-full h-44 object-contain block transition-opacity duration-300 ${ocr.loading ? 'opacity-30' : 'opacity-100'}`}
									/>

									{/* Cargando sobre la imagen */}
									{ocr.loading && (
										<div className="absolute inset-0 flex items-center justify-center">
											<div className="flex flex-col items-center gap-2">
												<div className="animate-spin rounded-full h-8 w-8 border-2 border-[#8B5E3C] border-t-transparent" />
												<p className="text-[10px] text-[#8B5E3C] uppercase tracking-widest font-bold">Analizando...</p>
											</div>
										</div>
									)}

									<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#111110]/90 to-transparent px-4 py-3 flex items-center justify-between">
										<span className="text-xs text-[#c4a882] truncate max-w-[160px]">{file?.name}</span>
										<label className="text-[11px] text-[#8B5E3C] underline cursor-pointer">
											Cambiar
											<input type="file" accept="image/*" onChange={handleInputChange} className="hidden" />
										</label>
									</div>
								</div>
							) : (
								<>
									<div className="h-44 flex flex-col items-center justify-center gap-2 text-[#4a3f35]">
										<svg width="30" height="30" viewBox="0 0 24 24" fill="none" className="opacity-50">
											<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
										<p className="text-sm">Arrastra tu comprobante aquí</p>
										<p className="text-xs text-[#3a3028]">o haz clic para seleccionar</p>
									</div>
									<input
										type="file"
										accept="image/*"
										onChange={handleInputChange}
										className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
									/>
								</>
							)}
						</div>

						{/* ── OCR RESULT ── */}
						{(ocr.loading || ocr.data || ocr.error) && (
							<div className={`rounded-2xl border p-5 flex flex-col gap-3 transition-all duration-300
								${ocr.error ? 'border-red-500/20 bg-[#1a1917]' : 'border-white/[0.07] bg-[#1a1917]'}`}
							>
								<p className="text-[11px] font-medium tracking-widest uppercase text-[#8B5E3C]">
									Información detectada
								</p>

								{/* Skeleton mientras carga */}
								{ocr.loading && (
									<div className="flex flex-col gap-4 animate-pulse">
										<div className="flex justify-between items-center">
											<div className="h-3 w-24 bg-white/5 rounded-md" />
											<div className="h-4 w-20 bg-white/10 rounded-md" />
										</div>
										<div className="h-px bg-white/5" />
										<div className="flex justify-between items-center">
											<div className="h-3 w-24 bg-white/5 rounded-md" />
											<div className="h-4 w-28 bg-white/10 rounded-md" />
										</div>
										<div className="h-12 w-full bg-white/5 rounded-xl mt-2" />
									</div>
								)}

								{/* Error */}
								{ocr.error && !ocr.loading && (
									<div className="flex items-start gap-2 text-red-400/80">
										<svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
											<circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
											<path d="M8 5v3M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
										</svg>
										<p className="text-xs">{ocr.error}</p>
									</div>
								)}

								{/* Datos detectados */}
								{ocr.data && !ocr.loading && (
									<div className="flex flex-col gap-4">

										{/* Monto detectado (INPUT) */}
										<div className="flex items-center justify-between gap-4 group/input">
											<span className="text-xs text-[#6b5b4e] shrink-0 font-medium">Monto a abonar</span>
											<div className="flex-1 max-w-[150px]">
												<CurrencyInput
													value={montoManual}
													onChange={setMontoManual}
													placeholder="0"
												/>
											</div>
										</div>

										<div className="h-px bg-white/5" />

										{/* Saldo restante (DINÁMICO) */}
										<div className="flex items-center justify-between">
											<span className="text-xs text-[#6b5b4e]">Saldo restante</span>
											<span className={`text-sm font-semibold tabular-nums ${restanteDespuesDePago <= 0
												? 'text-emerald-400'
												: 'text-[#e8e0d5]'
												}`}>
												{restanteDespuesDePago <= 0
													? 'Saldado ✓'
													: `$${restanteDespuesDePago.toLocaleString('es-CO')}`
												}
											</span>
										</div>

										{/* Badge pago total */}
										{restanteDespuesDePago <= 0 && (
											<div className="flex items-center gap-1.5 text-emerald-400/70 text-xs mt-1">
												<svg width="11" height="11" viewBox="0 0 12 12" fill="none">
													<path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
												Este pago cubre el total del pedido
											</div>
										)}

										{/* Aviso saldo pendiente */}
										{restanteDespuesDePago > 0 && (
											<div className="flex items-center gap-1.5 text-[#8B5E3C]/80 text-[10px] mt-1 italic">
												<AlertCircle size={10} />
												Cuando se apruebe, quedará un saldo de ${restanteDespuesDePago.toLocaleString('es-CO')}
											</div>
										)}

										{/* 🔥 Mensaje de abono si aplica */}
										{necesitaAbono && montoManual > 0 && restanteDespuesDePago > 0 && (
											<div className="mt-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
												<p className="text-[11px] text-yellow-400 flex items-start gap-2">
													<AlertCircle size={12} className="shrink-0 mt-0.5" />
													<span>
														<strong>Importante:</strong> Este pago será registrado como abono.
														{abonoInicial + montoManual >= totalPedido * 0.3 ? (
															<span className="block mt-1 text-emerald-400">
																✓ Con este pago alcanzarás el 30% y el pedido entrará en producción.
															</span>
														) : (
															<span className="block mt-1">
																Tu abono será del {((abonoInicial + montoManual) / totalPedido * 100).toFixed(0)}%.
																Faltan ${(totalPedido * 0.3 - (abonoInicial + montoManual)).toLocaleString('es-CO')} para el 30%.
															</span>
														)}
													</span>
												</p>
											</div>
										)}
									</div>
								)}
							</div>
						)}
					</div>
				</div>

				{/* ── FOOTER ── */}
				<div className="h-px bg-white/5" />

				<div className="flex justify-end">
					<button
						onClick={confirmarPago}
						disabled={sendPayment.isPending || ocr.loading}
						className="flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-br from-[#8B5E3C] to-[#a06840] text-white text-sm font-medium hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-40 disabled:translate-y-0 transition-all duration-200"
					>
						{sendPayment.isPending ? (
							<>
								<svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3" />
									<path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
								</svg>
								Enviando…
							</>
						) : ocr.loading ? (
							<>
								<svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3" />
									<path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
								</svg>
								Analizando…
							</>
						) : (
							<>
								Confirmar pago
								<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
									<path d="M6 3L11 8L6 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</>
						)}
					</button>
				</div>

			</div>
		</main>
	);
}