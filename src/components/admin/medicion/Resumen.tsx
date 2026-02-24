'use client';

import { useDashboard } from '@/hooks/apiHooks';
import { CalendarDays } from 'lucide-react';

export default function Resumen() {
	const { data } = useDashboard();

	if (!data) return null;

	const maxRevenue = Math.max(...data.series.monthly.map((m) => m.revenue));

	return (
		<section className='mt-6'>
			<div className='mb-5'>
				<h2 className='text-lg font-semibold text-[#3d2b1f]'>Ventas Mensuales</h2>
				<p className='text-sm text-[#8a7060]'>Resumen de ventas e ingresos mes a mes</p>
			</div>

			<div className='grid grid-cols-3 gap-4'>
				{data.series.monthly.map((m) => {
					const pct = Math.round((m.revenue / maxRevenue) * 100);
					return (
						<div
							key={m.period}
							className='border border-[#e8ddd4] rounded-xl p-4 bg-white hover:border-[#c8a882] transition-colors group'>
							<div className='flex items-center gap-2 mb-3'>
								<CalendarDays size={14} className='text-[#c8a882]' />
								<span className='text-sm font-semibold text-[#8a5e3c]'>{m.period}</span>
							</div>

							<div className='space-y-1 mb-3'>
								<div className='flex justify-between text-sm'>
									<span className='text-[#8a7060]'>Ventas</span>
									<span className='font-bold text-[#3d2b1f]'>{m.sales}</span>
								</div>
								<div className='flex justify-between text-sm'>
									<span className='text-[#8a7060]'>Ingresos</span>
									<span className='font-bold text-[#3d2b1f]'>
										${m.revenue.toLocaleString()}
									</span>
								</div>
							</div>

							<div className='h-1.5 rounded-full bg-[#f0e8df] overflow-hidden'>
								<div
									className='h-full rounded-full bg-gradient-to-r from-[#c8a882] to-[#8a5e3c] group-hover:from-[#8a5e3c] group-hover:to-[#c8a882] transition-all'
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