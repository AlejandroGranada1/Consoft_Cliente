'use client';

import { BarChart3, DollarSign, Star, Users, TrendingUp } from 'lucide-react';
import Resumen from '@/components/admin/medicion/Resumen';
import ServiciosPopulares from '@/components/admin/medicion/Servicios';
import Tendencias from '@/components/admin/medicion/Tendencias';
import { useDashboard } from '@/hooks/apiHooks';
import React, { useState } from 'react';

const TABS = [
	{ id: 'resumen', label: 'Resumen' },
	{ id: 'servicios', label: 'Servicios Populares' },
	{ id: 'tendencias', label: 'Tendencias' },
];

const SUMMARY_CARDS = (data: any) => [
	{
		label: 'Usuarios totales',
		value: data.summary.totalUsers.toLocaleString(),
		icon: <Users size={18} />,
		color: 'text-[#C8A882]',
		bg: 'bg-[#C8A882]/10',
	},
	{
		label: 'Ingresos totales',
		value: `$${data.summary.totalRevenue.toLocaleString()}`,
		icon: <DollarSign size={18} />,
		color: 'text-[#C8A882]',
		bg: 'bg-[#C8A882]/10',
	},
	{
		label: 'Ventas totales',
		value: data.summary.totalSales,
		icon: <BarChart3 size={18} />,
		color: 'text-[#C8A882]',
		bg: 'bg-[#C8A882]/10',
	},
	{
		label: 'Servicios Top',
		value: data.topItems.services.length,
		icon: <Star size={18} />,
		color: 'text-[#C8A882]',
		bg: 'bg-[#C8A882]/10',
	},
];

export default function Page() {
	const [tab, setTab] = useState('resumen');
	const { data, isLoading } = useDashboard({ limit: 5 });

	if (isLoading)
		return (
			<div className="min-h-screen flex items-center justify-center"
				style={{
					background: `
						radial-gradient(ellipse at 75% 10%, rgba(120,100,80,0.16) 0%, transparent 50%),
						radial-gradient(ellipse at 15% 65%, rgba(90,75,60,0.13) 0%, transparent 50%),
						linear-gradient(160deg, #1e1e1c 0%, #252320 30%, #2a2724 60%, #1e1c1a 100%)
					`,
				}}>
				<div className="text-white/40 text-sm tracking-widest uppercase">Cargando métricas...</div>
			</div>
		);
	
	if (!data)
		return (
			<div className="min-h-screen flex items-center justify-center"
				style={{
					background: `
						radial-gradient(ellipse at 75% 10%, rgba(120,100,80,0.16) 0%, transparent 50%),
						radial-gradient(ellipse at 15% 65%, rgba(90,75,60,0.13) 0%, transparent 50%),
						linear-gradient(160deg, #1e1e1c 0%, #252320 30%, #2a2724 60%, #1e1c1a 100%)
					`,
				}}>
				<div className="text-red-400/70 text-sm">Error cargando dashboard</div>
			</div>
		);

	return (
		<div
			className="w-full relative min-h-screen px-4 md:px-8 py-10"
			style={{
				background: `
					radial-gradient(ellipse at 75% 10%, rgba(120,100,80,0.16) 0%, transparent 50%),
					radial-gradient(ellipse at 15% 65%, rgba(90,75,60,0.13) 0%, transparent 50%),
					linear-gradient(160deg, #1e1e1c 0%, #252320 30%, #2a2724 60%, #1e1c1a 100%)
				`,
			}}
		>
			{/* Grain effect */}
			<div
				className="fixed inset-0 pointer-events-none opacity-[0.045]"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
					backgroundSize: '180px 180px',
				}}
			/>
			<div
				className="fixed inset-0 pointer-events-none"
				style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)' }}
			/>

			<div className="relative z-10">
				{/* Header */}
				<header className="mb-8">
					<div className="mb-6">
						<span className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium">
							Analytics
						</span>
						<h1 className="font-serif text-white text-3xl md:text-4xl mt-2 flex items-center gap-3">
							<TrendingUp size={32} className="text-[#C8A882]" />
							Medición y Desempeño
						</h1>
					</div>

					{/* Summary cards */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{SUMMARY_CARDS(data).map((card) => (
							<div
								key={card.label}
								className="rounded-xl border border-white/10 bg-white/5 p-5
									hover:border-[#C8A882]/30 hover:bg-white/8
									transition-all duration-200">
								<div className="flex items-center justify-between mb-3">
									<span className="text-xs text-white/40 uppercase tracking-wider">
										{card.label}
									</span>
									<span className={`${card.bg} ${card.color} p-2 rounded-lg`}>
										{card.icon}
									</span>
								</div>
								<p className="text-2xl font-bold text-white">{card.value}</p>
							</div>
						))}
					</div>
				</header>

				{/* Tabs */}
				<div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit mb-6 border border-white/10">
					{TABS.map((t) => (
						<button
							key={t.id}
							onClick={() => setTab(t.id)}
							className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
								tab === t.id
									? 'bg-[#C8A882]/20 text-[#C8A882] border border-[#C8A882]/30'
									: 'text-white/40 hover:text-white/60'
							}`}>
							{t.label}
						</button>
					))}
				</div>

				{/* Tab content */}
				<div className="space-y-6">
					{tab === 'resumen' && <Resumen data={data} />}
					{tab === 'servicios' && <ServiciosPopulares data={data} />}
					{tab === 'tendencias' && <Tendencias data={data} />}
				</div>
			</div>
		</div>
	);
}