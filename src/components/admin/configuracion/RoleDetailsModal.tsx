'use client';

import { X, Shield, Package, Check, User, Calendar, Users, Edit, Info } from 'lucide-react';
import { DefaultModalProps, Role } from '@/lib/types';
import React, { useState } from 'react';
import EditRoleModal from './EditRoleModal';

function RoleDetailsModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<Role>) {
  const [editModal, setEditModal] = useState(false);

  if (!isOpen || !extraProps) return null;

  const modules = Array.from(new Set(extraProps.permissions?.map((p) => p.module)));

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <div className='fixed top-18 left-72 inset-0 z-50 flex items-center justify-center p-4'
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
        
        <div className='w-full max-w-[600px] rounded-2xl border border-white/10
          shadow-[0_8px_32px_rgba(0,0,0,0.3)]
          flex flex-col max-h-[90vh]'
          style={{ background: 'rgba(30,30,28,0.95)', backdropFilter: 'blur(20px)' }}>
          
          {/* Header */}
          <header className='relative px-6 py-5 border-b border-white/10'>
            <button
              onClick={onClose}
              className='absolute left-4 top-1/2 -translate-y-1/2
                p-2 rounded-lg text-white/40 hover:text-white/70
                hover:bg-white/5 transition-all duration-200'>
              <X size={18} />
            </button>
            <h2 className='text-lg font-medium text-white text-center flex items-center justify-center gap-2'>
              <Shield size={18} className="text-[#C8A882]" />
              Detalles del rol
            </h2>
          </header>

          <div className='p-6 overflow-y-auto space-y-6'>

            {/* Información principal */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block'>
                  Nombre del rol
                </label>
                <div className='w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                  text-sm text-white/90'>
                  {extraProps.name}
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block'>
                  Estado
                </label>
                <div className='flex items-center h-12'>
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

            {/* Descripción */}
            <div className='space-y-2'>
              <label className='text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block'>
                Descripción
              </label>
              <div className='w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                text-sm text-white/70 min-h-[50px]'>
                {extraProps.description || 'Sin descripción'}
              </div>
            </div>

            {/* Metadata */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block'>
                  Fecha de creación
                </label>
                <div className='flex items-center gap-2 text-sm text-white/60'>
                  <Calendar size={14} className="text-white/40" />
                  {extraProps.createdAt ? formatDate(extraProps.createdAt) : 'No disponible'}
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block'>
                  Usuarios asignados
                </label>
                <div className='flex items-center gap-2 text-sm text-white/60'>
                  <Users size={14} className="text-white/40" />
                  {extraProps.usersCount || 0} usuario{(extraProps.usersCount || 0) !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Permisos */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-sm font-medium text-white/70 flex items-center gap-2'>
                  <Package size={14} className="text-[#C8A882]" />
                  Permisos ({extraProps.permissions?.length || 0})
                </h3>
                {extraProps.permissions && extraProps.permissions.length > 0 && (
                  <span className='text-xs text-white/40'>
                    {modules.length} módulo{modules.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {!extraProps.permissions || extraProps.permissions.length === 0 ? (
                <div className='text-center py-12 rounded-xl border border-white/10 bg-white/5'>
                  <Package size={32} className="mx-auto text-white/20 mb-2" />
                  <p className='text-white/40 text-sm'>No hay permisos asignados</p>
                </div>
              ) : (
                <div className='space-y-3 max-h-80 overflow-y-auto pr-2'>
                  {modules.map((module) => {
                    const modulePerms = extraProps.permissions?.filter(
                      (p) => p.module === module
                    );

                    return (
                      <div key={module}
                        className='rounded-xl border border-white/10 bg-white/5 p-4'>
                        
                        <div className='flex items-center justify-between mb-3'>
                          <h4 className='text-sm font-medium text-white'>{module}</h4>
                          <span className='text-[10px] px-2 py-1 rounded-full
                            bg-blue-500/10 text-blue-400 border border-blue-500/20'>
                            {modulePerms?.length} permiso{modulePerms?.length !== 1 ? 's' : ''}
                          </span>
                        </div>

                        <div className='grid grid-cols-2 gap-2'>
                          {modulePerms?.map((permission) => (
                            <div key={permission._id}
                              className='flex items-center gap-2 p-2 rounded-lg bg-white/5'>
                              <Check size={12} className="text-[#C8A882]" />
                              <span className='text-xs text-white/70'>
                                {permission.action === 'view' && 'Ver'}
                                {permission.action === 'create' && 'Crear'}
                                {permission.action === 'update' && 'Editar'}
                                {permission.action === 'delete' && 'Eliminar'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Resumen */}
            {extraProps.permissions && extraProps.permissions.length > 0 && (
              <div className='p-4 rounded-xl border border-white/10 bg-white/5'>
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='text-sm font-medium text-white'>Resumen del rol</p>
                    <p className='text-xs text-white/40 mt-1'>
                      {extraProps.permissions.length} permiso{extraProps.permissions.length !== 1 ? 's' : ''} 
                      {' en '}{modules.length} módulo{modules.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-full
                    ${extraProps.status
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                    {extraProps.status ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            )}

            {/* Botones */}
            <div className='flex justify-end gap-3 pt-4 border-t border-white/10'>
              <button
                type='button'
                onClick={onClose}
                className='px-5 py-2.5 rounded-lg
                  border border-white/15 bg-white/5
                  text-white/70 text-sm
                  hover:bg-white/10 hover:text-white
                  transition-all duration-200'>
                Cerrar
              </button>
              <button
                type='button'
                onClick={() => setEditModal(true)}
                className='px-5 py-2.5 rounded-lg
                  border border-[#C8A882]/30 bg-[#C8A882]/10
                  text-[#C8A882] text-sm font-medium
                  hover:bg-[#C8A882]/20 hover:border-[#C8A882]/50
                  flex items-center gap-2
                  transition-all duration-200'>
                <Edit size={14} />
                Editar rol
              </button>
            </div>
          </div>
        </div>
      </div>

      <EditRoleModal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        extraProps={extraProps}
        updateList={updateList}
      />
    </>
  );
}

export default RoleDetailsModal;