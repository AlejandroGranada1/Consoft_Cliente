import { X, Shield, Package, Check, User, Info, Save } from 'lucide-react';
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

	const isGroupPartiallySelected = (module: string) => {
		const grupo = permissions.find((g) => g.module === module);
		if (!grupo) return false;
		const selectedCount = grupo.permissions.filter((p) => isPermissionSelected(p._id)).length;
		return selectedCount > 0 && selectedCount < grupo.permissions.length;
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
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
			<div className='modal-frame w-full max-w-[720px] flex flex-col max-h-[92vh]'>
				
				<header className='sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-xs'>
					<button
						onClick={handleClose}
						className='absolute top-0 left-0 p-5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors'>
						<X size={20} />
					</button>
					<h1 className='text-2xl font-bold text-center flex items-center justify-center gap-2'>
						<Shield size={20} /> Editar Rol
					</h1>
				</header>

				<form onSubmit={handleSubmit} className='space-y-6 p-6 overflow-y-auto'>

					{/* Información principal del rol */}
					<div className='grid grid-cols-2 gap-6'>
						<div className='flex flex-col'>
							<label className='font-medium mb-1 flex items-center gap-2'>
								<User size={16} />
								Nombre *
							</label>
							<input
								name='name'
								type='text'
								placeholder='Ej: Administrador'
								value={roleData.name}
								onChange={handleChange}
								className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown'
							/>
						</div>

						<div className='flex flex-col'>
							<label className='font-medium mb-1 flex items-center gap-2'>
								<Info size={16} />
								Estado
							</label>
							<div className='flex items-center h-10'>
								<label className='flex items-center gap-2 cursor-pointer'>
									<input
										name='status'
										type='checkbox'
										checked={roleData.status}
										onChange={handleChange}
										className='rounded border-gray-300 text-brown focus:ring-brown focus:ring-1'
									/>
									<span className={`px-3 py-1 rounded-full text-sm font-medium ${
										roleData.status
											? 'bg-green-100 text-green-700'
											: 'bg-red-100 text-red-700'
									}`}>
										{roleData.status ? 'Activo' : 'Inactivo'}
									</span>
								</label>
							</div>
						</div>
					</div>

					{/* Descripción */}
					<div className='flex flex-col'>
						<label className='font-medium mb-1 flex items-center gap-2'>
							<DescriptionIcon size={16} />
							Descripción
						</label>
						<input
							name='description'
							type='text'
							placeholder='Breve descripción del rol'
							value={roleData.description}
							onChange={handleChange}
							className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown'
						/>
					</div>

					{/* Metadata adicional */}
					<div className='grid grid-cols-2 gap-6'>
						<div className='flex flex-col'>
							<label className='font-medium mb-1 text-xs text-gray-500'>
								Fecha de creación
							</label>
							<p className='text-sm'>
								{roleData.createdAt 
									? new Date(roleData.createdAt).toLocaleDateString('es-CO', {
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})
									: 'No disponible'}
							</p>
						</div>
						<div className='flex flex-col'>
							<label className='font-medium mb-1 text-xs text-gray-500'>
								Usuarios asignados
							</label>
							<p className='text-sm'>
								{roleData.usersCount || 0} usuario{(roleData.usersCount || 0) !== 1 ? 's' : ''}
							</p>
						</div>
					</div>

					{/* Sección de permisos */}
					<div className='border rounded-lg p-4'>
						<div className='flex justify-between items-center mb-4'>
							<h3 className='font-semibold text-lg flex items-center gap-2'>
								<Package size={18} />
								Permisos ({roleData.permissions.length})
							</h3>
							{roleData.permissions.length > 0 && (
								<span className='text-sm text-gray-500'>
									{permissions.length} módulo{permissions.length !== 1 ? 's' : ''} disponible{permissions.length !== 1 ? 's' : ''}
								</span>
							)}
						</div>

						{permissions.length === 0 ? (
							<div className='text-center py-8 text-gray-500 bg-gray-50 rounded-lg'>
								No hay permisos disponibles.
							</div>
						) : (
							<div className='space-y-4 max-h-80 overflow-y-auto p-1'>
								{permissions.map((group) => {
									const groupSelected = isGroupSelected(group.module);
									const groupPartiallySelected = isGroupPartiallySelected(group.module);
									const selectedCount = group.permissions.filter(
										(p) => isPermissionSelected(p._id)
									).length;

									return (
										<div key={group.module} className='bg-gray-50 p-4 rounded-lg border'>
											<div className='flex items-center justify-between mb-3'>
												<label className='font-semibold flex items-center gap-2 cursor-pointer'>
													<input
														type='checkbox'
														checked={groupSelected}
														onChange={() => toggleGroup(group.module)}
														className='rounded border-gray-300 text-brown focus:ring-brown focus:ring-1'
														ref={(input) => {
															if (input && groupPartiallySelected) {
																input.indeterminate = true;
															}
														}}
													/>
													<span className='text-base'>{group.module}</span>
												</label>
												{groupPartiallySelected && (
													<span className='text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full'>
														Parcial
													</span>
												)}
												{groupSelected && (
													<span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1'>
														<Check size={12} /> Todos
													</span>
												)}
											</div>

											<div className='grid grid-cols-2 gap-3 ml-6'>
												{group.permissions.map((permission) => (
													<label
														key={permission._id}
														className='flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors'>
														<input
															type='checkbox'
															checked={isPermissionSelected(permission._id)}
															onChange={() => togglePermission(permission)}
															className='rounded border-gray-300 text-brown focus:ring-brown focus:ring-1'
														/>
														<span className='text-gray-700'>
															{permission.action === 'view' && 'Ver'}
															{permission.action === 'create' && 'Crear'}
															{permission.action === 'update' && 'Actualizar'}
															{permission.action === 'delete' && 'Eliminar'}
															{!['view', 'create', 'update', 'delete'].includes(permission.action) && permission.action}
														</span>
													</label>
												))}
											</div>
											
											{/* Contador de permisos seleccionados en el grupo */}
											{selectedCount > 0 && (
												<div className='mt-2 text-xs text-gray-500 border-t pt-2'>
													{selectedCount} de {group.permissions.length} permisos seleccionados
												</div>
											)}
										</div>
									);
								})}
							</div>
						)}
					</div>

					{/* Resumen */}
					{roleData.permissions.length > 0 && (
						<div className='p-4 bg-gray-50 rounded-lg border'>
							<div className='flex justify-between items-center'>
								<div>
									<span className='font-semibold text-lg'>Resumen de cambios:</span>
									<p className='text-sm text-gray-600'>
										{roleData.permissions.length} permiso{roleData.permissions.length !== 1 ? 's' : ''} asignado{roleData.permissions.length !== 1 ? 's' : ''}
									</p>
								</div>
								<div className='text-right'>
									<span className='text-sm font-medium text-brown bg-brown/10 px-3 py-1 rounded-full'>
										{Array.from(new Set(roleData.permissions.map(p => p.module))).length} módulo{Array.from(new Set(roleData.permissions.map(p => p.module))).length !== 1 ? 's' : ''}
									</span>
								</div>
							</div>
						</div>
					)}

					{/* Botones */}
					<div className='flex justify-between pt-4 border-t'>
						<button
							type='button'
							onClick={handleClose}
							className='px-6 py-2 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-100 transition-colors'>
							Cancelar
						</button>
						<button
							type='submit'
							disabled={updateRole.isPending || !roleData.name.trim() || roleData.permissions.length === 0}
							className={`px-6 py-2 border border-brown rounded-md transition-colors flex items-center gap-2 ${
								updateRole.isPending || !roleData.name.trim() || roleData.permissions.length === 0
									? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500'
									: 'text-brown hover:bg-brown hover:text-white'
							}`}>
							{updateRole.isPending ? (
								<>
									<span className='animate-spin rounded-full h-4 w-4 border-b-2 border-current'></span>
									Guardando...
								</>
							) : (
								<>
									<Save size={16} />
									Guardar Cambios
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

// Icono personalizado para descripción (no disponible en lucide-react de forma directa)
const DescriptionIcon = ({ size }: { size: number }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M4 6h16M4 12h16M4 18h7"/>
	</svg>
);

export default EditRoleModal;