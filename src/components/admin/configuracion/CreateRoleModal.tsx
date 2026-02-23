import { X, Shield, Package, Check } from 'lucide-react';
import { DefaultModalProps, GroupPermission, Permission, Role } from '@/lib/types';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { createElement } from '../global/alerts';
import { useGetPermissions } from '@/hooks/apiHooks';

const initialState: Role = {
	_id: crypto.randomUUID(),
	name: '',
	description: '',
	status: true,
	permissions: [],
	createdAt: '',
	usersCount: 0,
};

function CreateRoleModal({ isOpen, onClose, updateList }: DefaultModalProps<Role>) {
	const [roleData, setRoleData] = useState<Role>(initialState);
	const { data } = useGetPermissions();
	const permissions = (data?.permisos as GroupPermission[]) || [];

	if (!isOpen) return null;

	const handleClose = () => {
		setRoleData({ ...initialState, _id: crypto.randomUUID() });
		onClose();
	};

	const togglePermission = (permission: Permission) => {
		setRoleData((prev) => {
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
		const group = permissions.find((g) => g.module === module);
		if (!group) return;

		const selected = group.permissions.every((p) =>
			roleData.permissions.some((rp) => rp._id === p._id),
		);

		setRoleData((prev) => ({
			...prev,
			permissions: selected
				? prev.permissions.filter((p) => p.module !== module)
				: [...prev.permissions, ...group.permissions],
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!roleData.name.trim())
			return Swal.fire('Campo requerido', 'Nombre obligatorio', 'warning');

		if (!roleData.permissions.length)
			return Swal.fire('Permisos requeridos', 'Selecciona permisos', 'warning');

		createElement(
			'Rol',
			`/api/roles`,
			{
				name: roleData.name,
				description: roleData.description,
				permissions: roleData.permissions.map((p) => p._id),
			},
			() => updateList?.(),
		);

		handleClose();
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
						<Shield size={20} /> Crear Rol
					</h1>
				</header>

				<form
					onSubmit={handleSubmit}
					className='space-y-6 p-6 overflow-y-auto'>
					{/* Información principal del rol */}
					<div className='grid grid-cols-2 gap-6'>
						<div className='flex flex-col'>
							<label className='font-medium mb-1 flex items-center gap-2'>
								<RolIcon size={16} />
								Nombre *
							</label>
							<input
								value={roleData.name}
								onChange={(e) => setRoleData({ ...roleData, name: e.target.value })}
								placeholder='Ej: Administrador'
								className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown'
							/>
						</div>

						<div className='flex flex-col'>
							<label className='font-medium mb-1 flex items-center gap-2'>
								<DescriptionIcon size={16} />
								Descripción
							</label>
							<input
								value={roleData.description}
								onChange={(e) =>
									setRoleData({ ...roleData, description: e.target.value })
								}
								placeholder='Breve descripción del rol'
								className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown'
							/>
						</div>
					</div>

					{/* Sección de permisos - similar a la sección de servicios en EditOrderModal */}
					<div className='border rounded-lg p-4'>
						<div className='flex justify-between items-center mb-4'>
							<h3 className='font-semibold text-lg flex items-center gap-2'>
								<Package size={18} />
								Permisos ({roleData.permissions.length})
							</h3>
							{roleData.permissions.length > 0 && (
								<span className='text-sm text-gray-500'>
									{roleData.permissions.length} permiso
									{roleData.permissions.length !== 1 ? 's' : ''} seleccionado
									{roleData.permissions.length !== 1 ? 's' : ''}
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
									const groupSelected = group.permissions.every((p) =>
										roleData.permissions.some((rp) => rp._id === p._id),
									);
									const someSelected = group.permissions.some((p) =>
										roleData.permissions.some((rp) => rp._id === p._id),
									);

									return (
										<div
											key={group.module}
											className='bg-gray-50 p-4 rounded-lg border'>
											<div className='flex items-center justify-between mb-3'>
												<label className='font-semibold flex items-center gap-2 cursor-pointer'>
													<input
														type='checkbox'
														checked={groupSelected}
														onChange={() => toggleGroup(group.module)}
														className='rounded border-gray-300 text-brown focus:ring-brown focus:ring-1'
													/>
													<span className='text-base'>
														{group.module}
													</span>
												</label>
												{someSelected && !groupSelected && (
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
												{group.permissions.map((p) => (
													<label
														key={p._id}
														className='flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors'>
														<input
															type='checkbox'
															checked={roleData.permissions.some(
																(x) => x._id === p._id,
															)}
															onChange={() => togglePermission(p)}
															className='rounded border-gray-300 text-brown focus:ring-brown focus:ring-1'
														/>
														<span className='text-gray-700'>
															{p.action}
														</span>
													</label>
												))}
											</div>

											{/* Contador de permisos seleccionados en el grupo */}
											{group.permissions.filter((p) =>
												roleData.permissions.some((rp) => rp._id === p._id),
											).length > 0 && (
												<div className='mt-2 text-xs text-gray-500 border-t pt-2'>
													{
														group.permissions.filter((p) =>
															roleData.permissions.some(
																(rp) => rp._id === p._id,
															),
														).length
													}{' '}
													de {group.permissions.length} permisos
													seleccionados
												</div>
											)}
										</div>
									);
								})}
							</div>
						)}
					</div>

					{/* Resumen de permisos seleccionados - similar al total en EditOrderModal */}
					{roleData.permissions.length > 0 && (
						<div className='p-4 bg-gray-50 rounded-lg border'>
							<div className='flex justify-between items-center'>
								<div>
									<span className='font-semibold text-lg'>
										Resumen de permisos:
									</span>
									<p className='text-sm text-gray-600'>
										{roleData.permissions.length} permiso
										{roleData.permissions.length !== 1 ? 's' : ''} asignado
										{roleData.permissions.length !== 1 ? 's' : ''}
									</p>
								</div>
								<div className='text-right'>
									<span className='text-sm font-medium text-brown bg-brown/10 px-3 py-1 rounded-full'>
										{
											Array.from(
												new Set(roleData.permissions.map((p) => p.module)),
											).length
										}{' '}
										módulo
										{Array.from(
											new Set(roleData.permissions.map((p) => p.module)),
										).length !== 1
											? 's'
											: ''}
									</span>
								</div>
							</div>
						</div>
					)}

					{/* Botones de acción */}
					<div className='flex justify-between pt-4 border-t'>
						<button
							type='button'
							onClick={handleClose}
							className='px-6 py-2 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-100 transition-colors'>
							Cancelar
						</button>
						<button
							type='submit'
							disabled={!roleData.name.trim() || roleData.permissions.length === 0}
							className={`px-6 py-2 border border-brown rounded-md transition-colors ${
								!roleData.name.trim() || roleData.permissions.length === 0
									? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500'
									: 'text-brown hover:bg-brown hover:text-white'
							}`}>
							Crear Rol
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

// Iconos personalizados para mantener consistencia
const RolIcon = ({ size }: { size: number }) => (
	<svg
		width={size}
		height={size}
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'>
		<path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
	</svg>
);

const DescriptionIcon = ({ size }: { size: number }) => (
	<svg
		width={size}
		height={size}
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'>
		<path d='M4 6h16M4 12h16M4 18h7' />
	</svg>
);

export default CreateRoleModal;
