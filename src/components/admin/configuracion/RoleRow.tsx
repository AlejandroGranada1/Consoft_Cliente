'use client';
import { Pencil, Eye, Trash2 } from 'lucide-react';
import { Role } from '@/lib/types';

interface RoleRowProps {
  role: Role;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function RoleRow({ role, onView, onEdit, onDelete }: RoleRowProps) {
  return (
    <div className="border-b py-4 px-2 md:px-0">
      {/* Desktop: grid */}
      <div className="hidden md:grid md:grid-cols-6 md:items-center md:gap-4">
        <p className="truncate">{role.name}</p>
        <p className="truncate">{role.description}</p>
        <p className="text-center">{role.usersCount}</p>
        <p className="text-center">{new Date(role.createdAt).toLocaleDateString()}</p>
        <p className={`text-center ${role.status ? 'text-green-500' : 'text-red-500'}`}>
          {role.status ? 'Activo' : 'Inactivo'}
        </p>
        <div className="flex justify-center gap-3">
          <Eye size={20} color="#d9b13b" onClick={onView} className="cursor-pointer hover:scale-110 transition" />
          <Pencil size={20} color="#7588f0" onClick={onEdit} className="cursor-pointer hover:scale-110 transition" />
          <Trash2 size={20} color="#fa4334" onClick={onDelete} className="cursor-pointer hover:scale-110 transition" />
        </div>
      </div>

      {/* Mobile: cards */}
      <div className="flex flex-col gap-2 md:hidden bg-white shadow rounded-lg p-3">
        <p><span className="font-semibold">Nombre: </span>{role.name}</p>
        <p><span className="font-semibold">Descripción: </span>{role.description}</p>
        <p><span className="font-semibold">Usuarios: </span>{role.usersCount}</p>
        <p><span className="font-semibold">Fecha: </span>{new Date(role.createdAt).toLocaleDateString()}</p>
        <p>
          <span className="font-semibold">Estado: </span>
          <span className={role.status ? 'text-green-500' : 'text-red-500'}>
            {role.status ? 'Activo' : 'Inactivo'}
          </span>
        </p>
        <div className="flex gap-3 mt-2">
          <Eye size={20} color="#d9b13b" onClick={onView} className="cursor-pointer hover:scale-110 transition" />
          <Pencil size={20} color="#7588f0" onClick={onEdit} className="cursor-pointer hover:scale-110 transition" />
          <Trash2 size={20} color="#fa4334" onClick={onDelete} className="cursor-pointer hover:scale-110 transition" />
        </div>
      </div>
    </div>
  );
}
