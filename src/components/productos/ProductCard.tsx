'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGetUserById, useUpdateUser } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';
import { User } from '@/lib/types';
import Swal from 'sweetalert2';

export default function ProductCard({
	id,
	name,
	image,
	refetch,
}: {
	id: string;
	name: string;
	image: string;
	refetch?: () => void;
}) {
	const router = useRouter();
	const { user: Usuario } = useUser();

	const userId = (Usuario as User)?.id;

	// Hook siempre en el mismo orden
	const updateUser = useUpdateUser();
	const { data } = useGetUserById(userId ?? '');

	const user = data?.data;

	// Ahora mapear los favoritos para obtener solo los IDs
	const favorites: string[] = user?.favorites?.map((f: any) => f._id) ?? [];

	const isFavorite = favorites.includes(id);

	const toggleFavorite = async () => {
		if (!user?._id) return console.warn('Usuario no cargado todavía.');

		const updatedFavorites = isFavorite
			? favorites.filter((fid) => fid !== id)
			: [...favorites, id];

		try {
			await updateUser.mutateAsync({
				_id: user._id,
				formData: { favorites: updatedFavorites },
			});

			Swal.fire({
				toast: true,
				animation: false,
				timerProgressBar: true,
				title: isFavorite
					? 'Producto removido de la lista de favoritos'
					: 'Producto agregado a la lista de favoritos',
				icon: 'success',
				timer: 700,
				showConfirmButton: false,
				position: 'top-right',
				customClass: {
					timerProgressBar: 'swal2-progress-bar',
				},
			});

			refetch?.();
		} catch (err) {
			console.error('Error al actualizar favoritos:', err);
		}
	};

	return (
		<div className='bg-white rounded-xl border flex flex-col justify-evenly border-black shadow h-[320px] w-[300px]'>
			<div className='relative w-full h-56 rounded-t-xl overflow-hidden'>
				<Image
					src={image}
					alt={name}
					fill
					className='object-cover'
					sizes='20'
					loading='lazy'
				/>

				{userId && (
					<button
						onClick={toggleFavorite}
						className='absolute top-2 right-2 p-2 rounded-full bg-white shadow hover:bg-gray-100 cursor-pointer'>
						<Heart
							size={20}
							className={isFavorite ? 'text-red-500' : 'text-gray-500'}
							fill={isFavorite ? 'currentColor' : 'none'}
						/>
					</button>
				)}
			</div>

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
