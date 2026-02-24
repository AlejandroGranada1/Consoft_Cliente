'use client';

import { useState } from 'react';
import { Calendar, TimePicker } from '@/components/agenda';
import { useCreateVisit, useCreateVisitForMe } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';
import { format } from 'date-fns';
import { MapPin, FileText, ArrowRight, User, Mail, Phone } from 'lucide-react';

const showAlert = async (config: any) => {
  const Swal = (await import('sweetalert2')).default;
  return Swal.fire(config);
};

function InputField({
  icon, placeholder, type = 'text', value, onChange, required,
}: {
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm focus-within:border-white/50 focus-within:bg-white/15 transition-all">
      <span className="text-white/50 shrink-0">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-transparent text-sm text-white placeholder:text-white/45 outline-none"
      />
    </div>
  );
}

export default function ScheduleSection() {
  const { user } = useUser();
  const isLogged = !!user;

  const createGuestVisit = useCreateVisitForMe();
  const createMyVisit    = useCreateVisit();

  const [date, setDate]                 = useState<Date | undefined>(undefined);
  const [time, setTime]                 = useState<string | null>(null);
  const [description, setDescription]   = useState('');
  const [service, setService]           = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userName, setUserName]         = useState('');
  const [userEmail, setUserEmail]       = useState('');
  const [userPhone, setUserPhone]       = useState('');
  const [userAddress, setUserAddress]   = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !userAddress) {
      await showAlert({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor, completa todos los campos obligatorios.' });
      return;
    }
    if (!isLogged) {
      if (!userName || !userEmail || !userPhone) {
        await showAlert({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor, completa tu información de contacto.' });
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
        await showAlert({ icon: 'warning', title: 'Email inválido', text: 'Por favor, ingresa un email válido.' });
        return;
      }
    }

    const basePayload = {
      visitDate: format(date, 'yyyy-MM-dd'),
      visitTime: time,
      address: userAddress.trim(),
      services: [service],
      description: description.trim() || undefined,
    };
    const payload = isLogged
      ? { ...basePayload }
      : { ...basePayload, userName: userName.trim(), userEmail: userEmail.trim(), userPhone: userPhone.trim() };

    const result = await showAlert({
      title: '¿Confirmar visita?',
      html: `<div style="text-align:left;margin-top:1rem;font-size:.9rem;line-height:1.8">
        ${!isLogged
          ? `<p><strong>Nombre:</strong> ${userName}</p><p><strong>Email:</strong> ${userEmail}</p><p><strong>Teléfono:</strong> ${userPhone}</p>`
          : `<p><strong>Solicitante:</strong> ${user?.email}</p>`}
        <p><strong>Dirección:</strong> ${userAddress}</p>
        <p><strong>Fecha:</strong> ${date.toLocaleDateString()}</p>
        <p><strong>Hora:</strong> ${time}</p>
      </div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, agendar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#8B5E3C',
    });

    if (!result.isConfirmed) return;
    setIsSubmitting(true);
    try {
      if (isLogged) await createMyVisit.mutateAsync(payload);
      else await createGuestVisit.mutateAsync(payload);
      await showAlert({ icon: 'success', title: 'Visita agendada', text: 'Tu visita ha sido creada exitosamente.', timer: 2000, showConfirmButton: false });
      setDate(undefined); setTime(null); setDescription(''); setService('');
      setUserName(''); setUserEmail(''); setUserPhone(''); setUserAddress('');
    } catch (error: any) {
      await showAlert({ icon: 'error', title: 'Error', text: error.status === 409 ? 'Esta hora no está disponible, por favor elige otra.' : 'Ocurrió un error, intenta de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full relative flex flex-col"
      style={{
        background: `
          radial-gradient(ellipse at 15% 55%, rgba(101, 67, 33, 0.13) 0%, transparent 50%),
          radial-gradient(ellipse at 85% 15%, rgba(139, 94, 60, 0.07) 0%, transparent 45%),
          linear-gradient(160deg, #111110 0%, #161412 40%, #1a1714 70%, #111110 100%)
        `,
      }}
    >
      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.045]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)' }}
      />

      <div className="relative z-10 flex flex-col min-h-screen px-6 pt-16 pb-12 max-w-6xl mx-auto w-full">

        {/* Hero text */}
        <div className="mb-6">
          <span className="inline-block bg-white/10 backdrop-blur border border-white/20 text-white text-[11px] font-medium tracking-[.07em] uppercase px-4 py-1.5 rounded-full mb-4">
            Visita a domicilio · Medellín
          </span>
          <h1 className="font-serif text-white leading-tight mb-2" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)' }}>
            Agenda tu <em className="italic text-[#C8A882]">visita</em>
          </h1>
          <p className="text-white/65 text-sm leading-relaxed max-w-sm">
            Vamos hasta tu casa. Cuéntanos cuándo y dónde, y nuestro equipo estará listo para asesorarte.
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl overflow-hidden border border-white/15 shadow-[0_24px_64px_rgba(0,0,0,.4)] flex-1"
          style={{ backdropFilter: 'blur(20px)', background: 'rgba(20,16,12,.55)' }}
        >
          {/* Header */}
          <div className="px-8 py-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-white text-sm">Completa tu solicitud</h2>
              <p className="text-white/45 text-xs mt-0.5">Todos los campos son requeridos</p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-[#8B5E3C] hover:bg-[#6F452A] disabled:opacity-60 text-white px-6 py-2.5 rounded-full text-sm font-medium shadow-lg hover:gap-3 transition-all duration-200"
            >
              {isSubmitting ? 'Agendando...' : <><span>Agendar Visita</span> <ArrowRight size={15} /></>}
            </button>
          </div>

          {/* Body 2 columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10">

            {/* Izquierda */}
            <div className="p-6 md:p-8 space-y-6">
              {!isLogged && (
                <div>
                  <p className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium mb-3">
                    Información de contacto
                  </p>
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-2.5">
                      <InputField icon={<User size={14}/>}  placeholder="Nombre completo" value={userName}  onChange={e => setUserName(e.target.value)}  required />
                      <InputField icon={<Mail size={14}/>}  placeholder="Email" type="email" value={userEmail} onChange={e => setUserEmail(e.target.value)} required />
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <InputField icon={<Phone size={14}/>} placeholder="Teléfono" type="tel" value={userPhone} onChange={e => setUserPhone(e.target.value)} required />
                      <InputField icon={<MapPin size={14}/>} placeholder="Dirección" value={userAddress} onChange={e => setUserAddress(e.target.value)} required />
                    </div>
                  </div>
                </div>
              )}

              {isLogged && (
                <div>
                  <p className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium mb-3">
                    Dirección de visita
                  </p>
                  <InputField icon={<MapPin size={14}/>} placeholder="Dirección completa" value={userAddress} onChange={e => setUserAddress(e.target.value)} required />
                </div>
              )}

              <div>
                <p className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium mb-3">
                  Descripción <span className="normal-case text-white/35">(opcional)</span>
                </p>
                <div className="flex items-start gap-3 rounded-xl px-4 py-3 border border-white/20 bg-white/10 focus-within:border-white/50 transition-all">
                  <FileText size={14} className="text-white/50 mt-0.5 shrink-0" />
                  <textarea
                    placeholder="Cuéntanos qué necesitas o qué mueble tienes en mente..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={isLogged ? 6 : 4}
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/45 outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Derecha */}
            <div className="p-6 md:p-8 space-y-6">
              <div>
                <p className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium mb-3">
                  Fecha de visita
                </p>
                <div className="rounded-xl border border-white/20 bg-white/10 overflow-hidden">
                  <Calendar value={date} onChange={setDate} className="bg-transparent border-0" />
                </div>
              </div>

              <div>
                <p className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium mb-3">
                  Hora de visita
                </p>
                <TimePicker selectedTime={time} onSelect={setTime} />
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}