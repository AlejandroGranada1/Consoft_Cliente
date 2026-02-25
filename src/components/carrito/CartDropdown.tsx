'use client';

import Link from 'next/link';
import { X, ShoppingCart, Trash2, PackageOpen } from 'lucide-react';
import { useRemoveItem, useMyCart } from '@/hooks/apiHooks';
import { useState } from 'react';

export default function CartDropdown({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const { data, isLoading, refetch } = useMyCart();
  const deleteItem = useRemoveItem();
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [clearingCart, setClearingCart] = useState(false);

  if (!isOpen) return null;

  const activeCart = data;
  const items = activeCart?.items || [];
  const itemCount = items.length;

  const handleDeleteItem = async (itemId: string) => {
    if (!activeCart?._id) return;
    const Swal = (await import('sweetalert2')).default;
    const confirm = await Swal.fire({
      title: '¿Eliminar producto?', icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#8B5E3C', cancelButtonColor: '#4a4a4a',
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
    });
    if (!confirm.isConfirmed) return;
    setDeletingItemId(itemId);
    try {
      await deleteItem.mutateAsync({ quotationId: activeCart._id, itemId });
      await refetch();
    } catch (error: any) {
      Swal.fire({ title: 'Error', text: error.response?.data?.message || 'No se pudo eliminar', icon: 'error' });
      refetch();
    } finally { setDeletingItemId(null); }
  };

  const handleClearCart = async () => {
    if (!activeCart?._id || !items.length) return;
    const Swal = (await import('sweetalert2')).default;
    const confirm = await Swal.fire({
      title: '¿Vaciar carrito?', text: 'Se eliminarán todos los productos.', icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#8B5E3C', cancelButtonColor: '#4a4a4a',
      confirmButtonText: 'Sí, vaciar', cancelButtonText: 'Cancelar',
    });
    if (!confirm.isConfirmed) return;
    setClearingCart(true);
    try {
      await Promise.all(items.map((item: any) => deleteItem.mutateAsync({ quotationId: activeCart._id, itemId: item._id })));
      await refetch();
    } catch {
      Swal.fire({ title: 'Error', text: 'No se pudo vaciar el carrito', icon: 'error' });
      refetch();
    } finally { setClearingCart(false); }
  };

  const dropdownBase = `absolute right-0 top-12 w-80 rounded-2xl z-50 overflow-hidden
    border border-white/15 shadow-[0_24px_64px_rgba(0,0,0,0.5)]`;
  const dropdownStyle = { backdropFilter: 'blur(24px)', background: 'rgba(30,28,26,0.95)' };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center py-10 px-4 gap-3">
      <PackageOpen size={32} className="text-white/20" />
      <p className="text-sm text-white/40">{message}</p>
      <Link href="/client/productos" onClick={() => setIsOpen(false)}
        className="text-xs text-[#C8A882] hover:text-white transition-colors mt-1">
        Ir a la tienda →
      </Link>
    </div>
  );

  if (!activeCart && !isLoading) {
    return (
      <div className={dropdownBase} style={dropdownStyle}>
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingCart size={15} className="text-[#C8A882]" />
            <span className="text-sm font-medium text-white">Carrito</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition">
            <X size={15} />
          </button>
        </div>
        <EmptyState message="No tienes un carrito activo" />
      </div>
    );
  }

  return (
    <div className={dropdownBase} style={dropdownStyle}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <ShoppingCart size={15} className="text-[#C8A882]" />
          <span className="text-sm font-medium text-white">Carrito</span>
          {itemCount > 0 && (
            <span className="bg-[#8B5E3C] text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </div>
        <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition">
          <X size={15} />
        </button>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="py-10 flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#C8A882] border-t-transparent" />
          <p className="text-xs text-white/30">Cargando...</p>
        </div>
      ) : itemCount === 0 ? (
        <EmptyState message="Tu carrito está vacío" />
      ) : (
        <>
          {/* Items */}
          <div className="divide-y divide-white/8 max-h-64 overflow-y-auto">
            {items.map((item: any) => (
              <div key={item._id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition">
                <img
                  src={item.isCustom ? item.customDetails.referenceImage : item.product?.imageUrl?.trim() ? item.product.imageUrl : '/def_prod.png'}
                  className="w-11 h-11 rounded-xl object-cover border border-white/10 shrink-0"
                  alt={item.product?.name || 'Producto'}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.product?.name || item.customDetails?.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-white/35">Cant: {item.quantity}</span>
                    {item.color && (
                      <>
                        <span className="text-white/20">·</span>
                        <span className="text-xs text-white/35 capitalize">{item.color}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteItem(item._id)}
                  disabled={deletingItemId === item._id || clearingCart}
                  className="p-1.5 text-white/25 hover:text-red-400 disabled:opacity-40 transition rounded-lg hover:bg-red-400/10"
                >
                  {deletingItemId === item._id
                    ? <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    : <Trash2 size={13} />
                  }
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 space-y-2.5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-white/35">Total productos</span>
              <span className="text-sm font-medium text-white">{itemCount}</span>
            </div>

            <Link
              href="/client/carrito"
              onClick={() => setIsOpen(false)}
              className="block text-center bg-[#8B5E3C] hover:bg-[#6F452A] text-white text-sm py-2.5 rounded-xl transition font-medium"
            >
              Ver carrito completo
            </Link>

            <button
              onClick={handleClearCart}
              disabled={clearingCart || deleteItem.isPending}
              className="w-full text-center border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/25 hover:bg-red-400/5 text-sm py-2.5 rounded-xl transition font-medium disabled:opacity-50"
            >
              {clearingCart
                ? <span className="flex items-center justify-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-transparent rounded-full animate-spin" />
                    Vaciando...
                  </span>
                : 'Vaciar carrito'
              }
            </button>
          </div>
        </>
      )}
    </div>
  );
}