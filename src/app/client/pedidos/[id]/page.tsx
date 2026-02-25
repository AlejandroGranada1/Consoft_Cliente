'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMyOrder } from '@/hooks/apiHooks';
import ItemCard from '@/components/pedidos/ItemCard';
import { useUser } from '@/providers/userContext';
import { useEffect } from 'react';
import { ArrowLeft, CalendarDays, Tag, Wallet, PackageOpen, CreditCard } from 'lucide-react';

const getStatusStyle = (estado: string) => {
  switch (estado?.toLowerCase()) {
    case 'listo':
    case 'completado': return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20';
    case 'cancelado':  return 'bg-red-400/10 text-red-400 border-red-400/20';
    case 'en proceso': return 'bg-blue-400/10 text-blue-400 border-blue-400/20';
    default:           return 'bg-[#C8A882]/10 text-[#C8A882] border-[#C8A882]/20';
  }
};

export default function PedidoDetallePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (loading) return;
    if (user === null) {
      (async () => {
        const Swal = (await import('sweetalert2')).default;
        await Swal.fire({ icon: 'warning', title: 'Inicia sesión', text: 'Debes iniciar sesión para ver el detalle del pedido.' });
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

  const { data: pedido, isLoading, error } = useMyOrder(id as string);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #1e1e1c 0%, #252320 30%, #2a2724 60%, #1e1c1a 100%)' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#C8A882] border-t-transparent" />
        <p className="text-white/40 text-sm">Cargando pedido...</p>
      </div>
    </div>
  );

  if (error || !pedido) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #1e1e1c 0%, #252320 30%, #2a2724 60%, #1e1c1a 100%)' }}>
      <p className="text-white/40 text-sm">No se pudo cargar el pedido</p>
    </div>
  );

  const productos   = pedido.raw?.items ?? [];
  const attachments = pedido.raw?.attachments ?? [];
  const cardStyle   = { backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.04)' };

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

      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 pt-24 pb-16 space-y-8">

        {/* Back + Header */}
        <div className="flex items-start justify-between">
          <div>
            <button
              onClick={() => router.push('/client/pedidos')}
              className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-[#C8A882] transition-colors group mb-4"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              Volver a mis pedidos
            </button>
            <span className="block text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium mb-1">Detalle del pedido</span>
            <h1 className="font-serif text-white text-2xl">{pedido.nombre}</h1>
          </div>
          <span className={`mt-6 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusStyle(pedido.estado)}`}>
            {pedido.estado}
          </span>
        </div>

        {/* Productos */}
        {productos.length === 0 ? (
          <div className="rounded-2xl border border-white/10 p-12 flex flex-col items-center gap-3" style={cardStyle}>
            <PackageOpen size={36} className="text-white/20" />
            <p className="text-sm text-white/40">Este pedido no tiene productos asociados</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {productos.map((prod: any) => {
              const imagenes = attachments.filter((att: any) => att.item_id === prod._id);
              return <ItemCard key={prod._id} prod={prod} imagenes={imagenes} />;
            })}
          </div>
        )}

        {/* Divisor */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[11px] uppercase tracking-wider text-white/30 font-medium">Detalles del pedido</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Detalles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <CalendarDays size={15} />, label: 'Fecha de entrega', value: pedido.dias },
            { icon: <Tag size={15} />,          label: 'Estado',           value: pedido.estado },
          ].map(({ icon, label, value }) => (
            <div key={label} className="rounded-2xl border border-white/10 p-5 space-y-3" style={cardStyle}>
              <div className="flex items-center gap-2 text-[#C8A882]">
                {icon}
                <span className="text-[11px] uppercase tracking-wider font-medium">{label}</span>
              </div>
              <p className="text-white text-sm font-medium">{value}</p>
            </div>
          ))}

          <div className="rounded-2xl border border-white/10 p-5 space-y-3" style={cardStyle}>
            <div className="flex items-center gap-2 text-[#C8A882]">
              <Wallet size={15} />
              <span className="text-[11px] uppercase tracking-wider font-medium">Precio acordado</span>
            </div>
            <p className="text-[#C8A882] text-xl font-semibold font-serif">{pedido.valor}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-end">
          <button
            onClick={() => router.push(`/client/pagos/${pedido.id}`)}
            className="inline-flex items-center gap-2.5
              bg-[#8B5E3C] hover:bg-[#6F452A] text-white
              px-7 py-3 rounded-xl text-sm font-medium
              shadow-lg shadow-[#8B5E3C]/20 hover:shadow-[#8B5E3C]/30
              transition-all duration-200 hover:gap-3"
          >
            <CreditCard size={15} />
            Pagar
          </button>
        </div>
      </div>
    </div>
  );
}