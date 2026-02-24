'use client';

import { useDashboard } from '@/hooks/apiHooks';
import { Sofa } from 'lucide-react';

export default function ServiciosPopulares() {
	const { data } = useDashboard({ limit: 5 });

	if (!data) return null;

	const maxQty = Math.max(...data.topItems.services.map((s) => s.quantity));

	return (
		<section className='mt-6'>
			<div className='mb-5'>
				<h2 className='text-lg font-semibold text-[#3d2b1f]'>Servicios más solicitados</h2>
				<p className='text-sm text-[#8a7060]'>Top 5 servicios con mayor demanda</p>
			</div>

			<div className='space-y-3'>
				{data.topItems.services.map((s, index) => {
					const pct = Math.round((s.quantity / maxQty) * 100);
					const medals = ['🥇', '🥈', '🥉'];
					return (
						<div
							key={s.id}
							className='border border-[#e8ddd4] rounded-xl p-4 bg-white hover:border-[#c8a882] transition-colors'>
							<div className='flex items-center justify-between mb-2'>
								<div className='flex items-center gap-3'>
									<span className='w-7 h-7 rounded-full bg-[#f5ede4] flex items-center justify-center text-sm font-bold text-[#8a5e3c]'>
										{index < 3 ? medals[index] : `#${index + 1}`}
									</span>
									<div className='flex items-center gap-2'>
										<Sofa size={15} className='text-[#c8a882]' />
										<p className='font-medium text-[#3d2b1f]'>{s.name}</p>
									</div>
								</div>
								<span className='text-sm font-semibold text-[#8a5e3c] bg-[#f5ede4] px-2 py-0.5 rounded-full'>
									{s.quantity} solicitudes
								</span>
							</div>
							{/* Barra de progreso */}
							<div className='h-1.5 rounded-full bg-[#f0e8df] overflow-hidden'>
								<div
									className='h-full rounded-full bg-gradient-to-r from-[#c8a882] to-[#8a5e3c] transition-all'
									style={{ width: `${pct}%` }}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}