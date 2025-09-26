'use client';
import { DefaultModalProps, Service } from '@/app/types';
import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { createElement } from '../../global/alerts';

function CreateServiceModal({ isOpen, onClose, extraProps, updateList }: DefaultModalProps<Service>) {
  const [serviceData, setServiceData] = useState<Service>({
    _id: undefined,
    name: '',
    description: '',
    imageUrl: '',
    status: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'imageUrl' && files) {
      setServiceData((prev) => ({ ...prev, imageUrl: URL.createObjectURL(files[0]) }));
    } else {
      setServiceData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createElement('Servicio', '/api/services', serviceData, updateList);
    console.log('Servicio creado:', serviceData);

    // Reset formulario
    setServiceData({ _id: undefined, name: '', description: '', imageUrl: '', status: true });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='modal-bg'>
      <div className='modal-frame w-[800px]'>
        <header className='w-fit mx-auto'>
          <button
            onClick={onClose}
            className='absolute top-4 left-4 text-2xl text-gray-500 hover:text-black cursor-pointer'>
            <IoMdClose />
          </button>
          <h1 className='text-xl font-semibold mb-4'>Agregar Servicio</h1>
        </header>

        <section className='grid grid-cols-2 gap-4'>
          <form onSubmit={handleSubmit} className='flex flex-col justify-between gap-4'>
            {/* Nombre */}
            <div className='flex flex-col'>
              <label htmlFor='name'>Servicio</label>
              <input
                id='name'
                name='name'
                type='text'
                placeholder='Nombre del servicio'
                value={serviceData.name}
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
                placeholder='Descripción del servicio'
                value={serviceData.description}
                onChange={handleChange}
                className='border px-3 py-2 rounded-md'
              />
            </div>

            {/* Imagen */}
            <div className='flex flex-col mt-4'>
              <label htmlFor='imageUrl'>Imagen</label>
              <input
                id='imageUrl'
                name='imageUrl'
                type='file'
                onChange={handleChange}
                className='border px-3 py-2 rounded-md'
              />
            </div>

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

          {/* Preview de la imagen */}
          <div className='border rounded-lg flex items-center justify-center'>
            {serviceData.imageUrl && (
              <img src={serviceData.imageUrl} alt='Preview' className='max-h-40 object-contain' />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default CreateServiceModal;
