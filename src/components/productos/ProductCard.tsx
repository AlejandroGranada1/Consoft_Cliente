'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGetUserById, useUpdateUser } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';
import { User } from '@/lib/types';

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

  const updateUser = useUpdateUser();
  const { data } = useGetUserById(userId ?? '');

  const user = data?.data;
  const favorites: string[] = user?.favorites?.map((f: any) => f._id) ?? [];
  const isFavorite = favorites.includes(id);

  const toggleFavorite = async () => {
    const Swal = (await import('sweetalert2')).default;
    if (!user?._id) return;

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
        timer: 700,
        title: isFavorite
          ? 'Producto removido de favoritos'
          : 'Producto agregado a favoritos',
        icon: 'success',
        showConfirmButton: false,
        position: 'top-right',
      });

      refetch?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <article
      className="
        bg-white rounded-[14px] overflow-hidden
        shadow-[0_4px_24px_rgba(44,36,32,0.10)]
        hover:shadow-[0_12px_40px_rgba(44,36,32,0.18)]
        transition-all duration-300
        hover:-translate-y-1
        cursor-pointer
      "
      onClick={() => router.push(`productos/${id}`)}
    >
      {/* Imagen */}
      <div className="relative aspect-[4/3] bg-[#F2E8D9] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="300px"
        />

        {/* Favorito */}
        {userId && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite();
            }}
            className="
              absolute top-3 right-3 z-10
              w-9 h-9 rounded-full
              bg-white/90 backdrop-blur
              shadow-md
              flex items-center justify-center
              hover:scale-110 transition
            "
          >
            <Heart
              size={16}
              className={isFavorite ? 'text-red-500' : 'text-[#9A8F87]'}
              fill={isFavorite ? 'currentColor' : 'none'}
            />
          </button>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5 space-y-3">
        <h3 className="font-serif text-lg font-semibold text-[#2C2420] leading-snug">
          {name}
        </h3>

        {/* Estado */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-[#8B5A2B] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8973A]" />
            Bajo pedido
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`productos/${id}`);
            }}
            className="
              px-4 py-2 text-xs font-medium
              bg-[#2C2420] text-white
              rounded-lg
              hover:bg-[#5C3317]
              transition
            "
          >
            Ver detalle
          </button>
        </div>
      </div>
    </article>
  );
}