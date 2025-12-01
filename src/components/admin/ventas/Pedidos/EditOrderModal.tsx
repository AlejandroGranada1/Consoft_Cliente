"use client";
import {
  DefaultModalProps,
  Order,
  OrderWithPartialUser,
  User,
} from "@/app/types";
import React, { useEffect, useState } from "react";
import { IoMdClose, IoMdAdd, IoMdRemove } from "react-icons/io";
import api from "@/components/Global/axios";
import { updateElement } from "../../global/alerts";
import { formatDateForInput } from "@/lib/formatDate";

interface Service {
  _id: string;
  name: string;
}

function EditOrderModal({
  isOpen,
  onClose,
  extraProps,
  updateList,
}: DefaultModalProps<Order>) {
  const [orderData, setOrderData] = useState<OrderWithPartialUser>(
    extraProps ?? {
      _id: "",
      user: { _id: "", name: "" } as User,
      status: "",
      address: "",
      startedAt: "",
      deliveredAt: "",
      items: [],
      payments: [],
      rating: 0,
      paymentStatus: "",
    }
  );

  const [services, setServices] = useState<Service[]>([]);

  // 🔹 Mantener sincronizado el estado con extraProps
  useEffect(() => {
    if (extraProps) {
      setOrderData({
        ...extraProps,
        user:
          typeof extraProps.user === "object"
            ? extraProps.user
            : { _id: String(extraProps.user), name: "" }, // fallback si no viene populado
      });
    }
  }, [extraProps]);

  // Traer servicios del backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get<Service[]>("/api/services");
        setServices(data);
      } catch (err) {
        console.error("Error cargando servicios", err);
      }
    };
    fetchServices();
  }, []);

  // Cambiar inputs generales
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Si el cambio es en un campo del cliente (user)
    if (name.startsWith("user.")) {
      const field = name.split(".")[1] as keyof User;
      setOrderData((prev) => ({
        ...prev,
        user: {
          ...(typeof prev.user === "object" ? prev.user : { _id: "" }),
          [field]: value,
        } as User,
      }));
    } else {
      // Caso general (address, status, startDate, etc.)
      setOrderData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Cambiar valores de los servicios
  const handleItemChange = (
    index: number,
    field: "id_servicio" | "detalles" | "valor",
    value: string | number
  ) => {
    const newItems = [...orderData.items];
    (newItems[index] as any)[field] = field === "valor" ? Number(value) : value;
    setOrderData((prev) => ({ ...prev, items: newItems }));
  };

  // Agregar fila
  const addItem = () => {
    setOrderData((prev) => ({
      ...prev,
      items: [...prev.items, { id_servicio: "", detalles: "", valor: 0 }],
    }));
  };

  // Eliminar fila
  const removeItem = (index: number) => {
    setOrderData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Calcular total
  const total = orderData.items.reduce(
    (sum, item) => sum + (item.valor || 0),
    0
  );

  // Colores dinámicos del estado
  const getStatusClass = (status: string) => {
    return status === "Completado"
      ? "bg-blue-500/30 text-blue-500"
      : status === "Cancelado"
      ? "bg-red/30 text-red"
      : "bg-orange/30 text-orange";
  };

  // 🔹 Guardar cambios (PUT al backend)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...orderData,
        user:
          typeof orderData.user === "object"
            ? orderData.user._id
            : orderData.user, // 🔹 enviar solo el _id
      };

      const response = await updateElement(
        "Pedido",
        `/api/orders/${payload._id}`,
        payload,
        updateList!
      );

      onClose(); // cerrar modal
    } catch (err) {
      console.error("Error al actualizar el pedido", err);
      alert("Error al actualizar el pedido ❌");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-bg">
      <div className="modal-frame w-[800px] p-6">
        <header className="relative mb-4">
          <button
            onClick={onClose}
            className="absolute top-0 left-0 text-2xl text-gray-500 hover:text-black cursor-pointer"
          >
            <IoMdClose />
          </button>
          <h1 className="text-xl font-semibold text-center">Editar Pedido</h1>
        </header>

        {/* Formulario con handleSubmit */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Cliente */}
          <div className="flex flex-col">
            <label>Cliente</label>
            <input
              name="user.name"
              type="text"
              placeholder="Nombre del cliente"
              value={(orderData.user as User)?.name || ""}
              onChange={handleChange}
              className="border px-3 py-2 rounded-md"
            />
          </div>

          {/* Dirección */}
          <div className="flex flex-col">
            <label>Dirección</label>
            <input
              name="address"
              type="text"
              placeholder="Dirección"
              value={orderData.address || ""}
              onChange={handleChange}
              className="border px-3 py-2 rounded-md"
            />
          </div>

          {/* Fechas */}
          <div className="flex flex-col">
            <label>Fecha de inicio</label>
            <input
              name="startDate"
              type="date"
              value={formatDateForInput(orderData.startedAt)}
              onChange={handleChange}
              className="border px-3 py-2 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label>Fecha de finalización</label>
            <input
              name="deliveredAt"
              type="date"
              value={formatDateForInput(orderData.deliveredAt)}
              onChange={handleChange}
              className="border px-3 py-2 rounded-md"
            />
          </div>

          {/* Estado */}
          <div className="flex flex-col">
            <label>Estado</label>
            <select
              name="status"
              value={orderData.status || ""}
              onChange={handleChange}
              className={`border px-3 py-2 rounded-md ${getStatusClass(
                orderData.status
              )}`}
            >
              <option value="En proceso">En proceso</option>
              <option value="Completado">Completado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          {/* Tabla de items */}
          <div className="mt-4 h-[138px] overflow-y-scroll">
            <div className="grid grid-cols-4 gap-2 font-semibold border-b pb-2 items-center">
              <p>Servicios</p>
              <p>Valor</p>
              <p>Detalles</p>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center justify-center border border-brown text-brown rounded-md px-2 py-1 hover:bg-brown hover:text-white transition"
              >
                <IoMdAdd />
              </button>
            </div>

            {orderData.items.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-4 gap-2 py-2 border-b items-center"
              >
                {/* Selector de servicio */}
                <select
                  value={
                    typeof item.id_servicio === "string"
                      ? item.id_servicio
                      : item.id_servicio?._id
                  }
                  onChange={(e) =>
                    handleItemChange(idx, "id_servicio", e.target.value)
                  }
                  className="border px-2 py-1 rounded-md"
                >
                  <option value="">Seleccione servicio</option>
                  {services.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                {/* Valor */}
                <input
                  type="number"
                  placeholder="Valor"
                  value={item.valor}
                  onChange={(e) =>
                    handleItemChange(idx, "valor", e.target.value)
                  }
                  className="border px-2 py-1 rounded-md"
                />

                {/* Detalles */}
                <input
                  type="text"
                  placeholder="Detalles"
                  value={(item as any).detalles || ""}
                  onChange={(e) =>
                    handleItemChange(idx, "detalles", e.target.value)
                  }
                  className="border px-2 py-1 rounded-md"
                />

                {/* Eliminar */}
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="flex items-center justify-center border border-red-400 text-red-500 rounded-md px-2 py-1 hover:bg-red-500 hover:text-white transition"
                >
                  <IoMdRemove />
                </button>
              </div>
            ))}
          </div>

          {/* Total */}
          <p className="mt-4 font-semibold">
            Valor total del pedido:{" "}
            <span className="text-brown">${total.toLocaleString("es-CO")}</span>
          </p>

          {/* Botones */}
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="px-6 py-2 border border-brown rounded-md text-brown hover:bg-brown hover:text-white transition"
            >
              Guardar cambios
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-200 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditOrderModal;
