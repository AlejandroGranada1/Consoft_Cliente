'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NotificationCard from '@/components/notificaciones/NotificationCard';
import EmptyState from '@/components/notificaciones/EmptyState';
import { useMyCart } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';

export default function NotificationsPage() {
	const router = useRouter();
	const { user, loading } = useUser();
	const { data: cart, refetch } = useMyCart();
	
	useEffect(() => {
		if (loading) return; // ⛔ aún validando sesión

		if (user === null) {
			(async () => {
				const Swal = (await import('sweetalert2')).default;

				await Swal.fire({
					icon: 'warning',
					title: 'Inicia sesión',
					text: 'Debes registrarte o iniciar sesión para agendar una cita.',
				});

				router.push('/client/auth/login');
			})();
		}
	}, [user, router]);

	if (user === undefined || user === null) return null;


	return (
		<section className='bg-[#f9f9f9] min-h-screen py-10 px-6'>
			<div className='max-w-2xl mx-auto'>
				<h1 className='text-2xl font-bold text-[#1E293B] mb-6'>Notificaciones</h1>

				{cart?.quotations?.length! > 0 && (
					<div className='space-y-4'>
						{cart?.quotations.map((quote: any) => {
							return quote.status === 'cotizada' ? (
								<NotificationCard
									key={quote._id}
									createdAt={quote.createdAt}
									totalEstimate={quote.totalEstimate}
									_id={quote._id}
									status={quote.status}
									items={quote.items}
									refetch={refetch}
									adminNotes={quote.adminNotes}
								/>
							) : (
								<EmptyState key={`empty-${quote._id}`} />
							);
						})}
					</div>
				)}
			</div>
		</section>
	);
}
