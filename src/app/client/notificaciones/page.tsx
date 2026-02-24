'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NotificationCard from '@/components/notificaciones/NotificationCard';
import EmptyState from '@/components/notificaciones/EmptyState';
import { useMyQuotations } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
	Solicitada:  { icon: '🕐', bg: 'bg-blue-900/20',   color: 'text-blue-400/80'   },
	Cotizada:    { icon: '💰', bg: 'bg-yellow-900/20', color: 'text-yellow-400/80' },
	Aprobada:    { icon: '✅', bg: 'bg-green-900/20',  color: 'text-green-400/80'  },
	Rechazada:   { icon: '❌', bg: 'bg-red-900/20',    color: 'text-red-400/80'    },
	Completada:  { icon: '🏁', bg: 'bg-purple-900/20', color: 'text-purple-400/80' },
	Revisada:    { icon: '📋', bg: 'bg-white/5',       color: 'text-white/50'      },
};

const bgStyle = {
	background: `
		radial-gradient(ellipse at 75% 10%, rgba(120,100,80,0.16) 0%, transparent 50%),
		radial-gradient(ellipse at 15% 65%, rgba(90,75,60,0.13) 0%, transparent 50%),
		linear-gradient(160deg, #1e1e1c 0%, #252320 30%, #2a2724 60%, #1e1c1a 100%)
	`,
};

export default function NotificationsPage() {
	const { user, loading } = useUser();
	const { data, isLoading, refetch } = useMyQuotations();
	const router = useRouter();
	const [selectedId, setSelectedId] = useState<string | null>(null);

	/* ───────── AUTH ───────── */
	useEffect(() => {
		if (loading) return;
		if (user === null) {
			(async () => {
				const Swal = (await import('sweetalert2')).default;
				await Swal.fire({
					icon: 'warning',
					title: 'Inicia sesión',
					text: 'Debes iniciar sesión para acceder a tus notificaciones',
				});
				router.push('/client/auth/login');
			})();
		}
	}, [user, router, loading]);

	const allQuotations = data || [];

	const notificationStatuses = ['Solicitada', 'Cotizada', 'Aprobada', 'Rechazada', 'Completada', 'Revisada'];
	const notifications = allQuotations.filter(
		(q: any) => notificationStatuses.includes(q.status) && q.status !== 'Carrito',
	);

	useEffect(() => {
		if (!selectedId && notifications.length > 0) {
			setSelectedId(notifications[0]._id);
		}
	}, [notifications, selectedId]);

	const selectedQuote = notifications.find((q: any) => q._id === selectedId);

	/* ───────── LOADING ───────── */
	if (isLoading) {
		return (
			<section className="min-h-screen flex items-center justify-center" style={bgStyle}>
				<div className="flex flex-col items-center gap-4 text-[#6b5b4e]">
					<svg className="animate-spin w-8 h-8 text-[#8B5E3C]" viewBox="0 0 24 24" fill="none">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
						<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
					</svg>
					<p className="text-sm">Cargando notificaciones…</p>
				</div>
			</section>
		);
	}

	/* ───────── UI ───────── */
	return (
		<section className="min-h-screen relative text-[#e8e0d5] px-6 pt-24 pb-12" style={bgStyle}>

			{/* Grain overlay */}
			<div
				className="absolute inset-0 pointer-events-none opacity-[0.045]"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
					backgroundSize: '180px 180px',
				}}
			/>
			<div
				className="absolute inset-0 pointer-events-none"
				style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)' }}
			/>

			{/* HEADER */}
			<div className="relative z-10 max-w-6xl mx-auto flex items-end justify-between mb-8">
				<div>
					<p className="text-[11px] font-medium tracking-widest uppercase text-[#8B5E3C] mb-1">
						Centro de mensajes
					</p>
					<h1 className="font-serif text-3xl font-medium text-[#f0e8d8]">
						Notificaciones
					</h1>
				</div>

				{notifications.length > 0 && (
					<span className="px-3 py-1 rounded-full bg-[#8B5E3C]/15 text-[#c4945a] text-xs font-medium border border-[#8B5E3C]/20">
						{notifications.length} {notifications.length === 1 ? 'notificación' : 'notificaciones'}
					</span>
				)}
			</div>

			<div className="relative z-10 h-px bg-white/5 max-w-6xl mx-auto mb-8" />

			{/* EMPTY */}
			{notifications.length === 0 ? (
				<div className="relative z-10 max-w-6xl mx-auto">
					<EmptyState />
				</div>
			) : (
				<div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">

					{/* ── LISTA IZQUIERDA ── */}
					<div className="flex flex-col gap-2">
						{notifications.map((q: any) => {
							const cfg = STATUS_CONFIG[q.status] ?? STATUS_CONFIG['Revisada'];
							const isActive = q._id === selectedId;

							return (
								<button
									key={q._id}
									onClick={() => setSelectedId(q._id)}
									className={`w-full text-left px-4 py-4 rounded-xl border transition-all duration-200
										${isActive
											? 'border-[#8B5E3C] bg-white/[0.06]'
											: 'border-white/[0.07] bg-white/[0.03] hover:border-[#8B5E3C]/40 hover:bg-white/[0.05]'
										}`}
								>
									<div className="flex justify-between items-start gap-2">
										<div className="flex flex-col gap-0.5 min-w-0">
											<p className={`text-sm font-medium truncate ${isActive ? 'text-[#f0e8d8]' : 'text-[#c4b8a8]'}`}>
												Cotización #{q._id.slice(-6)}
											</p>
											<p className="text-[11px] text-[#6b5b4e]">
												{q.items.length} {q.items.length === 1 ? 'producto' : 'productos'}
											</p>
										</div>

										<span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
											{cfg.icon} {q.status}
										</span>
									</div>

									<p className="text-[11px] text-[#4a3f35] mt-2">
										{new Date(q.createdAt).toLocaleDateString('es-ES', {
											day: 'numeric',
											month: 'short',
											year: 'numeric',
										})}
									</p>

									{isActive && (
										<div className="mt-3 h-px bg-gradient-to-r from-[#8B5E3C] to-transparent" />
									)}
								</button>
							);
						})}
					</div>

					{/* ── DETALLE DERECHA ── */}
					<div className="md:col-span-2">
						{selectedQuote ? (
							<NotificationCard
								key={selectedQuote._id}
								_id={selectedQuote._id}
								createdAt={selectedQuote.createdAt}
								totalEstimate={selectedQuote.totalEstimate ?? 0}
								items={selectedQuote.items}
								status={selectedQuote.status}
								adminNotes={selectedQuote.adminNotes}
								refetch={refetch}
							/>
						) : (
							<div className="flex flex-col items-center justify-center h-64 border border-dashed border-white/10 rounded-2xl bg-white/[0.03] text-center gap-3">
								<svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="opacity-30">
									<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
								<p className="text-sm text-[#6b5b4e]">Selecciona una cotización</p>
								<p className="text-xs text-[#3a3028]">Elige una notificación de la lista para ver los detalles</p>
							</div>
						)}
					</div>

				</div>
			)}
		</section>
	);
}