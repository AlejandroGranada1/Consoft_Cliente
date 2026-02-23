'use client';
import { X, Tag, FileText, Package, Edit, Eye, Layers } from 'lucide-react';
import { DefaultModalProps, Category } from '@/lib/types';
import React, { useState } from 'react';
import EditCategoryModal from './EditCategoryModal';

function CategoryDetailsModal({ isOpen, onClose, extraProps }: DefaultModalProps<Category>) {
	const [editModal, setEditModal] = useState(false);

	if (!isOpen || !extraProps) return null;

	return (
		<>
			<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
				<div className='modal-frame w-full max-w-[600px] flex flex-col max-h-[92vh]'>
					
					<header className='sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-xs'>
						<div className='flex items-center justify-between'>
							<h1 className='text-2xl font-bold flex items-center gap-2'>
								<Layers size={20} /> Detalles de Categoría
							</h1>
							<button
								onClick={onClose}
								className='p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors'>
								<X size={18} />
							</button>
						</div>
					</header>

					<div className='space-y-6 p-6 overflow-y-auto'>
						
						{/* Información principal */}
						<div className='grid grid-cols-1 gap-6'>
							{/* Nombre */}
							<div className='border rounded-lg p-4 bg-gray-50'>
								<h3 className='font-semibold mb-3 flex items-center gap-2'>
									<Tag size={16} />
									Nombre de la categoría
								</h3>
								<p className='text-gray-800 bg-white border rounded-md px-3 py-2'>
									{extraProps.name}
								</p>
							</div>

							{/* Descripción */}
							<div className='border rounded-lg p-4 bg-gray-50'>
								<h3 className='font-semibold mb-3 flex items-center gap-2'>
									<FileText size={16} />
									Descripción
								</h3>
								<p className='text-gray-700 bg-white border rounded-md px-3 py-2 min-h-[60px]'>
									{extraProps.description || 'Sin descripción'}
								</p>
							</div>

							{/* Productos */}
							<div className='border rounded-lg p-4 bg-gray-50'>
								<h3 className='font-semibold mb-3 flex items-center gap-2'>
									<Package size={16} />
									Productos asociados
								</h3>
								<div className='bg-white border rounded-md p-4'>
									<div className='flex items-center justify-between'>
										<span className='text-gray-600'>Cantidad de productos:</span>
										<span className='text-2xl font-bold text-brown'>
											{extraProps.products?.length || 0}
										</span>
									</div>
									
									{extraProps.products && extraProps.products.length > 0 && (
										<>
											<div className='border-t my-3'></div>
											<div className='max-h-32 overflow-y-auto space-y-2'>
												{extraProps.products.map((product: any, idx: number) => (
													<div key={idx} className='text-sm flex items-center gap-2 p-2 hover:bg-gray-50 rounded'>
														<Package size={14} className='text-gray-400' />
														<span className='text-gray-700'>
															{product.name || `Producto ${idx + 1}`}
														</span>
													</div>
												))}
											</div>
										</>
									)}
								</div>
							</div>
						</div>

						{/* Resumen */}
						<div className='p-4 bg-gray-50 rounded-lg border'>
							<div className='flex justify-between items-center'>
								<div>
									<span className='font-semibold text-lg'>Resumen:</span>
									<p className='text-sm text-gray-600 mt-1'>
										{extraProps.name}
									</p>
								</div>
								<div className='text-right'>
									<span className='text-sm font-medium text-brown bg-brown/10 px-3 py-1 rounded-full'>
										{extraProps.products?.length || 0} producto{(extraProps.products?.length || 0) !== 1 ? 's' : ''}
									</span>
								</div>
							</div>
						</div>

						{/* Botones */}
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
								Editar Categoría
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Edit Modal */}
			<EditCategoryModal
				isOpen={editModal}
				onClose={() => setEditModal(false)}
				extraProps={extraProps}
			/>
		</>
	);
}

export default CategoryDetailsModal;