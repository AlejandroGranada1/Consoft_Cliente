'use client';
import { Search, Plus } from 'lucide-react';
import { Role } from '@/lib/types';
import CreateRoleModal from '@/components/admin/configuracion/CreateRoleModal';
import EditRoleModal from '@/components/admin/configuracion/EditRoleModal';
import RoleDetailsModal from '@/components/admin/configuracion/RoleDetailsModal';
import { deleteElement } from '@/components/admin/global/alerts';
import React, { useEffect, useState } from 'react';
import Pagination from '@/components/Global/Pagination';
import { useDeleteRole, useGetRoles } from '@/hooks/apiHooks';
import RoleRow from '@/components/admin/configuracion/RoleRow'; // 👈 Importa el componente

function Page() {
	const [createModal, setCreateModal] = useState(false);
	const [detailsModal, setDetailsModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [role, setRole] = useState<Role>();
	const [currentPage, setCurrentPage] = useState(1);
	const [filterText, setFilterText] = useState('');

	const itemsPerPage = 5;

	const deleteRole = useDeleteRole();
	const { data, refetch } = useGetRoles();
	const roles = data?.roles || [];

	const filteredRoles = roles.filter((r: Role) =>
		r.name.toLowerCase().includes(filterText.toLowerCase())
	);

	const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentRoles = filteredRoles.slice(startIndex, endIndex);

	useEffect(() => {
		setCurrentPage(1);
	}, [filterText]);

	const handleDeleteRole = async (id: string) => {
		const Swal = (await import('sweetalert2')).default;
		try {
			Swal.fire({
				title: '¿Estas seguro de eliminar este rol?',
				text: 'Esta accion es irreversible',
				icon: 'warning',
				showCancelButton: true,
				showConfirmButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: 'lightgreen',
				cancelButtonText: 'Cancelar',
			}).then(async (response) => {
				if (response.isConfirmed) {
					await deleteRole.mutateAsync(id);
					Swal.fire({
						toast: true,
						animation: false,
						timerProgressBar: true,
						showConfirmButton: false,
						title: 'Rol eliminado exitosamente',
						icon: 'success',
						position: 'top-right',
						timer: 1500,
						customClass: {
							timerProgressBar: 'swal2-progress-bar',
						},
					});
					refetch();
				}
			});
		} catch (error: any) {
			Swal.fire({
				title: 'Error',
				text: error.message,
			});
		}
	};

	return (
		<div className='px-4 md:px-20'>
			<header className='flex flex-col gap-4 md:h-40 justify-around'>
				<h1 className='text-xl md:text-2xl text-brown text-center md:text-left'>
					CONFIGURACIÓN DE ROLES
				</h1>

				<div className='flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center'>
					<div className='relative w-full md:w-64'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
						<datalist id='roles'>
							{roles.map((role: Role) => (
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
						<Plus
							size={25}
							className='mr-2'
						/>{' '}
						Agregar Nuevo Rol
					</button>
				</div>
			</header>

			<section className='w-full mx-auto mt-6 flex flex-col justify-between border-t border-gray'>
				{/* Encabezado tabla - solo desktop */}
				<div className='hidden md:grid grid-cols-6 place-items-center py-6 font-semibold'>
					<p>Nombre del rol</p>
					<p>Descripción</p>
					<p>Usuarios</p>
					<p>Fecha de Creación</p>
					<p>Estado</p>
					<p>Acciones</p>
				</div>

				{/* Lista de roles - USA EL COMPONENTE AQUÍ 👇 */}
				{currentRoles.length > 0 ? (
					currentRoles.map((role: Role) => (
						<RoleRow
							key={role._id}
							role={role}
							onView={() => {
								setDetailsModal(true);
								setRole(role);
							}}
							onEdit={() => {
								setEditModal(true);
								setRole(role);
							}}
							onDelete={() => handleDeleteRole(role._id)}
						/>
					))
				) : (
					<div className='text-center py-8 text-gray-500'>No hay roles para mostrar</div>
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
			<CreateRoleModal
				isOpen={createModal}
				onClose={() => setCreateModal(false)}
				updateList={() => refetch()}
			/>
			<RoleDetailsModal
				isOpen={detailsModal}
				onClose={() => setDetailsModal(false)}
				extraProps={role}
				updateList={() => refetch()}
			/>
			<EditRoleModal
				isOpen={editModal}
				onClose={() => setEditModal(false)}
				extraProps={role}
				updateList={() => refetch()}
			/>
		</div>
	);
}

export default Page;
