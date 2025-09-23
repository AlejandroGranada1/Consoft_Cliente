'use client';
import { Service } from '@/app/types';
import CreateServiceModal from '@/components/admin/servicios/servicios/CreateService';
import ServiceDetailsModal from '@/components/admin/servicios/servicios/ServiceDetails';
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import api from '@/components/Global/axios';
import { log } from 'console';

function Page() {
  const [createModal, setCreateModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [service, setService] = useState<Service>();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/api/services');
        setServices(response.data);
		console.log(response.data)
      } catch (error) {
        console.error("Error al cargar servicios:", error);
      }
    };
    fetchServices();
  }, []);

  return (
    <div>
      <header className='flex flex-col h-60 justify-around px-20'>
        <h1 className='text-2xl text-brown'>GESTION DE SERVICIOS</h1>
        <div className='flex justify-between items-center'>
          <div className='relative w-64'>
            <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder='Buscar Servicio'
              className='pl-10 pr-4 py-2 border border-brown rounded-lg w-full text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-brown'
            />
          </div>
          <button
            onClick={() => setCreateModal(true)}
            className='flex items-center py-2 w-fit px-10 border border-brown rounded-lg cursor-pointer text-brown'>
            <IoMdAdd size={25} /> Agregar Nuevo Servicio
          </button>
        </div>
      </header>

      <section className='w-8/9 mx-auto h-[420px] flex flex-col justify-between border-t border-gray'>
        <div>
          <div className='grid grid-cols-3 place-items-center py-6'>
            <p>Servicio</p>
            <p>Descripción</p>
            <p>Estado</p>
          </div>

          <div className='mx-auto border-t border-brown pt-5 flex flex-col gap-4'>
            {services.map((service) => (
              <div
                onClick={() => {
                  setDetailsModal(true);
                  setService(service);
                }}
                key={service._id}
                className='grid grid-cols-3 place-items-center py-3 border border-brown rounded-lg cursor-pointer'>
                <p>{service.name}</p>
                <p>{service.description}</p>
                <p
                  className={`${
                    service.status
                      ? 'bg-green/30 text-green'
                      : 'bg-red/30 text-red'
                  } px-2 py-1 rounded-xl`}>
                  {service.status ? 'Activo' : 'Inactivo'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className='w-full flex justify-center mt-5'>
          <Pagination count={Math.ceil(services.length / 10)} />
        </div>
      </section>

      <CreateServiceModal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
      />
      <ServiceDetailsModal
        isOpen={detailsModal}
        onClose={() => setDetailsModal(false)}
        extraProps={service}
      />
    </div>
  );
}

export default Page;
