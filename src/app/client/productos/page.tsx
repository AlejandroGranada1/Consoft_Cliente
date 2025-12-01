'use client';

import ProductCard from '@/components/productos/ProductCard';
import SidebarFilters from '@/components/productos/SideBarFiltrer';
import { useGetProducts } from '@/hooks/apiHooks';

export default function ProductsPage() {
	const { data: products, isLoading } = useGetProducts();
	console.log(products);
	return (
		<section className='bg-[#f9f9f9] min-h-screen py-10 px-6'>
			<div className='grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 max-w-7xl mx-auto'>
				{/* Sidebar */}
				<SidebarFilters />

				{/* Grid de productos */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
					{products?.map((product) => (
						<ProductCard
							key={product._id}
							id={product._id!}
							name={product.name}
							image={product.imageUrl!}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
