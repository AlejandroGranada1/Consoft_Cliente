'use client';
import { DefaultModalProps, Category } from '@/app/types';
import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';

function CreateCategoryModal({ isOpen, onClose }: DefaultModalProps<Category>) {
    const [categoryData, setCategoryData] = useState<Category>({
        id: crypto.randomUUID(),
        name: '',
        description: '',
        products: [],
        status: true,
    });

    // Maneja cambios en inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCategoryData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('Categoría creada:', categoryData);

        // Reinicia el formulario
        setCategoryData({
            id: crypto.randomUUID(),
            name: '',
            description: '',
            products: [],
            status: true,
        });

        onClose();
    };

    if (!isOpen) return null; // 👈 no renderiza si está cerrado
    return (
        <div className="modal-bg">
            <div className="modal-frame w-[600px]">
                <header className="w-fit mx-auto">
                    <button
                        onClick={onClose}
                        className="absolute top-4 left-4 text-2xl text-gray-500 hover:text-black cursor-pointer">
                        <IoMdClose />
                    </button>
                    <h1 className="text-xl font-semibold mb-4">AGREGAR CATEGORÍA</h1>
                </header>

                <form onSubmit={handleSubmit}>
                    {/* Nombre */}
                    <div className="flex flex-col">
                        <label htmlFor="name">Categoría</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Nombre de la categoría"
                            value={categoryData.name}
                            onChange={handleChange}
                            className="border px-3 py-2 rounded-md"
                        />
                    </div>

                    {/* Descripción */}
                    <div className="flex flex-col mt-4">
                        <label htmlFor="description">Descripción</label>
                        <input
                            id="description"
                            name="description"
                            type="text"
                            placeholder="Descripción de la categoría"
                            value={categoryData.description}
                            onChange={handleChange}
                            className="border px-3 py-2 rounded-md"
                        />
                    </div>

                    {/* Estado */}
                    <div className="flex items-center gap-3 mt-4">
                        <input
                            id="status"
                            name="status"
                            type="checkbox"
                            checked={categoryData.status}
                            onChange={(e) =>
                                setCategoryData((prev) => ({
                                    ...prev,
                                    status: e.target.checked,
                                }))
                            }
                            className="h-4 w-4 cursor-pointer"
                        />
                        <span className={categoryData.status ? 'text-green-600' : 'text-red-600'}>
                            {categoryData.status ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>

                    {/* Botones */}
                    <div className="w-full flex justify-between mt-10">
                        <button
                            type="submit"
                            className="px-10 py-2 rounded-lg border border-brown text-brown cursor-pointer">
                            Guardar
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-10 py-2 rounded-lg border border-gray bg-gray cursor-pointer">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateCategoryModal;
