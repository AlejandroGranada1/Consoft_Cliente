'use client';

import Image from 'next/image';
import { Heart, ArrowUpRight, Bookmark } from 'lucide-react';
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
        title: isFavorite ? 'Removido de favoritos' : 'Agregado a favoritos',
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
      className="group relative rounded-2xl overflow-hidden cursor-pointer
        border border-white/10
        bg-white/5 backdrop-blur-sm
        shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]
        hover:border-white/20
        hover:bg-white/8
        hover:-translate-y-1
        transition-all duration-400"
      onClick={() => router.push(`productos/${id}`)}
    >
      {/* ── Imagen ── */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-600 group-hover:scale-105"
          sizes="300px"
        />

        {/* Overlay degradado */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Botón favorito */}
        {userId && (
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(); }}
            className="absolute top-3 right-3 z-10
              w-8 h-8 rounded-full
              bg-black/70 backdrop-blur border border-white/15
              flex items-center justify-center
              hover:scale-110 hover:bg-black/60
              transition-all duration-200"
          >
            <Bookmark
              size={14}
              className={isFavorite ? 'text-red' : 'text-white/70'}

              fill={isFavorite ? 'currentColor' : 'none'}
            />
          </button>
        )}

        {/* Badge bajo pedido — aparece en hover */}
        <div className="absolute bottom-3 left-3 z-10
          opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
          transition-all duration-300">
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide
            bg-black/50 backdrop-blur border border-white/15
            text-white/80 font-medium px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8A882]" />
            Bajo pedido
          </span>
        </div>
      </div>

      {/* ── Contenido ── */}
      <div className="p-5 space-y-3.5">
        <h3 className="font-serif text-white text-base font-semibold leading-snug group-hover:text-[#C8A882] transition-colors duration-300">
          {name}
        </h3>

        <div className="flex items-center justify-between">
          {/* Estado (desktop, fuera de hover) */}
          <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-white/40 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8A882]/60" />
            Bajo pedido
          </span>

          <button
            onClick={(e) => { e.stopPropagation(); router.push(`productos/${id}`); }}
            className="inline-flex items-center gap-1.5
              px-4 py-1.5 text-xs font-medium rounded-full
              bg-[#8B5E3C] hover:bg-[#6F452A] text-white
              transition-all duration-200
              hover:gap-2 cursor-pointer"
          >
            Cotizar
            <ArrowUpRight size={11} />
          </button>
        </div>
      </div>

      {/* Línea acento inferior */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-[#8B5E3C] to-[#C8A882] transition-all duration-500" />
    </article>
  );
}