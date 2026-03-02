'use client';

import ProductCard from '@/components/productos/ProductCard';
import { useGetProducts } from '@/hooks/apiHooks';
import { Category } from '@/lib/types';
import { Plus, Sparkles, Search, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';

export default function ProductsPage() {
  const router = useRouter();
  const { data: products, isLoading, refetch } = useGetProducts();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    if (!products) return [];
    const cats = new Set<string>();
    products.forEach(p => {
      const catName = (p.category as Category)?.name;
      if (catName) cats.add(catName);
    });
    return Array.from(cats).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const catName = (p.category as Category)?.name || 'Sin categoría';
      const matchesCategory = selectedCategory ? catName === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

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

        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sidebar de Filtros */}
          <aside className="w-full lg:w-64 shrink-0 space-y-8">
            {/* Buscador */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-medium tracking-[.07em] uppercase text-white/50">Buscar</h3>
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/10 transition-all duration-200 shadow-sm"
                />
              </div>
            </div>

            {/* Lista de Categorías */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-medium tracking-[.07em] uppercase text-white/50">Categorías</h3>
              <div className="flex flex-col space-y-1 shrink-0 bg-white/[0.02] border border-white/5 rounded-2xl p-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${selectedCategory === null
                    ? 'bg-[#C8A882]/15 text-[#C8A882] font-medium'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                >
                  Todas
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-left transition-all duration-200 ${selectedCategory === cat
                      ? 'bg-[#C8A882]/15 text-[#C8A882] font-medium'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <span className="truncate pr-2">{cat}</span>
                    {selectedCategory === cat && <ChevronRight size={14} className="shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid de Productos */}
          <div className="flex-1 space-y-6 min-w-0">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-white text-xl font-semibold truncate pr-4">
                {selectedCategory || 'Todos los productos'}
              </h2>
              <span className="text-[11px] uppercase tracking-wider text-white/35 font-medium shrink-0">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'resultado' : 'resultados'}
              </span>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
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
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center border border-white/10 rounded-2xl bg-white/[0.02] border-dashed">
                <Search size={32} className="text-white/20 mb-4" />
                <p className="text-white/50 text-sm mb-4">No se encontraron productos que coincidan con tu búsqueda.</p>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-white/80 transition-all duration-200 text-sm"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>

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