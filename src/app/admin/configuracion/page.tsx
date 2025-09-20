'use client';
import { Role } from '@/app/types';
import CreateRoleModal from '@/components/admin/configuracion/CreateRoleModal';
import RoleDetailsModal from '@/components/admin/configuracion/RoleDetailsModal';
import api from '@/components/Global/axios';
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';

function page() {
	const [createModal, setCreateModal] = useState(false);
	const [detailsModal, setDetailsModal] = useState(false);
	const [role, setRole] = useState<Role>();

	const [roles, setRoles] = useState<Role[]>([]);

	useEffect(() => {
		const fetchRoles = async () => {
			const response = await api.get('/api/roles');
			console.log(response.data);
			setRoles(response.data.roles);
		};
		fetchRoles();
	}, []);

	return (
		<div>
			<header className='flex flex-col h-60 justify-around px-20'>
				<h1 className='text-2xl  text-brown'>CONFIGURACION DE ROLES</h1>
				{/* actions */}
				<div className='flex justify-between items-center'>
					<div className='relative w-64'>
						{/* Icono */}
						<FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />

						{/* Input */}
						<input
							type='text'
							placeholder='Buscar Rol'
							className='pl-10 pr-4 py-2 border border-brown rounded-lg w-full text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-brown'
						/>
					</div>

					<button
						onClick={() => setCreateModal(true)}
						className='flex items-center py-2 w-fit px-10 border border-brown rounded-lg cursor-pointer text-brown'>
						<IoMdAdd size={25} /> Agregar Nuevo Rol
					</button>
				</div>
			</header>

			<section className='w-8/9 mx-auto h-[420px] flex flex-col justify-between border-t border-gray'>
				{/* Encabezado de la tabla */}
				<div>
					<div className='grid grid-cols-5 place-items-center py-6'>
						<p>Nombre del rol</p>
						<p>Descripción</p>
						<p>Usuarios</p>
						<p>Fecha de Creación</p>
						<p>Estado</p>
					</div>

					{/* Lista de roles */}
					<div className='mx-auto border-t border-brown pt-5 flex flex-col gap-4'>
						{roles.map((role) => (
							<div
								onClick={() => {
									setDetailsModal(true);
									setRole(role);
								}}
								key={role._id}
								className='grid grid-cols-5 place-items-center py-3 border border-brown rounded-lg cursor-pointer'>
								<p>{role.name}</p>
								<p>{role.description}</p>
								<p>{role.usersCount}</p>
								<p>{new Date(role.createdAt).toLocaleDateString()}</p>
								<p
									className={`${
										role.status
											? 'bg-green/30 text-green'
											: 'bg-red/30 text-red'
									} px-2 py-1 rounded-xl`}>
									{role.status ? 'Activo' : 'Inactivo'}
								</p>
							</div>
						))}
					</div>
				</div>

				{/* Paginación al fondo */}
				<div className='w-full flex justify-center mt-5'>
					<Pagination count={Math.ceil(roles.length / 10)} />
				</div>
			</section>
			<CreateRoleModal
				isOpen={createModal}
				onClose={() => setCreateModal(false)}
			/>
			<RoleDetailsModal
				isOpen={detailsModal}
				onClose={() => setDetailsModal(false)}
				extraProps={role}
			/>
		</div>
	);
}

export default page;
