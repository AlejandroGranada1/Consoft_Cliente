'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMyCart, useRemoveItem, useSubmitQuotation } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';

export default function CartPage() {
	const router = useRouter();
	const { user, loading } = useUser();

	const { data: cart, isLoading, refetch } = useMyCart();
	const deleteItem = useRemoveItem();
	const submitQuotation = useSubmitQuotation();

	useEffect(() => {
		if (loading) return;

		if (user === null) {
			(async () => {
				const Swal = (await import('sweetalert2')).default;
				await Swal.fire({
					icon: 'warning',
					title: 'Inicia sesión',
					text: 'Debes iniciar sesión para acceder a tu carrito.',
				});
				router.push('/client/auth/login');
			})();
		}
	}, [user, loading, router]);

	if (user === undefined) return <p className='p-6'>Validando sesión...</p>;
	if (user === null) return null;
	if (isLoading) return <p className='p-6 text-center'>Cargando carrito...</p>;

	const items = cart?.items || [];

	console.log(items);

	const handleDeleteItem = async (itemId: string) => {
		const Swal = (await import('sweetalert2')).default;

		const confirm = await Swal.fire({
			title: '¿Eliminar producto?',
			icon: 'warning',
			showCancelButton: true,
		});

		if (!confirm.isConfirmed) return;

		console.log('cartId:', cart?._id);
		console.log('itemId:', itemId);

		await deleteItem.mutateAsync({ quotationId: cart._id, itemId });
		await refetch();

		Swal.fire('Eliminado', '', 'success');
	};

	const handleClearCart = async () => {
		const Swal = (await import('sweetalert2')).default;

		const confirm = await Swal.fire({
			title: '¿Vaciar carrito?',
			icon: 'warning',
			showCancelButton: true,
		});

		if (!confirm.isConfirmed) return;

		await Promise.all(
			items.map((item: any) =>
				deleteItem.mutateAsync({ quotationId: cart._id, itemId: item._id }),
			),
		);

		await refetch();
	};

	const handleSendQuote = async () => {
		if (!items.length) return;

		const Swal = (await import('sweetalert2')).default;

		const confirm = await Swal.fire({
			title: '¿Enviar cotización?',
			icon: 'question',
			showCancelButton: true,
		});

		if (!confirm.isConfirmed) return;

		await submitQuotation.mutateAsync(cart._id);
		await refetch();

		Swal.fire('Cotización enviada', '', 'success');
	};

	return (
		<section className='p-10 max-w-3xl mx-auto'>
			<h1 className='text-3xl font-bold mb-6'>Carrito</h1>

			{items.length === 0 ? (
				<div className='bg-gray-50 border rounded-xl p-6 text-center'>
					Tu carrito está vacío
				</div>
			) : (
				<>
					<div className='space-y-6'>
						{items.map((item: any) => (
							<div
								key={item._id}
								className='flex gap-4 p-4 border rounded-xl'>
								<img
									src={
										item.isCustom
											? item.customDetails.referenceImage
											: item.product?.imageUrl || '/def_prod.png'
									}
									className='w-24 h-24 object-cover rounded-lg border'
								/>

								<div className='flex-1'>
									<p className='font-semibold text-lg'>
										{item.product?.name || item.customDetails?.name}
									</p>
									<p className='text-sm'>Cantidad: {item.quantity}</p>
								</div>

								<button
									onClick={() => handleDeleteItem(item._id)}
									className='text-red-600 text-sm'>
									Eliminar
								</button>
							</div>
						))}
					</div>

					<div className='flex gap-4 mt-6'>
						<button
							onClick={handleClearCart}
							className='bg-red-600 text-white px-5 py-2 rounded-lg'>
							Vaciar carrito
						</button>

						<button
							onClick={handleSendQuote}
							className='bg-blue-600 text-white px-5 py-2 rounded-lg ml-auto'>
							Solicitar cotización
						</button>
					</div>
				</>
			)}
		</section>
	);
}
