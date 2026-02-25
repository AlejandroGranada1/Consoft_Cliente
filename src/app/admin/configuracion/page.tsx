'use client';
import { Search, Plus, Shield } from 'lucide-react';
import { Role } from '@/lib/types';
import CreateRoleModal from '@/components/admin/configuracion/CreateRoleModal';
import EditRoleModal from '@/components/admin/configuracion/EditRoleModal';
import RoleDetailsModal from '@/components/admin/configuracion/RoleDetailsModal';
import React, { useEffect, useState } from 'react';
import Pagination from '@/components/Global/Pagination';
import { useDeleteRole, useGetRoles } from '@/hooks/apiHooks';
import RoleRow from '@/components/admin/configuracion/RoleRow';

function Page() {
  const [createModal, setCreateModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [role, setRole] = useState<Role>();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState('');

  const itemsPerPage = 5;

  const deleteRole = useDeleteRole();
  const { data, refetch } = useGetRoles();
  const roles = data?.roles || [];

  const filteredRoles = roles.filter((r: Role) =>
    r.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRoles = filteredRoles.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterText]);

  const handleDeleteRole = async (id: string) => {
    const Swal = (await import('sweetalert2')).default;
    try {
      Swal.fire({
        title: '¿Estás seguro de eliminar este rol?',
        text: 'Esta acción es irreversible',
        icon: 'warning',
        background: '#1e1e1c',
        color: '#fff',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#8B5E3C',
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#4a4a4a',
      }).then(async (response) => {
        if (response.isConfirmed) {
          await deleteRole.mutateAsync(id);
          Swal.fire({
            toast: true,
            animation: false,
            timerProgressBar: true,
            showConfirmButton: false,
            title: 'Rol eliminado exitosamente',
            icon: 'success',
            position: 'top-right',
            timer: 1500,
            background: '#1e1e1c',
            color: '#fff',
          });
          refetch();
        }
      });
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        background: '#1e1e1c',
        color: '#fff',
      });
    }
  };

  return (
    <div
      className="w-full relative px-4 md:px-20 py-10 min-h-full"
      style={{
        background: `
          radial-gradient(ellipse at 75% 10%, rgba(120,100,80,0.16) 0%, transparent 50%),
          radial-gradient(ellipse at 15% 65%, rgba(90,75,60,0.13) 0%, transparent 50%),
          linear-gradient(160deg, #1e1e1c 0%, #252320 30%, #2a2724 60%, #1e1c1a 100%)
        `,
      }}
    >
      {/* Grain effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.045]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)' }}
      />

      <div className="relative z-10 flex flex-col min-h-full">
        {/* Header */}
        <header className='flex flex-col gap-4 mb-8'>
          <div>
            <span className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium">
              Configuración
            </span>
            <h1 className='font-serif text-white text-3xl md:text-4xl mt-2 flex items-center gap-3'>
              <Shield size={32} className="text-[#C8A882]" />
              Roles de usuario
            </h1>
          </div>

          {/* Filtros y botón */}
          <div className='flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center'>
            {/* Buscador */}
            <div className='relative w-full md:w-80'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-white/30' size={18} />
              <datalist id='roles'>
                {roles.map((role: Role) => (
                  <option key={role._id} value={role.name}></option>
                ))}
              </datalist>
              <input
                type='text'
                list='roles'
                placeholder='Buscar rol...'
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className='w-full pl-10 pr-4 py-3 rounded-xl
                  border border-white/15 bg-white/5
                  text-sm text-white placeholder:text-white/30
                  focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                  transition-all duration-200'
              />
            </div>

            {/* Botón Agregar */}
            <button
              onClick={() => setCreateModal(true)}
              className='inline-flex items-center justify-center gap-2
                px-6 py-3 rounded-xl
                bg-[#8B5E3C] hover:bg-[#6F452A]
                text-white text-sm font-medium
                shadow-lg shadow-[#8B5E3C]/20
                transition-all duration-200
                w-full md:w-auto'
            >
              <Plus size={18} />
              Nuevo Rol
            </button>
          </div>
        </header>

        {/* Tabla - flex-1 para que ocupe el espacio disponible */}
        <section className='w-full mx-auto flex-1 flex flex-col'>
          {/* Encabezado tabla - solo desktop */}
          <div className='hidden md:grid grid-cols-6 place-items-center py-4 px-4
            border-b border-white/10 text-[11px] tracking-[.08em] uppercase text-white/40 font-medium'>
            <p>Rol</p>
            <p>Descripción</p>
            <p>Usuarios</p>
            <p>Fecha creación</p>
            <p>Estado</p>
            <p>Acciones</p>
          </div>

          {/* Lista de roles */}
          <div className='space-y-2 mt-4 flex-1'>
            {currentRoles.length > 0 ? (
              currentRoles.map((role: Role) => (
                <RoleRow
                  key={role._id}
                  role={role}
                  onView={() => {
                    setDetailsModal(true);
                    setRole(role);
                  }}
                  onEdit={() => {
                    setEditModal(true);
                    setRole(role);
                  }}
                  onDelete={() => handleDeleteRole(role._id)}
                />
              ))
            ) : (
              <div className='text-center py-16 px-4
                rounded-2xl border border-white/10
                bg-white/5 backdrop-blur-sm'>
                <Shield size={40} className="mx-auto text-white/20 mb-3" />
                <p className='text-white/60 text-sm'>No hay roles para mostrar</p>
                <p className='text-white/30 text-xs mt-1'>Crea un nuevo rol para comenzar</p>
              </div>
            )}
          </div>

          {/* Paginación - con borde superior para separar visualmente */}
          {totalPages > 1 && (
            <div className='mt-8 pt-4 border-t border-white/10'>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, newPage) => setCurrentPage(newPage)}
                className=''
              />
            </div>
          )}

          {/* Espaciador inferior para que la tabla no se corte abruptamente */}
          <div className="h-8 md:h-12" />
        </section>

        {/* Modales */}
        <CreateRoleModal
          isOpen={createModal}
          onClose={() => setCreateModal(false)}
          updateList={() => refetch()}
        />
        <RoleDetailsModal
          isOpen={detailsModal}
          onClose={() => setDetailsModal(false)}
          extraProps={role}
          updateList={() => refetch()}
        />
        <EditRoleModal
          isOpen={editModal}
          onClose={() => setEditModal(false)}
          extraProps={role}
          updateList={() => refetch()}
        />
      </div>
    </div>
  );
}

export default Page;