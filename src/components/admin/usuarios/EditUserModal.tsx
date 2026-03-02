'use client';
import { X, User, Mail, Phone, MapPin, UserCircle, Info, Save, Shield } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { DefaultModalProps, Role } from '@/lib/types';
import api from '@/components/Global/axios';
import { updateElement } from '../global/alerts';
import { createPortal } from 'react-dom';

function EditUserModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<any>) {
  const [userData, setUserData] = useState<any | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchRoles = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/roles');
        setRoles(res.data.roles || []);
      } catch (error) {
        console.error('Error al obtener roles:', error);
        const Swal = (await import('sweetalert2')).default;
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los roles',
          icon: 'error',
          background: '#1e1e1c',
          color: '#fff',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [isOpen]);

  useEffect(() => {
    if (extraProps && isOpen) {
      setUserData({
        _id: extraProps._id,
        name: extraProps.name || '',
        address: extraProps.address || '',
        email: extraProps.email || '',
        phone: extraProps.phone || '',
        registeredAt: extraProps.registeredAt || new Date().toISOString(),
        role: extraProps.role || '',
        status: extraProps.status ?? true,
        featuredProducts: extraProps.featuredProducts || [],
        document: extraProps.document || '',
        id: extraProps.id || '',
        profile_picture: extraProps.profile_picture || '',
      });
    }
  }, [extraProps, isOpen]);

  useEffect(() => {
    if (!isOpen) setUserData(null);
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev: any) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    if (!userData.name || !userData.email || !userData.role) {
      const Swal = (await import('sweetalert2')).default;
      return Swal.fire({
        title: 'Campos incompletos',
        text: 'Nombre, correo y rol son obligatorios',
        icon: 'warning',
        background: '#1e1e1c',
        color: '#fff',
      });
    }

    setSaving(true);
    try {
      await updateElement('Usuario', `/api/users/${userData._id}`, userData, updateList!);
      
      const Swal = (await import('sweetalert2')).default;
      Swal.fire({
        toast: true,
        animation: false,
        timerProgressBar: true,
        showConfirmButton: false,
        title: 'Usuario actualizado exitosamente',
        icon: 'success',
        position: 'top-right',
        timer: 1500,
        background: '#1e1e1c',
        color: '#fff',
      });
      
      onClose();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !userData) return null;

  return createPortal(
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-4'
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
            Editar usuario
          </h2>
        </header>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">

          {/* Información principal */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
                Nombre completo *
              </label>
              <input
                name="name"
                value={userData.name}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                  text-sm text-white placeholder:text-white/30
                  focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                  transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
                Estado
              </label>
              <label className="flex items-center gap-3 cursor-pointer h-12">
                <input
                  type="checkbox"
                  checked={userData.status}
                  onChange={(e) =>
                    setUserData((prev: any) =>
                      prev ? { ...prev, status: e.target.checked } : prev
                    )
                  }
                  className="w-4 h-4 rounded border-white/30
                    bg-white/5 text-[#C8A882]
                    focus:ring-[#C8A882] focus:ring-1 focus:ring-offset-0"
                />
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium
                  ${userData.status
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                  {userData.status ? 'Activo' : 'Inactivo'}
                </span>
              </label>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
              Correo electrónico *
            </label>
            <input
              name="email"
              type="email"
              value={userData.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                text-sm text-white placeholder:text-white/30
                focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                transition-all duration-200"
            />
          </div>

          {/* Teléfono y Rol */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
                Teléfono
              </label>
              <input
                name="phone"
                value={userData.phone}
                onChange={handleChange}
                placeholder="+57 300 123 4567"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                  text-sm text-white placeholder:text-white/30
                  focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                  transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
                Rol *
              </label>
              <select
                value={(userData.role as Role)?._id || ''}
                onChange={(e) => {
                  const selectedRole = roles.find((r) => r._id === e.target.value);
                  setUserData((prev: any) =>
                    prev ? { ...prev, role: selectedRole || '' } : prev
                  );
                }}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                  text-sm text-white placeholder:text-white/30
                  focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                  transition-all duration-200 appearance-none"
                disabled={loading}
              >
                <option value="" className="bg-[#1e1e1c]">Seleccionar rol</option>
                {loading ? (
                  <option value="" disabled className="bg-[#1e1e1c]">Cargando roles...</option>
                ) : (
                  roles.map((role) => (
                    <option key={role._id} value={role._id} className="bg-[#1e1e1c]">
                      {role.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Dirección */}
          <div className="space-y-2">
            <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
              Dirección
            </label>
            <input
              name="address"
              value={userData.address}
              onChange={handleChange}
              placeholder="Calle 123 #45-67, Ciudad"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                text-sm text-white placeholder:text-white/30
                focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                transition-all duration-200"
            />
          </div>

          {/* Documento (si existe) */}
          {userData.document !== undefined && (
            <div className="space-y-2">
              <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
                Documento de identidad
              </label>
              <input
                name="document"
                value={userData.document}
                onChange={handleChange}
                placeholder="123456789"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                  text-sm text-white placeholder:text-white/30
                  focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                  transition-all duration-200"
              />
            </div>
          )}

          {/* Resumen */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-white">Resumen de cambios</p>
                <p className="text-xs text-white/40 mt-1">{userData.name}</p>
                <p className="text-xs text-white/40">{userData.email}</p>
              </div>
              {userData.role && (
                <span className="text-xs px-3 py-1.5 rounded-full
                  bg-[#C8A882]/10 text-[#C8A882] border border-[#C8A882]/20">
                  {(userData.role as Role)?.name || 'Rol seleccionado'}
                </span>
              )}
            </div>
            {userData.status !== extraProps?.status && (
              <p className="text-xs text-yellow-400/70 mt-2 flex items-center gap-1">
                <Info size={12} />
                El estado cambiará de {extraProps?.status ? 'Activo' : 'Inactivo'} a {userData.status ? 'Activo' : 'Inactivo'}
              </p>
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
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !userData.name || !userData.email || !userData.role}
              className="px-5 py-2.5 rounded-lg
                bg-[#8B5E3C] hover:bg-[#6F452A]
                text-white text-sm font-medium
                shadow-lg shadow-[#8B5E3C]/20
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2
                transition-all duration-200">
              {saving ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default EditUserModal;