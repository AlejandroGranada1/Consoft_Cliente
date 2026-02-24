'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useGetProductById, useMyCart } from '@/hooks/apiHooks';
import { useAddItemAutoCart } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';
import Image from 'next/image';
import { ArrowLeft, ShieldCheck, Truck, Pencil, ShoppingCart, Minus, Plus } from 'lucide-react';

const AVAILABLE_COLORS = [
  { name: 'Nogal',       value: 'nogal',        hex: '#7B4A12' },
  { name: 'Blanco',      value: 'blanco',        hex: '#F5F5F5' },
  { name: 'Negro',       value: 'negro',         hex: '#1A1A1A' },
  { name: 'Gris',        value: 'gris',          hex: '#9CA3AF' },
  { name: 'Café oscuro', value: 'cafe_oscuro',   hex: '#4B2E1E' },
  { name: 'Azul petróleo', value: 'azul_petroleo', hex: '#1F4E5F' },
  { name: 'Verde oliva', value: 'verde_oliva',   hex: '#556B2F' },
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { data: cartData } = useMyCart();
  const { data, isLoading } = useGetProductById(String(id));
  const product = data?.data;

  const addItemMutation = useAddItemAutoCart();

  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState('');
  const [customSize, setCustomSize] = useState('');

  const changeQty = (delta: number) => setQuantity((q) => Math.max(1, q + delta));

  const addToCart = async () => {
    const Swal = (await import('sweetalert2')).default;

    if (!user) {
      Swal.fire({ title: 'Inicia sesión para añadir al carrito', icon: 'warning', timer: 1400, showConfirmButton: false });
      router.push('/client/auth/login');
      return;
    }
    if (!color) {
      Swal.fire({ title: 'Selecciona un color', icon: 'warning' });
      return;
    }

    await addItemMutation.mutateAsync({
      quotationId: cartData?._id,
      payload: { productId: product._id, quantity, color, size: customSize },
    });

    Swal.fire({ title: 'Añadido al carrito', icon: 'success', timer: 1200, showConfirmButton: false });
    router.push('/client/productos');
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #1e1e1c 0%, #252320 30%, #2a2724 60%, #1e1c1a 100%)' }}>
      <p className="text-white/50 text-sm tracking-widest uppercase">Cargando producto…</p>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #1e1e1c 0%, #252320 30%, #2a2724 60%, #1e1c1a 100%)' }}>
      <p className="text-white/50 text-sm">Producto no encontrado</p>
    </div>
  );

  return (
    <div
      className="min-h-screen w-full relative flex flex-col"
      style={{
        background: `
          radial-gradient(ellipse at 80% 10%, rgba(120, 100, 80, 0.16) 0%, transparent 50%),
          radial-gradient(ellipse at 10% 70%, rgba(90, 75, 60, 0.13) 0%, transparent 50%),
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
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)' }} />

      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 pt-16 pb-16">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-white/45 hover:text-[#C8A882] transition-colors duration-200 mb-10 group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          Volver a las referencias
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">

          {/* ── Imagen ── */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
              <Image
                src={product.imageUrl || '/def_prod.png'}
                alt={product.name}
                fill
                className="object-cover"
              />
              {/* Overlay sutil */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {/* Badge */}
              <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur border border-white/15 px-3.5 py-1.5 rounded-full">
                <span className="text-[10px] uppercase tracking-[.12em] text-white/75 font-medium">Madera certificada</span>
              </div>
            </div>
          </div>

          {/* ── Info ── */}
          <div className="flex flex-col gap-7">

            {/* Encabezado */}
            <div className="space-y-2">
              <span className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium">
                Colección 2025
              </span>
              <h1 className="font-serif text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
                {product.name}
              </h1>
            </div>

            <p className="text-sm leading-relaxed text-white/55">
              {product.description}
            </p>

            <div className="h-px bg-white/10" />

            {/* Cantidad */}
            <div className="space-y-3">
              <span className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium">Cantidad</span>
              <div className="inline-flex items-center rounded-xl border border-white/15 bg-white/5 overflow-hidden">
                <button
                  onClick={() => changeQty(-1)}
                  className="w-11 h-11 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Minus size={14} />
                </button>
                <div className="w-12 text-center text-white font-medium text-sm">{quantity}</div>
                <button
                  onClick={() => changeQty(1)}
                  className="w-11 h-11 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Colores */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium">Color</span>
                {color && (
                  <span className="text-xs text-white/45">
                    {AVAILABLE_COLORS.find(c => c.value === color)?.name}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {AVAILABLE_COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setColor(c.value)}
                    title={c.name}
                    className="relative w-9 h-9 rounded-full transition-transform duration-200 hover:scale-110"
                    style={{ backgroundColor: c.hex }}
                  >
                    {/* Ring activo */}
                    {color === c.value && (
                      <span className="absolute inset-0 rounded-full ring-2 ring-[#C8A882] ring-offset-2 ring-offset-[#252320]" />
                    )}
                    {/* Ring hover */}
                    {color !== c.value && (
                      <span className="absolute inset-0 rounded-full ring-1 ring-white/20" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tamaño */}
            <div className="space-y-2">
              <span className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium">
                Tamaño personalizado <span className="normal-case text-white/30 text-[10px]">(opcional)</span>
              </span>
              <input
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                placeholder="Ej: 220 × 90 cm"
                className="w-full rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm
                  px-4 py-3 text-sm text-white placeholder:text-white/30
                  focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                  transition-all duration-200"
              />
            </div>

            {/* CTA */}
            <button
              onClick={addToCart}
              className="w-full inline-flex items-center justify-center gap-2.5
                bg-[#8B5E3C] hover:bg-[#6F452A]
                text-white py-4 rounded-xl
                text-sm font-medium
                shadow-lg shadow-[#8B5E3C]/20
                hover:shadow-[#8B5E3C]/30
                transition-all duration-200
                hover:gap-3"
            >
              <ShoppingCart size={16} />
              Agregar al carrito
            </button>

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <ShieldCheck size={15} />, label: 'Garantía 2 años' },
                { icon: <Truck size={15} />,        label: 'Envío a domicilio' },
                { icon: <Pencil size={15} />,       label: 'Personalizable' },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3.5 text-center"
                >
                  <span className="text-[#C8A882]">{icon}</span>
                  <span className="text-[11px] text-white/50 leading-snug">{label}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}