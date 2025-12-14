'use client';
import { Search, Plus } from 'lucide-react';
import { Category } from '@/lib/types';
import CategoryDetailsModal from '@/components/admin/compras/categorias/CategoryDetailsModal';
import CreateCategoryModal from '@/components/admin/compras/categorias/CreateCategoryModal';
import EditCategoryModal from '@/components/admin/compras/categorias/EditCategoryModal';
import { deleteElement } from '@/components/admin/global/alerts';
import api from '@/components/Global/axios';
import React, { useEffect, useState } from 'react';
import CategoryRow from '@/components/admin/compras/categorias/CategoryRow';
import Pagination from '@/components/Global/Pagination';

function Page() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [createModal, setCreateModal] = useState(false);
	const [detailsModal, setDetailsModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [category, setCategory] = useState<Category>();
	const [filter, setFilter] = useState('');

	// Estados para paginación
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	// === API CALLS ===
	const fetchCategories = async () => {
		try {
			setLoading(true);
			const response = await api.get('/api/categories');
			setCategories(response.data.categories);
		} catch (error) {
			console.error('Error al obtener categorías', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	// === FILTRADO + PAGINACIÓN ===
	const filteredCategories = categories.filter(
		(c) =>
			c.name.toLowerCase().includes(filter.toLowerCase()) ||
			c.description?.toLowerCase().includes(filter.toLowerCase())
	);

	const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentCategories = filteredCategories.slice(startIndex, endIndex);

	// Resetear a página 1 cuando cambia el filtro
	useEffect(() => {
		setCurrentPage(1);
	}, [filter]);

	// Función para eliminar categoría
	const handleDeleteCategory = (categoryId: string) => {
		deleteElement('Categoría', `/api/categories/${categoryId}`, fetchCategories);
	};

	return (
		<div className='px-4 md:px-20'>
			<header className='flex flex-col gap-6 py-6'>
				<h1 className='text-2xl text-brown text-center md:text-left'>
					GESTIÓN DE CATEGORÍAS
				</h1>

				{/* actions */}
				<div className='flex flex-col md:flex-row gap-4 justify-between items-center'>
					<div className='relative w-full md:w-64'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
						<input
							type='text'
							placeholder='Buscar Categoría'
							value={filter}
							onChange={(e) => setFilter(e.target.value)}
							className='pl-10 pr-4 py-2 border border-brown rounded-lg w-full text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-brown'
						/>
					</div>

					<button
						onClick={() => setCreateModal(true)}
						className='flex items-center py-2 w-full md:w-fit justify-center px-6 border border-brown rounded-lg cursor-pointer text-brown'>
						<Plus size={22} /> <span className='ml-2'>Agregar Categoría</span>
					</button>
				</div>
			</header>

			<section className='w-full mx-auto flex flex-col justify-between border-t border-gray'>
				{/* Encabezado desktop */}
				<div className='hidden md:grid grid-cols-4 place-items-center py-6 font-semibold'>
					<p>Categoría</p>
					<p>Descripción</p>
					<p>Productos</p>
					<p>Acciones</p>
				</div>

				{/* Listado con paginación */}
				{loading ? (
					<div className='text-center py-8'>Cargando categorías...</div>
				) : currentCategories.length > 0 ? (
					currentCategories.map((cat) => (
						<CategoryRow
							key={cat._id}
							category={cat}
							onView={() => {
								setDetailsModal(true);
								setCategory(cat);
							}}
							onEdit={() => {
								setEditModal(true);
								setCategory(cat);
							}}
							onDelete={() => {}}
						/>
					))
				) : (
					<div className='text-center py-8 text-gray-500'>
						No se encontraron categorías
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

			{/* Modales */}
			<CreateCategoryModal
				isOpen={createModal}
				onClose={() => setCreateModal(false)}
				updateList={fetchCategories}
			/>
			<CategoryDetailsModal
				isOpen={detailsModal}
				onClose={() => setDetailsModal(false)}
				extraProps={category}
				updateList={fetchCategories}
			/>
			<EditCategoryModal
				isOpen={editModal}
				onClose={() => setEditModal(false)}
				extraProps={category}
				updateList={fetchCategories}
			/>
		</div>
	);
}

export default Page;
