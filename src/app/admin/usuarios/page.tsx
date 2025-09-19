'use client';
import { User } from '@/app/types';
import CreateUserModal from '@/components/admin/usuarios/CreateUserModal';
import DetailsUserModal from '@/components/admin/usuarios/DetailsUserModal';
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';

function Page() {
  const [createModal, setCreateModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [user, setUser] = useState<User>();
  const [users, setUsers] = useState<User[]>([]);

  // 🔹 Llamada al backend
  useEffect(() => {
    fetch('http://localhost:3000/users') // 👈 ajusta al puerto donde corre tu API
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error('Error cargando usuarios:', err));
  }, []);

  return (
    <div>
      <header className='flex flex-col h-60 justify-around px-20'>
        <h1 className='text-2xl text-brown'>GESTION DE USUARIOS</h1>
        <div className='flex justify-between items-center'>
          <div className='relative w-64'>
            <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder='Buscar Usuario'
              className='pl-10 pr-4 py-2 border border-brown rounded-lg w-full text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-brown'
            />
          </div>

          <button
            onClick={() => setCreateModal(true)}
            className='flex items-center py-2 w-fit px-10 border border-brown rounded-lg cursor-pointer text-brown'>
            <IoMdAdd size={25} /> Agregar Nuevo Usuario
          </button>
        </div>
      </header>

      <section className='w-8/9 mx-auto h-[420px] flex flex-col justify-between border-t border-gray'>
        <div>
          <div className='grid grid-cols-5 place-items-center py-6'>
            <p>Usuario</p>
            <p>Correo Electrónico</p>
            <p>Dirección</p>
            <p>Fecha de Registro</p>
            <p>Estado</p>
          </div>

          <div className='mx-auto border-t border-brown pt-5 flex flex-col gap-4'>
            {users.map((user) => (
              <div
                onClick={() => {
                  setDetailsModal(true);
                  setUser(user);
                }}
                key={user._id}
                className='grid grid-cols-5 place-items-center py-3 border border-brown rounded-lg cursor-pointer'>
                <p>{user.name}</p>
                <p>{user.email}</p>
                <p>{user.address}</p>
                <p>{new Date(user.registeredAt).toLocaleDateString()}</p>
                <p
                  className={`${
                    user.status
                      ? 'bg-green/30 text-green'
                      : 'bg-red/30 text-red'
                  } px-2 py-1 rounded-xl`}>
                  {user.status ? 'Activo' : 'Inactivo'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className='w-full flex justify-center mt-5'>
          <Pagination count={Math.ceil(users.length / 10)} />
        </div>
      </section>

      <CreateUserModal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
      />
      <DetailsUserModal
        isOpen={detailsModal}
        onClose={() => setDetailsModal(false)}
        extraProps={user}
      />
    </div>
  );
}

export default Page;
