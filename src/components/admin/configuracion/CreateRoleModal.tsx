'use client';

import { X, Shield, Package, Check, Users, FileText, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { DefaultModalProps, GroupPermission, Permission, Role } from '@/lib/types';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useGetPermissions } from '@/hooks/apiHooks';
import { createPortal } from 'react-dom';

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
	const [expandedModule, setExpandedModule] = useState<string | null>(null);
	const { data } = useGetPermissions();
	const permissions = (data?.permisos as GroupPermission[]) || [];

	const toggleModule = (module: string) => {
		setExpandedModule(prev => prev === module ? null : module);
	};

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

		// Aquí iría tu función createElement adaptada
		handleClose();
	};

	return createPortal(
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-4'
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
						Crear nuevo rol
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
								value={roleData.name}
								onChange={(e) => setRoleData({ ...roleData, name: e.target.value })}
								placeholder='Ej: Administrador'
								className='w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                  text-sm text-white placeholder:text-white/30
                  focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                  transition-all duration-200'
							/>
						</div>

						<div className='space-y-2'>
							<label className='text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block'>
								Descripción
							</label>
							<input
								value={roleData.description}
								onChange={(e) =>
									setRoleData({ ...roleData, description: e.target.value })
								}
								placeholder='Breve descripción del rol'
								className='w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                  text-sm text-white placeholder:text-white/30
                  focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                  transition-all duration-200'
							/>
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
							<div className='space-y-3 max-h-96 overflow-y-auto pr-2'>
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
											className='rounded-xl border border-white/10 bg-white/5 overflow-hidden transition-all duration-200'>
											<div
												className='flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 select-none'
												onClick={() => toggleModule(group.module)}
											>
												<div className='flex items-center gap-3' onClick={(e) => e.stopPropagation()}>
													<label className='flex items-center gap-2 cursor-pointer'>
														<input
															type='checkbox'
															checked={groupSelected}
															onChange={() => toggleGroup(group.module)}
															className='w-4 h-4 rounded border-white/30
																bg-white/5 text-[#C8A882]
																focus:ring-[#C8A882] focus:ring-1 focus:ring-offset-0
																transition-colors'
														/>
													</label>
													<span className='text-sm font-medium text-white'>
														{group.module}
													</span>
												</div>

												<div className='flex items-center gap-3'>
													{someSelected && !groupSelected && (
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
													{expandedModule === group.module ? (
														<ChevronUp size={16} className='text-white/40' />
													) : (
														<ChevronDown size={16} className='text-white/40' />
													)}
												</div>
											</div>

											<div className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedModule === group.module ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
												<div className='p-4 pt-0 border-t border-white/5'>
													<div className='grid grid-cols-2 gap-2 mt-3'>
														{group.permissions.map((p) => (
															<label
																key={p._id}
																className='flex items-center gap-2 cursor-pointer
																	p-2 rounded-lg hover:bg-white/5 transition-colors'>
																<input
																	type='checkbox'
																	checked={roleData.permissions.some(
																		(x) => x._id === p._id,
																	)}
																	onChange={() => togglePermission(p)}
																	className='w-3.5 h-3.5 rounded border-white/30
																		bg-white/5 text-[#C8A882]
																		focus:ring-[#C8A882] focus:ring-1 focus:ring-offset-0'
																/>
																<span className='text-xs text-white/70'>
																	{p.action === 'view' && 'Ver'}
																	{p.action === 'create' && 'Crear'}
																	{p.action === 'update' && 'Editar'}
																	{p.action === 'delete' && 'Eliminar'}
																</span>
															</label>
														))}
													</div>

													{someSelected && (
														<div className='mt-3 pt-3 border-t border-white/10'>
															<p className='text-[10px] text-white/30'>
																{
																	group.permissions.filter((p) =>
																		roleData.permissions.some(
																			(rp) => rp._id === p._id,
																		),
																	).length
																}{' '}
																de {group.permissions.length} seleccionados
															</p>
														</div>
													)}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>

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
							disabled={!roleData.name.trim() || roleData.permissions.length === 0}
							className='px-5 py-2.5 rounded-lg
                bg-[#8B5E3C] hover:bg-[#6F452A]
                text-white text-sm font-medium
                shadow-lg shadow-[#8B5E3C]/20
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200'>
							Crear Rol
						</button>
					</div>
				</form>
			</div>
		</div>,
		document.body
	);
}

export default CreateRoleModal;
