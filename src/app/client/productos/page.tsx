'use client';

import ProductCard from '@/components/productos/ProductCard';
import { useGetProducts } from '@/hooks/apiHooks';
import { Category } from '@/lib/types';
import { Plus, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const router = useRouter();
  const { data: products, isLoading, refetch } = useGetProducts();

  if (isLoading) return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(160deg, #1e1e1c 0%, #252320 30%, #2a2724 60%, #1e1c1a 100%)',
      }}
    >
      <p className="text-white/50 text-sm tracking-widest uppercase">Cargando...</p>
    </div>
  );

  const productsByCategory = products?.reduce(
    (acc, product) => {
      const categoryName = (product.category as Category)?.name || 'Sin categoría';
      if (!acc[categoryName]) acc[categoryName] = [];
      acc[categoryName].push(product);
      return acc;
    },
    {} as Record<string, typeof products>,
  );

  return (
    <div
      className="min-h-screen w-full relative flex flex-col"
      style={{
        background: `
          radial-gradient(ellipse at 75% 10%, rgba(120, 100, 80, 0.16) 0%, transparent 50%),
          radial-gradient(ellipse at 15% 65%, rgba(90, 75, 60, 0.13) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 40%, rgba(70, 60, 50, 0.08) 0%, transparent 65%),
          linear-gradient(160deg, #1e1e1c 0%, #252320 30%, #2a2724 60%, #1e1c1a 100%)
        `,
      }}
    >
      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.045]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-16 pb-16 space-y-14">

        {/* ── HEADER ── */}
        <header className="max-w-xl space-y-4">
          <span className="inline-block bg-white/10 backdrop-blur border border-white/15 text-white text-[11px] font-medium tracking-[.07em] uppercase px-4 py-1.5 rounded-full">
            Colección 2025
          </span>

          <h1 className="font-serif text-white leading-tight" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)' }}>
            Piezas <em className="italic text-[#C8A882]">artesanales</em>
            <br />para tu hogar
          </h1>

          <p className="text-sm text-white/55 leading-relaxed">
            Cada mueble es fabricado a mano con maderas seleccionadas. Elige el que mejor se adapte a tu espacio.
          </p>
        </header>

        {/* ── CATEGORÍAS ── */}
        {productsByCategory &&
          Object.entries(productsByCategory).map(([categoryName, items]) => (
            <section key={categoryName} className="space-y-6">

              {/* Encabezado de categoría */}
              <div className="flex items-center gap-4">
                <h2 className="font-serif text-white text-xl font-semibold whitespace-nowrap">
                  {categoryName}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
                <span className="text-[11px] uppercase tracking-wider text-white/35 font-medium">
                  {items.length} {items.length === 1 ? 'pieza' : 'piezas'}
                </span>
              </div>

              {/* Grid de productos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {items.map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id!}
                    name={product.name}
                    refetch={refetch}
                    image={
                      product.imageUrl && product.imageUrl.trim() !== ''
                        ? product.imageUrl
                        : '/def_prod.png'
                    }
                  />
                ))}
              </div>
            </section>
          ))}

        {/* ── BANNER PERSONALIZADO (al final) ── */}
        <div
          className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,.4)]"
          style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.05)' }}
        >
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(200,168,130,0.12) 0%, transparent 70%)' }} />
          <div className="absolute -bottom-8 -left-8 w-56 h-56 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(139,94,60,0.10) 0%, transparent 70%)' }} />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-10">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#C8A882]/15 border border-[#C8A882]/25 rounded-full">
                <Sparkles size={13} className="text-[#C8A882]" />
                <span className="text-[11px] uppercase tracking-wider text-[#C8A882] font-medium">
                  Diseño a medida
                </span>
              </div>

              <h2 className="font-serif text-white leading-tight" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)' }}>
                ¿No encuentras lo que buscas?
              </h2>

              <p className="text-sm text-white/55 leading-relaxed max-w-lg">
                Creamos muebles personalizados según tus necesidades. Cuéntanos tu idea y la haremos realidad con la misma calidad artesanal.
              </p>
            </div>

            <button
              onClick={() => router.push('/client/productos/custom')}
              className="group inline-flex items-center gap-2.5 bg-[#8B5E3C] hover:bg-[#6F452A] text-white px-7 py-3.5 rounded-full text-sm font-medium shadow-lg hover:gap-4 transition-all duration-200 whitespace-nowrap shrink-0"
            >
              <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
              Producto personalizado
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}