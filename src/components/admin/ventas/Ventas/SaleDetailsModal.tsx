'use client';
import {
    X,
    Package,
    Calendar,
    DollarSign,
    User,
    MapPin,
    Tag,
    CreditCard,
    Save,
} from 'lucide-react';
import { DefaultModalProps, Sale } from '@/lib/types';
import React, { useState, useEffect } from 'react';
import { useUpdateOrder } from '@/hooks/apiHooks';
import { createPortal } from 'react-dom';

function SaleDetailsModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<Sale>) {
    const updateOrderMutation = useUpdateOrder();
    const [orderStatus, setOrderStatus] = useState<string>('Pendiente');
    const [deliveredAt, setDeliveredAt] = useState<string>('');

    useEffect(() => {
        if (extraProps?.order) {
            setOrderStatus(extraProps.order.status || 'Pendiente');
            if (extraProps.order.deliveredAt) {
                setDeliveredAt(new Date(extraProps.order.deliveredAt).toISOString().split('T')[0]);
            } else {
                setDeliveredAt('');
            }
        }
    }, [extraProps]);

    if (!isOpen || !extraProps) return null;

    const sale = extraProps;
    const order = sale.order;
    const user = sale.user;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!order?._id) return;

        const Swal = (await import('sweetalert2')).default;

        try {
            await updateOrderMutation.mutateAsync({
                id: order._id,
                data: { status: orderStatus, deliveredAt: deliveredAt || undefined },
            });

            Swal.fire({
                toast: true,
                animation: false,
                timerProgressBar: true,
                showConfirmButton: false,
                title: 'Estado de pedido actualizado',
                icon: 'success',
                position: 'top-right',
                timer: 1500,
                background: '#1e1e1c',
                color: '#fff',
            });

            onClose();
            updateList?.();
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar el pedido',
                icon: 'error',
                background: '#1e1e1c',
                color: '#fff',
            });
        }
    };

    const formatCurrency = (value: number) => `$${value.toLocaleString('es-CO')} COP`;

    return createPortal(
        <div
            className='fixed inset-0 z-50 flex items-center justify-center p-4'
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>

            <div className="w-full max-w-[800px] rounded-2xl border border-white/10
        shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        flex flex-col max-h-[90vh] overflow-hidden"
                style={{ background: 'rgba(30,30,28,0.95)', backdropFilter: 'blur(20px)' }}>

                {/* Header */}
                <header className="relative px-6 py-5 border-b border-white/10 shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute left-4 top-1/2 -translate-y-1/2
              p-2 rounded-lg text-white/40 hover:text-white/70
              hover:bg-white/5 transition-all duration-200">
                        <X size={18} />
                    </button>
                    <h2 className="text-lg font-medium text-white text-center flex items-center justify-center gap-2">
                        <Package size={18} className="text-[#C8A882]" />
                        Detalles de Venta #{order._id?.slice(-6).toUpperCase()}
                    </h2>
                </header>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">

                    <div className="grid grid-cols-2 gap-4">
                        {/* Cliente */}
                        <div className="space-y-2">
                            <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block flex items-center gap-1.5">
                                <User size={12} /> Cliente
                            </label>
                            <div className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90">
                                {user?.name || 'Cliente'}
                            </div>
                        </div>

                        {/* Dirección */}
                        <div className="space-y-2">
                            <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block flex items-center gap-1.5">
                                <MapPin size={12} /> Dirección
                            </label>
                            <div className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 truncate">
                                {order?.address || 'No especificada'}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {/* Totales */}
                        <div className="space-y-2">
                            <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block flex items-center gap-1.5">
                                <DollarSign size={12} /> Total Pedido
                            </label>
                            <div className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 font-semibold">
                                {formatCurrency(sale.total)}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block flex items-center gap-1.5">
                                <CreditCard size={12} /> Pagado
                            </label>
                            <div className="w-full rounded-xl border border-white/10 bg-[#C8A882]/10 text-[#C8A882] px-4 py-3 text-sm font-semibold">
                                {formatCurrency(sale.paid ?? sale.payments?.reduce((s, p) => s + p.amount, 0) ?? 0)}
                            </div>
                        </div>

                        {/* Estado del Pedido (Elegible) */}
                        <div className="space-y-2">
                            <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block flex items-center gap-1.5">
                                <Tag size={12} /> Estado del Pedido
                            </label>
                            <select
                                value={orderStatus}
                                onChange={(e) => setOrderStatus(e.target.value)}
                                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                  text-sm text-white
                  focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                  transition-all duration-200 appearance-none"
                                disabled={updateOrderMutation.isPending}>
                                <option value="En proceso" className="bg-[#1e1e1c]">En proceso</option>
                                <option value="Completado" className="bg-[#1e1e1c]">Completado</option>
                                <option value="Cancelado" className="bg-[#1e1e1c]">Cancelado</option>
                                <option value="Pendiente" className="bg-[#1e1e1c]">Pendiente</option>
                            </select>
                        </div>
                    </div>

                    {/* Listado de Servicios Simplificado */}
                    <div className="space-y-3">
                        <h3 className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium flex items-center gap-1.5">
                            <Package size={12} /> Items / Servicios ({order?.items?.length || 0})
                        </h3>

                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {order?.items?.length > 0 ? order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center rounded-xl border border-white/10 bg-white/5 p-4">
                                    <div>
                                        <p className="text-sm text-white/90">
                                            {item.id_servicio?.name || item.id_producto?.name || item.detalles || 'Item sin detalle'}
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium text-[#C8A882]">
                                        {formatCurrency(item.valor)}
                                    </p>
                                </div>
                            )) : (
                                <div className="text-center py-6 rounded-xl border border-white/10 bg-white/5">
                                    <p className="text-white/40 text-sm">No hay servicios asociados</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Fechas */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block flex items-center gap-1.5">
                                <Calendar size={12} /> Fecha Inicio
                            </label>
                            <div className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                                {order?.startedAt ? new Date(order.startedAt).toLocaleDateString() : '-'}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block flex items-center gap-1.5">
                                <Calendar size={12} /> Fecha Finalización
                            </label>
                            <input
                                type="date"
                                value={deliveredAt}
                                onChange={(e) => setDeliveredAt(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90
                                focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8 transition-all duration-200"
                                disabled={updateOrderMutation.isPending}
                            />
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg
                border border-white/15 bg-white/5
                text-white/70 text-sm
                hover:bg-white/10 hover:text-white
                transition-all duration-200">
                            Cerrar
                        </button>
                        {(orderStatus !== order.status || deliveredAt !== (order.deliveredAt ? new Date(order.deliveredAt).toISOString().split('T')[0] : '')) && (
                            <button
                                type="submit"
                                disabled={updateOrderMutation.isPending}
                                className="px-5 py-2.5 rounded-lg
                  bg-[#8B5E3C] hover:bg-[#6F452A]
                  text-white text-sm font-medium
                  shadow-lg shadow-[#8B5E3C]/20
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center gap-2
                  transition-all duration-200">
                                {updateOrderMutation.isPending ? (
                                    <>
                                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save size={14} />
                                        Guardar Cambios
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

export default SaleDetailsModal;
