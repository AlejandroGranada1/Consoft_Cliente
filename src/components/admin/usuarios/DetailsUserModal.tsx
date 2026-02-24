import { X, User, Mail, Phone, MapPin, UserCircle, Info, Edit, Calendar, Shield } from 'lucide-react';
import { DefaultModalProps, Role } from '@/lib/types';
import React, { useState } from 'react';
import EditUserModal from './EditUserModal';
import { deleteElement } from '../global/alerts';

function DetailsUserModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<any>) {
  const [editModal, setEditModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteUser = async () => {
    if (!extraProps?._id) return;
    
    setDeleteLoading(true);
    const result = await deleteElement('Usuario', `/api/users/${extraProps._id}`, updateList!);
    setDeleteLoading(false);
    
    if (result) {
      onClose();
    }
  };

  const formatDate = (date: string) => {
    if (!date) return 'No disponible';
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen || !extraProps) return null;

  return (
    <>
      <div className="fixed  top-18 left-72 inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
        
        <div className="w-full max-w-[600px] rounded-2xl border border-white/10
          shadow-[0_8px_32px_rgba(0,0,0,0.3)]
          flex flex-col max-h-[90vh]"
          style={{ background: 'rgba(30,30,28,0.95)', backdropFilter: 'blur(20px)' }}>
          
          {/* Header */}
          <header className="relative px-6 py-5 border-b border-white/10">
            <button
              onClick={onClose}
              className="absolute left-4 top-1/2 -translate-y-1/2
                p-2 rounded-lg text-white/40 hover:text-white/70
                hover:bg-white/5 transition-all duration-200">
              <X size={18} />
            </button>
            <h2 className="text-lg font-medium text-white text-center flex items-center justify-center gap-2">
              <User size={18} className="text-[#C8A882]" />
              Detalles del usuario
            </h2>
          </header>

          <div className="p-6 overflow-y-auto space-y-6">

            {/* Información principal */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
                  Nombre
                </label>
                <div className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                  text-sm text-white/90">
                  {extraProps.name}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
                  Estado
                </label>
                <div className="flex items-center h-12">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium
                    ${extraProps.status
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                    {extraProps.status ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
                Correo electrónico
              </label>
              <div className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                text-sm text-white/90 flex items-center gap-2">
                <Mail size={14} className="text-white/40" />
                {extraProps.email}
              </div>
            </div>

            {/* Teléfono y Rol */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
                  Teléfono
                </label>
                <div className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                  text-sm text-white/70 flex items-center gap-2">
                  <Phone size={14} className="text-white/40" />
                  {extraProps.phone || 'No registrado'}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
                  Rol
                </label>
                <div className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                  text-sm text-white/70 flex items-center gap-2">
                  <Shield size={14} className="text-white/40" />
                  {(extraProps.role as Role)?.name || 'Sin rol'}
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div className="space-y-2">
              <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
                Dirección
              </label>
              <div className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                text-sm text-white/70 flex items-center gap-2">
                <MapPin size={14} className="text-white/40" />
                {extraProps.address || 'No registrada'}
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
                  Fecha de registro
                </label>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Calendar size={14} className="text-white/40" />
                  {formatDate(extraProps.createdAt)}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
                  Última actualización
                </label>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Calendar size={14} className="text-white/40" />
                  {formatDate(extraProps.updatedAt)}
                </div>
              </div>
            </div>

            {/* Resumen */}
            <div className="p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-white">Resumen del usuario</p>
                  <p className="text-xs text-white/40 mt-1">{extraProps.name}</p>
                  <p className="text-xs text-white/40">{extraProps.email}</p>
                </div>
                <span className="text-xs px-3 py-1.5 rounded-full
                  bg-[#C8A882]/10 text-[#C8A882] border border-[#C8A882]/20">
                  {(extraProps.role as Role)?.name || 'Sin rol'}
                </span>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-between gap-3 pt-4 border-t border-white/10">
              <div className="flex gap-3">
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
                  Editar usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      <EditUserModal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        extraProps={extraProps}
        updateList={updateList}
      />
    </>
  );
}

export default DetailsUserModal;