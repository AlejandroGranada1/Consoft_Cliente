'use client';

import { Button } from '@/components/ui/button';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ServiceCard from '@/components/servicios/ServiceCard';
import { Service } from '@/lib/types';
import { useGetServices } from '@/hooks/apiHooks';
import { useEffect, useRef, useState } from 'react';

const AUTO_DELAY = 3000;

function useVisibleCount() {
	const [visible, setVisible] = useState(4);
	useEffect(() => {
		const update = () => {
			if (window.innerWidth < 640) setVisible(1);
			else if (window.innerWidth < 1024) setVisible(2);
			else setVisible(4);
		};
		update();
		window.addEventListener('resize', update);
		return () => window.removeEventListener('resize', update);
	}, []);
	return visible;
}

export default function ServiciosPage() {
	const { data, isLoading } = useGetServices();
	const services: Service[] = data?.data ?? [];

	console.log(services)

	const VISIBLE = useVisibleCount();
	const total = services.length;
	const needsCarousel = total > VISIBLE;
	const maxIndex = Math.max(0, total - VISIBLE);

	const [current, setCurrent] = useState(0);
	const [autoPlay, setAutoPlay] = useState(true);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	// Resetear si cambia el tamaño y current queda fuera de rango
	useEffect(() => {
		setCurrent((c) => Math.min(c, maxIndex));
	}, [maxIndex]);

	const goTo = (index: number) => setCurrent(Math.min(Math.max(index, 0), maxIndex));
	const prev = () => {
		setAutoPlay(false);
		goTo(current === 0 ? maxIndex : current - 1);
	};
	const next = () => {
		setAutoPlay(false);
		goTo(current === maxIndex ? 0 : current + 1);
	};

	useEffect(() => {
		if (!autoPlay || !needsCarousel) return;
		timerRef.current = setInterval(() => {
			setCurrent((c) => (c >= maxIndex ? 0 : c + 1));
		}, AUTO_DELAY);
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [autoPlay, needsCarousel, maxIndex]);

	if (isLoading) return <p className='text-center py-20'>Cargando servicios...</p>;

	const cardWidthPct = 100 / VISIBLE;

	const translateX = current * (100 / VISIBLE); 

	return (
		<section className='px-6 py-12 bg-[#fff9f4]'>
			<div className='max-w-6xl mx-auto'>
				<h1 className='text-3xl font-bold text-center text-[#4b2e1a] mb-10'>Servicios</h1>

				<div className='relative mb-20'>
					{/* Flecha izquierda */}
					{needsCarousel && (
						<button
							onClick={prev}
							className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10
								bg-white border border-[#d9c4b0] shadow-md rounded-full p-2
								hover:bg-[#4b2e1a] hover:text-white transition'>
							<ChevronLeft size={20} />
						</button>
					)}

					{/* Ventana */}
					<div className='overflow-hidden mx-2'>
						<div
							className='flex transition-transform duration-500 ease-in-out'
							style={{
								// Cada tarjeta ocupa exactamente 1/VISIBLE del contenedor
								// El track mide total/VISIBLE * 100% del contenedor
								width: `${(total / VISIBLE) * 100}%`,
								transform: `translateX(-${(current / total) * 100}%)`,
							}}>
							{services.map((service) => (
								<div
									key={service._id}
									className='px-3 box-border'
									style={{ width: `${100 / total}%` }}>
									<ServiceCard
										description={service.description!}
										image={service.imageUrl!}
										title={service.name}
									/>
								</div>
							))}
						</div>
					</div>

					{/* Flecha derecha */}
					{needsCarousel && (
						<button
							onClick={next}
							className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10
								bg-white border border-[#d9c4b0] shadow-md rounded-full p-2
								hover:bg-[#4b2e1a] hover:text-white transition'>
							<ChevronRight size={20} />
						</button>
					)}

					{/* Dots + autoplay */}
					{needsCarousel && (
						<div className='flex flex-col items-center gap-3 mt-6'>
							<div className='flex gap-2'>
								{Array.from({ length: maxIndex + 1 }).map((_, i) => (
									<button
										key={i}
										onClick={() => {
											setAutoPlay(false);
											goTo(i);
										}}
										className={`h-2 rounded-full transition-all duration-300 ${
											i === current ? 'w-4 bg-[#4b2e1a]' : 'w-2 bg-[#d9c4b0]'
										}`}
									/>
								))}
							</div>
						</div>
					)}
				</div>

				{/* --- Sección 2: Servicio destacado --- */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-20'>
					<div className='relative'>
						<img
							src='/imagen2.png'
							alt='Fabricación a tu gusto'
							className='w-full h-80 object-cover rounded-xl shadow-md'
						/>
						<div className='absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 flex items-center space-x-2'>
							<img
								src='/mini.png'
								alt='mini'
								className='w-12 h-12 rounded-md object-cover'
							/>
							<div className='flex text-yellow-500'>
								<Star className='w-4 h-4 fill-current' />
								<Star className='w-4 h-4 fill-current' />
								<Star className='w-4 h-4 fill-current' />
								<Star className='w-4 h-4 fill-current' />
								<Star className='w-4 h-4' />
							</div>
						</div>
					</div>

					<div>
						<h2 className='text-3xl font-bold text-[#4b2e1a] mb-6 text-center'>
							Fabricación a tu gusto
						</h2>
						<ul className='space-y-3 text-gray-700 text-center'>
							<li>✨ Diseño 100% personalizado</li>
							<li>🪵 Selección de materiales</li>
							<li>👁️ Asesoría y visualización previa</li>
						</ul>
						<Link href='/agendarcita'>
							<Button className='mt-6 bg-[#4b2e1a] hover:bg-[#3a2314] text-white px-6 py-3 rounded-full text-lg shadow-md ml-50'>
								Agenda tu Cita
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
