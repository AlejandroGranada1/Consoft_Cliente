'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useGetProductById, useQuickQuotation } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';
import { useAddItemAutoCart } from '@/hooks/apiHooks';
import Image from 'next/image';

const AVAILABLE_COLORS = [
	{ name: 'Nogal', value: 'nogal', hex: '#7B4A12' },
	{ name: 'Blanco', value: 'blanco', hex: '#FFFFFF' },
	{ name: 'Negro', value: 'negro', hex: '#000000' },
	{ name: 'Gris', value: 'gris', hex: '#9CA3AF' },
	{ name: 'Café oscuro', value: 'cafe_oscuro', hex: '#4B2E1E' },
	{ name: 'Azul petróleo', value: 'azul_petroleo', hex: '#1F4E5F' },
	{ name: 'Verde oliva', value: 'verde_oliva', hex: '#556B2F' },
];
export default function ProductDetailPage() {
	const { id } = useParams();
	const router = useRouter();

	const { user } = useUser();

	const { data, isLoading } = useGetProductById(String(id));

	const product = data?.data;

	console.log(product);

	const addItemMutation = useAddItemAutoCart();

	const [quantity, setQuantity] = useState(1);
	const [color, setColor] = useState<string>('');
	const [customSize, setCustomSize] = useState('');

	const addToCart = async () => {
		const Swal = (await import('sweetalert2')).default;

		if (!user) {
			Swal.fire({
				title: 'Inicia sesión para añadir al carrito',
				icon: 'warning',
				showConfirmButton: false,
				timer: 1500,
			});
			router.push('/client/auth/login');
			return;
		}

		if (!product) return;

		try {
			if (!color) {
				Swal.fire({
					title: 'Selecciona un color',
					text: 'Debes elegir un color para el mueble',
					icon: 'warning',
				});
				return;
			}

			const payload = {
				productId: product._id,
				quantity,
				color,
				size: customSize,
			};

			console.log(payload);
			await addItemMutation.mutateAsync(payload);

			Swal.fire({
				title: 'Añadido al carrito',
				text: 'El producto ha sido añadido correctamente',
				icon: 'success',
				confirmButtonColor: '#8B5A2B',
			});

			router.push('/client/productos');
		} catch (err) {
			console.log(err);
			Swal.fire({
				title: 'Error',
				text: 'No se pudo agregar al carrito',
				icon: 'error',
			});
		}
	};

	if (isLoading) return <p className='p-10'>Cargando producto...</p>;
	if (!product) return <p className='p-10'>Producto no encontrado</p>;

	return (
		<section className='bg-[#FFF9F4] min-h-screen py-10 px-6'>
			<div className='max-w-5xl mx-auto bg-white p-10 rounded-2xl shadow-lg'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
					<div className='relative w-full h-80 rounded-xl overflow-hidden bg-gray-100 border flex items-center justify-center'>
						{product.imageUrl && product.imageUrl.trim() !== '' ? (
							<Image
								src={product.imageUrl}
								alt={product.name}
								fill
								className='object-contain'
							/>
						) : (
							<Image
								src='/def_prod.png'
								alt='Imagen por defecto'
								fill
								className='object-contain'
							/>
						)}
					</div>

					<div>
						<h1 className='text-3xl font-bold text-gray-900'>{product.name}</h1>
						<p className='text-gray-600 mt-2 leading-relaxed'>{product.description}</p>

						<hr className='my-6' />

						<div className='space-y-4'>
							<div>
								<label className='font-medium mr-4'>Cantidad</label>
								<input
									type='number'
									min='1'
									value={quantity}
									onChange={(e) => setQuantity(Number(e.target.value))}
									className='input-style w-24'
								/>
							</div>

							<div>
								<label className='font-medium block mb-2'>Color</label>

								<select
									value={color}
									onChange={(e) => setColor(e.target.value)}
									className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown bg-white'>
									<option value=''>Selecciona un color</option>

									{AVAILABLE_COLORS.map((c) => (
										<option
											key={c.value}
											value={c.value}>
											{c.name}
										</option>
									))}
								</select>

								{/* Vista previa del color seleccionado */}
								<div className='flex items-center gap-2 mt-3 h-10'>
									{color && (
										<>
											<span
												className='w-6 h-6 rounded-full border'
												style={{
													backgroundColor: AVAILABLE_COLORS.find(
														(c) => c.value === color
													)?.hex,
												}}
											/>
											<span className='text-sm text-gray-700'>
												{
													AVAILABLE_COLORS.find((c) => c.value === color)
														?.name
												}
											</span>
										</>
									)}
								</div>
							</div>

							<div>
								<label className='font-medium'>Tamaño personalizado</label>
								<input
									type='text'
									value={customSize}
									onChange={(e) => setCustomSize(e.target.value)}
									className='input-style w-full'
									placeholder='Ej: 50x40'
								/>
							</div>
							<button
								onClick={addToCart}
								className='w-full border border-brown  hover:bg-[#70461f] text-brown hover:text-white py-3 rounded-lg font-semibold transition cursor-pointer'>
								Agregar al carrito
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
