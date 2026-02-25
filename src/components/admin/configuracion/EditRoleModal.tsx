'use client';

import { X, Shield, Package, Check, User, Info, Save, Lock } from 'lucide-react';
import { DefaultModalProps, GroupPermission, Permission, Role } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useGetPermissions, useUpdateRole } from '@/hooks/apiHooks';

function EditRoleModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<Role>) {
	const [roleData, setRoleData] = useState<Role | null>(null);
	const { data } = useGetPermissions();
	const permissions = (data?.permisos as GroupPermission[]) || [];
	const updateRole = useUpdateRole();

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

	const handleClose = () => {
		setRoleData(null);
		onClose();
	};

	const isPermissionSelected = (_id: string) => roleData.permissions.some((p) => p._id === _id);

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
				(p) => !prev.permissions.some((up) => up._id === p._id),
			);

			return {
				...prev,
				permissions: [...prev.permissions, ...newPerms],
			};
		});
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, type, value, checked } = e.target;
		setRoleData((prev) =>
			prev
				? {
						...prev,
						[name]: type === 'checkbox' ? checked : value,
					}
				: null,
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!roleData) return;

		if (!roleData.name.trim()) {
			Swal.fire({
				title: 'Campo requerido',
				text: 'El nombre del rol es obligatorio',
				icon: 'warning',
				background: '#1e1e1c',
				color: '#fff',
			});
			return;
		}

		if (!roleData.permissions.length) {
			Swal.fire({
				title: 'Permisos requeridos',
				text: 'Debes seleccionar al menos un permiso',
				icon: 'warning',
				background: '#1e1e1c',
				color: '#fff',
			});
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

			Swal.fire({
				toast: true,
				animation: false,
				timerProgressBar: true,
				showConfirmButton: false,
				title: 'Rol actualizado exitosamente',
				icon: 'success',
				position: 'top-right',
				timer: 1500,
				background: '#1e1e1c',
				color: '#fff',
			});

			updateList?.();
			handleClose();
		} catch (err) {
			Swal.fire({
				title: 'Error',
				text: 'No se pudo actualizar el rol',
				icon: 'error',
				background: '#1e1e1c',
				color: '#fff',
			});
		}
	};

	const formatDate = (date: string | Date) => {
		return new Date(date).toLocaleDateString('es-CO', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	return (
		<div
			className='fixed top-18 left-72 inset-0 z-50 flex items-center justify-center p-4'
			style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
			<div
				className='w-full max-w-[720px] rounded-2xl border border-white/10
        shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        flex flex-col max-h-[90vh]'
				style={{ background: 'rgba(30,30,28,0.95)', backdropFilter: 'blur(20px)' }}>
				{/* Header */}
				<header className='relative px-6 py-5 border-b border-white/10'>
					<button
						onClick={handleClose}
						className='absolute left-4 top-1/2 -translate-y-1/2
              p-2 rounded-lg text-white/40 hover:text-white/70
              hover:bg-white/5 transition-all duration-200'>
						<X size={18} />
					</button>
					<h2 className='text-lg font-medium text-white text-center flex items-center justify-center gap-2'>
						<Shield
							size={18}
							className='text-[#C8A882]'
						/>
						Editar rol
					</h2>
				</header>

				<form
					onSubmit={handleSubmit}
					className='p-6 overflow-y-auto space-y-6'>
					{/* Información básica */}
					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<label className='text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block'>
								Nombre del rol *
							</label>
							<input
								name='name'
								value={roleData.name}
								onChange={handleChange}
								placeholder='Ej: Administrador'
								className='w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                  text-sm text-white placeholder:text-white/30
                  focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                  transition-all duration-200'
							/>
						</div>

						<div className='space-y-2'>
							<label className='text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block'>
								Estado
							</label>
							<label className='flex items-center gap-3 cursor-pointer h-12'>
								<input
									name='status'
									type='checkbox'
									checked={roleData.status}
									onChange={handleChange}
									className='w-4 h-4 rounded border-white/30
                    bg-white/5 text-[#C8A882]
                    focus:ring-[#C8A882] focus:ring-1 focus:ring-offset-0'
								/>
								<span
									className={`px-3 py-1.5 rounded-full text-xs font-medium
                  ${
						roleData.status
							? 'bg-green-500/10 text-green-400 border border-green-500/20'
							: 'bg-red-500/10 text-red-400 border border-red-500/20'
					}`}>
									{roleData.status ? 'Activo' : 'Inactivo'}
								</span>
							</label>
						</div>
					</div>

					{/* Descripción */}
					<div className='space-y-2'>
						<label className='text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block'>
							Descripción
						</label>
						<input
							name='description'
							value={roleData.description}
							onChange={handleChange}
							placeholder='Breve descripción del rol'
							className='w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                text-sm text-white placeholder:text-white/30
                focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                transition-all duration-200'
						/>
					</div>

					{/* Metadata - solo lectura */}
					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<label className='text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block'>
								Fecha de creación
							</label>
							<p className='text-sm text-white/60'>
								{roleData.createdAt
									? formatDate(roleData.createdAt)
									: 'No disponible'}
							</p>
						</div>

						<div className='space-y-2'>
							<label className='text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block'>
								Usuarios asignados
							</label>
							<p className='text-sm text-white/60'>
								{roleData.usersCount || 0} usuario
								{(roleData.usersCount || 0) !== 1 ? 's' : ''}
							</p>
						</div>
					</div>

					{/* Permisos */}
					<div className='space-y-4'>
						<div className='flex items-center justify-between'>
							<h3 className='text-sm font-medium text-white/70 flex items-center gap-2'>
								<Lock
									size={14}
									className='text-[#C8A882]'
								/>
								Permisos ({roleData.permissions.length})
							</h3>
							{roleData.permissions.length > 0 && (
								<span className='text-xs text-white/40'>
									{
										Array.from(
											new Set(roleData.permissions.map((p) => p.module)),
										).length
									}{' '}
									módulos
								</span>
							)}
						</div>

						{permissions.length === 0 ? (
							<div className='text-center py-12 rounded-xl border border-white/10 bg-white/5'>
								<Package
									size={32}
									className='mx-auto text-white/20 mb-2'
								/>
								<p className='text-white/40 text-sm'>No hay permisos disponibles</p>
							</div>
						) : (
							<div className='space-y-3 max-h-80 overflow-y-auto pr-2'>
								{permissions.map((group) => {
									const groupSelected = isGroupSelected(group.module);
									const groupPartiallySelected = isGroupPartiallySelected(
										group.module,
									);
									const selectedCount = group.permissions.filter((p) =>
										isPermissionSelected(p._id),
									).length;

									return (
										<div
											key={group.module}
											className='rounded-xl border border-white/10 bg-white/5 p-4'>
											<div className='flex items-center justify-between mb-3'>
												<label className='flex items-center gap-2 cursor-pointer'>
													<input
														type='checkbox'
														checked={groupSelected}
														onChange={() => toggleGroup(group.module)}
														ref={(input) => {
															if (input && groupPartiallySelected) {
																input.indeterminate = true;
															}
														}}
														className='w-4 h-4 rounded border-white/30
                              bg-white/5 text-[#C8A882]
                              focus:ring-[#C8A882] focus:ring-1 focus:ring-offset-0
                              transition-colors'
													/>
													<span className='text-sm font-medium text-white'>
														{group.module}
													</span>
												</label>

												{groupPartiallySelected && (
													<span
														className='text-[10px] px-2 py-1 rounded-full
                            bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'>
														Parcial
													</span>
												)}
												{groupSelected && (
													<span
														className='text-[10px] px-2 py-1 rounded-full
                            bg-green-500/10 text-green-400 border border-green-500/20
                            flex items-center gap-1'>
														<Check size={10} /> Todos
													</span>
												)}
											</div>

											<div className='grid grid-cols-2 gap-2 ml-6'>
												{group.permissions.map((permission) => (
													<label
														key={permission._id}
														className='flex items-center gap-2 cursor-pointer
                              p-2 rounded-lg hover:bg-white/5 transition-colors'>
														<input
															type='checkbox'
															checked={isPermissionSelected(
																permission._id,
															)}
															onChange={() =>
																togglePermission(permission)
															}
															className='w-3.5 h-3.5 rounded border-white/30
                                bg-white/5 text-[#C8A882]
                                focus:ring-[#C8A882] focus:ring-1 focus:ring-offset-0'
														/>
														<span className='text-xs text-white/70'>
															{permission.action === 'view' && 'Ver'}
															{permission.action === 'create' &&
																'Crear'}
															{permission.action === 'update' &&
																'Editar'}
															{permission.action === 'delete' &&
																'Eliminar'}
														</span>
													</label>
												))}
											</div>

											{selectedCount > 0 && (
												<div className='mt-2 pt-2 border-t border-white/10'>
													<p className='text-[10px] text-white/30'>
														{selectedCount} de{' '}
														{group.permissions.length} seleccionados
													</p>
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
						<div className='p-4 rounded-xl border border-white/10 bg-white/5'>
							<div className='flex justify-between items-center'>
								<div>
									<p className='text-sm font-medium text-white'>
										Resumen de cambios
									</p>
									<p className='text-xs text-white/40 mt-1'>
										{roleData.permissions.length} permiso
										{roleData.permissions.length !== 1 ? 's' : ''} asignado
										{roleData.permissions.length !== 1 ? 's' : ''}
									</p>
								</div>
								<span
									className='text-xs px-3 py-1.5 rounded-full
                  bg-[#C8A882]/10 text-[#C8A882] border border-[#C8A882]/20'>
									{
										Array.from(
											new Set(roleData.permissions.map((p) => p.module)),
										).length
									}{' '}
									módulos
								</span>
							</div>
						</div>
					)}

					{/* Botones */}
					<div className='flex justify-end gap-3 pt-4 border-t border-white/10'>
						<button
							type='button'
							onClick={handleClose}
							className='px-5 py-2.5 rounded-lg
                border border-white/15 bg-white/5
                text-white/70 text-sm
                hover:bg-white/10 hover:text-white
                transition-all duration-200'>
							Cancelar
						</button>
						<button
							type='submit'
							disabled={
								updateRole.isPending ||
								!roleData.name.trim() ||
								roleData.permissions.length === 0
							}
							className='px-5 py-2.5 rounded-lg
                bg-[#8B5E3C] hover:bg-[#6F452A]
                text-white text-sm font-medium
                shadow-lg shadow-[#8B5E3C]/20
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2
                transition-all duration-200'>
							{updateRole.isPending ? (
								<>
									<span className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></span>
									Guardando...
								</>
							) : (
								<>
									<Save size={14} />
									Guardar cambios
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default EditRoleModal;
