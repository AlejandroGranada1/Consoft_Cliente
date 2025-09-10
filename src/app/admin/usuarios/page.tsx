'use client';
import { UserProps } from '@/app/types';
import CreateUserModal from '@/components/admin/usuarios/CreateUserModal';
import DetailsUserModal from '@/components/admin/usuarios/DetailsUserModal';
import Pagination from '@mui/material/Pagination';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';

function page() {
    const [createModal, setCreateModal] = useState(false);
    const [detailsModal, setDetailsModal] = useState(false);
    const [user, setUser] = useState<UserProps>();
    const [users, setUsers] = useState<UserProps[]>([
        {
            id: 'askdljaklsdajklsd',
            name: 'Mark Wilson',
            email: 'Markwilson@gmail.com',
            address: 'Medellin',
            document: '1234567890',
            phone: '12344556778',
            password: 'aslkdlkasjkld',
            role: {
                name: 'administrador',
                description: 'Acceso completo',
                permissions: [],
                createDate: new Date('2025/02/02'),
            },
            register_date: new Date('2025/02/02'),
            status: true,
        },
    ]);
    return (
        <div>
            <header className='flex flex-col h-60 justify-around px-20'>
                <h1 className='text-2xl  text-brown'>GESTION DE USUARIOS</h1>
                {/* actions */}
                <div className='flex justify-between items-center'>
                    <div className='relative w-64'>
                        {/* Icono */}
                        <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />

                        {/* Input */}
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
                {/* Encabezado de la tabla */}
                <div>
                    <div className='grid grid-cols-5 place-items-center py-6'>
                        <p>Usuario</p>
                        <p>Correo Electrónico</p>
                        <p>Direccion</p>
                        <p>Fecha de Registro</p>
                        <p>Estado</p>
                    </div>

                    {/* Lista de roles */}
                    <div className='mx-auto border-t border-brown pt-5 flex flex-col gap-4'>
                        {users.map((user) => (
                            <div
                                onClick={() => {
                                    setDetailsModal(true);
                                    setUser(user);
                                }}
                                key={user.id}
                                className='grid grid-cols-5 place-items-center py-3 border border-brown rounded-lg cursor-pointer'>
                                <p>{user.name}</p>
                                <p>{user.email}</p>
                                <p>{user.address}</p>
                                <p>{user.register_date?.toLocaleDateString()}</p>
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

                {/* Paginación al fondo */}
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

export default page;
