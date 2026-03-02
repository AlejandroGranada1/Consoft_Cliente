'use client';

import { UserPlus, DollarSign, ShoppingCart, TrendingUp, TrendingDown } from 'lucide-react';

function calculateGrowth(current: number, previous: number) {
	if (!previous) return 0;
	return ((current - previous) / previous) * 100;
}

export default function Tendencias({ data }: { data: any }) {
	if (!data) return null;

	const monthly = data.series.monthly;
	const lastMonth = monthly[monthly.length - 1];
	const previousMonth = monthly[monthly.length - 2];

	const salesGrowth = calculateGrowth(lastMonth?.sales ?? 0, previousMonth?.sales ?? 0);
	const revenueGrowth = calculateGrowth(lastMonth?.revenue ?? 0, previousMonth?.revenue ?? 0);

	// Normalizamos totalUsers a un % relativo (máx 100) para la barra
	const usersBarPct = Math.min((data.summary.totalUsers / 500) * 100, 100);
	const salesBarPct = Math.min(Math.abs(salesGrowth), 100);
	const revenueBarPct = Math.min(Math.abs(revenueGrowth), 100);

	const metrics = [
		{
			id: 1,
			name: 'Usuarios Registrados',
			displayValue: data.summary.totalUsers.toLocaleString(),
			barPct: usersBarPct,
			icon: <UserPlus size={18} />,
			iconColor: 'text-[#C8A882]',
			rowBg: 'bg-[#C8A882]/5',
			barColor: 'bg-gradient-to-r from-[#C8A882] to-[#8B5E3C]',
			suffix: ' usuarios',
			growth: null,
		},
		{
			id: 2,
			name: 'Crecimiento en Ventas',
			displayValue: (salesGrowth >= 0 ? '+' : '') + salesGrowth.toFixed(1) + '%',
			barPct: salesBarPct,
			icon: <ShoppingCart size={18} />,
			iconColor: salesGrowth >= 0 ? 'text-green-400' : 'text-red-400',
			rowBg: salesGrowth >= 0 ? 'bg-green-500/5' : 'bg-red-500/5',
			barColor: salesGrowth >= 0 
				? 'bg-gradient-to-r from-green-500 to-emerald-500'
				: 'bg-gradient-to-r from-red-500 to-orange-500',
			suffix: '',
			growth: salesGrowth,
		},
		{
			id: 3,
			name: 'Crecimiento en Ingresos',
			displayValue: (revenueGrowth >= 0 ? '+' : '') + revenueGrowth.toFixed(1) + '%',
			barPct: revenueBarPct,
			icon: <DollarSign size={18} />,
			iconColor: revenueGrowth >= 0 ? 'text-green-400' : 'text-red-400',
			rowBg: revenueGrowth >= 0 ? 'bg-green-500/5' : 'bg-red-500/5',
			barColor: revenueGrowth >= 0
				? 'bg-gradient-to-r from-green-500 to-emerald-500'
				: 'bg-gradient-to-r from-red-500 to-orange-500',
			suffix: '',
			growth: revenueGrowth,
		},
	];

	return (
		<div className="rounded-xl border border-white/10 bg-white/5 p-6">
			{/* Encabezado */}
			<div className="mb-6">
				<h2 className="text-lg font-medium text-white">Tendencias de Crecimiento</h2>
				<p className="text-sm text-white/40 mt-1">
					Evolución de métricas clave en los últimos meses
				</p>
			</div>

			{/* Filas de métricas */}
			<div className="space-y-3">
				{metrics.map((metric) => (
					<div
						key={metric.id}
						className={`flex items-center gap-4 ${metric.rowBg} rounded-xl px-4 py-3 border border-white/5`}
					>
						{/* Icono */}
						<span className={`${metric.iconColor} shrink-0`}>
							{metric.icon}
						</span>

						{/* Nombre */}
						<span className="text-sm font-medium text-white w-44 shrink-0">
							{metric.name}
						</span>

						{/* Barra de progreso */}
						<div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
							<div
								className={`h-full rounded-full ${metric.barColor} transition-all duration-500`}
								style={{ width: `${metric.barPct}%` }}
							/>
						</div>

						{/* Valor y tendencia */}
						<div className="flex items-center gap-2 w-28 justify-end shrink-0">
							{metric.growth !== null && (
								metric.growth >= 0 
									? <TrendingUp size={14} className="text-green-400" />
									: <TrendingDown size={14} className="text-red-400" />
							)}
							<span className={`text-sm font-bold ${metric.iconColor}`}>
								{metric.displayValue}
							</span>
						</div>
					</div>
				))}
			</div>

			{/* Nota al pie */}
			<p className="text-xs text-white/20 text-center mt-4">
				Basado en datos de los últimos {monthly.length} meses
			</p>
		</div>
	);
}