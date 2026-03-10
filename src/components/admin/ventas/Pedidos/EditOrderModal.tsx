'use client';
import {
  X,
  Plus,
  Minus,
  User,
  MapPin,
  Calendar,
  Package,
  Upload,
  Image as ImageIcon,
  Save,
  Calculator,
  DollarSign,
  CreditCard,
} from 'lucide-react';
import { DefaultModalProps, Order, Service, User as UserType } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import { useGetServices, useGetUsers, useUpdateOrder, useGetProducts } from '@/hooks/apiHooks';
import api from '@/components/Global/axios';
import { createPortal } from 'react-dom';
import { createElement } from '@/components/admin/global/alerts';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
interface EditOrderData {
  _id: string;
  user: string;
  status: string;
  address: string;
  startedAt: string;
  deliveredAt?: string;
  items: Array<{
    id_servicio: string;
    id_producto?: string;
    customDetails?: any;
    detalles: string;
    valor: number;
    color?: string; // 👈 AÑADIDO
    size?: string;  // 👈 AÑADIDO
    progressImage?: File | null;
    imagePreview?: string | null;
    _id?: string;
    existingImages?: string[];
  }>;
  paymentStatus: string;
  total: number;
}

function EditOrderModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<Order>) {
  const { data: servicesData, isLoading: servicesLoading } = useGetServices();
  const { data: usersData, isLoading: usersLoading } = useGetUsers();
  const { data: productsData } = useGetProducts();
  const updateOrderMutation = useUpdateOrder();

  const services = servicesData?.data || [];
  const users = usersData?.users || [];
  const products = productsData || [];

  const [orderData, setOrderData] = useState<EditOrderData>({
    _id: '',
    user: '',
    status: 'En proceso',
    address: '',
    startedAt: new Date().toISOString().split('T')[0],
    items: [],
    paymentStatus: 'Pendiente',
    total: 0,
  });

  const [uploadingImages, setUploadingImages] = useState(false);

  // Estados para el registro de pago opcional
  const [registerPayment, setRegisterPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'card' | 'other'>('cash');

  const selectedUser = users.find((u: UserType) => u._id === orderData.user);

  useEffect(() => {
    if (!extraProps) return;

    const userId = typeof extraProps.user === 'object'
      ? (extraProps.user as UserType)._id
      : (extraProps.user as string);

    const processedItems = (extraProps.items || []).map((item: any) => ({
      id_servicio: typeof item.id_servicio === 'object'
        ? (item.id_servicio as Service)._id
        : item.id_servicio,
      id_producto: typeof item.id_producto === 'object'
        ? (item.id_producto as any)._id
        : item.id_producto,
      customDetails: item.customDetails || null,
      detalles: item.detalles || '',
      valor: item.valor || 0,
      color: item.color || '', // 👈 AÑADIDO
      size: item.size || '',   // 👈 AÑADIDO
      progressImage: null,
      imagePreview: null,
      _id: item._id,
      existingImages: item.images || [],
    }));

    setOrderData({
      _id: extraProps._id || '',
      user: userId!,
      status: extraProps.status || 'En proceso',
      address: extraProps.address || '',
      startedAt: extraProps.startedAt
        ? new Date(extraProps.startedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      deliveredAt: extraProps.deliveredAt
        ? new Date(extraProps.deliveredAt).toISOString().split('T')[0]
        : undefined,
      items: processedItems,
      paymentStatus: extraProps.paymentStatus || 'Pendiente',
      total: processedItems.reduce((s: number, i: any) => s + i.valor, 0),
    });
  }, [extraProps]);

  const total = orderData.items.reduce((s, i) => s + (i.valor || 0), 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrderData((p) => ({ ...p, [name]: value }));
  };

  const handleItemChange = (
    index: number,
    field: 'id_servicio' | 'detalles' | 'valor',
    value: string | number,
  ) => {
    const newItems = [...orderData.items];

    if (field === 'id_servicio') {
      const s = services.find((x: Service) => x._id === value);
      if (s)
        newItems[index] = {
          ...newItems[index],
          id_servicio: s._id,
          detalles: s.description || '',
          valor: s.price || 0,
        };
    } else if (field === 'valor')
      newItems[index] = { ...newItems[index], valor: Number(value) };
    else newItems[index] = { ...newItems[index], detalles: value as string };

    setOrderData((p) => ({ ...p, items: newItems }));
  };

  const handleImageChange = (index: number, file: File | null) => {
    const newItems = [...orderData.items];
    if (file) {
      newItems[index] = {
        ...newItems[index],
        progressImage: file,
        imagePreview: URL.createObjectURL(file),
      };
    } else {
      newItems[index] = { ...newItems[index], progressImage: null, imagePreview: null };
    }
    setOrderData((p) => ({ ...p, items: newItems }));
  };

  const addItem = () =>
    setOrderData((p) => ({
      ...p,
      items: [...p.items, { id_servicio: '', detalles: '', valor: 0 }],
    }));

  const removeItem = (i: number) =>
    setOrderData((p) => ({ ...p, items: p.items.filter((_, x) => x !== i) }));

  const uploadImages = async (orderId: string) => {
    const imgs = orderData.items.filter((i) => i.progressImage instanceof File);
    if (!imgs.length) return;
    setUploadingImages(true);
    try {
      for (const i of imgs) {
        const fd = new FormData();
        fd.append('product_images', i.progressImage as File);
        if (i._id) fd.append('item_id', i._id);
        await api.post(`/api/orders/${orderId}/attachments`, fd);
      }
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRegisterPayment = async (orderId: string) => {
    if (!registerPayment || paymentAmount <= 0) return;

    try {
      await createElement(
        'Pago',
        '/api/payments',
        {
          orderId,
          amount: paymentAmount,
          method: paymentMethod,
          paidAt: new Date(),
          status: 'aprobado', // Por defecto aprobado si lo registra el admin
        }
      );
    } catch (error) {
      console.error('Error al registrar el pago:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderData._id) return;

    const Swal = (await import('sweetalert2')).default;

    try {
      await updateOrderMutation.mutateAsync({
        id: orderData._id,
        data: { ...orderData, total },
      });

      await uploadImages(orderData._id);

      if (registerPayment) {
        await handleRegisterPayment(orderData._id);
      }

      Swal.fire({
        toast: true,
        animation: false,
        timerProgressBar: true,
        showConfirmButton: false,
        title: 'Pedido actualizado exitosamente',
        icon: 'success',
        position: 'top-right',
        timer: 1500,
        background: '#1e1e1c',
        color: '#fff',
      });

      onClose();
      updateList?.();
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar el pedido',
        icon: 'error',
        background: '#1e1e1c',
        color: '#fff',
      });
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4'
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>

      <div className="w-full max-w-[1000px] rounded-2xl border border-white/10
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
            <Package size={18} className="text-[#C8A882]" />
            Editar Pedido
          </h2>
        </header>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">

          {/* Cliente y Estado */}
          <div className="grid grid-cols-2 gap-4">
            {/* Cliente */}
            <div className="space-y-2">
              <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
                Cliente *
              </label>
              <select
                name="user"
                value={orderData.user}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                  text-sm text-white
                  focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                  transition-all duration-200 appearance-none"
                required
                disabled={usersLoading}>
                <option value="" className="bg-[#1e1e1c]">Seleccione un cliente</option>
                {usersLoading ? (
                  <option value="" disabled className="bg-[#1e1e1c]">Cargando...</option>
                ) : (
                  users.map((user: UserType) => (
                    <option key={user._id} value={user._id} className="bg-[#1e1e1c]">
                      {user.name} - {user.email}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
                Estado del pedido
              </label>
              <select
                name="status"
                value={orderData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                  text-sm text-white
                  focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                  transition-all duration-200 appearance-none">
                <option value="En proceso" className="bg-[#1e1e1c]">En proceso</option>
                <option value="Completado" className="bg-[#1e1e1c]">Completado</option>
                <option value="Cancelado" className="bg-[#1e1e1c]">Cancelado</option>
                <option value="Pendiente" className="bg-[#1e1e1c]">Pendiente</option>
              </select>
            </div>
          </div>

          {/* Dirección */}
          <div className="space-y-2">
            <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
              Dirección del servicio *
            </label>
            <input
              name="address"
              type="text"
              placeholder="Dirección donde se realizará el servicio"
              value={orderData.address}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                text-sm text-white placeholder:text-white/30
                focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                transition-all duration-200"
              required
            />
            {selectedUser?.address && orderData.address !== selectedUser.address && (
              <p className="text-xs text-yellow-400/70 mt-1">
                ⚠️ La dirección difiere de la registrada por el cliente
              </p>
            )}
          </div>

          {/* Fechas y Pago */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
                Fecha inicio *
              </label>
              <input
                name="startedAt"
                type="date"
                value={orderData.startedAt}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                  text-sm text-white
                  focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                  transition-all duration-200"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
                Fecha finalización
              </label>
              <input
                name="deliveredAt"
                type="date"
                value={orderData.deliveredAt || ''}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                  text-sm text-white
                  focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                  transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] tracking-[.08em] uppercase text-[#C8A882] font-medium block">
                Estado pago
              </label>
              <select
                name="paymentStatus"
                value={orderData.paymentStatus}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3
                  text-sm text-white
                  focus:outline-none focus:border-[#C8A882]/50 focus:bg-white/8
                  transition-all duration-200 appearance-none">
                <option value="Pendiente" className="bg-[#1e1e1c]">Pendiente</option>
                <option value="Pagado" className="bg-[#1e1e1c]">Pagado</option>
                <option value="Parcial" className="bg-[#1e1e1c]">Parcial</option>
              </select>
            </div>
          </div>

          {/* Servicios */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white/70 flex items-center gap-2">
                <Package size={14} className="text-[#C8A882]" />
                Servicios ({orderData.items.length})
              </h3>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                  border border-[#C8A882]/30 bg-[#C8A882]/10
                  text-[#C8A882] text-xs font-medium
                  hover:bg-[#C8A882]/20 hover:border-[#C8A882]/50
                  transition-all duration-200">
                <Plus size={14} />
                Agregar Servicio
              </button>
            </div>

            {orderData.items.length === 0 ? (
              <div className="text-center py-12 rounded-xl border border-white/10 bg-white/5">
                <Package size={32} className="mx-auto text-white/20 mb-2" />
                <p className="text-white/40 text-sm">No hay servicios agregados</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {orderData.items.map((item, idx) => {
                  const itemService = services.find((s: Service) => s._id === item.id_servicio);

                  return (
                    <div key={idx}
                      className="rounded-xl border border-white/10 bg-white/5 p-4">

                      {/* Info de Producto Asociado (si existe) */}
                      {(item.id_producto || item.customDetails) && (
                        <div className="mb-3 px-3 py-2 rounded-lg bg-[#C8A882]/10 border border-[#C8A882]/20 flex items-center gap-2">
                          <Package size={14} className="text-[#C8A882]" />
                          <span className="text-xs text-white/70">
                            Producto asociado: <span className="text-white font-medium">
                              {item.customDetails?.name ||
                                products.find((p: any) => p._id === item.id_producto)?.name ||
                                'Cargando nombre...'}
                            </span>
                          </span>
                        </div>
                      )}

                      {/* Fila principal */}
                      <div className="grid grid-cols-12 gap-3 mb-3">
                        {/* Servicio */}
                        <div className="col-span-4">
                          <label className="text-[10px] text-white/40 mb-1 block">
                            Servicio *
                          </label>
                          <select
                            value={item.id_servicio}
                            onChange={(e) => handleItemChange(idx, 'id_servicio', e.target.value)}
                            className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2
                              text-xs text-white
                              focus:outline-none focus:border-[#C8A882]/50
                              transition-all duration-200"
                            required>
                            <option value="" className="bg-[#1e1e1c]">Seleccionar</option>
                            {servicesLoading ? (
                              <option value="" disabled className="bg-[#1e1e1c]">Cargando...</option>
                            ) : (
                              services?.map((service: Service) => (
                                <option key={service._id} value={service._id} className="bg-[#1e1e1c]">
                                  {service.name}
                                </option>
                              ))
                            )}
                          </select>
                        </div>

                        {/* Valor */}
                        <div className="col-span-3">
                          <label className="text-[10px] text-white/40 mb-1 block">
                            Valor ($) *
                          </label>
                          <CurrencyInput
                            value={item.valor}
                            onChange={(val) => handleItemChange(idx, 'valor', val)}
                            placeholder="0"
                            className="!py-2 !text-xs"
                          />
                        </div>

                        {/* Detalles */}
                        <div className="col-span-4">
                          <label className="text-[10px] text-white/40 mb-1 block">
                            Detalles / Color / Tamaño
                          </label>
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="Color"
                                value={item.color || ''}
                                onChange={(e) => {
                                  const newItems = [...orderData.items];
                                  newItems[idx] = { ...newItems[idx], color: e.target.value };
                                  setOrderData((p) => ({ ...p, items: newItems }));
                                }}
                                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-1.5
                                  text-[10px] text-white placeholder:text-white/30
                                  focus:outline-none focus:border-[#C8A882]/50"
                              />
                              <input
                                type="text"
                                placeholder="Tamaño"
                                value={item.size || ''}
                                onChange={(e) => {
                                  const newItems = [...orderData.items];
                                  newItems[idx] = { ...newItems[idx], size: e.target.value };
                                  setOrderData((p) => ({ ...p, items: newItems }));
                                }}
                                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-1.5
                                  text-[10px] text-white placeholder:text-white/30
                                  focus:outline-none focus:border-[#C8A882]/50"
                              />
                            </div>
                            <textarea
                              placeholder="Notas..."
                              value={item.detalles || ''}
                              onChange={(e) => handleItemChange(idx, 'detalles', e.target.value)}
                              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2
                                text-xs text-white placeholder:text-white/30
                                focus:outline-none focus:border-[#C8A882]/50
                                transition-all duration-200 resize-none"
                              rows={2}
                            />
                          </div>
                        </div>

                        {/* Eliminar */}
                        <div className="col-span-1 flex justify-end items-end pb-2">
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="p-1.5 rounded-lg text-white/40 hover:text-red-400
                              hover:bg-white/5 transition-all duration-200">
                            <Minus size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Imágenes */}
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <label className="text-[10px] text-white/40 mb-2 flex items-center gap-1">
                          <ImageIcon size={12} />
                          Imágenes del servicio
                        </label>

                        {/* Imágenes existentes */}
                        {item.existingImages && item.existingImages.length > 0 && (
                          <div className="mb-3">
                            <p className="text-[10px] text-white/30 mb-2">Imágenes existentes:</p>
                            <div className="flex flex-wrap gap-2">
                              {item.existingImages.map((imgUrl, imgIdx) => (
                                <div key={imgIdx} className="relative">
                                  <img
                                    src={imgUrl}
                                    alt={`Imagen ${imgIdx + 1}`}
                                    className="w-16 h-16 object-cover rounded-lg border border-white/10"
                                  />
                                  <span className="absolute -top-1 -right-1 
                                    bg-white/10 text-white/60 text-[10px] rounded-full w-5 h-5 
                                    flex items-center justify-center border border-white/20">
                                    {imgIdx + 1}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Subir nueva imagen */}
                        <div>
                          <label className="text-[10px] text-white/40 mb-1 flex items-center gap-1">
                            <Upload size={10} />
                            Agregar nueva imagen
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                handleImageChange(idx, file);
                              }}
                              className="flex-1 text-xs border border-white/15 bg-white/5 
                                px-3 py-2 rounded-lg text-white/70
                                file:mr-3 file:py-1 file:px-3 file:rounded-lg
                                file:border-0 file:text-xs file:font-medium
                                file:bg-[#C8A882]/10 file:text-[#C8A882]
                                hover:file:bg-[#C8A882]/20
                                transition-all duration-200"
                            />
                            {item.imagePreview && (
                              <div className="relative">
                                <img
                                  src={item.imagePreview}
                                  alt="Vista previa"
                                  className="w-12 h-12 object-cover rounded-lg border border-white/10"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleImageChange(idx, null)}
                                  className="absolute -top-1 -right-1 
                                    bg-red-500/80 text-white text-[10px] rounded-full w-5 h-5
                                    flex items-center justify-center hover:bg-red-500
                                    transition-colors">
                                  ✕
                                </button>
                              </div>
                            )}
                          </div>
                          {item.progressImage && (
                            <p className="text-[10px] text-green-400/70 mt-1">
                              ✓ {item.progressImage.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Total */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-white">Total del pedido</p>
                <p className="text-xs text-white/40 mt-1">
                  {orderData.items.length} {orderData.items.length === 1 ? 'servicio' : 'servicios'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#C8A882]">
                  ${total.toLocaleString('es-CO')}
                </span>
                <p className="text-xs text-white/40">COP</p>
              </div>
            </div>
          </div>

          {/* Sección de Registro de Pago (Opcional) */}
          <div className="mt-6 p-4 rounded-xl border border-[#C8A882]/20 bg-[#C8A882]/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium flex items-center gap-2">
                <Calculator size={16} className="text-[#C8A882]" />
                Registrar Pago (Opcional)
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">{registerPayment ? 'Activado' : 'Desactivado'}</span>
                <button
                  type="button"
                  onClick={() => setRegisterPayment(!registerPayment)}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${registerPayment ? 'bg-[#C8A882]' : 'bg-white/10'
                    }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${registerPayment ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
            </div>

            {registerPayment && (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Monto del pago */}
                <div>
                  <label className="text-white/40 text-xs mb-1 block">
                    Monto a registrar
                  </label>
                  <CurrencyInput
                    value={paymentAmount}
                    onChange={setPaymentAmount}
                    placeholder="0"
                  />
                </div>

                {/* Método de pago */}
                <div>
                  <label className="text-white/40 text-xs mb-1 block">
                    Método de pago
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-3 rounded-lg border transition ${paymentMethod === 'cash'
                        ? 'border-[#C8A882] bg-[#C8A882]/10 text-white'
                        : 'border-white/10 bg-white/5 text-white/40'
                        }`}>
                      💵 Efectivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('transfer')}
                      className={`p-3 rounded-lg border transition ${paymentMethod === 'transfer'
                        ? 'border-[#C8A882] bg-[#C8A882]/10 text-white'
                        : 'border-white/10 bg-white/5 text-white/40'
                        }`}>
                      🏦 Transferencia
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!registerPayment && (
              <p className="text-[10px] text-white/30 italic">
                Activa esta opción para registrar un pago asociado inmediatamente a este pedido.
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
              disabled={updateOrderMutation.isPending || uploadingImages ||
                orderData.items.length === 0 || !orderData.user}
              className="px-5 py-2.5 rounded-lg
                bg-[#8B5E3C] hover:bg-[#6F452A]
                text-white text-sm font-medium
                shadow-lg shadow-[#8B5E3C]/20
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2
                transition-all duration-200">
              {uploadingImages ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Subiendo imágenes...
                </>
              ) : updateOrderMutation.isPending ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Guardar Cambios
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

export default EditOrderModal;