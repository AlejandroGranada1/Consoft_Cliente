import { DefaultModalProps, PermissionProps, RoleProps } from '@/app/types';
import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import EditRoleModal from './EditRoleModal';
import deleteElement from '../global/DeleteElement';
import Swal from 'sweetalert2';

const permissionsConfig: PermissionProps[] = [
    { id: '1', module: 'Usuarios', action: 'view' },
    { id: '2', module: 'Usuarios', action: 'create' },
    { id: '3', module: 'Usuarios', action: 'update' },
    { id: '4', module: 'Usuarios', action: 'delete' },
    { id: '5', module: 'Configuracion', action: 'view' },
    { id: '6', module: 'Configuracion', action: 'create' },
    { id: '7', module: 'Configuracion', action: 'update' },
    { id: '8', module: 'Configuracion', action: 'delete' },
];

function RoleDetailsModal({ isOpen, onClose, extraProps }: DefaultModalProps<RoleProps>) {
    const [editModal, setEditModal] = useState(false);
    if (!isOpen || !extraProps) return null;
    const modules = Array.from(new Set(permissionsConfig.map((p) => p.module)));

    const handleDeleteRole = async () => {
        const result = await deleteElement('Rol');
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Rol Eliminado con exito',
                icon: 'success',
                timer: 1000,
                showConfirmButton: false,
                position: "top-right",
            });
        }
        onClose();
    };

    return (
        <div className='modal-bg'>
            <div className='modal-frame w-[600px]'>
                <header className='w-fit mx-auto'>
                    <button
                        onClick={onClose}
                        className='absolute top-4 left-4 text-2xl text-gray-500 hover:text-black cursor-pointer'>
                        <IoMdClose />
                    </button>
                    <h1 className='text-xl font-semibold mb-4'>DETALLES DEL ROL</h1>
                </header>

                <div>
                    {/* Nombre */}
                    <div className='flex flex-col'>
                        <label className='font-semibold'>Rol</label>
                        <p className='border px-3 py-2 rounded-md bg-gray-100'>{extraProps.name}</p>
                    </div>

                    {/* Descripción */}
                    <div className='flex flex-col mt-4'>
                        <label className='font-semibold'>Descripción</label>
                        <p className='border px-3 py-2 rounded-md bg-gray-100'>
                            {extraProps.description || 'Sin descripción'}
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

                    {/* Permisos */}
                    <section className='mt-10 h-50 overflow-y-scroll'>
                        {modules.map((module) => {
                            const moduloPerms = permissionsConfig.filter(
                                (p) => p.module === module
                            );

                            return (
                                <div
                                    key={module}
                                    className='border rounded-lg p-4 mb-4 bg-gray-50'>
                                    <h3 className='font-semibold mb-2'>{module}</h3>
                                    <div className='grid grid-cols-2 gap-2'>
                                        {moduloPerms.map((permission) => (
                                            <label
                                                key={permission.id}
                                                className='flex items-center gap-2'>
                                                <input
                                                    type='checkbox'
                                                    checked={extraProps.permissions?.some(
                                                        (p) => p.id === permission.id
                                                    )}
                                                    disabled // 👈 solo lectura
                                                />
                                                {permission.action === 'view' && 'Ver'}
                                                {permission.action === 'create' && 'Crear'}
                                                {permission.action === 'update' && 'Actualizar'}
                                                {permission.action === 'delete' && 'Eliminar'}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </section>

                    {/* Botón cerrar */}
                    <div className='w-full flex justify-between mt-10'>
                        <button
                            onClick={() => setEditModal(true)}
                            className='px-10 py-2 rounded-lg border border-brown text-brown cursor-pointer'>
                            Editar Rol
                        </button>
                        <button
                            onClick={handleDeleteRole}
                            className='px-10 py-2 rounded-lg border border-red bg-red text-white cursor-pointer'>
                            Eliminar Rol
                        </button>
                    </div>
                </div>
            </div>
            <EditRoleModal
                isOpen={editModal}
                onClose={() => setEditModal(false)}
                extraProps={extraProps}
            />
        </div>
    );
}

export default RoleDetailsModal;
