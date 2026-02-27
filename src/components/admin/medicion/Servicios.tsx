'use client';

import { Sofa, Star, Award, TrendingUp } from 'lucide-react';

export default function ServiciosPopulares({ data }: { data: any }) {
	if (!data) return null;

	const maxQty = Math.max(...data.topItems.services.map((s: any) => s.quantity));

	const getMedal = (index: number) => {
		switch (index) {
			case 0: return <Award size={16} className="text-yellow-400" />;
			case 1: return <Award size={16} className="text-gray-400" />;
			case 2: return <Award size={16} className="text-amber-600" />;
			default: return <Star size={14} className="text-white/20" />;
		}
	};

	return (
		<section className="space-y-6">
			<div>
				<h2 className="text-lg font-medium text-white">Servicios más populares</h2>
				<p className="text-sm text-white/40 mt-1">Top 5 servicios con mayor demanda</p>
			</div>

			<div className="space-y-3">
				{data.topItems.services.map((s: any, index: number) => {
					const pct = Math.round((s.quantity / maxQty) * 100);
					return (
						<div
							key={s.id}
							className="rounded-xl border border-white/10 bg-white/5 p-4
								hover:border-[#C8A882]/30 hover:bg-white/8
								transition-all duration-200">
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-3">
									<div className="w-7 h-7 rounded-full bg-[#C8A882]/10 
										flex items-center justify-center">
										{getMedal(index)}
									</div>
									<div className="flex items-center gap-2">
										<Sofa size={15} className="text-[#C8A882]" />
										<p className="font-medium text-white">{s.name}</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-xs text-white/40">
										<TrendingUp size={12} className="inline mr-1" />
										{pct}%
									</span>
									<span className="text-sm font-semibold text-[#C8A882] 
										bg-[#C8A882]/10 px-2 py-0.5 rounded-full">
										{s.quantity}
									</span>
								</div>
							</div>

							{/* Barra de progreso */}
							<div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
								<div
									className="h-full rounded-full bg-gradient-to-r from-[#C8A882] to-[#8B5E3C]"
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