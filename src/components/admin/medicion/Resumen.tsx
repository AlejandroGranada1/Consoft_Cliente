'use client';
import React from 'react';

function Resumen() {
	// Datos para Usuarios Totales vs Registrados
	const usuariosData = [
		{
			mes: 'Enero 2024',
			total: 12847,
			registrados: 8234,
			porcentaje: '64.1%',
		},
		{
			mes: 'Diciembre 2023',
			total: 11234,
			registrados: 6789,
			porcentaje: '60.4%',
		},
		{
			mes: 'Noviembre 2023',
			total: 9876,
			registrados: 5432,
			porcentaje: '55.0%',
		},
	];

	// Datos para Métricas de Rendimiento
	const rendimientoData = [
		{
			mes: 'Enero 2024',
			pedidos: 156,
			calificacion: 4.8,
			conversion: '64.1%',
		},
		{
			mes: 'Diciembre 2023',
			pedidos: 134,
			calificacion: 4.6,
			conversion: '60.4%',
		},
		{
			mes: 'Noviembre 2023',
			pedidos: 128,
			calificacion: 4.5,
			conversion: '55.0%',
		},
	];

	return (
		<section className='grid grid-cols-2 gap-6 mt-6'>
			{/* Usuarios Totales vs Registrados */}
			<div className='border rounded-lg p-4 bg-white shadow'>
				<h2 className='font-semibold text-lg'>Usuarios totales vs Registrados</h2>
				<p className='text-sm text-gray-500 mb-4'>
					Comparación mensual de usuarios totales y registrados
				</p>

				<div className='space-y-4'>
					{usuariosData.map((item, idx) => (
						<div key={idx}>
							<p className='font-medium'>{item.mes}</p>
							<div className='flex justify-between text-sm text-gray-600'>
								<span>Total: {item.total.toLocaleString()}</span>
								<span className='font-medium bg-gray-100 px-2 rounded'>
									{item.porcentaje} registrados
								</span>
							</div>
							<meter
								min={0}
								max={item.total}
								value={item.registrados}
								className='w-full h-2 mt-1 [&::-webkit-meter-bar]:bg-gray-200 [&::-webkit-meter-optimum-value]:bg-black rounded'></meter>
							<p className='text-xs text-gray-500 mt-1'>
								Registrados: {item.registrados.toLocaleString()}
							</p>
						</div>
					))}
				</div>
			</div>

			{/* Métricas de Rendimiento */}
			<div className='border rounded-lg p-4 bg-white shadow'>
				<h2 className='font-semibold text-lg'>Métricas de Rendimiento</h2>
				<p className='text-sm text-gray-500 mb-4'>
					Indicadores clave de desempeño mensual
				</p>

				<div className='space-y-4'>
					{rendimientoData.map((item, idx) => (
						<div
							key={idx}
							className='flex items-center justify-between border rounded p-3'>
							<div>
								<p className='font-medium'>{item.mes}</p>
								<p className='text-sm text-gray-500'>
									{item.pedidos} pedidos completados
								</p>
							</div>
							<div className='text-right'>
								<p className='font-semibold'>⭐ {item.calificacion}</p>
								<p className='text-xs text-gray-500'>
									{item.conversion} conversión
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default Resumen;
