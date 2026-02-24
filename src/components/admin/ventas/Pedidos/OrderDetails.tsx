'use client';
import {
  X,
  Edit,
  User,
  MapPin,
  Calendar,
  Package,
  DollarSign,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { DefaultModalProps, Order, Service, User as UserType } from '@/lib/types';
import EditOrderModal from './EditOrderModal';

function OrderDetailsModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<Order>) {
  const [editModal, setEditModal] = useState(false);

  if (!isOpen || !extraProps) return null;

  const user = extraProps.user as UserType;
  const total = extraProps.items.reduce((sum, item) => sum + (item.valor || 0), 0);

  const totalPaid = extraProps.payments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
  const remaining = total - totalPaid;
  const paymentPercentage = total > 0 ? Math.round((totalPaid / total) * 100) : 0;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completado':
        return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'cancelado':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'en proceso':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'pendiente':
        return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      default:
        return 'bg-white/10 text-white/40 border border-white/20';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pagado':
        return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'parcial':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'pendiente':
        return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      default:
        return 'bg-white/10 text-white/40 border border-white/20';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('es-CO')} COP`;
  };

  return (
    <>
      <div className="fixed  top-18 left-72 inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
        
        <div className="w-full max-w-[1000px] rounded-2xl border border-white/10
          shadow-[0_8px_32px_rgba(0,0,0,0.3)]
          flex flex-col max-h-[90vh]"
          style={{ background: 'rgba(30,30,28,0.95)', backdropFilter: 'blur(20px)' }}>
          
          {/* Header */}
          <header className="relative px-6 py-5 border-b border-white/10">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-white/40 hover:text-white/70
                  hover:bg-white/5 transition-all duration-200">
                <X size={18} />
              </button>
              <button
                onClick={() => setEditModal(true)}
                className="p-2 rounded-lg text-white/40 hover:text-[#C8A882]
                  hover:bg-white/5 transition-all duration-200"
                title="Editar pedido">
                <Edit size={18} />
              </button>
            </div>
            <h2 className="text-lg font-medium text-white text-center">
              Detalles del Pedido
            </h2>
            <p className="text-center text-white/40 text-xs mt-1">
              ID: #{extraProps._id?.slice(-8).toUpperCase() || 'N/A'}
            </p>
          </header>

          <div className="p-6 overflow-y-auto space-y-6">

            {/* Información principal en grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Cliente */}
              <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <User size={16} className="text-[#C8A882]" />
                  Información del Cliente
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-white/40">Nombre</p>
                    <p className="text-sm text-white/90">{user?.name || 'No disponible'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Email</p>
                    <p className="text-sm text-white/90">{user?.email || 'No disponible'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Teléfono</p>
                    <p className="text-sm text-white/90">{user?.phone || 'No disponible'}</p>
                  </div>
                </div>
              </div>

              {/* Estado del pedido */}
              <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <Package size={16} className="text-[#C8A882]" />
                  Información del Pedido
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/40">Estado:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(extraProps.status)}`}>
                      {extraProps.status || 'No definido'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/40">Pago:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(extraProps.paymentStatus)}`}>
                      {extraProps.paymentStatus || 'Pendiente'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/40">Fecha inicio:</span>
                    <span className="text-xs text-white/70">{formatDate(extraProps.startedAt)}</span>
                  </div>
                  {extraProps.deliveredAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40">Fecha entrega:</span>
                      <span className="text-xs text-white/70">{formatDate(extraProps.deliveredAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div className="p-4 rounded-xl border border-white/10 bg-white/5">
              <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-[#C8A882]" />
                Dirección del Servicio
              </h3>
              <p className="text-sm text-white/90">
                {extraProps.address || user?.address || 'No especificada'}
              </p>
              {!extraProps.address && user?.address && (
                <p className="text-xs text-white/30 mt-1">
                  (Usando dirección registrada del cliente)
                </p>
              )}
            </div>

            {/* Información de pago */}
            <div className="p-4 rounded-xl border border-white/10 bg-white/5">
              <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <DollarSign size={16} className="text-[#C8A882]" />
                Información de Pago
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/40">Total del pedido:</span>
                  <span className="text-lg font-bold text-[#C8A882]">{formatCurrency(total)}</span>
                </div>

                {totalPaid > 0 && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40">Pagado:</span>
                      <span className="text-sm font-medium text-green-400">{formatCurrency(totalPaid)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40">Restante:</span>
                      <span className={`text-sm font-medium ${remaining > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                        {formatCurrency(remaining)}
                      </span>
                    </div>

                    {/* Barra de progreso */}
                    <div className="pt-2">
                      <div className="flex justify-between text-xs text-white/40 mb-1">
                        <span>Progreso de pago</span>
                        <span>{paymentPercentage}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            paymentPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${paymentPercentage}%` }} />
                      </div>
                    </div>
                  </>
                )}

                {extraProps.payments?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-white/60 mb-2">Historial de pagos:</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {extraProps.payments.map((payment, idx) => (
                        <div key={idx}
                          className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/10">
                          <div>
                            <span className="text-xs font-medium text-white/90">
                              {formatCurrency(payment.amount)}
                            </span>
                            <span className="text-[10px] text-white/40 ml-2">
                              {new Date(payment.paidAt).toLocaleDateString('es-CO')}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                            payment.status === 'approved'
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          }`}>
                            {payment.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Servicios */}
            <div className="p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                  <Package size={16} className="text-[#C8A882]" />
                  Servicios ({extraProps.items.length})
                </h3>
                <span className="text-xs text-white/40">{formatCurrency(total)}</span>
              </div>

              {extraProps.items.length === 0 ? (
                <div className="text-center py-8">
                  <Package size={32} className="mx-auto text-white/20 mb-2" />
                  <p className="text-white/40 text-sm">No hay servicios en este pedido</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {extraProps.items.map((item, idx) => {
                    const service = item.id_servicio as Service;
                    return (
                      <div key={item._id || idx}
                        className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="grid grid-cols-12 gap-3">
                          <div className="col-span-5">
                            <p className="text-xs font-medium text-white/90">
                              {service?.name || 'Servicio no disponible'}
                            </p>
                            {service?.description && (
                              <p className="text-[10px] text-white/40 mt-1">
                                {service.description}
                              </p>
                            )}
                          </div>
                          <div className="col-span-3">
                            <p className="text-xs font-medium text-[#C8A882]">
                              {formatCurrency(item.valor || 0)}
                            </p>
                          </div>
                          <div className="col-span-4">
                            <p className="text-xs text-white/60">
                              {item.detalles || (
                                <span className="text-white/30 italic">Sin detalles</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
              <button
                type="button"
                onClick={() => setEditModal(true)}
                className="px-5 py-2.5 rounded-lg
                  border border-[#C8A882]/30 bg-[#C8A882]/10
                  text-[#C8A882] text-sm font-medium
                  hover:bg-[#C8A882]/20 hover:border-[#C8A882]/50
                  flex items-center gap-2
                  transition-all duration-200">
                <Edit size={14} />
                Editar Pedido
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      <EditOrderModal
        isOpen={editModal}
        onClose={() => {
          setEditModal(false);
          if (updateList) updateList();
        }}
        extraProps={extraProps}
        updateList={updateList}
      />
    </>
  );
}

export default OrderDetailsModal;