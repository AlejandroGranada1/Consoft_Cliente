'use client';
import {
	X,
	Edit,
	User,
	MapPin,
	Calendar,
	Package,
	DollarSign,
	CheckCircle,
	Clock,
} from 'lucide-react';
import React, { useState } from 'react';
import { DefaultModalProps, Order, Service, User as UserType } from '@/lib/types';
import EditOrderModal from './EditOrderModal';

function OrderDetailsModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<Order>) {
	const [editModal, setEditModal] = useState(false);

	if (!isOpen || !extraProps) return null;

	const user = extraProps.user as UserType;
	const total = extraProps.items.reduce((sum, item) => sum + (item.valor || 0), 0);

	// Calcular pagos
	const totalPaid =
		extraProps.payments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
	const remaining = total - totalPaid;
	const paymentPercentage = total > 0 ? Math.round((totalPaid / total) * 100) : 0;

	// Colores dinámicos
	const getStatusColor = (status: string) => {
		switch (status?.toLowerCase()) {
			case 'completado':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'cancelado':
				return 'bg-red-100 text-red-800 border-red-200';
			case 'en proceso':
				return 'bg-blue-100 text-blue-800 border-blue-200';
			case 'pendiente':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	};

	const getPaymentStatusColor = (status: string) => {
		switch (status?.toLowerCase()) {
			case 'pagado':
				return 'bg-green-100 text-green-800';
			case 'parcial':
				return 'bg-blue-100 text-blue-800';
			case 'pendiente':
				return 'bg-yellow-100 text-yellow-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	return (
	<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
			<div className='modal-frame w-full max-w-[920px] flex flex-col max-h-[92vh]'>
				<header className='sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-xs'>
					<div className='absolute top-0 left-0 flex items-center gap-2'>
						<button
							onClick={onClose}
							className='p-1 text-gray-500 hover:text-black cursor-pointer hover:bg-gray-100 rounded-full'>
							<X size={20} />
						</button>
						<button
							onClick={() => setEditModal(true)}
							className='p-1 text-blue-600 hover:text-blue-800 cursor-pointer hover:bg-blue-50 rounded-full'
							title='Editar pedido'>
							<Edit size={18} />
						</button>
					</div>
					<h1 className='text-2xl font-bold text-center text-gray-800'>
						Detalles del Pedido
					</h1>
					<p className='text-center text-gray-600 text-sm mt-1'>
						ID: #{extraProps._id?.slice(-8).toUpperCase() || 'N/A'}
					</p>
				</header>

				<section className='space-y-6 px-6'>
					{/* Información principal */}
					<div className='grid grid-cols-2 gap-6'>
						{/* Información del cliente */}
						<div className='bg-gray-50 p-4 rounded-lg border'>
							<h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
								<User size={18} />
								Información del Cliente
							</h3>
							<div className='space-y-2'>
								<div>
									<p className='text-sm text-gray-600'>Nombre</p>
									<p className='font-medium'>{user?.name || 'No disponible'}</p>
								</div>
								<div>
									<p className='text-sm text-gray-600'>Email</p>
									<p className='font-medium'>{user?.email || 'No disponible'}</p>
								</div>
								<div>
									<p className='text-sm text-gray-600'>Teléfono</p>
									<p className='font-medium'>{user?.phone || 'No disponible'}</p>
								</div>
							</div>
						</div>

						{/* Información del pedido */}
						<div className='bg-gray-50 p-4 rounded-lg border'>
							<h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
								<Package size={18} />
								Información del Pedido
							</h3>
							<div className='space-y-2'>
								<div className='flex justify-between'>
									<span className='text-sm text-gray-600'>Estado:</span>
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
											extraProps.status
										)}`}>
										{extraProps.status || 'No definido'}
									</span>
								</div>
								<div className='flex justify-between'>
									<span className='text-sm text-gray-600'>Pago:</span>
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
											extraProps.paymentStatus
										)}`}>
										{extraProps.paymentStatus || 'Pendiente'}
									</span>
								</div>
								<div className='flex justify-between'>
									<span className='text-sm text-gray-600'>Fecha inicio:</span>
									<span className='font-medium'>
										{new Date(extraProps.startedAt).toLocaleDateString(
											'es-ES',
											{
												day: 'numeric',
												month: 'long',
												year: 'numeric',
											}
										)}
									</span>
								</div>
								{extraProps.deliveredAt && (
									<div className='flex justify-between'>
										<span className='text-sm text-gray-600'>
											Fecha entrega:
										</span>
										<span className='font-medium'>
											{new Date(extraProps.deliveredAt).toLocaleDateString(
												'es-ES'
											)}
										</span>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Dirección */}
					<div className='bg-gray-50 p-4 rounded-lg border'>
						<h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
							<MapPin size={18} />
							Dirección del Servicio
						</h3>
						<p className='text-gray-800'>
							{extraProps.address || user?.address || 'No especificada'}
						</p>
						{!extraProps.address && user?.address && (
							<p className='text-xs text-gray-500 mt-1'>
								(Usando dirección registrada del cliente)
							</p>
						)}
					</div>

					{/* Información de pago */}
					<div className='bg-gray-50 p-4 rounded-lg border'>
						<h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
							<DollarSign size={18} />
							Información de Pago
						</h3>
						<div className='space-y-3'>
							<div className='flex justify-between items-center'>
								<span className='text-gray-600'>Total del pedido:</span>
								<span className='text-xl font-bold text-gray-800'>
									${total.toLocaleString('es-CO')} COP
								</span>
							</div>

							{totalPaid > 0 && (
								<>
									<div className='flex justify-between items-center'>
										<span className='text-gray-600'>Pagado:</span>
										<span className='font-semibold text-green-600'>
											${totalPaid.toLocaleString('es-CO')} COP
										</span>
									</div>
									<div className='flex justify-between items-center'>
										<span className='text-gray-600'>Restante:</span>
										<span
											className={`font-semibold ${
												remaining > 0 ? 'text-orange-600' : 'text-green-600'
											}`}>
											${remaining.toLocaleString('es-CO')} COP
										</span>
									</div>

									{/* Barra de progreso */}
									<div className='pt-2'>
										<div className='flex justify-between text-xs text-gray-600 mb-1'>
											<span>Progreso de pago</span>
											<span>{paymentPercentage}%</span>
										</div>
										<div className='w-full bg-gray-200 rounded-full h-2'>
											<div
												className={`h-2 rounded-full ${
													paymentPercentage === 100
														? 'bg-green-500'
														: 'bg-blue-500'
												}`}
												style={{ width: `${paymentPercentage}%` }}></div>
										</div>
									</div>
								</>
							)}

							{extraProps.payments?.length > 0 && (
								<div className='mt-3'>
									<p className='text-sm font-medium text-gray-700 mb-2'>
										Historial de pagos:
									</p>
									<div className='space-y-2 max-h-40 overflow-y-auto'>
										{extraProps.payments.map((payment, idx) => (
											<div
												key={idx}
												className='flex justify-between items-center text-sm p-2 bg-white rounded border'>
												<div>
													<span className='font-medium'>
														${payment.amount?.toLocaleString('es-CO')}{' '}
														COP
													</span>
													<span className='text-xs text-gray-500 ml-2'>
														{new Date(
															payment.paidAt
														).toLocaleDateString('es-ES')}
													</span>
												</div>
												<span
													className={`px-2 py-1 rounded text-xs ${
														payment.status === 'approved'
															? 'bg-green-100 text-green-800'
															: 'bg-yellow-100 text-yellow-800'
													}`}>
													{payment.status === 'approved'
														? 'Aprobado'
														: 'Pendiente'}
												</span>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Servicios */}
					<div className='bg-gray-50 p-4 rounded-lg border'>
						<div className='flex justify-between items-center mb-3'>
							<h3 className='font-semibold text-lg flex items-center gap-2'>
								<Package size={18} />
								Servicios ({extraProps.items.length})
							</h3>
							<span className='text-sm text-gray-600'>
								Total: ${total.toLocaleString('es-CO')} COP
							</span>
						</div>

						<div className='overflow-x-auto'>
							<table className='w-full'>
								<thead>
									<tr className='border-b'>
										<th className='text-left py-2 px-3 text-sm font-medium text-gray-700'>
											Servicio
										</th>
										<th className='text-left py-2 px-3 text-sm font-medium text-gray-700'>
											Valor
										</th>
										<th className='text-left py-2 px-3 text-sm font-medium text-gray-700'>
											Detalles
										</th>
									</tr>
								</thead>
								<tbody>
									{extraProps.items.map((item, idx) => {
										const service = item.id_servicio as Service;
										return (
											<tr
												key={item._id || idx}
												className='border-b hover:bg-gray-100'>
												<td className='py-3 px-3'>
													<div>
														<p className='font-medium'>
															{service?.name ||
																'Servicio no disponible'}
														</p>
														{service?.description && (
															<p className='text-xs text-gray-500 mt-1 truncate max-w-xs'>
																{service.description}
															</p>
														)}
													</div>
												</td>
												<td className='py-3 px-3'>
													<p className='font-semibold text-gray-800'>
														${(item.valor || 0).toLocaleString('es-CO')}{' '}
														COP
													</p>
												</td>
												<td className='py-3 px-3'>
													<p className='text-gray-700'>
														{item.detalles || (
															<span className='text-gray-400 italic'>
																Sin detalles adicionales
															</span>
														)}
													</p>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>

						{extraProps.items.length === 0 && (
							<div className='text-center py-8 text-gray-500'>
								No hay servicios en este pedido
							</div>
						)}
					</div>
				</section>
			</div>

			{/* Modal de edición */}
			<EditOrderModal
				isOpen={editModal}
				onClose={() => {
					setEditModal(false);
					if (updateList) updateList(); // Actualizar lista después de editar
				}}
				extraProps={extraProps}
				updateList={updateList}
			/>
		</div>
	);
}

export default OrderDetailsModal;
