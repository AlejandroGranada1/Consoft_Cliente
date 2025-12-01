'use client';
import { Role } from '@/app/types';
import CreateRoleModal from '@/components/admin/configuracion/CreateRoleModal';
import EditRoleModal from '@/components/admin/configuracion/EditRoleModal';
import RoleDetailsModal from '@/components/admin/configuracion/RoleDetailsModal';
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
	const [role, setRole] = useState<Role>();

	const [roles, setRoles] = useState<Role[]>([]);
	const [filterText, setFilterText] = useState('');

	const fetchRoles = async () => {
		const response = await api.get('/api/roles');
		setRoles(response.data.roles);
	};

	useEffect(() => {
		fetchRoles();
	}, []);

	// 📌 Filtro
	const filteredRoles = roles.filter((r) =>
		r.name.toLowerCase().includes(filterText.toLowerCase())
	);

	return (
		<div className='px-4 md:px-20'>
			<header className='flex flex-col gap-4 md:h-40 justify-around'>
				<h1 className='text-xl md:text-2xl text-brown text-center md:text-left'>
					CONFIGURACIÓN DE ROLES
				</h1>

				{/* acciones */}
				<div className='flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center'>
					<div className='relative w-full md:w-64'>
						<FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
						<datalist id='roles'>
							{roles.map((role) => (
								<option
									key={role._id}
									value={role.name}></option>
							))}
						</datalist>
						<input
							type='text'
							list='roles'
							placeholder='Buscar Rol'
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
						Agregar Nuevo Rol
					</button>
				</div>
			</header>

			<section className='w-full mx-auto mt-6 flex flex-col justify-between border-t border-gray'>
				{/* encabezado tabla */}
				<div className='hidden md:grid grid-cols-6 place-items-center py-6 font-semibold'>
					<p>Nombre del rol</p>
					<p>Descripción</p>
					<p>Usuarios</p>
					<p>Fecha de Creación</p>
					<p>Estado</p>
					<p>Acciones</p>
				</div>

				{/* listado con paginación */}
				<PaginatedList
					data={filteredRoles}
					itemsPerPage={5}>
					{(role: Role) => (
						<div
							key={role._id}
							className='grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-0 place-items-center py-3 border-brown/40 md:border-b md:border-brown/10 rounded-lg p-4 md:py-2'>
							{/* 📱 Mobile */}
							<div className='w-full md:hidden text-center space-y-2 border-b pb-4'>
								<p>
									<span className='font-semibold'>Nombre:</span> {role.name}
								</p>
								<p>
									<span className='font-semibold'>Descripción:</span>{' '}
									{role.description}
								</p>
								<p>
									<span className='font-semibold'>Usuarios:</span>{' '}
									{role.usersCount}
								</p>
								<p>
									<span className='font-semibold'>Fecha de creación:</span>{' '}
									{new Date(role.createdAt).toLocaleDateString()}
								</p>
								<p>
									<span className='font-semibold'>Estado:</span>{' '}
									<span
										className={role.status ? 'text-green-500' : 'text-red-500'}>
										{role.status ? 'Activo' : 'Inactivo'}
									</span>
								</p>
								<div className='flex gap-4 mt-2 justify-center'>
									<FaEye
										size={20}
										color='#d9b13b'
										onClick={() => {
											setDetailsModal(true);
											setRole(role);
										}}
										cursor='pointer'
									/>
									<FaEdit
										size={20}
										color='#7588f0'
										onClick={() => {
											setEditModal(true);
											setRole(role);
										}}
										cursor='pointer'
									/>
									<FaTrash
										size={19}
										color='#fa4334'
										onClick={() =>
											deleteElement('Rol', `/api/roles/${role._id}`, () =>
												fetchRoles()
											)
										}
										cursor='pointer'
									/>
								</div>
							</div>

							{/* 💻 Desktop */}
							<p className='hidden md:block'>{role.name}</p>
							<p className='hidden md:block truncate w-40 text-center'>
								{role.description}
							</p>
							<p className='hidden md:block'>{role.usersCount}</p>
							<p className='hidden md:block'>
								{new Date(role.createdAt).toLocaleDateString()}
							</p>
							<p
								className={`hidden md:block ${
									role.status ? 'text-green-500' : 'text-red-500'
								}`}>
								{role.status ? 'Activo' : 'Inactivo'}
							</p>
							<div className='hidden md:flex justify-evenly place-items-center w-full'>
								<FaEye
									size={20}
									color='#d9b13b'
									onClick={() => {
										setDetailsModal(true);
										setRole(role);
									}}
									cursor='pointer'
								/>
								<FaEdit
									size={20}
									color='#7588f0'
									onClick={() => {
										setEditModal(true);
										setRole(role);
									}}
									cursor='pointer'
								/>
								<FaTrash
									size={19}
									color='#fa4334'
									onClick={() =>
										deleteElement('Rol', `/api/roles/${role._id}`, () =>
											fetchRoles()
										)
									}
									cursor='pointer'
								/>
							</div>
						</div>
					)}
				</PaginatedList>
			</section>

			{/* Modales */}
			<CreateRoleModal
				isOpen={createModal}
				onClose={() => setCreateModal(false)}
				updateList={() => fetchRoles()}
			/>
			<RoleDetailsModal
				isOpen={detailsModal}
				onClose={() => setDetailsModal(false)}
				extraProps={role}
			/>
			<EditRoleModal
				isOpen={editModal}
				onClose={() => setEditModal(false)}
				extraProps={role}
				updateList={() => fetchRoles()}
			/>
		</div>
	);
}

export default Page;
