'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUpdateProduct } from '@/hooks/apiHooks';

export default function ProductCard({
	id,
	name,
	image,
}: {
	id: string;
	name: string;
	image: string;
}) {
	const router = useRouter();





	return (
		<div className='bg-white rounded-xl border flex flex-col justify-evenly border-black shadow h-[320px] w-[300px]'>
			{/* Imagen con altura fija */}
			<div className='relative w-full h-56 rounded-t-xl overflow-hidden'>
				<Image
					src={image}
					alt={name}
					fill
					className='object-cover'
				/>
				{/* Botón favorito */}
				<label className='absolute top-2 right-2 p-2 rounded-full bg-white shadow hover:bg-gray-100 cursor-pointer'>
					<input
						type='checkbox'
						className='peer hidden'
					/>

					<Heart
						size={18}
						className='text-gray-500 peer-checked:text-red-500 transition-colors'
						fill='currentColor'
					/>
				</label>
			</div>

			{/* Info */}
			<div className='flex flex-col flex-1 p-4'>
				<h2 className='text-lg font-semibold'>{name}</h2>
				<button
					onClick={() => router.push(`productos/${id}`)}
					className='mt-2 px-4 py-2 bg-[#8B5E3C] text-white rounded-lg hover:bg-[#70492F] cursor-pointer'>
					Ver detalle
				</button>
			</div>
		</div>
	);
}
