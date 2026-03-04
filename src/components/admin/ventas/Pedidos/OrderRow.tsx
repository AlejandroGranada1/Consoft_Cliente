'use client';

import { Order, User } from '@/lib/types';
import { Eye, Edit, Trash2, MoreVertical, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

interface OrderRowProps {
  order: Order;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function OrderRow({ order, onView, onEdit, onDelete }: OrderRowProps) {
  const [showActions, setShowActions] = useState(false);

  const user = order.user as User;
  const total = order.total || order.items.reduce((sum, item) => sum + (item.valor || 0), 0);
  const totalPaid = (order.payments || []).reduce((sum, p) => {
    const APPROVED = new Set(['aprobado', 'approved', 'confirmado', 'pagado', 'paid']);
    const PENDING = new Set(['pendiente', 'pending', 'en_revision', 'en_proceso']);
    const status = String(p.status || '').toLowerCase();
    if (APPROVED.has(status) || PENDING.has(status)) return sum + (p.amount || 0);
    return sum;
  }, 0) + (order.initialPayment?.amount || 0);
  const itemsCount = order.items.length;

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completado':
        return <CheckCircle size={14} className="text-green-400" />;
      case 'cancelado':
        return <XCircle size={14} className="text-red-400" />;
      case 'en proceso':
        return <Clock size={14} className="text-blue-400" />;
      default:
        return <Clock size={14} className="text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completado':
        return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'cancelado':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'en proceso':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pagado':
        return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'parcial':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
    }
  };

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('es-CO')}`;
  };

  return (
    <div className='relative group'>
      {/* Versión Desktop */}
      <div className='hidden md:grid grid-cols-7 place-items-center py-3 px-4
        rounded-xl border border-white/10 bg-white/5
        hover:bg-white/8 transition-all duration-200'>

        {/* ID */}
        <div className='min-w-0 w-full text-center'>
          <p className="text-sm text-white/60 font-mono truncate">
            #{order._id?.slice(-6).toUpperCase()}
          </p>
        </div>

        {/* Cliente */}
        <div className='min-w-0 w-full text-center'>
          <p className="text-sm text-white/90 font-medium truncate">
            {user?.name || 'N/A'}
          </p>
        </div>

        {/* Resumen Pago */}
        <div className='col-span-2 w-full px-4 space-y-1.5'>
          <div className='flex justify-between items-center text-[10px]'>
            <span className='text-white/40'>Progreso Pago</span>
            <span className='text-[#C8A882] font-medium'>
              {Math.round(((order.paidTotal || totalPaid || 0) / (total || 1)) * 100)}%
            </span>
          </div>
          <div className='h-1.5 w-full bg-white/10 rounded-full overflow-hidden'>
            <div
              className='h-full bg-[#C8A882] transition-all duration-500'
              style={{ width: `${Math.min(100, Math.round(((order.paidTotal || totalPaid || 0) / (total || 1)) * 100))}%` }}
            />
          </div>
          <div className='flex justify-between text-[9px] tabular-nums'>
            <div className='flex flex-col'>
              <span className='text-green-400/80'>Pagado: {formatCurrency(order.payments.reduce((sum, acc) => sum + acc.amount, 0) || 0)}</span>
              {order.paidPending ? (
                <span className='text-yellow-400/60 text-[8px]'>({formatCurrency(order.paidApproved || 0)} apr.)</span>
              ) : null}
            </div>
            <span className='text-white/40 font-medium'>
              Restante: {formatCurrency(order.restanteConPendientes ?? (total - (order.paidTotal || 0)))}
            </span>
          </div>
        </div>

        {/* Estado */}
        <div className="flex items-center gap-1.5">
          {getStatusIcon(order.status)}
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(order.status)}`}>
            {order.status || 'Pendiente'}
          </span>
        </div>

        {/* Items */}
        <div className="flex items-center gap-1.5">
          <Package size={12} className="text-white/40" />
          <p className="text-sm text-white/60">{itemsCount}</p>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          <button
            onClick={onView}
            className="p-1.5 rounded-lg text-white/40 hover:text-[#C8A882]
              hover:bg-white/5 transition-all duration-200"
            title="Ver detalles">
            <Eye size={16} />
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-white/40 hover:text-[#C8A882]
              hover:bg-white/5 transition-all duration-200"
            title="Editar">
            <Edit size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-white/40 hover:text-red-400
              hover:bg-white/5 transition-all duration-200"
            title="Eliminar">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Versión Mobile */}
      <div className='md:hidden rounded-xl border border-white/10 bg-white/5 p-4'>
        <div className='flex justify-between items-start mb-3'>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-white/40 font-mono">
                #{order._id?.slice(-6).toUpperCase()}
              </p>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(order.status)}`}>
                {order.status || 'Pendiente'}
              </span>
            </div>
            <h3 className="text-white font-medium text-sm mt-2">{user?.name}</h3>
            <p className="text-xs text-white/40 mt-1">{user?.email}</p>
          </div>

          <p className="text-lg font-bold text-[#C8A882]">{formatCurrency(total)}</p>
        </div>

        <div className='flex items-center gap-3 mt-2'>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
            {order.paymentStatus || 'Pendiente'}
          </span>
          <span className="flex items-center gap-1 text-xs text-white/40">
            <Package size={12} /> {itemsCount} items
          </span>
        </div>

        {/* Menú de acciones mobile */}
        <div className='relative mt-3 flex justify-end'>
          <button
            onClick={() => setShowActions(!showActions)}
            className='p-2 rounded-lg text-white/40 hover:text-white
              hover:bg-white/5 transition-all'>
            <MoreVertical size={18} />
          </button>

          {showActions && (
            <div className='absolute right-0 mt-2 w-32 rounded-lg
              border border-white/10 bg-[#252320] shadow-lg z-10'>
              <button
                onClick={() => { onView(); setShowActions(false); }}
                className='w-full px-4 py-2 text-left text-sm text-white/70
                  hover:bg-white/5 first:rounded-t-lg
                  flex items-center gap-2'>
                <Eye size={14} /> Ver
              </button>
              <button
                onClick={() => { onEdit(); setShowActions(false); }}
                className='w-full px-4 py-2 text-left text-sm text-white/70
                  hover:bg-white/5
                  flex items-center gap-2'>
                <Edit size={14} /> Editar
              </button>
              <button
                onClick={() => { onDelete(); setShowActions(false); }}
                className='w-full px-4 py-2 text-left text-sm text-red-400
                  hover:bg-white/5 last:rounded-b-lg
                  flex items-center gap-2'>
                <Trash2 size={14} /> Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}