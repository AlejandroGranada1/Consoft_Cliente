'use client';

import { BarChart3, DollarSign, Star, Users } from 'lucide-react';
import Resumen from '@/components/admin/medicion/Resumen';
import Satisfaccion from '@/components/admin/medicion/Satisfaccion';
import ServiciosPopulares from '@/components/admin/medicion/Servicios';
import Tendencias from '@/components/admin/medicion/Tendencias';
import { useDashboard } from '@/hooks/apiHooks';
import React, { useState } from 'react';

const TABS = [
	{ id: 'resumen', label: 'Resumen' },
	{ id: 'servicios', label: 'Servicios' },
	{ id: 'satisfaccion', label: 'Satisfacción' },
	{ id: 'tendencias', label: 'Tendencias' },
];

const SUMMARY_CARDS = (data: any) => [
	{
		label: 'Usuarios totales',
		value: data.summary.totalUsers.toLocaleString(),
		icon: <Users size={18} />,
		color: 'text-[#8a5e3c]',
		bg: 'bg-[#f5ede4]',
	},
	{
		label: 'Ingresos totales',
		value: `$${data.summary.totalRevenue.toLocaleString()}`,
		icon: <DollarSign size={18} />,
		color: 'text-[#8a5e3c]',
		bg: 'bg-[#f5ede4]',
	},
	{
		label: 'Ventas totales',
		value: data.summary.totalSales,
		icon: <BarChart3 size={18} />,
		color: 'text-[#8a5e3c]',
		bg: 'bg-[#f5ede4]',
	},
	{
		label: 'Servicios Top',
		value: data.topItems.services.length,
		icon: <Star size={18} />,
		color: 'text-[#8a5e3c]',
		bg: 'bg-[#f5ede4]',
	},
];

export default function Page() {
	const [tab, setTab] = useState('resumen');
	const { data, isLoading } = useDashboard({ limit: 5 });

	if (isLoading)
		return (
			<div className='flex items-center justify-center h-60 text-[#8a7060]'>
				Cargando métricas...
			</div>
		);
	if (!data)
		return (
			<div className='flex items-center justify-center h-60 text-red-400'>
				Error cargando dashboard
			</div>
		);

	return (
		<div className='min-h-screen bg-[#faf7f4]'>
			{/* Header */}
			<header className='px-8 pt-8 pb-6'>
				<h1 className='text-2xl font-bold tracking-wide text-[#3d2b1f] mb-6'>
					MEDICIÓN Y DESEMPEÑO
				</h1>

				{/* Summary cards */}
				<div className='grid grid-cols-4 gap-4'>
					{SUMMARY_CARDS(data).map((card) => (
						<div
							key={card.label}
							className='bg-white border border-[#e8ddd4] rounded-xl p-4 hover:border-[#c8a882] transition-colors'>
							<div className='flex items-center justify-between mb-3'>
								<span className='text-sm text-[#8a7060]'>{card.label}</span>
								<span className={`${card.bg} ${card.color} p-1.5 rounded-lg`}>
									{card.icon}
								</span>
							</div>
							<p className='text-2xl font-bold text-[#3d2b1f]'>{card.value}</p>
						</div>
					))}
				</div>
			</header>

			{/* Tab content */}
			<section className='px-8 pb-8'>
				{/* Tabs */}
				<div className='flex gap-1 bg-[#f0e8df] p-1 rounded-xl w-fit mb-6'>
					{TABS.map((t) => (
						<button
							key={t.id}
							onClick={() => setTab(t.id)}
							className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
								tab === t.id
									? 'bg-white text-[#8a5e3c] shadow-sm border border-[#e8ddd4]'
									: 'text-[#8a7060] hover:text-[#3d2b1f]'
							}`}>
							{t.label}
						</button>
					))}
				</div>

				{tab === 'resumen' && <Resumen />}
				{tab === 'servicios' && <ServiciosPopulares />}
				{tab === 'satisfaccion' && <Satisfaccion />}
				{tab === 'tendencias' && <Tendencias />}
			</section>
		</div>
	);
}