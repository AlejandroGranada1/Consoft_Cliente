import { DefaultModalProps, Role, User } from "@/app/types";
import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import axios from "axios"; // Importa axios para hacer el llamado a la API
import api from "@/components/Global/axios";
import { updateElement } from "../global/alerts";

function EditUserModal({
  isOpen,
  onClose,
  extraProps,
  updateList,
}: DefaultModalProps<User>) {
  const [userData, setUserData] = useState<User>({
    _id: extraProps?._id,
    name: extraProps?.name || "",
    address: extraProps?.address || "",
    email: extraProps?.email || "",
    password: extraProps?.password || "",
    phone: extraProps?.phone || "",
    registeredAt: extraProps?.registeredAt || new Date().toISOString(),
    role: extraProps?.role || "",
    status: extraProps?.status || false,
    featuredProducts: extraProps?.featuredProducts || [],
  });

  const [roles, setRoles] = useState<Role[]>([]); // Estado para los roles disponibles

  // Llamado a la API para obtener los roles
  useEffect(() => {
    if (isOpen) {
      const fetchRoles = async () => {
        const response = await api.get("/api/roles");
        setRoles(response.data.roles);
      };
      fetchRoles();
    }
  }, [isOpen]); // Solo se hace el llamado cuando el modal se abre

  // Prellenar datos al abrir modal
  useEffect(() => {
    if (extraProps) {
      setUserData(extraProps);
    }
  }, [extraProps, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = updateElement(
      "Usuario",
      `/api/users/${userData._id}`,
      userData,
      updateList!
    );
    console.log("Usuario actualizado:", userData);
    onClose();
  };

  if (!isOpen) return null;

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
          <h1 className="text-xl font-semibold mb-4">EDITAR USUARIO</h1>
        </header>

        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="flex flex-col">
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              name="name"
              type="text"
              value={userData.name}
              onChange={handleChange}
              className="border px-3 py-2 rounded-md"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col mt-4">
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              name="email"
              type="email"
              value={userData.email}
              onChange={handleChange}
              className="border px-3 py-2 rounded-md"
            />
          </div>

          {/* Teléfono */}
          <div className="flex flex-col mt-4">
            <label htmlFor="phone">Teléfono</label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={userData.phone}
              onChange={handleChange}
              className="border px-3 py-2 rounded-md"
            />
          </div>

          {/* Dirección */}
          <div className="flex flex-col mt-4">
            <label htmlFor="address">Dirección</label>
            <input
              id="address"
              name="address"
              type="text"
              value={userData.address}
              onChange={handleChange}
              className="border px-3 py-2 rounded-md"
            />
          </div>

          {/* Rol */}
          <div className="flex flex-col mt-4">
            <label htmlFor="role">Rol</label>
            <select
              id="role"
              name="role"
              value={(userData.role as Role)?._id || ""}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  role: {
                    ...(prev.role as Role),
                    id: e.target.value,
                    name: e.target.options[e.target.selectedIndex].text,
                  },
                }))
              }
              className="border px-3 py-2 rounded-md"
            >
              <option value="">Seleccionar rol</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div className="flex items-center gap-3 mt-4">
            <input
              id="status"
              name="status"
              type="checkbox"
              checked={userData.status}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  status: e.target.checked,
                }))
              }
              className="h-4 w-4 cursor-pointer"
            />
            <span
              className={userData.status ? "text-green-600" : "text-red-600"}
            >
              {userData.status ? "Activo" : "Inactivo"}
            </span>
          </div>

          {/* Botones */}
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
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;
