'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, User, Lock, Camera, Check, X } from 'lucide-react';
import { useGetProfile, useUpdateUser, useChangePassword } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';
import { useRouter } from 'next/navigation';

function DarkInput({
  value, onChange, placeholder, readOnly, type = 'text',
}: {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full rounded-xl border px-4 py-3 text-sm text-white placeholder:text-white/30
        focus:outline-none transition-all duration-200
        ${readOnly
          ? 'border-white/8 bg-white/3 text-white/30 cursor-not-allowed'
          : 'border-white/15 bg-white/5 focus:border-[#C8A882]/50 focus:bg-white/8'
        }`}
    />
  );
}

function PasswordField({
  label, value, onChange, show, onToggle,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 pr-11
            text-sm text-white placeholder:text-white/30
            focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
            transition-all duration-200"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useUser();

  const { data, isLoading } = useGetProfile();
  const updateUser    = useUpdateUser();
  const changePassword = useChangePassword();
  const dbUser = data?.user;

  const [form, setForm] = useState({ name: '', email: '', document: '', address: '', phone: '' });
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileFile, setProfileFile]       = useState<File | null>(null);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrent, setShowCurrent]   = useState(false);
  const [showNew, setShowNew]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);

  useEffect(() => {
    if (loading) return;
    if (user === null) {
      (async () => {
        const Swal = (await import('sweetalert2')).default;
        await Swal.fire({ icon: 'warning', title: 'Inicia sesión', text: 'Debes iniciar sesión para acceder a tu perfil' });
        router.push('/client/auth/login');
      })();
    }
  }, [user, router, loading]);

  useEffect(() => {
    if (dbUser) {
      setForm({ name: dbUser.name ?? '', email: dbUser.email ?? '', document: dbUser.document ?? '', address: dbUser.address ?? '', phone: dbUser.phone ?? '' });
      setProfilePreview(dbUser.profile_picture ?? null);
    }
  }, [dbUser]);

  if (isLoading || !dbUser) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #1e1e1c 0%, #252320 30%, #2a2724 60%, #1e1c1a 100%)' }}>
      <p className="text-white/40 text-sm tracking-widest uppercase">Cargando...</p>
    </div>
  );

  const handleUpdateProfile = async () => {
    const Swal = (await import('sweetalert2')).default;
    if (!form.name || !form.document || !form.address || !form.phone)
      return Swal.fire({ icon: 'error', title: 'Campos incompletos', text: 'Completa todos los campos' });
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('document', form.document);
      formData.append('address', form.address);
      formData.append('phone', form.phone);
      if (profileFile) formData.append('profile_picture', profileFile);
      await updateUser.mutateAsync({ _id: dbUser._id, formData });
      Swal.fire({ icon: 'success', title: 'Perfil actualizado', timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar el perfil' });
    }
  };

  const handleChangePassword = async () => {
    const Swal = (await import('sweetalert2')).default;
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword)
      return Swal.fire({ icon: 'error', title: 'Campos incompletos', text: 'Completa todos los campos' });
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      return Swal.fire({ icon: 'error', title: 'Contraseñas no coinciden' });
    if (passwordForm.currentPassword === passwordForm.newPassword)
      return Swal.fire({ icon: 'error', title: 'Contraseña inválida', text: 'La nueva contraseña no puede ser igual a la actual' });

    const hasUpper   = /[A-Z]/.test(passwordForm.newPassword);
    const hasNumber  = /\d/.test(passwordForm.newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(passwordForm.newPassword);
    const validLen   = passwordForm.newPassword.length >= 8;

    if (!hasUpper || !hasNumber || !hasSpecial || !validLen)
      return Swal.fire({ icon: 'error', title: 'Contraseña débil', html: '<ul class="text-left ml-4"><li>• Una letra mayúscula</li><li>• Un número</li><li>• Un carácter especial</li><li>• Mínimo 8 caracteres</li></ul>' });

    try {
      Swal.fire({ title: 'Actualizando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      await changePassword.mutateAsync({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      Swal.fire({ icon: 'success', title: 'Contraseña actualizada', timer: 1500, showConfirmButton: false });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'No se pudo cambiar la contraseña' });
    }
  };

  if (!user) return null;

  const pwRules = [
    { ok: passwordForm.newPassword.length >= 8,          text: 'Mínimo 8 caracteres' },
    { ok: /[A-Z]/.test(passwordForm.newPassword),         text: 'Una mayúscula' },
    { ok: /\d/.test(passwordForm.newPassword),            text: 'Un número' },
    { ok: /[^A-Za-z0-9]/.test(passwordForm.newPassword), text: 'Un carácter especial' },
  ];

  return (
    <div
      className="min-h-screen w-full relative flex flex-col"
      style={{
        background: `
          radial-gradient(ellipse at 75% 10%, rgba(120,100,80,0.16) 0%, transparent 50%),
          radial-gradient(ellipse at 15% 65%, rgba(90,75,60,0.13) 0%, transparent 50%),
          linear-gradient(160deg, #1e1e1c 0%, #252320 30%, #2a2724 60%, #1e1c1a 100%)
        `,
      }}
    >
      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.045]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)' }} />

      <div className="relative z-10 max-w-4xl mx-auto w-full px-6 pt-24 pb-16 space-y-6">

        {/* Page title */}
        <div>
          <span className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium">Cuenta</span>
          <h1 className="font-serif text-white text-2xl mt-1">Mi perfil</h1>
        </div>

        {/* ── INFORMACIÓN PERSONAL ── */}
        <div className="rounded-2xl border border-white/10 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.04)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-white/8">
            <User size={13} className="text-[#C8A882]" />
            <h2 className="text-[11px] font-medium text-white/50 uppercase tracking-wider">
              Información personal
            </h2>
          </div>

          <div className="grid md:grid-cols-3">
            {/* Avatar */}
            <div className="border-b md:border-b-0 md:border-r border-white/8 flex flex-col items-center justify-center p-8 gap-4">
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-white/15 shadow-lg">
                  <Image
                    src={profilePreview || '/default-user.png'}
                    alt="Perfil"
                    width={112}
                    height={112}
                    className="object-cover w-full h-full"
                  />
                </div>
                <label className="absolute bottom-0 right-0 bg-[#8B5E3C] hover:bg-[#6F452A] text-white p-2 rounded-full cursor-pointer transition shadow-lg">
                  <Camera size={13} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) { setProfileFile(file); setProfilePreview(URL.createObjectURL(file)); }
                    }}
                  />
                </label>
              </div>
              <div className="text-center">
                <p className="font-medium text-white text-sm">{form.name || 'Sin nombre'}</p>
                <p className="text-xs text-white/35 mt-0.5">{form.email}</p>
              </div>
            </div>

            {/* Campos */}
            <div className="md:col-span-2 p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { key: 'name',     label: 'Nombre completo' },
                  { key: 'document', label: 'Documento' },
                  { key: 'address',  label: 'Dirección' },
                  { key: 'phone',    label: 'Teléfono' },
                ].map((f) => (
                  <div key={f.key} className="space-y-2">
                    <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
                      {f.label}
                    </label>
                    <DarkInput
                      value={(form as any)[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.label}
                    />
                  </div>
                ))}

                <div className="space-y-2">
                  <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
                    Correo electrónico
                  </label>
                  <DarkInput value={form.email} readOnly />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={handleUpdateProfile}
                  disabled={updateUser.isPending}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl
                    bg-[#8B5E3C] hover:bg-[#6F452A] text-white text-sm font-medium
                    shadow-lg shadow-[#8B5E3C]/20 transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateUser.isPending ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── SEGURIDAD ── */}
        <div className="rounded-2xl border border-white/10 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.04)' }}
        >
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-white/8">
            <Lock size={13} className="text-[#C8A882]" />
            <h2 className="text-[11px] font-medium text-white/50 uppercase tracking-wider">
              Seguridad
            </h2>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid md:grid-cols-3 gap-4">
              <PasswordField
                label="Contraseña actual"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                show={showCurrent}
                onToggle={() => setShowCurrent(!showCurrent)}
              />
              <PasswordField
                label="Nueva contraseña"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                show={showNew}
                onToggle={() => setShowNew(!showNew)}
              />
              <PasswordField
                label="Confirmar contraseña"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                show={showConfirm}
                onToggle={() => setShowConfirm(!showConfirm)}
              />
            </div>

            {/* Reglas de contraseña */}
            {passwordForm.newPassword.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {pwRules.map(({ ok, text }) => (
                  <div key={text} className={`flex items-center gap-1.5 text-[11px] transition-colors ${ok ? 'text-emerald-400' : 'text-white/30'}`}>
                    {ok ? <Check size={11} className="shrink-0" /> : <X size={11} className="shrink-0" />}
                    {text}
                  </div>
                ))}
              </div>
            )}

            {/* Match indicator */}
            {passwordForm.confirmPassword.length > 0 && (
              <p className={`text-xs ${passwordForm.newPassword === passwordForm.confirmPassword ? 'text-emerald-400' : 'text-red-400/80'}`}>
                {passwordForm.newPassword === passwordForm.confirmPassword ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
              </p>
            )}

            <div className="flex justify-end pt-1">
              <button
                onClick={handleChangePassword}
                disabled={changePassword.isPending}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl
                  bg-white/8 hover:bg-white/12 border border-white/15 hover:border-white/25
                  text-white text-sm font-medium
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock size={13} />
                {changePassword.isPending ? 'Actualizando...' : 'Actualizar contraseña'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}