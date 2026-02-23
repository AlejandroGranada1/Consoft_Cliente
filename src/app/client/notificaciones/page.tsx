'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NotificationCard from '@/components/notificaciones/NotificationCard';
import EmptyState from '@/components/notificaciones/EmptyState';
import { useMyQuotations } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';

export default function NotificationsPage() {
	const { user, loading } = useUser();
	const { data, isLoading, refetch } = useMyQuotations();
	const router = useRouter();
	const [selectedId, setSelectedId] = useState<string | null>(null);

	// 🚨 PROTEGER RUTA - Redirección si no hay usuario
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

	// Filtrar cotizaciones que NO son carritos activos
	const allQuotations = data || [];

	// Estados que consideramos "notificaciones"
	const notificationStatuses = [
		'Solicitada',
		'Cotizada',
		'Aprobada',
		'Rechazada',
		'Completada',
		'Revisada',
	];

	const notifications = allQuotations.filter(
		(q: any) => notificationStatuses.includes(q.status) && q.status !== 'Carrito',
	);

	console.log(notifications);
	/* seleccionar la primera automáticamente */
	useEffect(() => {
		if (!selectedId && notifications.length > 0) {
			setSelectedId(notifications[0]._id);
		}
	}, [notifications, selectedId]);

	const selectedQuote = notifications.find((q: any) => q._id === selectedId);

	return (
		<section className='bg-[#f9f9f9] min-h-screen p-6'>
			<h1 className='text-2xl font-bold text-[#1E293B] mb-6'>Notificaciones</h1>

			{/* Badge de cantidad */}
			{notifications.length > 0 && (
				<div className='mb-4'>
					<span className='bg-[#5C3A21] text-white text-xs px-3 py-1 rounded-full'>
						{notifications.length}{' '}
						{notifications.length === 1 ? 'notificación' : 'notificaciones'}
					</span>
				</div>
			)}

			{notifications.length === 0 ? (
				<EmptyState />
			) : (
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					{/* ───── LISTA IZQUIERDA ───── */}
					<div className='space-y-2'>
						{notifications.map((q: any) => {
							// Determinar color según estado
							let statusColor = 'bg-gray-100 text-gray-800';
							let statusIcon = '📋';

							if (q.status === 'Aprobada') {
								statusColor = 'bg-green-100 text-green-800';
								statusIcon = '✅';
							} else if (q.status === 'Rechazada') {
								statusColor = 'bg-red-100 text-red-800';
								statusIcon = '❌';
							} else if (q.status === 'Solicitada') {
								statusColor = 'bg-blue-100 text-blue-800';
								statusIcon = '🕐';
							} else if (q.status === 'Cotizada') {
								statusColor = 'bg-yellow-100 text-yellow-800';
								statusIcon = '💰';
							} else if (q.status === 'Completada') {
								statusColor = 'bg-purple-100 text-purple-800';
								statusIcon = '🏁';
							}

							return (
								<button
									key={q._id}
									onClick={() => setSelectedId(q._id)}
									className={`w-full text-left p-4 rounded-lg border transition-all duration-200
										${
											q._id === selectedId
												? 'bg-[#5C3A21] text-white border-[#5C3A21] shadow-md'
												: 'bg-white hover:bg-gray-50 border-gray-200 hover:shadow-sm'
										}`}>
									<div className='flex justify-between items-start'>
										<div>
											<p className='font-semibold'>
												Cotización #{q._id.slice(-5)}
											</p>
											<p className='text-sm opacity-80'>
												{q.items.length}{' '}
												{q.items.length === 1 ? 'producto' : 'productos'}
											</p>
										</div>
										<span
											className={`text-xs px-2 py-1 rounded-full ${
												q._id === selectedId ? 'bg-white/20' : statusColor
											}`}>
											{statusIcon} {q.status}
										</span>
									</div>
									<p className='text-xs mt-2 opacity-70'>
										{new Date(q.createdAt).toLocaleDateString('es-ES', {
											day: 'numeric',
											month: 'short',
											year: 'numeric',
										})}
									</p>
								</button>
							);
						})}
					</div>

					{/* ───── DETALLE DERECHA ───── */}
					<div className='md:col-span-2'>
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
							<div className='bg-white rounded-xl p-8 text-center border'>
								<p className='text-gray-500 text-lg mb-4'>
									Selecciona una cotización
								</p>
								<p className='text-gray-400 text-sm'>
									Elige una notificación de la lista para ver los detalles
								</p>
							</div>
						)}
					</div>
				</div>
			)}
		</section>
	);
}
