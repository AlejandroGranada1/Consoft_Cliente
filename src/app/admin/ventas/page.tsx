"use client";
import { Sale } from "@/app/types";
import api from "@/components/Global/axios";
import React, { useEffect, useState } from "react";
import { FaEye, FaSearch } from "react-icons/fa";
import PaginatedList from "@/components/Global/Pagination";

function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [detailsModal, setDetailsModal] = useState(false);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchSales = async () => {
      const response = await api.get("/api/sales");
      setSales(response.data.sales);
    };
    fetchSales();
  }, []);

  console.log(sales);
  const filteredSales = sales.filter(
    (s) =>
      s.order._id?.toLowerCase().includes(filterText.toLowerCase()) ||
      s.user?.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="px-4 md:px-20">
      <header className="flex flex-col gap-4 md:h-60 justify-around">
        <h1 className="text-xl md:text-2xl text-brown text-center md:text-left">
          GESTIÓN DE VENTAS
        </h1>

        {/* buscador */}
        <div className="relative w-full md:w-64">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar Venta"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-10 pr-4 py-2 border border-brown rounded-lg w-full text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-brown"
          />
        </div>
      </header>

      <section className="w-full mx-auto mt-6 flex flex-col justify-between border-t border-gray">
        {/* encabezado tabla solo desktop */}
        <div className="hidden md:grid grid-cols-6 place-items-center py-6 font-semibold">
          <p>Id Venta</p>
          <p>Cliente</p>
          <p>Total</p>
          <p>Pagado</p>
          <p>Estado</p>
          <p>Acciones</p>
        </div>

        {/* listado con paginación */}
        <PaginatedList data={filteredSales} itemsPerPage={5}>
          {(sale: Sale) => (
            <div
              key={sale._id}
              className={`grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-0 place-items-center py-3 border-brown/40 md:border-b md:border-brown/10 rounded-lg p-4 md:py-2 transition-colors ${
                sale.restante === 0
                  ? "bg-green-50 hover:bg-green-100"
                  : "bg-orange-50 hover:bg-orange-100"
              }`}
            >
              {/* mobile view */}
              <div className="w-full md:hidden text-center space-y-2 border-b pb-4">
                <p>
                  <span className="font-semibold">Id Venta:</span>{" "}
                  {sale.order._id}
                </p>
                <p>
                  <span className="font-semibold">Cliente:</span>{" "}
                  {sale.user?.name || "---"}
                </p>
                <p>
                  <span className="font-semibold">Total:</span>{" "}
                  {sale.total.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                  })}
                </p>
                <p>
                  <span className="font-semibold">Pagado:</span>{" "}
                  {sale.paid.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                  })}
                </p>
                <p>
                  <span className="font-semibold">Estado:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full font-semibold text-sm ${
                      sale.restante === 0
                        ? "bg-green-200 text-green-800"
                        : "bg-orange-200 text-orange-800"
                    }`}
                  >
                    {sale.restante === 0 ? "Pagado" : "Pendiente"}
                  </span>
                </p>

                {/* Icono inspeccionar mobile */}
                <div className="flex justify-center mt-2">
                  <FaEye
                    size={20}
                    color="#d9b13b"
                    onClick={() => {
                      setDetailsModal(true);
                    }}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              {/* desktop view */}
              <p className="hidden md:block truncate w-20">{sale.order._id}</p>
              <p className="hidden md:block">{sale.user?.name || "---"}</p>
              <p className="hidden md:block">
                {sale.total.toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                })}
              </p>
              <p className="hidden md:block">
                {sale.paid.toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                })}
              </p>
              <p className="hidden md:block px-2 py-1 rounded-full text-center font-semibold text-sm">
                {sale.restante === 0 ? "Pagado" : "Pendiente"}
              </p>

              {/* Icono inspeccionar desktop */}
              <div className="hidden md:flex justify-center w-full">
                <FaEye
                  size={20}
                  color="#d9b13b"
                  onClick={() => {
                    setDetailsModal(true);
                  }}
                  className="cursor-pointer"
                />
              </div>
            </div>
          )}
        </PaginatedList>
      </section>
    </div>
  );
}

export default SalesPage;
