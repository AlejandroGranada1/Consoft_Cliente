import { X } from 'lucide-react';
import { DefaultModalProps, GroupPermission, Permission, Role } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import { useGetPermissions, useUpdateRole } from '@/hooks/apiHooks';

const initialState: Role | null = null;

function EditRoleModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<Role>) {
	const [roleData, setRoleData] = useState<Role | null>(initialState);

	const { data } = useGetPermissions();
	const permissions = (data?.permisos as GroupPermission[]) || [];
	const updateRole = useUpdateRole();

	// 📌 Cargar datos
	useEffect(() => {
		if (isOpen && extraProps) {
			setRoleData({
				_id: extraProps._id!,
				name: extraProps.name || '',
				description: extraProps.description || '',
				usersCount: extraProps.usersCount || 0,
				status: extraProps.status ?? true,
				createdAt: extraProps.createdAt || new Date(),
				permissions: extraProps.permissions || [],
			});
		}
	}, [extraProps, isOpen]);

	if (!isOpen || !roleData) return null;

	// 🧼 Cerrar modal correctamente
	const handleClose = () => {
		setRoleData(initialState);
		onClose();
	};

	// 📌 Helpers
	const isPermissionSelected = (_id: string) =>
		roleData.permissions.some((p) => p._id === _id);

	const isGroupSelected = (module: string) => {
		const grupo = permissions.find((g) => g.module === module);
		if (!grupo) return false;
		return grupo.permissions.every((p) => isPermissionSelected(p._id));
	};

	// 📌 Toggle permisos
	const togglePermission = (permission: Permission) => {
		setRoleData((prev) => {
			if (!prev) return null;
			const exists = prev.permissions.some((p) => p._id === permission._id);
			return {
				...prev,
				permissions: exists
					? prev.permissions.filter((p) => p._id !== permission._id)
					: [...prev.permissions, permission],
			};
		});
	};

	const toggleGroup = (module: string) => {
		const grupo = permissions.find((g) => g.module === module);
		if (!grupo) return;

		const allSelected = isGroupSelected(module);

		setRoleData((prev) => {
			if (!prev) return null;
			if (allSelected) {
				return {
					...prev,
					permissions: prev.permissions.filter((p) => p.module !== module),
				};
			}

			const newPerms = grupo.permissions.filter(
				(p) => !prev.permissions.some((up) => up._id === p._id)
			);

			return {
				...prev,
				permissions: [...prev.permissions, ...newPerms],
			};
		});
	};

	// 📌 Inputs
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, type, value, checked } = e.target;
		setRoleData((prev) =>
			prev
				? {
						...prev,
						[name]: type === 'checkbox' ? checked : value,
				  }
				: null
		);
	};

	// 📌 Guardar
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!roleData) return;

		if (!roleData.name.trim()) {
			Swal.fire('Campo requerido', 'El nombre del rol es obligatorio', 'warning');
			return;
		}

		if (!roleData.permissions.length) {
			Swal.fire(
				'Permisos requeridos',
				'Debes seleccionar al menos un permiso',
				'warning'
			);
			return;
		}

		try {
			const sentData = {
				_id: roleData._id,
				name: roleData.name,
				description: roleData.description ?? '',
				status: roleData.status,
				permissions: roleData.permissions.map((p) => p._id),
			};

			await updateRole.mutateAsync(sentData);
			updateList?.();
			handleClose();
		} catch (err) {
			Swal.fire('Error', 'No se pudo actualizar el rol', 'error');
		}
	};

	return (
		<div className='modal-bg'>
			<div className='modal-frame w-[600px]'>
				<header className='w-fit mx-auto'>
					<button
						onClick={handleClose}
						className='absolute top-4 left-4 text-2xl text-gray-500 hover:text-black'>
						<X />
					</button>
					<h1 className='text-xl font-semibold mb-4'>EDITAR ROL</h1>
				</header>

				<form onSubmit={handleSubmit}>
					<div className='flex flex-col'>
						<label>Rol</label>
						<input
							name='name'
							type='text'
							placeholder='Nombre del rol'
							value={roleData.name}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					<div className='flex flex-col mt-4'>
						<label>Descripción</label>
						<input
							name='description'
							type='text'
							placeholder='Descripción del rol'
							value={roleData.description}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					<div className='flex flex-col mt-4'>
						<label className='flex items-center gap-2'>
							<input
								name='status'
								type='checkbox'
								checked={roleData.status}
								onChange={handleChange}
							/>
							{roleData.status ? 'Activo' : 'Inactivo'}
						</label>
					</div>

					<section className='mt-10 h-[276px] overflow-y-scroll'>
						{permissions.map((group) => (
							<div key={group.module} className='border rounded-lg p-4 mb-4 bg-gray-50'>
								<label className='flex items-center gap-2 font-semibold mb-2'>
									<input
										type='checkbox'
										checked={isGroupSelected(group.module)}
										onChange={() => toggleGroup(group.module)}
									/>
									Seleccionar todo en {group.module}
								</label>

								<div className='grid grid-cols-2 gap-2 ml-6'>
									{group.permissions.map((permission) => (
										<label key={permission._id} className='flex items-center gap-2'>
											<input
												type='checkbox'
												checked={isPermissionSelected(permission._id)}
												onChange={() => togglePermission(permission)}
											/>
											{permission.action === 'view' && 'Ver'}
											{permission.action === 'create' && 'Crear'}
											{permission.action === 'update' && 'Actualizar'}
											{permission.action === 'delete' && 'Eliminar'}
										</label>
									))}
								</div>
							</div>
						))}
					</section>

					{/* Botones */}
					<div className='w-full flex justify-end gap-4 mt-10'>
						<button
							type='button'
							onClick={handleClose}
							className='px-10 py-2 rounded-lg border border-gray bg-gray'>
							Cancelar
						</button>
						<button
							type='submit'
							className='px-10 py-2 rounded-lg border border-brown text-brown'>
							Guardar Cambios
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default EditRoleModal;
