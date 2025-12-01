'use client';
import { Product } from '@/app/types';
import ProductDetailsModal from '@/components/admin/compras/productos/ProductDetailsModal';
import CreateProductModal from '@/components/admin/compras/productos/CreateProductModal';
import EditProductModal from '@/components/admin/compras/productos/EditProductModal';
import { deleteElement } from '@/components/admin/global/alerts';
import api from '@/components/Global/axios';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaEye, FaSearch, FaTrash } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import PaginatedList from '@/components/Global/Pagination';

function Page() {
	const [createModal, setCreateModal] = useState(false);
	const [detailsModal, setDetailsModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [product, setProduct] = useState<Product>();

	const [products, setProducts] = useState<Product[]>([]);
	const [filterText, setFilterText] = useState('');

	// 📌 traer productos de la API
	const fetchProducts = async () => {
		try {
			const response = await api.get('/api/products');
			setProducts(response.data.products);
		} catch (err) {
			console.error('Error al traer productos', err);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	// 📌 Filtrar productos
	const filteredProducts = products.filter(
		(p) =>
			p.name.toLowerCase().includes(filterText.toLowerCase()) ||
			p.description?.toLowerCase().includes(filterText.toLowerCase())
	);

	return (
		<div className='px-4 md:px-20'>
			<header className='flex flex-col gap-4 md:h-40 justify-around'>
				<h1 className='text-xl md:text-2xl text-brown text-center md:text-left'>
					GESTIÓN DE PRODUCTOS
				</h1>

				{/* acciones */}
				<div className='flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center'>
					<div className='relative w-full md:w-64'>
						<FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />

						<datalist id='products'>
							{products.map((p) => (
								<option
									key={p._id}
									value={p.name}></option>
							))}
						</datalist>

						<input
							type='text'
							list='products'
							placeholder='Buscar Producto'
							value={filterText}
							onChange={(e) => setFilterText(e.target.value)}
							className='pl-10 pr-4 py-2 border border-brown rounded-lg w-full text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-brown'
						/>
					</div>

					<button
						onClick={() => setCreateModal(true)}
						className='flex items-center justify-center py-2 px-6 md:px-10 border border-brown rounded-lg cursor-pointer text-brown w-full md:w-fit'>
						<IoMdAdd
							size={25}
							className='mr-2'
						/>{' '}
						Agregar Nuevo Producto
					</button>
				</div>
			</header>

			<section className='w-full mx-auto mt-6 flex flex-col justify-between border-t border-gray'>
				{/* encabezado tabla - solo en desktop */}
				<div className='hidden md:grid grid-cols-5 place-items-center py-6 font-semibold'>
					<p>Producto</p>
					<p>Categoría</p>
					<p>Descripción</p>
					<p>Estado</p>
					<p>Acciones</p>
				</div>

				{/* listado con paginación */}
				<PaginatedList
					data={filteredProducts}
					itemsPerPage={5}>
					{(p: Product) => (
						<div
							key={p._id}
							className='grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-0 place-items-center py-3 border-brown/40 md:border-b md:border-brown/10 rounded-lg p-4 md:py-2'>
							{/* 📱 Vista mobile */}
							<div className='w-full md:hidden text-center space-y-2 border-b pb-4'>
								<p>
									<span className='font-semibold'>Producto:</span> {p.name}
								</p>
								<p>
									<span className='font-semibold'>Categoría:</span>{' '}
									{p.category?.name}
								</p>
								<p>
									<span className='font-semibold'>Descripción:</span>{' '}
									{p.description}
								</p>
								<p>
									<span className='font-semibold'>Estado:</span>{' '}
									<span className={p.status ? 'text-green-500' : 'text-red-500'}>
										{p.status ? 'Activo' : 'Inactivo'}
									</span>
								</p>
								<div className='flex gap-4 mt-2 justify-center'>
									{/* 👁️ acciones */}
									<FaEye
										size={20}
										color='#d9b13b'
										onClick={() => {
											setDetailsModal(true);
											setProduct(p);
										}}
										cursor='pointer'
									/>
									<FaEdit
										size={20}
										color='#7588f0'
										onClick={() => {
											setEditModal(true);
											setProduct(p);
										}}
										cursor='pointer'
									/>
									<FaTrash
										size={19}
										color='#fa4334'
										onClick={() =>
											deleteElement(
												'Producto',
												`/api/products/${p._id}`,
												() => fetchProducts()
											)
										}
										cursor='pointer'
									/>
								</div>
							</div>

							{/* 💻 Vista desktop */}
							<p className='hidden md:block'>{p.name}</p>
							<p className='hidden md:block'>{p.category?.name}</p>
							<p className='hidden md:block truncate w-40 text-center'>{p.description}</p>
							<p
								className={`hidden md:block ${
									p.status ? 'text-green-500' : 'text-red-500'
								}`}>
								{p.status ? 'Activo' : 'Inactivo'}
							</p>
							<div className='hidden md:flex justify-evenly place-items-center w-full'>
								{/* 👁️ acciones */}
								<div className='flex gap-4 mt-2 justify-center'>
									<FaEye
										size={20}
										color='#d9b13b'
										onClick={() => {
											setDetailsModal(true);
											setProduct(p);
										}}
										cursor='pointer'
									/>
									<FaEdit
										size={20}
										color='#7588f0'
										onClick={() => {
											setEditModal(true);
											setProduct(p);
										}}
										cursor='pointer'
									/>
									<FaTrash
										size={19}
										color='#fa4334'
										onClick={() =>
											deleteElement(
												'Producto',
												`/api/products/${p._id}`,
												() => fetchProducts()
											)
										}
										cursor='pointer'
									/>
								</div>
							</div>
						</div>
					)}
				</PaginatedList>
			</section>

			{/* modales */}
			<CreateProductModal
				isOpen={createModal}
				onClose={() => setCreateModal(false)}
				updateList={() => fetchProducts()}
			/>
			<ProductDetailsModal
				isOpen={detailsModal}
				onClose={() => setDetailsModal(false)}
				extraProps={product}
			/>
			<EditProductModal
				isOpen={editModal}
				onClose={() => setEditModal(false)}
				extraProps={product}
				updateList={() => fetchProducts()}
			/>
		</div>
	);
}

export default Page;
