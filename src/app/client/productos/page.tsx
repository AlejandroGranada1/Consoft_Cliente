'use client';

import ProductCard from '@/components/productos/ProductCard';
import { useGetProducts } from '@/hooks/apiHooks';
import { Category } from '@/lib/types';
import { Plus, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
	const router = useRouter();
	const { data: products, isLoading, refetch } = useGetProducts();

	if (isLoading) return <p className='p-10'>Cargando...</p>;

	const productsByCategory = products?.reduce(
		(acc, product) => {
			const categoryName = (product.category as Category)?.name || 'Sin categoría';
			if (!acc[categoryName]) acc[categoryName] = [];
			acc[categoryName].push(product);
			return acc;
		},
		{} as Record<string, typeof products>,
	);

	return (
		<section className='bg-[#FAF5EE] min-h-screen py-14 px-6'>
			<div className='max-w-7xl mx-auto space-y-16'>
				{/* HEADER */}
				<header className='max-w-xl space-y-4'>
					<span className='text-[11px] tracking-[0.22em] uppercase text-[#C8973A] font-medium'>
						Colección 2025
					</span>

					<h1 className='font-serif text-4xl md:text-5xl font-light leading-tight text-[#2C2420]'>
						Piezas <em className='italic text-[#A0522D]'>artesanales</em>
						<br /> para tu hogar
					</h1>

					<p className='text-sm text-[#9A8F87] leading-relaxed'>
						Cada mueble es fabricado a mano con maderas seleccionadas. Elige el que
						mejor se adapte a tu espacio.
					</p>
				</header>

				<div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2C2420] via-[#5C3317] to-[#8B5A2B] p-8 md:p-12 shadow-xl'>
					{/* Decorative elements */}
					<div className='absolute top-0 right-0 w-64 h-64 bg-[#C8973A]/10 rounded-full blur-3xl' />
					<div className='absolute bottom-0 left-0 w-48 h-48 bg-[#FAF5EE]/5 rounded-full blur-2xl' />

					<div className='relative z-10 flex flex-col md:flex-row items-center justify-between gap-6'>
						<div className='flex-1 space-y-4 text-center md:text-left'>
							<div className='inline-flex items-center gap-2 px-4 py-2 bg-[#C8973A]/20 rounded-full'>
								<Sparkles
									size={16}
									className='text-[#C8973A]'
								/>
								<span className='text-xs uppercase tracking-wider text-[#FAF5EE] font-medium'>
									Diseño a medida
								</span>
							</div>

							<h2 className='font-serif text-3xl md:text-4xl font-light text-[#FAF5EE]'>
								¿No encuentras lo que buscas?
							</h2>

							<p className='text-sm text-[#D9CFCA] leading-relaxed max-w-xl'>
								Creamos muebles personalizados según tus necesidades. Cuéntanos tu
								idea y la haremos realidad con la misma calidad artesanal.
							</p>
						</div>

						<button
							onClick={() => router.push('/client/productos/custom')}
							className='group px-8 py-4 bg-[#FAF5EE] hover:bg-white text-[#2C2420] cursor-pointer rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 whitespace-nowrap'>
							<Plus
								size={20}
								className='group-hover:rotate-90 transition-transform duration-300'
							/>
							Producto personalizado
						</button>
					</div>
				</div>

				{/* CATEGORÍAS */}
				{productsByCategory &&
					Object.entries(productsByCategory).map(([categoryName, items]) => (
						<section
							key={categoryName}
							className='space-y-6'>
							{/* Category heading */}
							<div className='flex items-center gap-4'>
								<h2 className='font-serif text-xl font-semibold text-[#2C2420] whitespace-nowrap'>
									{categoryName}
								</h2>

								<div className='flex-1 h-px bg-gradient-to-r from-[#D9CFCA] to-transparent' />

								<span className='text-[11px] uppercase tracking-wider text-[#9A8F87] font-medium'>
									{items.length} piezas
								</span>
							</div>

							{/* Grid */}
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
								{items.map((product) => (
									<ProductCard
										key={product._id}
										id={product._id!}
										name={product.name}
										refetch={refetch}
										image={
											product.imageUrl && product.imageUrl.trim() !== ''
												? product.imageUrl
												: '/def_prod.png'
										}
									/>
								))}
							</div>
						</section>
					))}
			</div>
		</section>
	);
}
