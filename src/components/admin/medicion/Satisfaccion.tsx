'use client';

import { Star, MessageSquare, User, Calendar } from 'lucide-react';
import React from 'react';
import { useGetAllReviews } from '@/hooks/apiHooks';

function Satisfaccion() {
	const { data: reviews, isLoading } = useGetAllReviews();

	if (isLoading) {
		return (
			<div className='flex items-center justify-center p-12'>
				<div className='animate-spin rounded-full h-8 w-8 border-2 border-[#C8A882] border-t-transparent' />
			</div>
		);
	}
	console.log(reviews);
	const allReviews = reviews || [];
	const totalResenas = allReviews.length;

	// Calcular promedio y distribución
	const distributionMap: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
	let sum = 0;

	allReviews.forEach((r: any) => {
		const rating = Math.round(r.rating) || 5;
		distributionMap[rating as keyof typeof distributionMap] = (distributionMap[rating as keyof typeof distributionMap] || 0) + 1;
		sum += rating;
	});

	const promedio = totalResenas > 0 ? (sum / totalResenas).toFixed(1) : '0';
	const distribucion = [5, 4, 3, 2, 1].map(stars => ({
		estrellas: stars,
		cantidad: distributionMap[stars],
		porcentaje: totalResenas > 0 ? Math.round((distributionMap[stars] / totalResenas) * 100) : 0
	}));

	return (
		<div className='space-y-6'>
			<section className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Distribución de calificaciones */}
				<div className='rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm'>
					<h2 className='text-lg font-medium text-white mb-1'>Distribución de Calificaciones</h2>
					<p className='text-sm text-white/40 mb-6'>
						Análisis de las {totalResenas} valoraciones recibidas
					</p>

					<div className='space-y-4'>
						{distribucion.map((d) => (
							<div
								key={d.estrellas}
								className='flex items-center gap-4'>
								{/* Estrellas */}
								<div className='flex items-center gap-1 w-24 shrink-0'>
									<span className='text-sm font-medium text-white/60 w-4'>{d.estrellas}</span>
									<Star size={14} className='text-yellow-400 fill-yellow-400' />
									<span className='text-[11px] text-white/30 ml-auto'>({d.cantidad})</span>
								</div>

								{/* Barra */}
								<div className='flex-1 h-2 bg-white/5 rounded-full overflow-hidden'>
									<div
										className='h-full bg-[#C8A882] transition-all duration-500'
										style={{ width: `${d.porcentaje}%` }}
									/>
								</div>

								<span className='text-xs font-medium text-white/40 w-8 text-right'>{d.porcentaje}%</span>
							</div>
						))}
					</div>
				</div>

				{/* Resumen de satisfacción */}
				<div className='rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm flex flex-col items-center justify-center text-center'>
					<h2 className='text-lg font-medium text-white mb-1'>Puntuación General</h2>
					<p className='text-sm text-white/40 mb-6'>Promedio histórico de satisfacción</p>

					<div className='space-y-2'>
						<p className='text-6xl font-serif font-bold text-white'>{promedio}</p>
						<div className='flex justify-center gap-1'>
							{[1, 2, 3, 4, 5].map((_, i) => (
								<Star
									key={i}
									size={20}
									className={
										i < Math.round(Number(promedio)) ? 'text-yellow-400 fill-yellow-400' : 'text-white/10'
									}
								/>
							))}
						</div>
						<p className='text-xs uppercase tracking-[.1em] text-[#C8A882] font-medium pt-2'>
							Satisfacción del Cliente
						</p>
					</div>
				</div>
			</section>

			{/* Listado de Reseñas */}
			<section className='rounded-2xl border border-white/10 bg-white/5 overflow-hidden'>
				<div className='px-6 py-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<MessageSquare size={16} className='text-[#C8A882]' />
						<h3 className='text-sm font-medium text-white uppercase tracking-wider'>Comentarios Recientes</h3>
					</div>
					<span className='text-[10px] bg-white/10 text-white/60 px-2.5 py-1 rounded-full uppercase font-medium'>
						{allReviews.length} Reseñas totales
					</span>
				</div>

				<div className='divide-y divide-white/5'>
					{allReviews.length > 0 ? (
						allReviews.map((r: any, idx: number) => (
							<div key={r._id || idx} className='p-6 hover:bg-white/[0.02] transition-colors'>
								<div className='flex flex-col md:flex-row md:items-start justify-between gap-4'>
									<div className='space-y-3 flex-1'>
										<div className='flex items-center gap-2'>
											<div className='flex gap-0.5'>
												{[1, 2, 3, 4, 5].map(s => (
													<Star key={s} size={12} className={s <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/10'} />
												))}
											</div>
											<span className='w-1 h-1 rounded-full bg-white/20' />
											<span className='text-[11px] text-white/40 uppercase tracking-tight'>Pedido #{r.order?.slice(-6).toUpperCase() || 'N/A'}</span>
										</div>
										<p className='text-sm text-white/80 leading-relaxed italic'>
											"{r.comment || 'Sin comentarios adicionales.'}"
										</p>
									</div>

									<div className='flex items-center gap-3 shrink-0'>
										<div className='text-right hidden sm:block'>
											<p className='text-sm font-medium text-white/90'>{r.user?.name || 'Usuario'}</p>
											<div className='flex items-center justify-end gap-1.5 text-[10px] text-white/30 uppercase tracking-widest'>
												<Calendar size={10} />
												{new Date(r.createdAt).toLocaleDateString()}
											</div>
										</div>
										<div className='h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C8A882]'>
											<User size={18} />
										</div>
									</div>
								</div>
							</div>
						))
					) : (
						<div className='p-12 text-center text-white/30 text-sm'>
							No se han registrado reseñas todavía.
						</div>
					)}
				</div>
			</section>
		</div>
	);
}

export default Satisfaccion;
