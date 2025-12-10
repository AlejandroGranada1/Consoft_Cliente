'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGetUserById, useUpdateUser } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';
import { User } from '@/lib/types';

export default function ProductCard({ id, name, image }: {
	id: string;
	name: string;
	image: string;
}) {
	const router = useRouter();
	const { user: Usuario } = useUser();

	const userId = (Usuario as User)?.id;
	if (!userId) return
	const updateUser = useUpdateUser();
	const { data: user } = useGetUserById(userId!)

	const isFavorite = user?.favorites?.some((fav: any) => fav._id === id) ?? false;

	const toggleFavorite = async () => {
		if (!user?._id) {
			console.warn("Usuario no cargado todavía.");
			return;
		}

		const currentFavorites = user.favorites || [];
		const updatedFavorites = isFavorite
			? currentFavorites.filter((f: any) => f._id !== id)
			: [...currentFavorites.map((f: any) => f._id), id].filter(Boolean); // aseguramos que no haya undefined

		try {
			await updateUser.mutateAsync({
				_id: user._id,
				formData: { favorites: updatedFavorites },
			});
			console.log("Favoritos actualizados:", updatedFavorites);
		} catch (err) {
			console.error("Error al actualizar favoritos:", err);
		}
	};


	return (
		<div className='bg-white rounded-xl border flex flex-col justify-evenly border-black shadow h-[320px] w-[300px]'>

			<div className='relative w-full h-56 rounded-t-xl overflow-hidden'>
				<Image src={image} alt={name} fill className='object-cover' />

				{userId && (
					<button
						onClick={toggleFavorite}
						className='absolute top-2 right-2 p-2 rounded-full bg-white shadow hover:bg-gray-100'
					>
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
