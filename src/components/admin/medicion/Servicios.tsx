'use client';
import React from 'react';

function ServiciosPopulares() {
	const servicios = [
		{ id: 1, nombre: 'Reparación', solicitudes: 1247, ingresos: 45230, porcentaje: 35 },
		{ id: 2, nombre: 'Tapicería', solicitudes: 1247, ingresos: 45230, porcentaje: 25 },
		{ id: 3, nombre: 'Fabricación', solicitudes: 1247, ingresos: 45230, porcentaje: 18 },
	];

	return (
		<section className='p-4 border rounded-xl shadow-sm mt-6'>
			<h2 className='text-lg font-semibold'>Servicios más solicitados</h2>
			<p className='text-sm text-gray-600 mb-4'>
				Ranking de servicios por número de solicitudes e ingresos generados
			</p>

			<div className='space-y-3'>
				{servicios.map((s) => (
					<div
						key={s.id}
						className='flex items-center justify-between border rounded-lg p-3'>
						{/* Número ranking */}
						<div className='flex items-center space-x-3'>
							<span className='px-3 py-1 bg-gray-100 rounded-full border text-sm font-semibold'>
								#{s.id}
							</span>
							<div>
								<p className='font-medium'>{s.nombre}</p>
								<p className='text-xs text-gray-500'>
									{s.solicitudes.toLocaleString()} solicitudes • $
									{s.ingresos.toLocaleString()} ingresos
								</p>
							</div>
						</div>

						{/* Barra con porcentaje */}
						<div className='flex items-center space-x-2 w-1/3'>
							<meter
								min={0}
								max={100}
								value={s.porcentaje}
								className='w-full'></meter>
							<span className='text-sm'>{s.porcentaje}%</span>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export default ServiciosPopulares;
