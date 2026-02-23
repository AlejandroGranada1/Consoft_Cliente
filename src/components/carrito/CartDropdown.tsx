'use client';

import Link from 'next/link';
import { X, ShoppingCart, Trash2, PackageOpen } from 'lucide-react';
import { useRemoveItem, useMyCart } from '@/hooks/apiHooks';
import { useState } from 'react';

export default function CartDropdown({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean;
	setIsOpen: (v: boolean) => void;
}) {
	const { data, isLoading, refetch } = useMyCart();
	const deleteItem = useRemoveItem();
	const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
	const [clearingCart, setClearingCart] = useState(false);

	if (!isOpen) return null;

	const activeCart = data;
	const items = activeCart?.items || [];
	const itemCount = items.length;

	const handleDeleteItem = async (itemId: string) => {
		if (!activeCart?._id) return;
		const Swal = (await import('sweetalert2')).default;
		const confirm = await Swal.fire({
			title: '¿Eliminar producto?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#6b7280',
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar',
		});
		if (!confirm.isConfirmed) return;

		setDeletingItemId(itemId);
		try {
			await deleteItem.mutateAsync({ quotationId: activeCart._id, itemId });
			await refetch();
		} catch (error: any) {
			Swal.fire({ title: 'Error', text: error.response?.data?.message || 'No se pudo eliminar', icon: 'error' });
			refetch();
		} finally {
			setDeletingItemId(null);
		}
	};

	const handleClearCart = async () => {
		if (!activeCart?._id || !items.length) return;
		const Swal = (await import('sweetalert2')).default;
		const confirm = await Swal.fire({
			title: '¿Vaciar carrito?',
			text: 'Se eliminarán todos los productos.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#6b7280',
			confirmButtonText: 'Sí, vaciar',
			cancelButtonText: 'Cancelar',
		});
		if (!confirm.isConfirmed) return;

		setClearingCart(true);
		try {
			await Promise.all(
				items.map((item: any) =>
					deleteItem.mutateAsync({ quotationId: activeCart._id, itemId: item._id })
				)
			);
			await refetch();
		} catch {
			Swal.fire({ title: 'Error', text: 'No se pudo vaciar el carrito', icon: 'error' });
			refetch();
		} finally {
			setClearingCart(false);
		}
	};

	// Empty state
	if (!activeCart && !isLoading) {
		return (
			<div className='absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden'>
				<div className='flex items-center justify-between px-4 py-3 border-b border-gray-100'>
					<div className='flex items-center gap-2'>
						<ShoppingCart size={16} className='text-gray-500' />
						<span className='text-sm font-semibold text-gray-800'>Carrito</span>
					</div>
					<button onClick={() => setIsOpen(false)} className='p-1 rounded-full hover:bg-gray-100 text-gray-400 transition'>
						<X size={16} />
					</button>
				</div>
				<div className='flex flex-col items-center py-8 px-4 gap-2 text-gray-300'>
					<PackageOpen size={36} />
					<p className='text-sm text-gray-400'>No tienes un carrito activo</p>
					<Link href='/client/productos' onClick={() => setIsOpen(false)}
						className='text-xs text-[#6e4424] hover:underline mt-1'>
						Ir a la tienda →
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className='absolute right-75 top-18 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden'>

			{/* Header */}
			<div className='flex items-center justify-between px-4 py-3 border-b border-gray-100'>
				<div className='flex items-center gap-2'>
					<ShoppingCart size={16} className='text-gray-500' />
					<span className='text-sm font-semibold text-gray-800'>Carrito</span>
					{itemCount > 0 && (
						<span className='bg-[#6e4424] text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center'>
							{itemCount}
						</span>
					)}
				</div>
				<button onClick={() => setIsOpen(false)} className='p-1 rounded-full hover:bg-gray-100 text-gray-400 transition'>
					<X size={16} />
				</button>
			</div>

			{/* Body */}
			{isLoading ? (
				<div className='py-10 flex flex-col items-center gap-2'>
					<div className='animate-spin rounded-full h-6 w-6 border-2 border-[#6e4424] border-t-transparent' />
					<p className='text-xs text-gray-400'>Cargando...</p>
				</div>
			) : itemCount === 0 ? (
				<div className='flex flex-col items-center py-8 px-4 gap-2 text-gray-300'>
					<PackageOpen size={36} />
					<p className='text-sm text-gray-400'>Tu carrito está vacío</p>
					<Link href='/client/productos' onClick={() => setIsOpen(false)}
						className='text-xs text-[#6e4424] hover:underline mt-1'>
						Ir a la tienda →
					</Link>
				</div>
			) : (
				<>
					{/* Items */}
					<div className='divide-y divide-gray-50 max-h-64 overflow-y-auto'>
						{items.map((item: any) => (
							<div key={item._id} className='flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition'>
								<img
									src={item.isCustom ? item.customDetails.referenceImage : item.product?.imageUrl?.trim() ? item.product.imageUrl : '/def_prod.png'}
									className='w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0'
									alt={item.product?.name || 'Producto'}
								/>
								<div className='flex-1 min-w-0'>
									<p className='text-sm font-medium text-gray-800 truncate'>{item.product?.name}</p>
									<div className='flex items-center gap-2 mt-0.5'>
										<span className='text-xs text-gray-400'>Cant: {item.quantity}</span>
										{item.color && (
											<>
												<span className='text-gray-200'>·</span>
												<span className='text-xs text-gray-400 capitalize'>{item.color}</span>
											</>
										)}
									</div>
								</div>
								<button
									onClick={() => handleDeleteItem(item._id)}
									disabled={deletingItemId === item._id || clearingCart}
									className='p-1.5 text-gray-300 hover:text-red-400 disabled:opacity-40 transition rounded-lg hover:bg-red-50'>
									{deletingItemId === item._id ? (
										<div className='w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin' />
									) : (
										<Trash2 size={13} />
									)}
								</button>
							</div>
						))}
					</div>

					{/* Footer */}
					<div className='p-4 border-t border-gray-100 space-y-2'>
						<div className='flex justify-between items-center mb-3'>
							<span className='text-xs text-gray-400'>Total productos</span>
							<span className='text-sm font-semibold text-gray-800'>{itemCount}</span>
						</div>

						<Link
							href='/client/carrito'
							onClick={() => setIsOpen(false)}
							className='block text-center bg-[#6e4424] hover:bg-[#5a3519] text-white text-sm py-2.5 rounded-xl transition font-medium'>
							Ver carrito completo
						</Link>

						<button
							onClick={handleClearCart}
							disabled={clearingCart || deleteItem.isPending}
							className='w-full text-center border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-red-500 hover:border-red-200 text-sm py-2.5 rounded-xl transition font-medium disabled:opacity-50'>
							{clearingCart ? (
								<span className='flex items-center justify-center gap-2'>
									<div className='w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin' />
									Vaciando...
								</span>
							) : 'Vaciar carrito'}
						</button>
					</div>
				</>
			)}
		</div>
	);
}