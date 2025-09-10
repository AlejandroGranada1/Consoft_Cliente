'use client';
import { Category } from '@/app/types';
import CategoryDetailsModal from '@/components/admin/compras/categorias/CategoryDetailsModal';
import CreateCategoryModal from '@/components/admin/compras/categorias/CreateCategoryModal';
import Pagination from '@mui/material/Pagination';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';

function page() {
	const [categories, setCategories] = useState<Category[]>([
		{
			id: '',
			name: 'Sillas',
			description: 'Sillas reclinables',
			products: [],
			status: true,
		},
	]);
	const [createModal, setCreateModal] = useState(false);
	const [detailsModal, setDetailsModal] = useState(false);
	const [category, setCategory] = useState<Category>();
	return (
		<div>
			<header className='flex flex-col h-60 justify-around px-20'>
				<h1 className='text-2xl  text-brown'>GESTION DE CATEGORIAS</h1>
				{/* actions */}
				<div className='flex justify-between items-center'>
					<div className='relative w-64'>
						{/* Icono */}
						<FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />

						{/* Input */}
						<input
							type='text'
							placeholder='Buscar Categoría'
							className='pl-10 pr-4 py-2 border border-brown rounded-lg w-full text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-brown'
						/>
					</div>

					<button
						onClick={() => setCreateModal(true)}
						className='flex items-center py-2 w-fit px-10 border border-brown rounded-lg cursor-pointer text-brown'>
						<IoMdAdd size={25} /> Agregar Categoría
					</button>
				</div>
			</header>

			<section className='w-8/9 mx-auto h-[420px] flex flex-col justify-between border-t border-gray'>
				{/* Encabezado de la tabla */}
				<div>
					<div className='grid grid-cols-4 place-items-center py-6'>
						<p>Categoría</p>
						<p>Descripción</p>
						<p>Productos</p>
						<p>Estado</p>
					</div>

					{/* Lista de roles */}
					<div className='mx-auto border-t border-brown pt-5 flex flex-col gap-4'>
						{categories.map((category) => (
							<div
								onClick={() => {
									setDetailsModal(true);
									setCategory(category);
								}}
								key={category.id}
								className='grid grid-cols-4 place-items-center py-3 border border-brown rounded-lg cursor-pointer'>
								<p>{category.name}</p>
								<p>{category.description}</p>
								<p>{category.products.length}</p>
								<p
									className={`${
										category.status
											? 'bg-green/30 text-green'
											: 'bg-red/30 text-red'
									} px-2 py-1 rounded-xl`}>
									{category.status ? 'Activo' : 'Inactivo'}
								</p>
							</div>
						))}
					</div>
				</div>

				{/* Paginación al fondo */}
				<div className='w-full flex justify-center mt-5'>
					<Pagination count={Math.ceil(categories.length / 10)} />
				</div>
			</section>
			<CreateCategoryModal
				isOpen={createModal}
				onClose={() => setCreateModal(false)}
			/>

			<CategoryDetailsModal
				isOpen={detailsModal}
				onClose={() => setDetailsModal(false)}
				extraProps={category}
			/>
		</div>
	);
}

export default page;
