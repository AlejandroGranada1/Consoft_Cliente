'use client';

import NotificationCard from '@/components/notificaciones/NotificationCard';
import EmptyState from '@/components/notificaciones/EmptyState';
import { useMyCart } from '@/hooks/apiHooks';
import { QuotationsResponse } from '@/lib/types';

export default function NotificationsPage() {
	const { data: cart } = useMyCart();

	console.log(cart);

	return (
		<section className='bg-[#f9f9f9] min-h-screen py-10 px-6'>
			<div className='max-w-2xl mx-auto'>
				<h1 className='text-2xl font-bold text-[#1E293B] mb-6'>Notificaciones</h1>

				{cart?.quotations.length > 0 && (
					<div className='space-y-4'>
						{cart.quotations.map((quote: any) => {
							return quote.status == 'cotizada' ? (
								<NotificationCard
									key={quote._id}
									createdAt={quote.createdAt}
									totalEstimate={quote.totalEstimate}
									_id={quote._id}
									status={quote.status}
									items={quote.items}
									adminNotes={quote.adminNotes}
								/>
							) : (
								<EmptyState />
							);
						})}
					</div>
				)}
			</div>
		</section>
	);
}
