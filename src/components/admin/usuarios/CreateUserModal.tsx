'use client';
import { X, User, Mail, Lock, UserCircle, Save, Shield } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createElement } from '@/components/admin/global/alerts';
import api from '@/components/Global/axios';
import { DefaultModalProps } from '@/lib/types';

function CreateUserModal({ isOpen, onClose, updateList }: DefaultModalProps<any>) {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const [roles, setRoles] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchRoles = async () => {
      const Swal = (await import('sweetalert2')).default;
      try {
        const res = await api.get('/api/roles');
        if (res.data?.ok) {
          setRoles(res.data.roles);
        } else {
          setRoles([]);
        }
      } catch (err) {
        console.error('Error al obtener roles:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los roles',
          icon: 'error',
          background: '#1e1e1c',
          color: '#fff',
        });
      }
    };

    fetchRoles();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setUserData({
        name: '',
        email: '',
        password: '',
        role: '',
      });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const Swal = (await import('sweetalert2')).default;

    const { name, email, password, role } = userData;

    if (!name || !email || !password || !role) {
      return Swal.fire({
        title: 'Campos incompletos',
        text: 'Todos los campos son obligatorios',
        icon: 'warning',
        background: '#1e1e1c',
        color: '#fff',
      });
    }

    setLoading(true);
    try {
      await createElement('usuario', '/api/users', userData, updateList!);
      
      Swal.fire({
        toast: true,
        animation: false,
        timerProgressBar: true,
        showConfirmButton: false,
        title: 'Usuario creado exitosamente',
        icon: 'success',
        position: 'top-right',
        timer: 1500,
        background: '#1e1e1c',
        color: '#fff',
      });
      
      onClose();
    } catch (error) {
      console.error('Error al crear usuario:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al crear el usuario',
        icon: 'error',
        background: '#1e1e1c',
        color: '#fff',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed  top-18 left-72 inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      
      <div className="w-full max-w-[500px] rounded-2xl border border-white/10
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
            <UserCircle size={18} className="text-[#C8A882]" />
            Crear nuevo usuario
          </h2>
        </header>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">

          {/* Nombre */}
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

          {/* Password */}
          <div className="space-y-2">
            <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
              Contraseña *
            </label>
            <input
              name="password"
              type="password"
              value={userData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                text-sm text-white placeholder:text-white/30
                focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                transition-all duration-200"
            />
            <p className="text-xs text-white/30 mt-1">
              Mínimo 6 caracteres
            </p>
          </div>

          {/* Rol */}
          <div className="space-y-2">
            <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
              Rol *
            </label>
            <select
              name="role"
              value={userData.role}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                text-sm text-white placeholder:text-white/30
                focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                transition-all duration-200 appearance-none"
            >
              <option value="" className="bg-[#1e1e1c]">Seleccionar rol</option>
              {roles.length === 0 ? (
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

          {/* Resumen */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/5 mt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-medium text-white/70">Resumen</p>
                <p className="text-xs text-white/40 mt-1">
                  {userData.name || 'Nombre no especificado'}
                </p>
                <p className="text-xs text-white/40">
                  {userData.email || 'Email no especificado'}
                </p>
              </div>
              {userData.role && roles.find(r => r._id === userData.role) && (
                <span className="text-xs px-3 py-1.5 rounded-full
                  bg-[#C8A882]/10 text-[#C8A882] border border-[#C8A882]/20">
                  {roles.find(r => r._id === userData.role)?.name}
                </span>
              )}
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
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !userData.name || !userData.email || !userData.password || !userData.role}
              className="px-5 py-2.5 rounded-lg
                bg-[#8B5E3C] hover:bg-[#6F452A]
                text-white text-sm font-medium
                shadow-lg shadow-[#8B5E3C]/20
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2
                transition-all duration-200">
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Creando...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Crear Usuario
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUserModal;