import { DefaultModalProps, User } from '@/app/types';
import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import EditUserModal from './EditUserModal';
import deleteElement from '../global/DeleteElement';
import Swal from 'sweetalert2';

function DetailsUserModal({ isOpen, onClose, extraProps }: DefaultModalProps<User>) {
    const [editModal, setEditModal] = useState(false);

    const handleDeleteUser = async () => {
        const result = await deleteElement('Usuario');
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Usuario eliminado con exito',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000,
                position: 'top-right',
            });
        }
        onClose();
    };

    if (!isOpen || !extraProps) return null;

    return (
        <div className='modal-bg'>
            <div className='modal-frame w-[600px]'>
                <header className='w-fit mx-auto'>
                    <button
                        onClick={onClose}
                        className='absolute top-4 left-4 text-2xl text-gray-500 hover:text-black cursor-pointer'>
                        <IoMdClose />
                    </button>
                    <h1 className='text-xl font-semibold mb-4'>DETALLES DEL USUARIO</h1>
                </header>

                <div>
                    {/* Nombre */}
                    <div className='flex flex-col'>
                        <label className='font-semibold'>Nombre</label>
                        <p className='border px-3 py-2 rounded-md bg-gray-100'>{extraProps.name}</p>
                    </div>

                    {/* Correo */}
                    <div className='flex flex-col mt-4'>
                        <label className='font-semibold'>Correo</label>
                        <p className='border px-3 py-2 rounded-md bg-gray-100'>
                            {extraProps.email}
                        </p>
                    </div>

                    {/* Teléfono */}
                    <div className='flex flex-col mt-4'>
                        <label className='font-semibold'>Teléfono</label>
                        <p className='border px-3 py-2 rounded-md bg-gray-100'>
                            {extraProps.phone || 'No registrado'}
                        </p>
                    </div>

                    {/* Dirección */}
                    <div className='flex flex-col mt-4'>
                        <label className='font-semibold'>Dirección</label>
                        <p className='border px-3 py-2 rounded-md bg-gray-100'>
                            {extraProps.address || 'No registrada'}
                        </p>
                    </div>

                    {/* Rol */}
                    <div className='flex flex-col mt-4'>
                        <label className='font-semibold'>Rol</label>
                        <p className='border px-3 py-2 rounded-md bg-gray-100'>
                            {extraProps.role?.name || 'Sin rol'}
                        </p>
                    </div>

                    {/* Estado */}
                    <div className='flex flex-col mt-4'>
                        <label className='font-semibold'>Estado</label>
                        <p
                            className={`px-3 py-2 rounded-md w-fit ${
                                extraProps.status
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                            }`}>
                            {extraProps.status ? 'Activo' : 'Inactivo'}
                        </p>
                    </div>

                    {/* Botones */}
                    <div className='w-full flex justify-between mt-10'>
                        <button
                            onClick={() => setEditModal(true)}
                            className='px-10 py-2 rounded-lg border border-brown text-brown cursor-pointer'>
                            Editar Usuario
                        </button>
                        <button
                            onClick={handleDeleteUser}
                            className='px-10 py-2 rounded-lg border border-red bg-red text-white cursor-pointer'>
                            Eliminar Usuario
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de edición */}
            <EditUserModal
                isOpen={editModal}
                onClose={() => setEditModal(false)}
                extraProps={extraProps}
            />
        </div>
    );
}

export default DetailsUserModal;
