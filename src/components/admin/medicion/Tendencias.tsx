'use client';
import { FaUserPlus, FaChartLine, FaStar, FaChartBar } from 'react-icons/fa';

export default function GrowthTrends() {
	const metrics = [
		{
			id: 1,
			name: 'Usuarios Registrados',
			value: 56,
			icon: <FaUserPlus className='text-green-500 text-lg' />,
			classes: 'border-green-200 bg-green-50',
			color: 'green',
		},
		{
			id: 2,
			name: 'Tasa de Conversión',
			value: 25,
			icon: <FaChartLine className='text-blue-500 text-lg' />,
			classes: 'border-blue-200 bg-blue-50',
			color: 'blue',
		},
		{
			id: 3,
			name: 'Satisfacción',
			value: 6.8,
			icon: <FaStar className='text-yellow-500 text-lg' />,
			classes: 'border-yellow-200 bg-yellow-50',
			color: 'yellow',
		},
		{
			id: 4,
			name: 'Usuarios Activos',
			value: 23,
			icon: <FaChartBar className='text-purple-500 text-lg' />,
			classes: 'border-purple-200 bg-purple-50',
			color: 'purple',
		},
	];

	return (
		<div className='bg-white rounded-xl shadow p-6'>
			<h2 className='text-lg font-semibold mb-1'>Tendencias de Crecimiento</h2>
			<p className='text-sm text-gray-500 mb-4'>
				Evolución de métricas clave en los últimos meses
			</p>

			<div className='space-y-3'>
				{metrics.map((metric) => (
					<div
						key={metric.id}
						className={`flex items-center justify-between border rounded-xl p-2 px-3 ${metric.classes}`}>
						<div className='flex items-center gap-2'>
							{metric.icon}
							<span className='text-sm font-medium'>{metric.name}</span>
						</div>

						<div className='flex items-center gap-3 w-1/3'>
							<meter
								min={0}
								max={100}
								value={metric.value}
								className={`w-full h-3 meter-${metric.color}`}></meter>
							<span className='text-sm font-semibold text-gray-700'>
								+{metric.value}%
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
