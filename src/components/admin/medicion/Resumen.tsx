'use client';

import { CalendarDays, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';

export default function Resumen({ data }: { data: any }) {
	if (!data) return null;

	const maxRevenue = Math.max(...data.series.monthly.map((m: any) => m.revenue));

	return (
		<section className="space-y-6">
			<div>
				<h2 className="text-lg font-medium text-white">Ventas Mensuales</h2>
				<p className="text-sm text-white/40 mt-1">Resumen de ventas e ingresos mes a mes</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{data.series.monthly.map((m: any) => {
					const pct = Math.round((m.revenue / maxRevenue) * 100);
					return (
						<div
							key={m.period}
							className="rounded-xl border border-white/10 bg-white/5 p-5
								hover:border-[#C8A882]/30 hover:bg-white/8
								transition-all duration-200 group">
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-2">
									<CalendarDays size={14} className="text-[#C8A882]" />
									<span className="text-sm font-medium text-white">{m.period}</span>
								</div>
								<div className="flex items-center gap-1 text-xs text-white/40">
									<TrendingUp size={12} />
									<span>{pct}% del máximo</span>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4 mb-4">
								<div className="space-y-1">
									<div className="flex items-center gap-1.5 text-xs text-white/40">
										<ShoppingBag size={12} />
										<span>Ventas</span>
									</div>
									<p className="text-lg font-bold text-white">{m.sales}</p>
								</div>
								<div className="space-y-1">
									<div className="flex items-center gap-1.5 text-xs text-white/40">
										<DollarSign size={12} />
										<span>Ingresos</span>
									</div>
									<p className="text-lg font-bold text-[#C8A882]">
										${m.revenue.toLocaleString()}
									</p>
								</div>
							</div>

							{/* Barra de progreso */}
							<div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
								<div
									className="h-full rounded-full bg-gradient-to-r from-[#C8A882] to-[#8B5E3C] 
										group-hover:opacity-80 transition-all"
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