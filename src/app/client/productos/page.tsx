'use client';

import ProductCard from '@/components/productos/ProductCard';
import { useGetProducts } from '@/hooks/apiHooks';
import { Category } from '@/lib/types';

export default function ProductsPage() {
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
