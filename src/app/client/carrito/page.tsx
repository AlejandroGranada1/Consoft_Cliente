'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMyCart } from '@/hooks/apiHooks';
import { useDeleteCartItem, useSubmitQuotation } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';

export default function CartPage() {
	const router = useRouter();
	const { user, loading } = useUser();
	const { data, isLoading, refetch } = useMyCart(); // ✅ Ya filtra solo carritos activos
	const deleteItem = useDeleteCartItem();
	const submitQuotation = useSubmitQuotation();

	// 🚨 PROTEGER RUTA 🚨
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

	// ✅ El hook useMyCart YA filtra solo carritos activos
	const quotations = data?.quotations || [];

	// Tomar el carrito activo (debería haber máximo uno)
	const activeCart = quotations[0];
	const items = activeCart?.items || [];

	// 🔥 Si NO hay carritos activos
	if (quotations.length === 0) {
		return (
			<section className='p-10 max-w-3xl mx-auto'>
				<h1 className='text-3xl font-bold mb-6'>Carrito</h1>
				<div className='bg-blue-50 border border-blue-200 rounded-xl p-6 text-center'>
					<p className='text-gray-600 mb-2'>Tu carrito está vacío</p>
					<p className='text-gray-500 text-sm mb-4'>
						Agrega productos desde la tienda para crear un carrito.
					</p>
					<button
						onClick={() => router.push('/client/productos')}
						className='bg-[#5C3A21] text-white px-4 py-2 rounded-lg hover:bg-[#472D19]'>
						Ir a la tienda
					</button>
				</div>
			</section>
		);
	}

	// 🔥 Si por alguna razón el carrito no está activo (no debería pasar)
	if (activeCart.status?.toLowerCase() !== 'carrito') {
		return (
			<section className='p-10 max-w-3xl mx-auto'>
				<h1 className='text-3xl font-bold mb-6'>Carrito</h1>
				<div className='bg-yellow-50 border border-yellow-300 text-yellow-800 p-5 rounded-xl'>
					<p className='font-medium'>
						Este carrito ya fue procesado (estado: {activeCart.status}).
					</p>
					<p className='text-sm mt-1'>
						Para agregar más productos, necesitas un nuevo carrito. Ve a la tienda y
						agrega un producto para crear uno automáticamente.
					</p>
					<button
						onClick={() => router.push('/client/productos')}
						className='mt-3 bg-[#5C3A21] text-white px-4 py-2 rounded-lg hover:bg-[#472D19]'>
						Ir a la tienda
					</button>
				</div>
			</section>
		);
	}

	const handleDeleteItem = async (itemId: string) => {
		if (!activeCart?._id) return;

		const Swal = (await import('sweetalert2')).default;
		const confirm = await Swal.fire({
			title: '¿Eliminar producto?',
			text: 'Este producto se eliminará del carrito.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Eliminar',
			cancelButtonText: 'Cancelar',
		});

		if (!confirm.isConfirmed) return;

		deleteItem.mutate(
			{ cartId: activeCart._id, itemId },
			{
				onSuccess: () => {
					Swal.fire('Eliminado', 'Producto eliminado del carrito.', 'success');
					refetch();
				},
			}
		);
	};

	const handleClearCart = async () => {
		if (!activeCart?._id || items.length === 0) return;

		const Swal = (await import('sweetalert2')).default;
		const confirm = await Swal.fire({
			title: '¿Vaciar carrito?',
			text: `Se eliminarán ${items.length} producto(s) del carrito.`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Sí, vaciar',
			cancelButtonText: 'Cancelar',
		});

		if (confirm.isConfirmed) {
			try {
				// Eliminar todos los items uno por uno
				for (const item of items) {
					await deleteItem.mutateAsync({ cartId: activeCart._id, itemId: item._id });
				}

				Swal.fire('Carrito vacío', 'El carrito se vació con éxito.', 'success');
				refetch();
			} catch (error) {
				Swal.fire('Error', 'No se pudo vaciar el carrito.', 'error');
			}
		}
	};

	const handleSendQuote = async () => {
		if (!activeCart?._id) return;

		const Swal = (await import('sweetalert2')).default;

		if (items.length === 0) {
			Swal.fire({
				icon: 'warning',
				title: 'El carrito está vacío',
				text: 'Agrega productos antes de enviar una cotización.',
			});
			return;
		}

		try {
			const result = await Swal.fire({
				title: '¿Enviar cotización?',
				html: `
					<p>Se enviará una solicitud con tus productos:</p>
					<ul class="text-left mt-2">
						${items.map((item: any) => `<li>• ${item.product.name} (x${item.quantity})</li>`).join('')}
					</ul>
				`,
				icon: 'question',
				showCancelButton: true,
				confirmButtonText: 'Enviar',
				cancelButtonText: 'Cancelar',
			});

			if (result.isConfirmed) {
				await submitQuotation.mutateAsync(activeCart._id);
				await refetch();

				Swal.fire({
					icon: 'success',
					title: '¡Cotización enviada!',
					html: `
						<p>Nos pondremos en contacto contigo pronto.</p>
						<p class="text-sm text-gray-600 mt-2">
							Puedes ver el estado de tu cotización en "Mis Cotizaciones".
						</p>
					`,
				});
			}
		} catch (error: any) {
			const message =
				error.response?.data?.message === 'The Quotation has already been requested'
					? 'Esta cotización ya fue solicitada anteriormente.'
					: error.response?.data?.message || 'Error al solicitar la cotización';

			Swal.fire({
				title: 'Error',
				icon: 'error',
				text: message,
			});
		}
	};

	return (
		<section className='p-10 max-w-3xl mx-auto'>
			<h1 className='text-3xl font-bold mb-6'>Carrito</h1>

			{items.length === 0 ? (
				<div className='bg-gray-50 border border-gray-200 rounded-xl p-6 text-center'>
					<p className='text-gray-600'>Tu carrito está vacío.</p>
					<button
						onClick={() => router.push('/client/productos')}
						className='mt-3 bg-[#5C3A21] text-white px-4 py-2 rounded-lg hover:bg-[#472D19]'>
						Agregar productos
					</button>
				</div>
			) : (
				<>
					<div className='space-y-6'>
						{items.map((item: any) => (
							<div
								key={item._id}
								className='flex gap-4 bg-white p-4 rounded-xl shadow-md border'>
								<img
									src={
										item.product.imageUrl?.trim()
											? item.product.imageUrl
											: '/def_prod.png'
									}
									alt={item.product.name}
									className='w-24 h-24 object-cover rounded-lg border'
								/>

								<div className='flex-1'>
									<p className='font-semibold text-lg'>{item.product.name}</p>
									<p className='text-sm text-gray-500'>
										Cantidad: {item.quantity}
									</p>
									{item.color && (
										<p className='text-sm text-gray-700'>
											Color: <span className='capitalize'>{item.color}</span>
										</p>
									)}
									{item.size && (
										<p className='text-sm text-gray-700'>Tamaño: {item.size}</p>
									)}
									{item.notes && (
										<p className='text-sm text-gray-700'>Notas: {item.notes}</p>
									)}
								</div>

								<button
									onClick={() => handleDeleteItem(item._id)}
									className='text-red-600 text-sm hover:text-red-800 hover:underline self-start'>
									Eliminar
								</button>
							</div>
						))}

						<div className='flex flex-col sm:flex-row gap-4 mt-6'>
							<button
								onClick={handleClearCart}
								className='bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-colors'>
								Vaciar carrito
							</button>

							<button
								onClick={handleSendQuote}
								className='bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors sm:ml-auto'>
								Solicitar cotización
							</button>
						</div>
					</div>

					<div className='mt-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
						<p className='text-green-800 text-sm'>
							💡 <strong>Nota:</strong> Una vez enviada la cotización, podrás agregar
							más productos creando un nuevo carrito automáticamente.
						</p>
					</div>
				</>
			)}
		</section>
	);
}
