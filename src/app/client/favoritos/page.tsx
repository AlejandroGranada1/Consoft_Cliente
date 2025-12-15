'use client';

import ProductCard from '@/components/productos/ProductCard';
import { useGetUserById } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';
import { User } from '@/lib/types';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
  const router = useRouter();
  const { user } = useUser();

  // 🚨 PROTEGER RUTA
  useEffect(() => {
    if (user === null) {
      (async () => {
        const Swal = (await import('sweetalert2')).default;

        await Swal.fire({
          icon: 'warning',
          title: 'Inicia sesión',
          text: 'Debes iniciar sesión para ver tus productos favoritos.',
        });

        router.push('/client/auth/login');
      })();
    }
  }, [user, router]);

  // 🟡 user === undefined → cargando sesión
  if (user === undefined) {
    return <p className="p-6">Validando sesión...</p>;
  }

  // 🔴 user === null → redirigiendo
  if (user === null) {
    return null;
  }

  // 🟢 Usuario autenticado
  const userId = (user as User).id;
  const { data, isLoading } = useGetUserById(userId);

  if (isLoading) return <p className="p-6">Cargando favoritos...</p>;

  const favorites = data?.data?.favorites || [];

  return (
    <section className="bg-[#f9f9f9] min-h-screen py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold">Mis Favoritos</h1>

        {favorites.length === 0 ? (
          <p className="text-gray-600">
            No tienes productos favoritos aún.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product: any) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                image={
                  product.imageUrl?.trim()
                    ? product.imageUrl
                    : '/def_prod.png'
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
