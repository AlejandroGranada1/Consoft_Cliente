'use client';

import ProductCard from '@/components/productos/ProductCard';
import { useGetProducts } from '@/hooks/apiHooks';
import { Category } from '@/lib/types';

export default function ProductsPage() {
	const { data: products, isLoading, refetch } = useGetProducts();

	if (isLoading) return <p>Cargando...</p>;

	// Agrupar productos por categoría
	const productsByCategory = products?.reduce((acc, product) => {
		const categoryName = (product.category as Category)?.name || 'Sin categoría';
		if (!acc[categoryName]) acc[categoryName] = [];
		acc[categoryName].push(product);
		return acc;
	}, {} as Record<string, typeof products>);

	return (
		<section className='bg-[#f9f9f9] min-h-screen py-10 px-6'>
			<div className='max-w-7xl mx-auto space-y-12'>

				{/* Secciones por categoría */}
				{productsByCategory &&
					Object.entries(productsByCategory).map(([categoryName, items]) => (
						<div key={categoryName} className='space-y-4'>

							{/* Título de categoría */}
							<h2 className='text-2xl font-semibold text-gray-800'>
								{categoryName}
							</h2>

							{/* Grid de productos */}
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
						</div>
					))}
			</div>
		</section>
	);
}
