"use client";
import { Role, User } from "@/app/types";
import CreateUserModal from "@/components/admin/usuarios/CreateUserModal";
import EditUserModal from "@/components/admin/usuarios/EditUserModal";
import DetailsUserModal from "@/components/admin/usuarios/DetailsUserModal";
import { deleteElement } from "@/components/admin/global/alerts";
import api from "@/components/Global/axios";
import Pagination from "@mui/material/Pagination";
import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaSearch, FaTrash } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import PaginatedList from "@/components/Global/Pagination";

function Page() {
  const [createModal, setCreateModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [user, setUser] = useState<User>();

  const [users, setUsers] = useState<User[]>([]);
  const [filterText, setFilterText] = useState(""); // 📌 filtro buscador

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/users");
      setUsers(response.data.users);
    } catch (err) {
      console.error("Error al traer usuarios", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 📌 Filtrar usuarios
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(filterText.toLowerCase()) ||
      u.email.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="px-4 md:px-20">
      <header className="flex flex-col gap-4 md:h-40 justify-around">
        <h1 className="text-xl md:text-2xl text-brown text-center md:text-left">
          GESTIÓN DE USUARIOS
        </h1>

        {/* acciones */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div className="relative w-full md:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <datalist id="users">
              {users.map((u) => (
                <option key={u._id} value={u.name}></option>
              ))}
            </datalist>

            <input
              type="text"
              list="users"
              placeholder="Buscar Usuario"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-10 pr-4 py-2 border border-brown rounded-lg w-full text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-brown"
            />
          </div>

          <button
            onClick={() => setCreateModal(true)}
            className="flex items-center justify-center py-2 px-6 md:px-10 border border-brown rounded-lg cursor-pointer text-brown w-full md:w-fit"
          >
            <IoMdAdd size={25} className="mr-2" /> Agregar Nuevo Usuario
          </button>
        </div>
      </header>
      <section className="w-full mx-auto mt-6 flex flex-col justify-between border-t border-gray">
        {/* encabezado tabla - solo en desktop */}
        <div className="hidden md:grid grid-cols-6 place-items-center py-6 font-semibold">
          <p>Usuario</p>
          <p>Correo</p>
          <p>Rol</p>
          <p>Fecha de Registro</p>
          <p>Estado</p>
          <p>Acciones</p>
        </div>

        {/* listado con paginación */}
        <PaginatedList data={filteredUsers} itemsPerPage={5}>
          {(u: User) => (
            <div
              key={u._id}
              className="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-0 place-items-center py-3 border-brown/40 md:border-b md:border-brown/10 rounded-lg p-4 md:py-2"
            >
              {/* 📱 Vista mobile */}
              <div className="w-full md:hidden text-center space-y-2 border-b pb-4">
                <p>
                  <span className="font-semibold">Usuario:</span> {u.name}
                </p>
                <p>
                  <span className="font-semibold">Correo:</span> {u.email}
                </p>
                <p>
                  <span className="font-semibold">Rol:</span>{" "}
                  {(u.role as Role)?.name}
                </p>
                <p>
                  <span className="font-semibold">Fecha de Registro:</span>{" "}
                  {new Date(u.registeredAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Estado:</span>{" "}
                  <span
                    className={u.status ? "text-green-500" : "text-red-500"}
                  >
                    {u.status ? "Activo" : "Inactivo"}
                  </span>
                </p>
                <div className="flex gap-4 mt-2 justify-center">
                  {/* 👁️ acciones */}
                </div>
              </div>

              {/* 💻 Vista desktop */}
              <p className="hidden md:block">{u.name}</p>
              <p className="hidden md:block truncate w-40">{u.email}</p>
              <p className="hidden md:block">{(u.role as Role)?.name}</p>
              <p className="hidden md:block">
                {new Date(u.registeredAt).toLocaleDateString()}
              </p>
              <p
                className={`hidden md:block ${
                  u.status ? "text-green-500" : "text-red-500"
                }`}
              >
                {u.status ? "Activo" : "Inactivo"}
              </p>
              <div className="hidden md:flex justify-evenly place-items-center w-full">
                {/* 👁️ acciones */}
                <div className="flex gap-4 mt-2 justify-center">
                  <FaEye
                    size={20}
                    color="#d9b13b"
                    onClick={() => {
                      setDetailsModal(true);
                      setUser(u);
                    }}
                    cursor="pointer"
                  />
                  <FaEdit
                    size={20}
                    color="#7588f0"
                    onClick={() => {
                      setEditModal(true);
                      setUser(u);
                    }}
                    cursor="pointer"
                  />
                  <FaTrash
                    size={19}
                    color="#fa4334"
                    onClick={() =>
                      deleteElement("Usuario", `/api/users/${u._id}`, () =>
                        fetchUsers()
                      )
                    }
                    cursor="pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </PaginatedList>
      </section>
      {/* modales */}
      <CreateUserModal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        updateList={() => fetchUsers()}
      />
      <DetailsUserModal
        isOpen={detailsModal}
        onClose={() => setDetailsModal(false)}
        extraProps={user}
      />
      <EditUserModal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        extraProps={user}
        updateList={() => fetchUsers()}
      />
    </div>
  );
}

export default Page;
