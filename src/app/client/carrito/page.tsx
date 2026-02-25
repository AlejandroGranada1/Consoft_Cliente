'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMyCart, useRemoveItem, useSubmitQuotation } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';
import { Trash2, PackageOpen, SendHorizonal, ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const { user, loading } = useUser();

  const { data: cart, isLoading, refetch } = useMyCart();
  const deleteItem      = useRemoveItem();
  const submitQuotation = useSubmitQuotation();

  useEffect(() => {
    if (loading) return;
    if (user === null) {
      (async () => {
        const Swal = (await import('sweetalert2')).default;
        await Swal.fire({ icon: 'warning', title: 'Inicia sesión', text: 'Debes iniciar sesión para acceder a tu carrito.' });
        router.push('/client/auth/login');
      })();
    }
  }, [user, loading, router]);

  if (user === undefined) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #1e1e1c 0%, #252320 30%, #2a2724 60%, #1e1c1a 100%)' }}>
      <p className="text-white/40 text-sm tracking-widest uppercase">Validando sesión...</p>
    </div>
  );
  if (user === null) return null;
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #1e1e1c 0%, #252320 30%, #2a2724 60%, #1e1c1a 100%)' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#C8A882] border-t-transparent" />
        <p className="text-white/40 text-sm">Cargando carrito...</p>
      </div>
    </div>
  );

  const items = cart?.items || [];

  const handleDeleteItem = async (itemId: string) => {
    const Swal = (await import('sweetalert2')).default;
    const confirm = await Swal.fire({
      title: '¿Eliminar producto?', icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#8B5E3C', cancelButtonColor: '#4a4a4a',
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
    });
    if (!confirm.isConfirmed) return;
    await deleteItem.mutateAsync({ quotationId: cart._id, itemId });
    await refetch();
    Swal.fire({ title: 'Eliminado', icon: 'success', timer: 1000, showConfirmButton: false });
  };

  const handleClearCart = async () => {
    const Swal = (await import('sweetalert2')).default;
    const confirm = await Swal.fire({
      title: '¿Vaciar carrito?', text: 'Se eliminarán todos los productos.', icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#8B5E3C', cancelButtonColor: '#4a4a4a',
      confirmButtonText: 'Sí, vaciar', cancelButtonText: 'Cancelar',
    });
    if (!confirm.isConfirmed) return;
    await Promise.all(items.map((item: any) => deleteItem.mutateAsync({ quotationId: cart._id, itemId: item._id })));
    await refetch();
  };

  const handleSendQuote = async () => {
    if (!items.length) return;
    const Swal = (await import('sweetalert2')).default;
    const confirm = await Swal.fire({
      title: '¿Enviar cotización?',
      text: 'Recibirás una respuesta en las próximas 24 horas.',
      icon: 'question', showCancelButton: true,
      confirmButtonColor: '#8B5E3C', cancelButtonColor: '#4a4a4a',
      confirmButtonText: 'Sí, enviar', cancelButtonText: 'Cancelar',
    });
    if (!confirm.isConfirmed) return;
    await submitQuotation.mutateAsync(cart._id);
    await refetch();
    Swal.fire({ title: '¡Cotización enviada!', text: 'Nos pondremos en contacto contigo pronto.', icon: 'success', confirmButtonColor: '#8B5E3C' });
  };

  return (
    <div
      className="min-h-screen w-full relative flex flex-col"
      style={{
        background: `
          radial-gradient(ellipse at 75% 10%, rgba(120,100,80,0.16) 0%, transparent 50%),
          radial-gradient(ellipse at 15% 65%, rgba(90,75,60,0.13) 0%, transparent 50%),
          linear-gradient(160deg, #1e1e1c 0%, #252320 30%, #2a2724 60%, #1e1c1a 100%)
        `,
      }}
    >
      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.045]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)' }} />

      <div className="relative z-10 max-w-3xl mx-auto w-full px-6 pt-24 pb-16 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium">Mi pedido</span>
            <h1 className="font-serif text-white text-2xl mt-1 flex items-center gap-3">
              Carrito
              {items.length > 0 && (
                <span className="text-sm font-normal text-white/35 font-sans">
                  {items.length} {items.length === 1 ? 'producto' : 'productos'}
                </span>
              )}
            </h1>
          </div>
          <Link href="/client/productos"
            className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-[#C8A882] transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Seguir comprando
          </Link>
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 flex flex-col items-center py-16 gap-4"
            style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.04)' }}
          >
            <PackageOpen size={40} className="text-white/20" />
            <p className="text-white/40 text-sm">Tu carrito está vacío</p>
            <Link href="/client/productos"
              className="inline-flex items-center gap-2 bg-[#8B5E3C] hover:bg-[#6F452A] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all mt-2">
              <ShoppingCart size={14} />
              Ver productos
            </Link>
          </div>
        ) : (
          <>
            {/* Lista de items */}
            <div className="rounded-2xl border border-white/10 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="divide-y divide-white/8">
                {items.map((item: any) => (
                  <div key={item._id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition">
                    {/* Imagen */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 shrink-0">
                      <img
                        src={item.isCustom ? item.customDetails.referenceImage : item.product?.imageUrl || '/def_prod.png'}
                        className="w-full h-full object-cover"
                        alt={item.product?.name || 'Producto'}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <p className="font-medium text-white text-sm leading-snug">
                        {item.product?.name || item.customDetails?.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="text-xs text-white/35">Cantidad: {item.quantity}</span>
                        {item.color && (
                          <>
                            <span className="text-white/15">·</span>
                            <span className="text-xs text-white/35 capitalize">Color: {item.color}</span>
                          </>
                        )}
                        {item.size && (
                          <>
                            <span className="text-white/15">·</span>
                            <span className="text-xs text-white/35">Talla: {item.size}</span>
                          </>
                        )}
                      </div>
                      {item.isCustom && (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#C8A882] bg-[#C8A882]/10 border border-[#C8A882]/20 px-2 py-0.5 rounded-full">
                          Personalizado
                        </span>
                      )}
                    </div>

                    {/* Eliminar */}
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      disabled={deleteItem.isPending}
                      className="p-2 text-white/25 hover:text-red-400 hover:bg-red-400/10 disabled:opacity-40 transition rounded-xl"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                onClick={handleClearCart}
                disabled={deleteItem.isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                  border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/25 hover:bg-red-400/5
                  text-sm font-medium transition-all duration-200 disabled:opacity-50"
              >
                <Trash2 size={14} />
                Vaciar carrito
              </button>

              <button
                onClick={handleSendQuote}
                disabled={submitQuotation.isPending}
                className="inline-flex items-center gap-2.5
                  bg-[#8B5E3C] hover:bg-[#6F452A] text-white
                  px-7 py-2.5 rounded-xl text-sm font-medium
                  shadow-lg shadow-[#8B5E3C]/20 hover:shadow-[#8B5E3C]/30
                  transition-all duration-200 disabled:opacity-50 hover:gap-3"
              >
                <SendHorizonal size={15} />
                {submitQuotation.isPending ? 'Enviando...' : 'Solicitar cotización'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}