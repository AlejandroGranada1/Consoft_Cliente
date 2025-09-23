import { DefaultModalProps, GroupPermission, Permission, Role } from '@/app/types';
import api from '@/components/Global/axios';
import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import Swal from 'sweetalert2';
import { updateElement } from '../global/alerts';

function EditRoleModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<Role>) {
	const [roleData, setRoleData] = useState<Role | null>(null);
	const [permissions, setPermissions] = useState<GroupPermission[]>([]);

	// 📌 Cargar datos iniciales cuando se abre
	useEffect(() => {
		if (isOpen && extraProps) {
			setRoleData({ ...extraProps }); // prellenar con el rol que viene
			const fetchPermissions = async () => {
				const response = await api.get('/api/permissions');
				setPermissions(response.data.permisos);
			};
			fetchPermissions();
		}
	}, [isOpen, extraProps]);

	if (!isOpen || !roleData) return null;

	// 📌 Helpers
	const isPermissionSelected = (_id: string) => roleData.permissions.some((p) => p._id === _id);

	const isGroupSelected = (module: string) => {
		const grupo = permissions.find((g) => g.module === module);
		if (!grupo) return false;
		return grupo.permissions.every((p) => isPermissionSelected(p._id));
	};

	// 📌 Toggle individuales
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

	// 📌 Toggle grupo completo
	const toggleGroup = (module: string) => {
		const grupo = permissions.find((g) => g.module === module);
		if (!grupo) return;

		const allSelected = isGroupSelected(module);

		setRoleData((prev) => {
			if (!prev) return null;
			if (allSelected) {
				// quitar todos los permisos del grupo
				return {
					...prev,
					permissions: prev.permissions.filter((p) => p.module !== module),
				};
			}
			// agregar los que faltan
			const newPerms = grupo.permissions.filter(
				(p) => !prev.permissions.some((up) => up._id === p._id)
			);
			return {
				...prev,
				permissions: [...prev.permissions, ...newPerms],
			};
		});
	};

	// 📌 Inputs de texto y checkbox
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, type, value, checked } = e.target;
		setRoleData((prev) =>
			prev
				? {
						...prev,
						[name]: type === 'checkbox' ? checked : value, // 👈 aquí diferenciamos
				  }
				: null
		);
	};

	// 📌 Guardar cambios
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!roleData) return;

		const sentData = {
			name: roleData.name,
			description: roleData.description,
			status: roleData.status,
			permissions: roleData.permissions.map((p) => p._id),
		};

		await updateElement('Rol', `/api/roles/${roleData._id}`, sentData);
		updateList!();
		onClose();
	};

	return (
		<div className='modal-bg'>
			<div className='modal-frame w-[600px]'>
				<header className='w-fit mx-auto'>
					<button
						onClick={onClose}
						className='absolute top-4 left-4 text-2xl text-gray-500 hover:text-black cursor-pointer'>
						<IoMdClose />
					</button>
					<h1 className='text-xl font-semibold mb-4'>EDITAR ROL</h1>
				</header>

				<form onSubmit={handleSubmit}>
					{/* Nombre */}
					<div className='flex flex-col'>
						<label htmlFor='name'>Rol</label>
						<input
							id='name'
							name='name'
							type='text'
							placeholder='Nombre del rol'
							value={roleData.name}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>

					{/* Descripción */}
					<div className='flex flex-col mt-4'>
						<label htmlFor='description'>Descripción</label>
						<input
							id='description'
							name='description'
							type='text'
							placeholder='Descripción del rol'
							value={roleData.description}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md'
						/>
					</div>
					{/* Estado */}
					<div className='flex flex-col mt-4'>
						<label htmlFor='status'>Estado</label>
						<label className='flex items-center gap-2'>
							<input
								id='status'
								name='status'
								type='checkbox'
								checked={roleData.status}
								onChange={handleChange}
							/>
							{roleData.status ? 'Activo' : 'Inactivo'}
						</label>
					</div>

					{/* 📌 Permisos */}
					<section className='mt-10 h-[276px] overflow-y-scroll'>
						{permissions.map((group) => (
							<div
								key={group.module}
								className='border rounded-lg p-4 mb-4 bg-gray-50'>
								{/* Checkbox padre */}
								<label className='flex items-center gap-2 font-semibold mb-2'>
									<input
										type='checkbox'
										checked={isGroupSelected(group.module)}
										onChange={() => toggleGroup(group.module)}
									/>
									Seleccionar todo en {group.module}
								</label>

								{/* Hijos */}
								<div className='grid grid-cols-2 gap-2 ml-6'>
									{group.permissions.map((permission) => (
										<label
											key={permission._id}
											className='flex items-center gap-2'>
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
					<div className='w-full flex justify-between mt-10'>
						<button
							type='submit'
							className='px-10 py-2 rounded-lg border border-brown text-brown cursor-pointer'>
							Guardar Cambios
						</button>
						<button
							onClick={onClose}
							type='button'
							className='px-10 py-2 rounded-lg border border-gray bg-gray cursor-pointer'>
							Cancelar
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default EditRoleModal;
