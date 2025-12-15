'use client';

import Link from 'next/link';
import { X, ShoppingCart, Trash2 } from 'lucide-react';
import { useDeleteCartItem, useMyCart } from '@/hooks/apiHooks';
import { useState } from 'react';

export default function CartDropdown({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean;
	setIsOpen: (v: boolean) => void;
}) {
	const { data, isLoading, refetch } = useMyCart();
	const deleteItem = useDeleteCartItem();
	const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

	if (!isOpen) return null;

	// ✔ Tomamos el carrito activo desde la API
	const activeCart = data?.quotations?.[0];
	const items = activeCart?.items || [];
	const itemCount = items.length;
	// En CartDropdown, justo después de obtener activeCart:
	console.log('🔍 CartDropdown - Debug:', {
		hasActiveCart: !!activeCart,
		activeCartId: activeCart?._id,
		activeCartStatus: activeCart?.status,
		itemCount: items.length,
		items: items.map((i: any) => ({ id: i._id, product: i.product?.name })),
	});
	const handleDeleteItem = async (itemId: string) => {
		if (!activeCart?._id) {
			console.error('No hay carrito activo');
			return;
		}

		const Swal = (await import('sweetalert2')).default;

		// Confirmación
		const confirm = await Swal.fire({
			title: '¿Eliminar producto?',
			text: 'Este producto se eliminará del carrito.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#3085d6',
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar',
		});

		if (!confirm.isConfirmed) return;

		setDeletingItemId(itemId);

		try {
			// IMPORTANTE: Verificar que el carrito aún exista y esté activo
			if (activeCart.status !== 'Carrito') {
				throw new Error('El carrito ya no está activo');
			}

			await deleteItem.mutateAsync({
				cartId: activeCart._id,
				itemId,
			});

			// Refrescar datos
			await refetch();

			Swal.fire({
				title: 'Eliminado',
				text: 'Producto eliminado del carrito.',
				icon: 'success',
				timer: 1500,
				showConfirmButton: false,
			});
		} catch (error: any) {
			console.error('Error eliminando item:', error);

			let errorMessage = 'No se pudo eliminar el producto';

			if (error.response?.status === 404) {
				errorMessage = 'El carrito ya no existe o ha sido procesado';
			} else if (error.message === 'El carrito ya no está activo') {
				errorMessage = 'El carrito ya no está disponible';
			} else if (error.response?.data?.message) {
				errorMessage = error.response.data.message;
			}

			Swal.fire({
				title: 'Error',
				text: errorMessage,
				icon: 'error',
				confirmButtonColor: '#5C3A21',
			});

			// Forzar refresco completo por si el carrito cambió
			refetch();
		} finally {
			setDeletingItemId(null);
		}
	};

	const handleGoToCart = () => {
		setIsOpen(false);
	};

	// Si no hay usuario activo o carrito, mostrar mensaje
	if (!activeCart && !isLoading) {
		return (
			<div className='absolute right-30 top-18 w-80 bg-white border shadow-xl rounded-xl p-5 z-50'>
				<div className='flex justify-between items-center mb-4'>
					<h3 className='text-lg font-semibold'>Carrito</h3>
					<button onClick={() => setIsOpen(false)}>
						<X className='w-5 h-5 cursor-pointer' />
					</button>
				</div>
				<div className='text-center py-4'>
					<p className='text-gray-500 mb-2'>No tienes un carrito activo</p>
					<Link
						href='/client/productos'
						onClick={handleGoToCart}
						className='text-[#5C3A21] hover:underline text-sm'>
						Ir a la tienda
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className='absolute right-30 top-18 w-80 bg-white border shadow-xl rounded-xl p-5 z-50'>
			{/* Header */}
			<div className='flex justify-between items-center mb-4'>
				<div className='flex items-center gap-2'>
					<ShoppingCart size={20} />
					<h3 className='text-lg font-semibold'>Carrito</h3>
					{itemCount > 0 && (
						<span className='bg-[#5C3A21] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
							{itemCount}
						</span>
					)}
				</div>
				<button
					onClick={() => setIsOpen(false)}
					className='p-1 hover:bg-gray-100 rounded-full transition-colors'>
					<X className='w-5 h-5 cursor-pointer text-gray-500' />
				</button>
			</div>

			{/* Loading */}
			{isLoading ? (
				<div className='py-8 text-center'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#5C3A21] mx-auto'></div>
					<p className='text-gray-500 text-sm mt-2'>Cargando carrito...</p>
				</div>
			) : itemCount === 0 ? (
				<div className='py-4 text-center'>
					<p className='text-gray-500 text-sm mb-3'>Tu carrito está vacío</p>
					<Link
						href='/client/productos'
						onClick={handleGoToCart}
						className='inline-block text-sm text-[#5C3A21] hover:underline'>
						Ir a la tienda
					</Link>
				</div>
			) : (
				<>
					<div className='space-y-3 max-h-60 overflow-y-auto pr-2'>
						{items.map((item: any) => (
							<div
								key={item._id}
								className='flex items-center gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors group'>
								<img
									src={
										item.product?.imageUrl &&
										item.product.imageUrl.trim() !== ''
											? item.product.imageUrl
											: '/def_prod.png'
									}
									className='w-14 h-14 rounded-lg object-cover border'
									alt={item.product?.name || 'Producto'}
								/>

								<div className='flex-1 min-w-0'>
									<p
										className='font-medium text-sm truncate'
										title={item.product?.name}>
										{item.product?.name}
									</p>
									<p className='text-xs text-gray-500'>
										Cantidad: {item.quantity}
									</p>
									{item.color && (
										<p className='text-xs text-gray-700 capitalize'>
											Color: {item.color}
										</p>
									)}
								</div>

								<button
									onClick={() => handleDeleteItem(item._id)}
									disabled={deletingItemId === item._id}
									className='p-1 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed'
									title='Eliminar producto'>
									{deletingItemId === item._id ? (
										<div className='w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin'></div>
									) : (
										<Trash2 size={14} />
									)}
								</button>
							</div>
						))}
					</div>

					{/* Footer */}
					{itemCount > 0 && (
						<div className='mt-5 space-y-3'>
							<div className='flex justify-between items-center text-sm border-t pt-3'>
								<span className='text-gray-600'>Total productos:</span>
								<span className='font-semibold'>{itemCount}</span>
							</div>

							<Link
								href='/client/carrito'
								onClick={handleGoToCart}
								className='block text-center bg-[#5C3A21] text-white py-2 rounded-lg hover:bg-[#472D19] transition-colors font-medium'>
								Ver carrito completo
							</Link>

							<button
								onClick={() => setIsOpen(false)}
								className='block w-full text-center text-sm text-gray-600 hover:text-gray-800 pt-1'>
								Seguir comprando
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
}
