'use client';
import { DefaultModalProps, User } from '@/app/types';
import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';

function CreateUserModal({ isOpen, onClose, extraProps }: DefaultModalProps<User>) {
    const [userData, setUserData] = useState<User>({
        id: '',
        name: '',
        address: '',
        email: '',
        password: '',
        phone: '',
        registeredAt: '2025-02-02',
        role: {
            id: '',
            description: '',
            name: '',
            permissions: [],
            createdAt: '2025-02-02',
            usersCount: 1,
            status: true,
        },
        status: true,
    });

    // Manejar cambios en inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'role') {
            setUserData((prev) => ({
                ...prev,
                role: {
                    ...prev.role,
                    id: value,
                    name: value, // puedes cambiar esto según tus roles reales
                },
            }));
        } else {
            setUserData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Manejar submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('Usuario a guardar:', userData);

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className='modal-bg fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50'>
            <div className='modal-frame bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative'>
                <header className='w-fit mx-auto'>
                    <button
                        onClick={onClose}
                        className='absolute top-4 left-4 text-2xl text-gray-500 hover:text-black cursor-pointer'>
                        <IoMdClose />
                    </button>
                    <h1 className='text-xl font-semibold mb-4'>AGREGAR NUEVO USUARIO</h1>
                </header>

                <form
                    onSubmit={handleSubmit}
                    className='space-y-4'>
                    <div className='flex flex-col'>
                        <label htmlFor='name'>Nombre</label>
                        <input
                            id='name'
                            name='name'
                            type='text'
                            placeholder='Nombre'
                            value={userData.name}
                            onChange={handleChange}
                            className='border px-3 py-2 rounded-md'
                        />
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor='email'>Correo Electrónico</label>
                        <input
                            id='email'
                            name='email'
                            type='email'
                            placeholder='Correo Electrónico'
                            value={userData.email}
                            onChange={handleChange}
                            className='border px-3 py-2 rounded-md'
                        />
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor='role'>Rol</label>
                        <select
                            value={userData.role.id}
                            onChange={handleChange}
                            name='role'
                            id='role'
                            className='border px-3 py-2 rounded-md'>
                            <option value=''>Seleccionar rol</option>
                            <option value='administrador'>Administrador</option>
                            <option value='usuario'>Usuario</option>
                        </select>
                    </div>

                    <div className='w-full flex justify-between mt-6'>
                        <button
                            type='submit'
                            className='px-10 py-2 rounded-lg border border-brown text-brown cursor-pointer'>
                            Guardar
                        </button>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-10 py-2 rounded-lg border border-gray bg-gray cursor-pointer'>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateUserModal;
