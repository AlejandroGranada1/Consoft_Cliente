import { DefaultModalProps, Visit } from "@/app/types";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";

function CreateVisitModal({
  isOpen,
  onClose,
  extraProps,
}: DefaultModalProps<Visit>) {
  const [visitData, setVisitData] = useState<Visit>({
    id: "VIS-003",
    scheduledAt: "2025-02-02",
    user: {
      id: "",
      name: "Raúl 3",
      email: "",
      address: "",
      phone: "",
      role: {
        id: "",
        name: "",
        description: "",
        usersCount: 0,
        createdAt: "",
        permissions: [],
        status: true,
      },
      featuredProducts: [],
      registeredAt: "",
      status: true,
    },
    address: "",
    services: [],
    status: "Terminada",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVisitData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Categoría creada:", visitData);

    // Reinicia el formulario
    setVisitData({
      id: "VIS-003",
      scheduledAt: "2025-02-02",
      user: {
        id: "",
        name: "Raúl 3",
        email: "",
        address: "",
        phone: "",
        role: {
          id: "",
          name: "",
          description: "",
          usersCount: 0,
          createdAt: "",
          permissions: [],
          status: true,
        },
        featuredProducts: [],
        registeredAt: "",
        status: true,
      },
      address: "",
      services: [],
      status: "Terminada",
    });

    onClose();
  };

  if (!isOpen) return;
  return (
    <div className="modal-bg">
      <div className="modal-frame w-[600px]">
        <header className="w-fit mx-auto">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-2xl text-gray-500 hover:text-black cursor-pointer"
          >
            <IoMdClose />
          </button>
          <h1 className="text-xl font-semibold mb-4">AGREGAR VISITA</h1>
        </header>
        <form>
          {/* Cliente */}
          <div className="flex flex-col">
            <label htmlFor="cliente">Cliente</label>
            <input
              id="cliente"
              name="user"
              type="text"
              placeholder="Nombre del producto"
              value={visitData.user.name}
              onChange={handleChange}
              className="border px-3 py-2 rounded-md"
            />
          </div>

          {/* Direccion */}
          <div className="flex flex-col">
            <label htmlFor="direccion">Direccion</label>
            <input
              id="name"
              name="address"
              type="text"
              placeholder="Nombre del producto"
              value={visitData.address}
              onChange={handleChange}
              className="border px-3 py-2 rounded-md"
            />
          </div>
          {/* Fecha */}
          <div className="flex flex-col">
            <label htmlFor="name">Fecha de la visita</label>
            <input
              id="name"
              name="scheduledAt"
              type="date"
              placeholder="Nombre del producto"
              value={visitData.scheduledAt}
              onChange={handleChange}
              className="border px-3 py-2 rounded-md"
            />
            <label htmlFor="hora">Hora de la visita</label>
            <select name="" id="">
              <option value="">10:00 AM</option>
              <option value="">11:00 AM</option>
              <option value="">12:00 AM</option>
              <option value="">01:00 PM</option>
              <option value="">02:00 PM</option>
              <option value="">03:00 PM</option>
              <option value="">04:00 PM</option>
              <option value="">05:00 PM</option>
            </select>
          </div>

          {/* Servicios */}
          <div className="flex gap-2">
            <label htmlFor="fabricacion">Fabricacion</label>
            <input
              id="fabricacion"
              name="name"
              type="checkbox"
              onChange={handleChange}
              className="border px-3 py-2 rounded-md"
            />
          </div>
        </form>
        <div className="w-full flex justify-between mt-10">
          <button
            type="submit"
            className="px-10 py-2 rounded-lg border border-brown text-brown cursor-pointer"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-10 py-2 rounded-lg border border-gray bg-gray cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateVisitModal;
