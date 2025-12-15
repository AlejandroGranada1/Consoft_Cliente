'use client';
import { Pencil, Eye, Search, Trash2, Plus } from 'lucide-react';
import { Role, User } from '@/lib/types';
import CreateUserModal from '@/components/admin/usuarios/CreateUserModal';
import EditUserModal from '@/components/admin/usuarios/EditUserModal';
import DetailsUserModal from '@/components/admin/usuarios/DetailsUserModal';
import { deleteElement } from '@/components/admin/global/alerts';
import api from '@/components/Global/axios';
import Pagination from '@/components/Global/Pagination';
import React, { useEffect, useState } from 'react';
import UserRow from '@/components/admin/usuarios/UserRow';
import { useDeleteUser, useGetUsers } from '@/hooks/useUsers';

function Page() {
	const [createModal, setCreateModal] = useState(false);
	const [detailsModal, setDetailsModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [user, setUser] = useState<User>();
	const [filterText, setFilterText] = useState('');
	const deleteUser = useDeleteUser();
	// Estado para paginación
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

	const { data, refetch } = useGetUsers();
	const users = data?.users;

	// Filtrar usuarios
	const filteredUsers = users?.filter(
		(u: User) =>
			u.name.toLowerCase().includes(filterText.toLowerCase()) ||
			u.email.toLowerCase().includes(filterText.toLowerCase())
	);

	// Calcular paginación
	const totalPages = Math.ceil(filteredUsers?.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentUsers = filteredUsers?.slice(startIndex, endIndex);

	// Resetear a página 1 cuando cambia el filtro
	useEffect(() => {
		setCurrentPage(1);
	}, [filterText]);

	const handleDeleteUser = async (id: string) => {
		const Swal = (await import('sweetalert2')).default;
		try {
			Swal.fire({
				title: '¿Estas seguro de eliminar este Usuario?',
				text: 'Esta acción es irreversible',
				icon: 'warning',
				showCancelButton: true,
				showConfirmButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: 'lightgreen',
				cancelButtonText: 'Cancelar',
			}).then(async (response) => {
				if (response.isConfirmed) {
					await deleteUser.mutateAsync(id);
					Swal.fire({
						toast: true,
						animation: false,
						timerProgressBar: true,
						showConfirmButton: false,
						title: 'Usuario eliminado exitosamente',
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
		<div className="px-4 md:px-20">
			<header className="flex flex-col gap-4 md:h-40 justify-around">
				<h1 className="text-xl md:text-2xl text-brown text-center md:text-left">
					GESTIÓN DE USUARIOS
				</h1>

				<div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
					<div className="relative w-full md:w-64">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

						<datalist id="users">
							{users?.map((u: User) => (
								<option key={u._id} value={u.name}></option>
							))}
						</datalist>

						<input
							type="text"
							list="users"
							placeholder="Buscar Usuario"
							value={filterText}
							onChange={(e) => setFilterText(e.target.value)}
							className="pl-10 pr-4 py-2 border border-brown rounded-lg w-full text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-brown"
						/>
					</div>

					<button
						onClick={() => setCreateModal(true)}
						className="flex items-center justify-center py-2 px-6 md:px-10 border border-brown rounded-lg cursor-pointer text-brown w-full md:w-fit"
					>
						<Plus size={25} className="mr-2" /> Agregar Nuevo Usuario
					</button>
				</div>
			</header>

			<section className="w-full mx-auto mt-6 flex flex-col justify-between border-t border-gray">
				{/* Encabezado tabla - solo en desktop */}
				<div className="hidden md:grid grid-cols-6 place-items-center py-6 font-semibold">
					<p>Usuario</p>
					<p>Correo</p>
					<p>Rol</p>
					<p>Fecha de Registro</p>
					<p>Estado</p>
					<p>Acciones</p>
				</div>

				{/* Listado de usuarios */}
				{currentUsers?.length > 0 ? (
					currentUsers?.map((u: User) => (
						<UserRow
							key={u._id}
							user={u}
							onView={() => {
								setDetailsModal(true);
								setUser(u);
							}}
							onEdit={() => {
								setEditModal(true);
								setUser(u);
							}}
							onDelete={() => handleDeleteUser(u._id!)}
						/>
					))
				) : (
					<div className="text-center py-8 text-gray-500">
						No hay usuarios para mostrar
					</div>
				)}

				{/* Paginación */}
				{totalPages > 1 && (
					<Pagination
						count={totalPages}
						page={currentPage}
						onChange={(_, newPage) => setCurrentPage(newPage)}
						className="mt-6"
					/>
				)}
			</section>

			{/* Modales */}
			<CreateUserModal
				isOpen={createModal}
				onClose={() => setCreateModal(false)}
				updateList={() => refetch()}
			/>
			<DetailsUserModal
				isOpen={detailsModal}
				onClose={() => setDetailsModal(false)}
				extraProps={user}
			/>
			<EditUserModal
				isOpen={editModal}
				onClose={() => setEditModal(false)}
				extraProps={user}
				updateList={() => refetch()}
			/>
		</div>
	);
}

export default Page;
