'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMyOrder, useGetOrderReviews, useCreateOrderReview } from '@/hooks/apiHooks';
import ItemCard from '@/components/pedidos/ItemCard';
import { useUser } from '@/providers/userContext';
import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, Tag, Wallet, PackageOpen, CreditCard, Star } from 'lucide-react';

const getStatusStyle = (estado: string) => {
  switch (estado?.toLowerCase()) {
    case 'listo':
    case 'completado': return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20';
    case 'cancelado': return 'bg-red-400/10 text-red-400 border-red-400/20';
    case 'en proceso': return 'bg-blue-400/10 text-blue-400 border-blue-400/20';
    default: return 'bg-[#C8A882]/10 text-[#C8A882] border-[#C8A882]/20';
  }
};

export default function PedidoDetallePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { id } = useParams();

  const { data: pedido, isLoading, error } = useMyOrder(id as string);
  const { data: reviews } = useGetOrderReviews(id as string);
  const addReviewMutation = useCreateOrderReview();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

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


  const existingReview = reviews?.find((r: any) => String(r.user?._id || r.user) === String(user?.id));

  const handleReviewSubmit = async () => {
    if (rating < 1) return;
    try {
      await addReviewMutation.mutateAsync({ orderId: id as string, rating, comment });
      const Swal = (await import('sweetalert2')).default;
      Swal.fire({
        icon: 'success',
        title: '¡Gracias por tu reseña!',
        text: 'Tu opinión nos ayuda a mejorar.',
        background: '#1e1e1c',
        color: '#fff',
      });
    } catch (e: any) {
      const Swal = (await import('sweetalert2')).default;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: e.response?.data?.message || 'Error al enviar reseña',
        background: '#1e1e1c',
        color: '#fff',
      });
    }
  };

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

  const productos = pedido.raw?.items ?? [];
  const attachments = pedido.raw?.attachments ?? [];
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
            { icon: <Tag size={15} />, label: 'Estado', value: pedido.estado },
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

        {/* REVIEWS SECTION */}
        {(pedido.estado?.toLowerCase() === 'completado' || pedido.estado?.toLowerCase() === 'listo') && (
          <div className="rounded-2xl border border-white/10 p-6 md:p-8 space-y-6 mt-8" style={cardStyle}>
            <div>
              <h3 className="font-serif text-xl tracking-wide text-white mb-2">Reseña del pedido</h3>
              <p className="text-sm text-white/40">Cuéntanos cómo fue tu experiencia con tu pedido.</p>
            </div>

            {existingReview ? (
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={star <= existingReview.rating ? "text-yellow-400 fill-yellow-400" : "text-white/20"}
                    />
                  ))}
                </div>
                {existingReview.comment && (
                  <p className="text-sm text-white/80 p-4 bg-white/5 rounded-xl border border-white/10">
                    "{existingReview.comment}"
                  </p>
                )}
                <p className="text-xs text-white/30 truncate uppercase tracking-widest">
                  Reseña publicada el {new Date(existingReview.createdAt).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs text-white/40 uppercase tracking-widest pl-1">Calificación</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110 p-1"
                        disabled={addReviewMutation.isPending}
                      >
                        <Star
                          size={28}
                          className={`transition-colors duration-200 ${(hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-white/40 uppercase tracking-widest pl-1">Comentario (Opcional)</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={addReviewMutation.isPending}
                    placeholder="Nos encantaría saber más sobre tu experiencia..."
                    className="w-full bg-[#111110]/50 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C8A882]/50 focus:bg-[#111110] transition-all duration-300 resize-none min-h-[120px]"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleReviewSubmit}
                    disabled={rating === 0 || addReviewMutation.isPending}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addReviewMutation.isPending ? 'Enviando...' : 'Publicar reseña'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}