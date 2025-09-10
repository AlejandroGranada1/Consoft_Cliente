'use client';
import { Product } from '@/app/types';
import ProductDetailsModal from '@/components/admin/compras/productos/ProductDetailsModal';
import CreateProductModal from '@/components/admin/compras/productos/CreateProductModal';
import Pagination from '@mui/material/Pagination';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';

function page() {
	const [products, setProducts] = useState<Product[]>([
		{
			id: '1',
			name: 'Silla Reclinable',
			description: 'Silla ergonómica de oficina',
			category: {
				id: 'c1',
				name: 'Sillas',
				description: 'Sillas de oficina',
				products: [],
				status: true,
			},
			status: true,
			imageUrl: '',
		},
	]);

	const [createModal, setCreateModal] = useState(false);
	const [detailsModal, setDetailsModal] = useState(false);
	const [product, setProduct] = useState<Product>();

	return (
		<div>
			<header className='flex flex-col h-60 justify-around px-20'>
				<h1 className='text-2xl text-brown'>GESTIÓN DE PRODUCTOS</h1>

				{/* actions */}
				<div className='flex justify-between items-center'>
					<div className='relative w-64'>
						<FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
						<input
							type='text'
							placeholder='Buscar Producto'
							className='pl-10 pr-4 py-2 border border-brown rounded-lg w-full text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-brown'
						/>
					</div>

					<button
						onClick={() => setCreateModal(true)}
						className='flex items-center py-2 w-fit px-10 border border-brown rounded-lg cursor-pointer text-brown'>
						<IoMdAdd size={25} /> Agregar Producto
					</button>
				</div>
			</header>

			<section className='w-8/9 mx-auto h-[420px] flex flex-col justify-between border-t border-gray'>
				<div>
					<div className='grid grid-cols-4 place-items-center py-6'>
						<p>Producto</p>
						<p>Categoría</p>
						<p>Descripción</p>
						<p>Estado</p>
					</div>

					<div className='mx-auto border-t border-brown pt-5 flex flex-col gap-4'>
						{products.map((product) => (
							<div
								onClick={() => {
									setDetailsModal(true);
									setProduct(product);
								}}
								key={product.id}
								className='grid grid-cols-4 place-items-center py-3 border border-brown rounded-lg cursor-pointer'>
								<p>{product.name}</p>
								<p>{product.category.name}</p>
								<p>{product.description}</p>
								<p
									className={`${
										product.status
											? 'bg-green/30 text-green'
											: 'bg-red/30 text-red'
									} px-2 py-1 rounded-xl`}>
									{product.status ? 'Activo' : 'Inactivo'}
								</p>
							</div>
						))}
					</div>
				</div>

				<div className='w-full flex justify-center mt-5'>
					<Pagination count={Math.ceil(products.length / 10)} />
				</div>
			</section>

			{/* Modales */}
			<CreateProductModal
				isOpen={createModal}
				onClose={() => setCreateModal(false)}
			/>
			<ProductDetailsModal
				isOpen={detailsModal}
				onClose={() => setDetailsModal(false)}
				extraProps={product}
			/>
		</div>
	);
}

export default page;
