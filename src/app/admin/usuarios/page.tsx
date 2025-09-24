"use client";
import { User } from "@/app/types";
import CreateUserModal from "@/components/admin/usuarios/CreateUserModal";
import EditUserModal from "@/components/admin/usuarios/EditUserModal";
import DetailsUserModal from "@/components/admin/usuarios/DetailsUserModal";
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
    <div>
      <header className="flex flex-col h-40 justify-around px-20">
        <h1 className="text-2xl text-brown">GESTIÓN DE USUARIOS</h1>

        {/* acciones */}
        <div className="flex justify-between items-center">
          <div className="relative w-64">
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
            className="flex items-center py-2 w-fit px-10 border border-brown rounded-lg cursor-pointer text-brown"
          >
            <IoMdAdd size={25} /> Agregar Nuevo Usuario
          </button>
        </div>
      </header>

      <section className="w-8/9 mx-auto h-[420px] flex flex-col justify-between border-t border-gray">
        {/* encabezado tabla */}
        <div>
          <div className="grid grid-cols-6 place-items-center py-6 font-semibold">
            <p>Usuario</p>
            <p>Correo</p>
            <p>Dirección</p>
            <p>Fecha de Registro</p>
            <p>Estado</p>
            <p>Acciones</p>
          </div>

          {/* listado */}
          <div className="mx-auto border-t border-brown/60 pt-5 flex flex-col gap-4">
            {filteredUsers.map((u) => (
              <div
                key={u._id}
                className="grid grid-cols-6 place-items-center py-3 border-b border-brown/60 rounded-lg"
              >
                <p>{u.name}</p>
                <p className='truncate w-40'>{u.email}</p>
                <p>{u.address || "-"}</p>
                <p>{new Date(u.registeredAt).toLocaleDateString()}</p>
                <p className={u.status ? "text-green-500" : "text-red-500"}>
                  {u.status ? "Activo" : "Inactivo"}
                </p>
                <p className="flex justify-evenly place-items-center w-full">
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
                </p>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <p className="text-center text-gray-500 py-5">
                No se encontraron usuarios.
              </p>
            )}
          </div>
        </div>

        {/* paginación */}
        <div className="w-full flex justify-center mt-5">
          <Pagination count={Math.ceil(filteredUsers.length / 10)} />
        </div>
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
