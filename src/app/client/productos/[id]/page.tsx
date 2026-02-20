'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useGetProductById } from '@/hooks/apiHooks';
import { useAddItemAutoCart } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';
import Image from 'next/image';
import { ArrowLeft, ShieldCheck, Truck, Pencil } from 'lucide-react';

const AVAILABLE_COLORS = [
	{ name: 'Nogal', value: 'nogal', hex: '#7B4A12' },
	{ name: 'Blanco', value: 'blanco', hex: '#F5F5F5' },
	{ name: 'Negro', value: 'negro', hex: '#1A1A1A' },
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

	const addItemMutation = useAddItemAutoCart();

	const [quantity, setQuantity] = useState(1);
	const [color, setColor] = useState('');
	const [customSize, setCustomSize] = useState('');

	const changeQty = (delta: number) =>
		setQuantity((q) => Math.max(1, q + delta));

	const addToCart = async () => {
		const Swal = (await import('sweetalert2')).default;

		if (!user) {
			Swal.fire({
				title: 'Inicia sesión para añadir al carrito',
				icon: 'warning',
				timer: 1400,
				showConfirmButton: false,
			});
			router.push('/client/auth/login');
			return;
		}

		if (!color) {
			Swal.fire({
				title: 'Selecciona un color',
				icon: 'warning',
			});
			return;
		}

		await addItemMutation.mutateAsync({
			productId: product._id,
			quantity,
			color,
			size: customSize,
		});

		Swal.fire({
			title: 'Añadido al carrito',
			icon: 'success',
			timer: 1200,
			showConfirmButton: false,
		});

		router.push('/client/productos');
	};

	if (isLoading) return <p className='p-10'>Cargando producto…</p>;
	if (!product) return <p className='p-10'>Producto no encontrado</p>;

	return (
		<section className='bg-[#FAF5EE] min-h-screen px-6 py-12'>
			<div className='max-w-6xl mx-auto'>

				{/* Back */}
				<button
					onClick={() => router.back()}
					className='flex items-center gap-2 text-sm text-gray-500 hover:text-[#8B5A2B] mb-10'>
					<ArrowLeft size={16} />
					Volver a las referencias
				</button>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-16'>

					{/* Imagen */}
					<div className='relative aspect-square rounded-2xl overflow-hidden bg-[#F2E8D9] shadow'>
						<Image
							src={product.imageUrl || '/def_prod.png'}
							alt={product.name}
							fill
							className='object-cover'
						/>
						<div className='absolute bottom-4 left-4 bg-[#FAF5EE]/90 backdrop-blur px-4 py-2 rounded-lg text-xs uppercase tracking-wider'>
							Madera certificada
						</div>
					</div>

					{/* Info */}
					<div className='flex flex-col gap-8'>
						<div>
							<span className='text-xs tracking-[.22em] uppercase text-[#C8973A]'>
								Colección
							</span>
							<h1 className='font-serif text-3xl font-light mt-2'>
								{product.name}
							</h1>
						</div>

						<p className='text-sm leading-relaxed text-gray-600'>
							{product.description}
						</p>

						<hr className='border-[#D9CFCA]' />

						{/* Cantidad */}
						<div>
							<span className='text-xs uppercase tracking-widest font-medium'>
								Cantidad
							</span>
							<div className='flex items-center border rounded-lg w-fit mt-2'>
								<button
									onClick={() => changeQty(-1)}
									className='w-10 h-10 bg-[#F2E8D9] hover:bg-[#D9CFCA]'>
									−
								</button>
								<div className='w-12 text-center font-medium'>
									{quantity}
								</div>
								<button
									onClick={() => changeQty(1)}
									className='w-10 h-10 bg-[#F2E8D9] hover:bg-[#D9CFCA]'>
									+
								</button>
							</div>
						</div>

						{/* Colores */}
						<div>
							<span className='text-xs uppercase tracking-widest font-medium'>
								Color
							</span>
							<div className='flex flex-wrap gap-4 mt-3'>
								{AVAILABLE_COLORS.map((c) => (
									<button
										key={c.value}
										onClick={() => setColor(c.value)}
										className={`flex flex-col items-center gap-1 ${
											color === c.value ? 'scale-110' : ''
										}`}>
										<span
											className='w-8 h-8 rounded-full border-2'
											style={{
												backgroundColor: c.hex,
												borderColor:
													color === c.value ? '#8B5A2B' : '#D9CFCA',
											}}
										/>
										<span className='text-[10px] text-gray-500'>
											{c.name}
										</span>
									</button>
								))}
							</div>
						</div>

						{/* Tamaño */}
						<div>
							<span className='text-xs uppercase tracking-widest font-medium'>
								Tamaño personalizado
							</span>
							<input
								value={customSize}
								onChange={(e) => setCustomSize(e.target.value)}
								placeholder='Ej: 220x90 cm'
								className='mt-2 w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#8B5A2B]'
							/>
							<p className='text-xs text-gray-500 mt-1'>
								Opcional · Medidas especiales
							</p>
						</div>

						{/* Acción */}
						<button
							onClick={addToCart}
							className='w-full bg-[#2C2420] hover:bg-[#5C3317] text-white py-4 rounded-lg flex items-center justify-center gap-2'>
							Agregar al carrito
						</button>

						{/* Trust strip */}
						<div className='grid grid-cols-3 gap-4 bg-[#F2E8D9] border rounded-lg p-4'>
							<div className='flex items-center gap-2 text-xs text-gray-600'>
								<ShieldCheck size={16} />
								Garantía 2 años
							</div>
							<div className='flex items-center gap-2 text-xs text-gray-600'>
								<Truck size={16} />
								Envío a domicilio
							</div>
							<div className='flex items-center gap-2 text-xs text-gray-600'>
								<Pencil size={16} />
								Personalizable
							</div>
						</div>
					</div>

				</div>
			</div>
		</section>
	);
}