'use client';

import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import NotificationCard from '@/components/notificaciones/NotificationCard';
import EmptyState from '@/components/notificaciones/EmptyState';
import { useMyCart } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';

export default function NotificationsPage() {
	const { user } = useUser();
	const { data: cart, refetch } = useMyCart();

	const [selectedId, setSelectedId] = useState<string | null>(null);

	/* 🚨 proteger ruta */
	useEffect(() => {
		if (user === null) {
			redirect('/auth/login');
		}
	}, [user]);

	if (!user) return null;

	const quotations =
		cart?.quotations?.filter(q => q.status === 'cotizada') ?? [];

	/* seleccionar la primera automáticamente */
	useEffect(() => {
		if (!selectedId && quotations.length > 0) {
			setSelectedId(quotations[0]._id);
		}
	}, [quotations, selectedId]);

	const selectedQuote = quotations.find(q => q._id === selectedId);

	return (
		<section className="bg-[#f9f9f9] min-h-screen p-6">
			<h1 className="text-2xl font-bold text-[#1E293B] mb-6">
				Notificaciones
			</h1>

			{quotations.length === 0 && <EmptyState />}

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

				{/* ───── LISTA IZQUIERDA ───── */}
				<div className="space-y-2">
					{quotations.map(q => (
						<button
							key={q._id}
							onClick={() => setSelectedId(q._id)}
							className={`w-full text-left p-4 rounded-lg border transition
								${q._id === selectedId
									? 'bg-blue-50 border-blue-400'
									: 'bg-white hover:bg-gray-50'
								}`}
						>
							<p className="font-semibold">
								Cotización #{q._id.slice(-5)}
							</p>
							<p className="text-sm text-gray-500">
								{q.items.length} productos
							</p>
						</button>
					))}
				</div>

				{/* ───── DETALLE DERECHA ───── */}
				<div className="md:col-span-2">
					{selectedQuote ? (
						<NotificationCard
							_id={selectedQuote._id}
							createdAt={selectedQuote.createdAt}
							totalEstimate={selectedQuote.totalEstimate ?? 0}
							items={selectedQuote.items}
							status={selectedQuote.status}
							adminNotes={selectedQuote.adminNotes}
							refetch={refetch}
						/>
					) : (
						<p className="text-center text-gray-500 mt-20">
							Selecciona una cotización
						</p>
					)}
				</div>

			</div>
		</section>
	);
}
