"use client";
import { Role } from "@/app/types";
import CreateRoleModal from "@/components/admin/configuracion/CreateRoleModal";
import EditRoleModal from "@/components/admin/configuracion/EditRoleModal";
import RoleDetailsModal from "@/components/admin/configuracion/RoleDetailsModal";
import { deleteElement } from "@/components/admin/global/alerts";
import api from "@/components/Global/axios";
import Pagination from "@mui/material/Pagination";
import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaSearch, FaTrash } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";

function Page() {
  const [createModal, setCreateModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [role, setRole] = useState<Role>();

  const [roles, setRoles] = useState<Role[]>([]);
  const [filterText, setFilterText] = useState(""); // 📌 texto de búsqueda

  const fetchRoles = async () => {
    const response = await api.get("/api/roles");
    setRoles(response.data.roles);
  };
  useEffect(() => {
    fetchRoles();
  }, []);

  // 📌 Filtrar roles
  const filteredRoles = roles.filter((r) =>
    r.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div>
      <header className="flex flex-col h-40 justify-around px-20">
        <h1 className="text-2xl text-brown">CONFIGURACIÓN DE ROLES</h1>

        {/* actions */}
        <div className="flex justify-between items-center">
          <div className="relative w-64">
            {/* Icono */}
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <datalist id="roles">
              {roles.map((role) => (
                <option key={role._id} value={role.name}></option>
              ))}
            </datalist>

            {/* Input */}
            <input
              type="text"
              list="roles"
              placeholder="Buscar Rol"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)} // 📌 actualiza filtro
              className="pl-10 pr-4 py-2 border border-brown rounded-lg w-full text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-brown"
            />
          </div>

          <button
            onClick={() => setCreateModal(true)}
            className="flex items-center py-2 w-fit px-10 border border-brown rounded-lg cursor-pointer text-brown"
          >
            <IoMdAdd size={25} /> Agregar Nuevo Rol
          </button>
        </div>
      </header>

      <section className="w-8/9 mx-auto h-[420px] flex flex-col justify-between border-t border-gray">
        {/* Encabezado de la tabla */}
        <div>
          <div className="grid grid-cols-6 place-items-center py-6 font-semibold">
            <p>Nombre del rol</p>
            <p>Descripción</p>
            <p>Usuarios</p>
            <p>Fecha de Creación</p>
            <p>Estado</p>
            <p>Acciones</p>
          </div>

          {/* Lista de roles */}
          <div className="mx-auto border-t border-brown/60 pt-5 flex flex-col gap-4">
            {filteredRoles.map((role) => (
              <div
                key={role._id}
                className="grid grid-cols-6 place-items-center py-3 border-b border-brown/60 rounded-lg"
              >
                <p>{role.name}</p>
                <p className="truncate w-40 text-center">{role.description}</p>
                <p>{role.usersCount}</p>
                <p>{new Date(role.createdAt).toLocaleDateString()}</p>
                <p className={role.status ? "text-green-500" : "text-red-500"}>
                  {role.status ? "Activo" : "Inactivo"}
                </p>
                <p className="flex justify-evenly place-items-center w-full">
                  <FaEye
                    size={20}
                    color="#d9b13b"
                    onClick={() => {
                      setDetailsModal(true);
                      setRole(role);
                    }}
                    cursor={"pointer"}
                  />
                  <FaEdit
                    size={20}
                    color="#7588f0"
                    onClick={() => {
                      setEditModal(true);
                      setRole(role);
                    }}
                    cursor={"pointer"}
                  />
                  <FaTrash
                    size={19}
                    color="#fa4334"
                    onClick={() => {
                      deleteElement("Rol", `/api/roles/${role._id}`, () =>
                        fetchRoles()
                      );
                      setRole(role);
                    }}
                    cursor={"pointer"}
                  />
                </p>
              </div>
            ))}

            {filteredRoles.length === 0 && (
              <p className="text-center text-gray-500 py-5">
                No se encontraron roles.
              </p>
            )}
          </div>
        </div>

        {/* Paginación al fondo */}
        <div className="w-full flex justify-center mt-5">
          <Pagination count={Math.ceil(filteredRoles.length / 10)} />
        </div>
      </section>

      <CreateRoleModal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        updateList={() => fetchRoles()}
      />
      <RoleDetailsModal
        isOpen={detailsModal}
        onClose={() => setDetailsModal(false)}
        extraProps={role}
      />
      <EditRoleModal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        extraProps={role}
        updateList={() => fetchRoles()}
      />
    </div>
  );
}

export default Page;
