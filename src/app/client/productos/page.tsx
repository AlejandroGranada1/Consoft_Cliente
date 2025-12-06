'use client';

import ProductCard from '@/components/productos/ProductCard';
import { useGetProducts } from '@/hooks/apiHooks';

export default function ProductsPage() {
	const { data: products, isLoading } = useGetProducts();
	console.log(products);
	return (
		<section className='bg-[#f9f9f9] min-h-screen py-10 px-6'>
			<div className='grid grid-cols-1 gap-8 max-w-7xl mx-auto'>
				{/* Sidebar */}

				{/* Grid de productos */}
				<div className='grid grid-cols-5 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full'>
					{products?.map((product) => (
						<ProductCard
							key={product._id}
							id={product._id!}
							name={product.name}
							image={product.imageUrl && product.imageUrl.trim() !== "" ? product.imageUrl : '/def_prod.png'}
						/>
					))}
				</div>
			</div>
		</section>
	);
}