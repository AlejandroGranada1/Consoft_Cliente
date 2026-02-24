'use client';

import Link from 'next/link';
import { useMyOrders } from '@/hooks/apiHooks';
import { PedidoUI } from '@/lib/types';
import { useUser } from '@/providers/userContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PackageOpen, ChevronRight, ShoppingBag } from 'lucide-react';

const getStatusStyle = (estado: string) => {
  switch (estado?.toLowerCase()) {
    case 'listo':
    case 'completado':
      return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20';
    case 'cancelado':
      return 'bg-red-400/10 text-red-400 border-red-400/20';
    case 'en proceso':
      return 'bg-blue-400/10 text-blue-400 border-blue-400/20';
    default:
      return 'bg-[#C8A882]/10 text-[#C8A882] border-[#C8A882]/20';
  }
};

export default function PedidosPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { data, isLoading, error } = useMyOrders();

  useEffect(() => {
    if (loading) return;
    if (user === null) {
      (async () => {
        const Swal = (await import('sweetalert2')).default;
        await Swal.fire({ icon: 'warning', title: 'Inicia sesión', text: 'Debes iniciar sesión para ver tus pedidos.' });
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

  const pedidos: PedidoUI[] = data ?? [];

  const cardStyle = { backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.04)' };

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

      <div className="relative z-10 max-w-5xl mx-auto w-full px-6 pt-24 pb-16 space-y-6">

        {/* Header */}
        <div>
          <span className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium">Historial</span>
          <h1 className="font-serif text-white text-2xl mt-1">Mis pedidos</h1>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="rounded-2xl border border-white/10 p-12 flex flex-col items-center gap-3" style={cardStyle}>
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#C8A882] border-t-transparent" />
            <p className="text-sm text-white/40">Cargando pedidos...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-10 text-center">
            <p className="text-sm text-red-400">Ocurrió un error cargando tus pedidos</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && pedidos.length === 0 && (
          <div className="rounded-2xl border border-white/10 p-14 flex flex-col items-center gap-4" style={cardStyle}>
            <PackageOpen size={40} className="text-white/20" />
            <p className="text-sm text-white/40">Aún no tienes pedidos registrados</p>
            <Link href="/client/productos"
              className="inline-flex items-center gap-2 bg-[#8B5E3C] hover:bg-[#6F452A] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all mt-1">
              <ShoppingBag size={14} />
              Explorar productos
            </Link>
          </div>
        )}

        {/* Lista */}
        {pedidos.length > 0 && (
          <div className="rounded-2xl border border-white/10 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]" style={cardStyle}>

            {/* Header tabla */}
            <div className="px-6 py-4 border-b border-white/8 flex items-center gap-2">
              <PackageOpen size={13} className="text-[#C8A882]" />
              <span className="text-[11px] font-medium text-white/50 uppercase tracking-wider">
                {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''} encontrado{pedidos.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    {['Pedido', 'Estado', 'Valor', 'Entrega', 'Restante', ''].map((h) => (
                      <th key={h} className="py-3 px-6 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/6">
                  {pedidos.map((p: PedidoUI) => (
                    <tr key={p.id} className="hover:bg-white/5 transition">
                      <td className="py-4 px-6">
                        <p className="font-medium text-white text-sm">{p.nombre}</p>
                        <p className="text-xs text-white/30 mt-0.5 font-mono">#{p.id?.slice(-8).toUpperCase()}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${getStatusStyle(p.estado)}`}>
                          {p.estado}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-white">{p.valor}</td>
                      <td className="py-4 px-6 text-sm text-white/50">{p.dias}</td>
                      <td className="py-4 px-6 text-sm text-white/50">${p.restante}</td>
                      <td className="py-4 px-6 text-right">
                        <Link href={`/client/pedidos/${p.id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl
                            border border-white/15 text-white/50 text-xs font-medium
                            hover:bg-[#8B5E3C] hover:text-white hover:border-[#8B5E3C] transition-all duration-200">
                          Ver detalle <ChevronRight size={11} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-white/8">
              {pedidos.map((p: PedidoUI) => (
                <div key={p.id} className="px-5 py-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-white text-sm">{p.nombre}</p>
                      <p className="text-xs text-white/30 mt-0.5 font-mono">#{p.id?.slice(-8).toUpperCase()}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${getStatusStyle(p.estado)}`}>
                      {p.estado}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: 'Valor',    value: p.valor },
                      { label: 'Entrega',  value: p.dias },
                      { label: 'Restante', value: `$${p.restante}` },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                        <p className="text-[10px] text-white/30 uppercase tracking-wider">{item.label}</p>
                        <p className="text-xs font-medium text-white mt-0.5">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <Link href={`/client/pedidos/${p.id}`}
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl
                      border border-white/15 text-white/50 text-xs font-medium
                      hover:bg-[#8B5E3C] hover:text-white hover:border-[#8B5E3C] transition-all duration-200">
                    Ver detalle <ChevronRight size={11} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}