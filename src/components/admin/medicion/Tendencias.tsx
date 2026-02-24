'use client';

import { UserPlus, DollarSign, ShoppingCart } from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';

function calculateGrowth(current: number, previous: number) {
	if (!previous) return 0;
	return ((current - previous) / previous) * 100;
}

export default function GrowthTrends() {
	const { data, isLoading, isError } = useDashboard();

	if (isLoading) {
		return (
			<div className='bg-white border border-[#e8ddd4] rounded-xl p-6'>
				<p className='text-sm text-[#8a7060]'>Cargando métricas...</p>
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className='bg-white border border-[#e8ddd4] rounded-xl p-6'>
				<p className='text-sm text-red-400'>Error cargando dashboard</p>
			</div>
		);
	}

	const monthly = data.series.monthly;
	const lastMonth = monthly[monthly.length - 1];
	const previousMonth = monthly[monthly.length - 2];

	const salesGrowth = calculateGrowth(lastMonth?.sales ?? 0, previousMonth?.sales ?? 0);
	const revenueGrowth = calculateGrowth(lastMonth?.revenue ?? 0, previousMonth?.revenue ?? 0);

	// Normalizamos totalUsers a un % relativo (máx 100) para la barra
	const usersBarPct = Math.min((data.summary.totalUsers / 500) * 100, 100);

	const metrics = [
		{
			id: 1,
			name: 'Usuarios Registrados',
			// El valor real que mostramos en texto
			displayValue: data.summary.totalUsers.toLocaleString(),
			// El % que ocupa la barra (0-100)
			barPct: usersBarPct,
			icon: <UserPlus size={18} />,
			iconColor: 'text-[#5e7a3c]',
			rowBg: 'bg-[#eef5e4]',
			barColor: 'bg-[#8ab85e]',
			suffix: ' usuarios',
		},
		{
			id: 2,
			name: 'Ventas',
			displayValue: salesGrowth.toFixed(1) + '%',
			barPct: Math.min(Math.abs(salesGrowth), 100),
			icon: <ShoppingCart size={18} />,
			iconColor: 'text-[#3c5e8a]',
			rowBg: 'bg-[#e4eef5]',
			barColor: 'bg-[#5e8ab8]',
			suffix: '',
		},
		{
			id: 3,
			name: 'Ingresos',
			displayValue: (revenueGrowth >= 0 ? '+' : '') + revenueGrowth.toFixed(1) + '%',
			barPct: Math.min(Math.abs(revenueGrowth), 100),
			icon: <DollarSign size={18} />,
			iconColor: 'text-[#8a5e3c]',
			rowBg: 'bg-[#f5ede4]',
			barColor: 'bg-[#c8a882]',
			suffix: '',
		},
	];

	return (
		<div className='bg-white border border-[#e8ddd4] rounded-xl p-6'>
			{/* Encabezado */}
			<h2 className='text-lg font-semibold text-[#3d2b1f] mb-1'>
				Tendencias de Crecimiento
			</h2>
			<p className='text-sm text-[#8a7060] mb-5'>
				Evolución de métricas clave en los últimos meses
			</p>

			{/* Filas de métricas */}
			<div className='space-y-3'>
				{metrics.map((metric) => (
					<div
						key={metric.id}
						className={`flex items-center gap-4 ${metric.rowBg} rounded-lg px-4 py-3`}
					>
						{/* Icono */}
						<span className={`${metric.iconColor} shrink-0`}>
							{metric.icon}
						</span>

						{/* Nombre — ancho fijo para que las barras queden alineadas */}
						<span className='text-sm font-medium text-[#3d2b1f] w-44 shrink-0'>
							{metric.name}
						</span>

						{/* Barra de progreso — ocupa el espacio restante */}
						<div className='flex-1 bg-white/70 rounded-full h-2 overflow-hidden'>
							<div
								className={`h-full rounded-full ${metric.barColor} transition-all duration-500`}
								style={{ width: `${metric.barPct}%` }}
							/>
						</div>

						{/* Valor numérico — ancho fijo a la derecha */}
						<span className={`text-sm font-bold ${metric.iconColor} w-20 text-right shrink-0`}>
							{metric.displayValue}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}