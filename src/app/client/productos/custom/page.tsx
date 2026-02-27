// app/client/productos/custom/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAddCustomItem } from '@/hooks/apiHooks';
import { useUser } from '@/providers/userContext';
import Image from 'next/image';
import { ArrowLeft, Upload, Sparkles, Minus, Plus, ShoppingCart, Ruler, Palette, Tag, FileText, Paintbrush } from 'lucide-react';

const AVAILABLE_COLORS = [
  { name: 'Nogal', value: 'nogal', hex: '#7B4A12' },
  { name: 'Blanco', value: 'blanco', hex: '#F5F5F5' },
  { name: 'Negro', value: 'negro', hex: '#1A1A1A' },
  { name: 'Gris', value: 'gris', hex: '#9CA3AF' },
  { name: 'Café oscuro', value: 'cafe_oscuro', hex: '#4B2E1E' },
  { name: 'Azul petróleo', value: 'azul_petroleo', hex: '#1F4E5F' },
  { name: 'Verde oliva', value: 'verde_oliva', hex: '#556B2F' },
];

function InputField({ label, required, hint, icon, children }: {
  label: string;
  required?: boolean;
  hint?: string;
  icon?: React.ReactNode;
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium flex items-center gap-1.5">
        {icon && <span className="text-white/40">{icon}</span>}
        {label} {required && <span className="text-red-400/80">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-white/30">{hint}</p>}
    </div>
  );
}

export default function CustomProductPage() {
  const router = useRouter();
  const { user } = useUser();
  const addItemMutation = useAddCustomItem();

  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    dimensions: '',
    color: '',
    customColor: '',
    quantity: 1,
    referenceImage: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [useCustomColor, setUseCustomColor] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, referenceImage: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const changeQty = (delta: number) =>
    setFormData({ ...formData, quantity: Math.max(1, formData.quantity + delta) });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const Swal = (await import('sweetalert2')).default;

    if (!user) {
      Swal.fire({
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para solicitar productos personalizados',
        icon: 'warning',
        confirmButtonColor: '#8B5E3C',
        background: '#1e1e1c',
        color: '#fff',
      });
      router.push('/client/auth/login');
      return;
    }

    // Validaciones
    if (!formData.productName || !formData.description) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor completa el nombre y la descripción',
        icon: 'warning',
        confirmButtonColor: '#8B5E3C',
        background: '#1e1e1c',
        color: '#fff',
      });
      return;
    }

    // Validar color según el modo
    if (useCustomColor) {
      if (!formData.customColor.trim()) {
        Swal.fire({
          title: 'Color requerido',
          text: 'Por favor especifica el color deseado',
          icon: 'warning',
          confirmButtonColor: '#8B5E3C',
          background: '#1e1e1c',
          color: '#fff',
        });
        return;
      }
    } else {
      if (!formData.color) {
        Swal.fire({
          title: 'Color requerido',
          text: 'Por favor selecciona un color',
          icon: 'warning',
          confirmButtonColor: '#8B5E3C',
          background: '#1e1e1c',
          color: '#fff',
        });
        return;
      }
    }

    const selectedColor = useCustomColor
      ? formData.customColor
      : AVAILABLE_COLORS.find((c) => c.value === formData.color)?.name || formData.color;

    const detailedDescription = `
PRODUCTO PERSONALIZADO

Descripción: ${formData.description}
Dimensiones: ${formData.dimensions || 'Por definir'}
Color: ${selectedColor}

${formData.referenceImage ? '✓ Imagen de referencia adjunta' : '✓ Sin imagen de referencia'}
`.trim();

    try {
      const fd = new FormData();
      fd.append('name', formData.productName);
      fd.append('description', detailedDescription);
      fd.append('color', selectedColor);
      fd.append('size', formData.dimensions || 'Por definir');
      fd.append('quantity', String(formData.quantity));
      if (formData.referenceImage) fd.append('referenceImage', formData.referenceImage);

      await addItemMutation.mutateAsync(fd);

      Swal.fire({
        title: '¡Solicitud enviada!',
        html: `<p>Tu producto personalizado ha sido agregado al carrito.</p><p class="text-sm text-white/40 mt-2">Nos pondremos en contacto contigo para confirmar detalles y cotización.</p>`,
        icon: 'success',
        confirmButtonColor: '#8B5E3C',
        background: '#1e1e1c',
        color: '#fff',
      });

      setFormData({
        productName: '',
        description: '',
        dimensions: '',
        color: '',
        customColor: '',
        quantity: 1,
        referenceImage: null
      });
      setUseCustomColor(false);
      setImagePreview(null);
      router.push('/client/productos');
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al procesar tu solicitud',
        icon: 'error',
        confirmButtonColor: '#8B5E3C',
        background: '#1e1e1c',
        color: '#fff',
      });
      console.log(error);
    }
  };

  return (
    <div
      className="min-h-screen w-full relative flex flex-col"
      style={{
        background: `
          radial-gradient(ellipse at 80% 10%, rgba(120, 100, 80, 0.16) 0%, transparent 50%),
          radial-gradient(ellipse at 10% 70%, rgba(90, 75, 60, 0.13) 0%, transparent 50%),
          linear-gradient(160deg, #1e1e1c 0%, #252320 30%, #2a2724 60%, #1e1c1a 100%)
        `,
      }}
    >
      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.045]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)' }} />

      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 pt-16 pb-16">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-[#C8A882] transition-colors duration-200 mb-10 group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          Volver a productos
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">

          {/* ── Columna izquierda: imagen ── */}
          <div className="space-y-4">

            {/* Preview & Upload Area */}
            <label className="relative cursor-pointer aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.5)] bg-white/5 flex group transition-all duration-300 hover:border-[#C8A882]/50 hover:shadow-[0_24px_64px_rgba(200,168,130,0.15)] w-full block">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

              {imagePreview ? (
                <>
                  <Image src={imagePreview} alt="Referencia" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="flex items-center gap-2 bg-[#C8A882] text-white px-4 py-2 rounded-lg font-medium text-sm translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <Upload size={16} />
                      Cambiar imagen
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-center p-8 gap-4 group-hover:bg-white/[0.02] transition-colors duration-300">
                  <div className="w-16 h-16 rounded-2xl border border-white/15 bg-white/5 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:border-[#C8A882]/40 group-hover:bg-[#C8A882]/10">
                    <Upload size={24} className="text-white/30 group-hover:text-[#C8A882] transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-sm text-white/40 group-hover:text-white/70 transition-colors duration-300">Sube una imagen de referencia</p>
                    <p className="text-xs text-white/25 mt-1">opcional</p>
                  </div>
                </div>
              )}
            </label>

            {/* Info card */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles size={13} className="text-[#C8A882]" />
                <span className="text-[11px] uppercase tracking-wider text-[#C8A882] font-medium">¿Cómo funciona?</span>
              </div>
              <ul className="space-y-2">
                {[
                  'Completa los detalles de tu mueble ideal',
                  'Recibimos tu solicitud y la revisamos',
                  'Te enviamos una cotización en 24 horas',
                  'Confirmamos y comenzamos la fabricación',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-white/45">
                    <span className="shrink-0 w-4 h-4 rounded-full bg-[#C8A882]/15 border border-[#C8A882]/25 text-[#C8A882] text-[10px] flex items-center justify-center font-medium mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Columna derecha: formulario ── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-7">

            {/* Header */}
            <div className="space-y-2">
              <span className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium">
                Diseño personalizado
              </span>
              <h1 className="font-serif text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
                Crea tu <em className="italic text-[#C8A882]">mueble ideal</em>
              </h1>
              <p className="text-sm text-white/50 leading-relaxed">
                Completa los detalles y nos pondremos en contacto para confirmar cotización y tiempos de entrega.
              </p>
            </div>

            <div className="h-px bg-white/10" />

            {/* Nombre */}
            <InputField label="Nombre del mueble" required icon={<Tag size={12} />}>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                placeholder="Ej: Mesa de comedor rústica"
                required
                className="w-full rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8 transition-all duration-200"
              />
            </InputField>

            {/* Descripción */}
            <InputField label="Descripción" required icon={<FileText size={12} />}>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe el mueble que necesitas, material, tela, estilo..."
                rows={4}
                required
                className="w-full rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8 transition-all duration-200 resize-none"
              />
            </InputField>

            {/* Dimensiones (opcional) */}
            <InputField
              label="Dimensiones"
              hint="Opcional - Especifica largo × ancho × alto en centímetros"
              icon={<Ruler size={12} />}
            >
              <input
                type="text"
                value={formData.dimensions}
                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                placeholder="Ej: 180 × 90 × 75 cm (opcional)"
                className="w-full rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8 transition-all duration-200"
              />
            </InputField>

            {/* Opción de color personalizado */}
            <div className="space-y-4 p-5 rounded-xl border border-[#C8A882]/20 bg-[#C8A882]/5">
              <label className="flex items-center gap-3 cursor-pointer">
                <button
                  type="button"
                  onClick={() => setUseCustomColor(!useCustomColor)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${useCustomColor ? 'bg-[#C8A882]' : 'bg-white/20'
                    }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${useCustomColor ? 'translate-x-5' : ''
                      }`}
                  />
                </button>
                <div className="flex items-center gap-2">
                  <Paintbrush size={16} className="text-[#C8A882]" />
                  <span className="text-sm font-medium text-white">
                    Usar color personalizado
                  </span>
                </div>
              </label>

              <p className="text-xs text-white/40 pl-14">
                Activa esta opción si no encuentras el color que buscas en la paleta.
              </p>
            </div>

            {/* Color - según modo */}
            {useCustomColor ? (
              <InputField label="Color personalizado" required icon={<Palette size={12} />}>
                <input
                  type="text"
                  value={formData.customColor}
                  onChange={(e) => setFormData({ ...formData, customColor: e.target.value })}
                  placeholder="Ej: Verde esmeralda, Azul marino, Rojo vino..."
                  required
                  className="w-full rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8 transition-all duration-200"
                />
              </InputField>
            ) : (
              <InputField label="Color / Acabado" required icon={<Palette size={12} />}>
                <div className="flex flex-wrap gap-3 pt-0.5">
                  {AVAILABLE_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      title={c.name}
                      onClick={() => setFormData({ ...formData, color: c.value })}
                      className="relative w-9 h-9 rounded-full transition-transform duration-200 hover:scale-110"
                      style={{ backgroundColor: c.hex }}
                    >
                      {formData.color === c.value && (
                        <span className="absolute inset-0 rounded-full ring-2 ring-[#C8A882] ring-offset-2 ring-offset-[#252320]" />
                      )}
                      {formData.color !== c.value && (
                        <span className="absolute inset-0 rounded-full ring-1 ring-white/20" />
                      )}
                    </button>
                  ))}
                </div>
                {formData.color && (
                  <p className="text-xs text-white/40 mt-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8A882]" />
                    {AVAILABLE_COLORS.find(c => c.value === formData.color)?.name}
                  </p>
                )}
              </InputField>
            )}

            {/* Cantidad */}
            <InputField label="Cantidad">
              <div className="inline-flex items-center rounded-xl border border-white/15 bg-white/5 overflow-hidden">
                <button
                  type="button"
                  onClick={() => changeQty(-1)}
                  className="w-11 h-11 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Minus size={14} />
                </button>
                <div className="w-12 text-center text-white font-medium text-sm">{formData.quantity}</div>
                <button
                  type="button"
                  onClick={() => changeQty(1)}
                  className="w-11 h-11 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Plus size={14} />
                </button>
              </div>
            </InputField>

            {/* Submit */}
            <button
              type="submit"
              disabled={addItemMutation.isPending}
              className="w-full inline-flex items-center justify-center gap-2.5
                bg-[#8B5E3C] hover:bg-[#6F452A]
                disabled:opacity-50 disabled:cursor-not-allowed
                text-white py-4 rounded-xl
                text-sm font-medium
                shadow-lg shadow-[#8B5E3C]/20
                hover:shadow-[#8B5E3C]/30
                transition-all duration-200 hover:gap-3 mt-1"
            >
              <ShoppingCart size={16} />
              {addItemMutation.isPending ? 'Procesando...' : 'Solicitar cotización'}
            </button>

            <p className="text-xs text-white/30 text-center leading-relaxed">
              Nos pondremos en contacto en las próximas 24 horas para confirmar detalles y enviarte una cotización personalizada.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}