'use client';
import { Search, Plus } from 'lucide-react';
import { Product } from '@/lib/types';
import ProductDetailsModal from '@/components/admin/compras/productos/ProductDetailsModal';
import CreateProductModal from '@/components/admin/compras/productos/CreateProductModal';
import EditProductModal from '@/components/admin/compras/productos/EditProductModal';
import { deleteElement } from '@/components/admin/global/alerts';
import api from '@/components/Global/axios';
import React, { useEffect, useState } from 'react';
import ProductRow from '@/components/admin/compras/productos/ProductRow';
import Pagination from '@/components/Global/Pagination';

function Page() {
	const [createModal, setCreateModal] = useState(false);
	const [detailsModal, setDetailsModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [product, setProduct] = useState<Product>();

	const [products, setProducts] = useState<Product[]>([]);
	const [filterText, setFilterText] = useState('');
	const [loading, setLoading] = useState(true);

	// Estados para paginación
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

	// 📌 traer productos de la API
	const fetchProducts = async () => {
		try {
			setLoading(true);
			const response = await api.get('/api/products');
			setProducts(response.data.products);
		} catch (err) {
			console.error('Error al traer productos', err);
		} finally {
			setLoading(false);
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

	// Cálculos de paginación
	const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentProducts = filteredProducts.slice(startIndex, endIndex);

	// Resetear a página 1 cuando cambia el filtro
	useEffect(() => {
		setCurrentPage(1);
	}, [filterText]);

	// Función para eliminar producto
	const handleDeleteProduct = (productId: string) => {
		deleteElement('Producto', `/api/products/${productId}`, fetchProducts);
	};

	return (
		<div className='px-4 md:px-20'>
			<header className='flex flex-col gap-4 md:h-40 justify-around'>
				<h1 className='text-xl md:text-2xl text-brown text-center md:text-left'>
					GESTIÓN DE PRODUCTOS
				</h1>

				{/* acciones */}
				<div className='flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center'>
					<div className='relative w-full md:w-64'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
						<input
							type='text'
							placeholder='Buscar Producto'
							value={filterText}
							onChange={(e) => setFilterText(e.target.value)}
							className='pl-10 pr-4 py-2 border border-brown rounded-lg w-full text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-brown'
						/>
					</div>

					<button
						onClick={() => setCreateModal(true)}
						className='flex items-center justify-center py-2 px-6 md:px-10 border border-brown rounded-lg cursor-pointer text-brown w-full md:w-fit'>
						<Plus
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
				{loading ? (
					<div className='text-center py-8'>Cargando productos...</div>
				) : currentProducts.length > 0 ? (
					currentProducts.map((prod) => (
						<ProductRow
							key={prod._id}
							product={prod}
							onView={() => {
								setDetailsModal(true);
								setProduct(prod);
							}}
							onEdit={() => {
								setEditModal(true);
								setProduct(prod);
							}}
							onDelete={() => {}}
						/>
					))
				) : (
					<div className='text-center py-8 text-gray-500'>
						No se encontraron productos
					</div>
				)}

				{/* Paginación */}
				{totalPages > 1 && (
					<Pagination
						count={totalPages}
						page={currentPage}
						onChange={(_, newPage) => setCurrentPage(newPage)}
						className='mt-6'
					/>
				)}
			</section>

			{/* modales */}
			<CreateProductModal
				isOpen={createModal}
				onClose={() => setCreateModal(false)}
				updateList={fetchProducts}
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
				updateList={fetchProducts}
			/>
		</div>
	);
}

export default Page;
