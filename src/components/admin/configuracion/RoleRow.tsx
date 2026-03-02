'use client';

import { Role } from '@/lib/types';
import { Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface RoleRowProps {
  role: Role;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function RoleRow({ role, onView, onEdit, onDelete }: RoleRowProps) {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (date: string | Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className='relative group'>
      {/* Versión Desktop */}
      <div className='hidden md:grid grid-cols-6 place-items-center py-4 px-4
        rounded-xl border border-white/10 bg-white/5
        hover:bg-white/8 transition-all duration-200'>

        <div className='min-w-0 w-full text-center'>
          <p className='text-sm text-white/90 font-medium truncate'>{role.name}</p>
        </div>
        <div className='min-w-0 w-full text-center'>
          <p className='text-sm text-white/60 truncate' title={role.description || ''}>{role.description || '-'}</p>
        </div>
        <p className='text-sm text-white/60'>{role.usersCount || 0}</p>
        <p className='text-sm text-white/60'>{formatDate(role.createdAt)}</p>

        <div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium
            ${role.status
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
            {role.status ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        <div className='flex items-center gap-2'>
          <button
            onClick={onView}
            className='p-2 rounded-lg text-white/40 hover:text-[#C8A882]
              hover:bg-white/5 transition-all duration-200'
            title='Ver detalles'>
            <Eye size={16} />
          </button>
          <button
            onClick={onEdit}
            className='p-2 rounded-lg text-white/40 hover:text-[#C8A882]
              hover:bg-white/5 transition-all duration-200'
            title='Editar'>
            <Edit size={16} />
          </button>
          <button
            onClick={onDelete}
            className='p-2 rounded-lg text-white/40 hover:text-red-400
              hover:bg-white/5 transition-all duration-200'
            title='Eliminar'>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Versión Mobile */}
      <div className='md:hidden rounded-xl border border-white/10 bg-white/5 p-4'>
        <div className='flex justify-between items-start'>
          <div>
            <h3 className='text-white font-medium'>{role.name}</h3>
            <p className='text-xs text-white/40 mt-1'>{role.description || 'Sin descripción'}</p>

            <div className='flex items-center gap-3 mt-3'>
              <span className={`text-xs px-2 py-1 rounded-full
                ${role.status
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-red-500/10 text-red-400'
                }`}>
                {role.status ? 'Activo' : 'Inactivo'}
              </span>
              <span className='text-xs text-white/40'>
                {role.usersCount || 0} usuarios
              </span>
            </div>
          </div>

          <div className='relative'>
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
    </div>
  );
}