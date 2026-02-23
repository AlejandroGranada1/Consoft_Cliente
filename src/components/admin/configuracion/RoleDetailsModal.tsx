import { X, Shield, Package, Check, Edit, User, Info } from 'lucide-react';
import { DefaultModalProps, Role } from '@/lib/types';
import React, { useState } from 'react';
import EditRoleModal from './EditRoleModal';

function RoleDetailsModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<Role>) {
	const [editModal, setEditModal] = useState(false);

	if (!isOpen || !extraProps) return null;

	// 📌 Agrupar permisos por módulo
	const modules = Array.from(new Set(extraProps.permissions?.map((p) => p.module)));

	return (
		<>
			<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
				<div className='modal-frame w-full max-w-[600px] flex flex-col max-h-[92vh]'>
					
					<header className='sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-xs'>
						<button
							onClick={onClose}
							className='absolute top-0 left-0 p-5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors'>
							<X size={20} />
						</button>
						<h1 className='text-2xl font-bold text-center flex items-center justify-center gap-2'>
							<Shield size={20} /> Detalles del Rol
						</h1>
					</header>

					<div className='space-y-6 p-6 overflow-y-auto'>
						
						{/* Información principal del rol - similar a la sección principal de EditOrderModal */}
						<div className='grid grid-cols-2 gap-6'>
							{/* Nombre */}
							<div className='flex flex-col'>
								<label className='font-medium mb-1 flex items-center gap-2'>
									<User size={16} />
									Rol
								</label>
								<p className='border px-3 py-2 rounded-md bg-gray-50 text-gray-700'>
									{extraProps.name}
								</p>
							</div>

							{/* Estado */}
							<div className='flex flex-col'>
								<label className='font-medium mb-1 flex items-center gap-2'>
									<Info size={16} />
									Estado
								</label>
								<div className='flex items-center h-10'>
									<span
										className={`px-3 py-1 rounded-full text-sm font-medium ${
											extraProps.status
												? 'bg-green-100 text-green-700'
												: 'bg-red-100 text-red-700'
										}`}>
										{extraProps.status ? 'Activo' : 'Inactivo'}
									</span>
								</div>
							</div>
						</div>

						{/* Descripción */}
						<div className='flex flex-col'>
							<label className='font-medium mb-1 flex items-center gap-2'>
								<DescriptionIcon size={16} />
								Descripción
							</label>
							<p className='border px-3 py-2 rounded-md bg-gray-50 text-gray-700 min-h-[42px]'>
								{extraProps.description || 'Sin descripción'}
							</p>
						</div>

						{/* Metadata adicional - similar a las fechas en EditOrderModal */}
						<div className='grid grid-cols-2 gap-6'>
							<div className='flex flex-col'>
								<label className='font-medium mb-1 text-xs text-gray-500'>
									Fecha de creación
								</label>
								<p className='text-sm'>
									{extraProps.createdAt 
										? new Date(extraProps.createdAt).toLocaleDateString('es-CO', {
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
									{extraProps.usersCount || 0} usuario{(extraProps.usersCount || 0) !== 1 ? 's' : ''}
								</p>
							</div>
						</div>

						{/* Sección de permisos - similar a la sección de servicios en EditOrderModal */}
						<div className='border rounded-lg p-4'>
							<div className='flex justify-between items-center mb-4'>
								<h3 className='font-semibold text-lg flex items-center gap-2'>
									<Package size={18} />
									Permisos ({extraProps.permissions?.length || 0})
								</h3>
								{extraProps.permissions && extraProps.permissions.length > 0 && (
									<span className='text-sm text-gray-500'>
										{modules.length} módulo{modules.length !== 1 ? 's' : ''}
									</span>
								)}
							</div>

							{!extraProps.permissions || extraProps.permissions.length === 0 ? (
								<div className='text-center py-8 text-gray-500 bg-gray-50 rounded-lg'>
									No hay permisos asignados a este rol.
								</div>
							) : (
								<div className='space-y-4 max-h-80 overflow-y-auto p-1'>
									{modules.map((module) => {
										const moduloPerms = extraProps.permissions?.filter(
											(p) => p.module === module
										);

										return (
											<div key={module} className='bg-gray-50 p-4 rounded-lg border'>
												<div className='flex items-center justify-between mb-3'>
													<h3 className='font-semibold text-base'>{module}</h3>
													<span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full'>
														{moduloPerms?.length} permiso{moduloPerms?.length !== 1 ? 's' : ''}
													</span>
												</div>
												
												<div className='grid grid-cols-2 gap-3'>
													{moduloPerms?.map((permission) => (
														<label
															key={permission._id}
															className='flex items-center gap-2 text-sm p-1 rounded bg-white border'>
															<input
																type='checkbox'
																checked
																disabled
																className='rounded border-gray-300 text-brown focus:ring-brown focus:ring-1 opacity-60'
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

												{/* Contador de permisos por módulo */}
												<div className='mt-2 text-xs text-gray-500 border-t pt-2'>
													<TodoCheck size={12} className='inline mr-1' />
													Todos los permisos de {module}
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>

						{/* Resumen - similar al total en EditOrderModal */}
						{extraProps.permissions && extraProps.permissions.length > 0 && (
							<div className='p-4 bg-gray-50 rounded-lg border'>
								<div className='flex justify-between items-center'>
									<div>
										<span className='font-semibold text-lg'>Resumen del rol:</span>
										<p className='text-sm text-gray-600'>
											{extraProps.permissions.length} permiso{extraProps.permissions.length !== 1 ? 's' : ''} en {modules.length} módulo{modules.length !== 1 ? 's' : ''}
										</p>
									</div>
									<div className='text-right'>
										<span className='text-sm font-medium text-brown bg-brown/10 px-3 py-1 rounded-full'>
											{extraProps.status ? 'Activo' : 'Inactivo'}
										</span>
									</div>
								</div>
							</div>
						)}

						{/* Botones de acción */}
						<div className='flex justify-between pt-4 border-t'>
							<button
								type='button'
								onClick={onClose}
								className='px-6 py-2 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-100 transition-colors'>
								Cerrar
							</button>
							<button
								type='button'
								onClick={() => setEditModal(true)}
								className='px-6 py-2 border border-brown text-brown rounded-md hover:bg-brown hover:text-white transition-colors flex items-center gap-2'>
								<Edit size={16} />
								Editar Rol
							</button>
						</div>
					</div>
				</div>
			</div>

			<EditRoleModal
				isOpen={editModal}
				onClose={() => setEditModal(false)}
				extraProps={extraProps}
				updateList={updateList}
			/>
		</>
	);
}

// Iconos personalizados para mantener consistencia
const DescriptionIcon = ({ size }: { size: number }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M4 6h16M4 12h16M4 18h7"/>
	</svg>
);

const TodoCheck = ({ size, className }: { size: number; className?: string }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
		<path d="M20 6L9 17l-5-5"/>
	</svg>
);

export default RoleDetailsModal;