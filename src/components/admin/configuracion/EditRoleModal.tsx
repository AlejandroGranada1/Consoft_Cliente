import { DefaultModalProps, Permission, Role } from '@/app/types';
import React, { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';

const permissionsConfig: Permission[] = [
    { id: '1', module: 'Usuarios', action: 'view' },
    { id: '2', module: 'Usuarios', action: 'create' },
    { id: '3', module: 'Usuarios', action: 'update' },
    { id: '4', module: 'Usuarios', action: 'delete' },
    { id: '5', module: 'Configuracion', action: 'view' },
    { id: '6', module: 'Configuracion', action: 'create' },
    { id: '7', module: 'Configuracion', action: 'update' },
    { id: '8', module: 'Configuracion', action: 'delete' },
];

function EditRoleModal({ isOpen, onClose, extraProps }: DefaultModalProps<Role>) {
    const [roleData, setRoleData] = useState<Role>({
        id: '',
        name: '',
        description: '',
        status: true,
        permissions: [],
        createdAt: '',
        usersCount: 0,
    });

    const modules = Array.from(new Set(permissionsConfig.map((p) => p.module)));

    // 🔹 Prellenar datos cuando se abre el modal
    useEffect(() => {
        if (extraProps) {
            setRoleData(extraProps);
        }
    }, [extraProps, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRoleData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const togglePermission = (permission: Permission) => {
        setRoleData((prev) => {
            const exists = prev.permissions?.some((p) => p.id === permission.id);
            return {
                ...prev,
                permissions: exists
                    ? prev.permissions?.filter((p) => p.id !== permission.id)
                    : [...(prev.permissions || []), permission],
            };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Rol actualizado:', roleData);
        onClose();
    };

    if (!isOpen) return null;

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

                <form onSubmit={handleSubmit}>
                    {/* Nombre */}
                    <div className='flex flex-col'>
                        <label htmlFor='name'>Rol</label>
                        <input
                            id='name'
                            name='name'
                            type='text'
                            value={roleData.name}
                            onChange={handleChange}
                            className='border px-3 py-2 rounded-md'
                        />
                    </div>

                    {/* Descripción */}
                    <div className='flex flex-col mt-4'>
                        <label htmlFor='description'>Descripción</label>
                        <input
                            id='description'
                            name='description'
                            type='text'
                            value={roleData.description}
                            onChange={handleChange}
                            className='border px-3 py-2 rounded-md'
                        />
                    </div>
                    {/* Estado */}
                    <div className='flex items-center gap-3 mt-4'>
                        <input
                            id='status'
                            name='status'
                            type='checkbox'
                            checked={roleData.status}
                            onChange={(e) =>
                                setRoleData((prev) => ({
                                    ...prev,
                                    status: e.target.checked,
                                }))
                            }
                            className='h-4 w-4 cursor-pointer'
                        />
                        <span className={roleData.status ? 'text-green-600' : 'text-red-600'}>
                            {roleData.status ? 'Activo' : 'Inactivo'}
                        </span>
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
                                                    checked={roleData.permissions?.some(
                                                        (p) => p.id === permission.id
                                                    )}
                                                    onChange={() => togglePermission(permission)}
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

                    {/* Botones */}
                    <div className='w-full flex justify-between mt-10'>
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

export default EditRoleModal;
