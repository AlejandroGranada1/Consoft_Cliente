"use client";
import { Category } from "@/app/types";
import CategoryDetailsModal from "@/components/admin/compras/categorias/CategoryDetailsModal";
import CreateCategoryModal from "@/components/admin/compras/categorias/CreateCategoryModal";
import Pagination from "@mui/material/Pagination";
import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaSearch, FaTrash } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { deleteElement } from "@/components/admin/global/alerts";
import api from "@/components/Global/axios";
import EditCategoryModal from "@/components/admin/compras/categorias/EditCategoryModal";

function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [category, setCategory] = useState<Category>();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");

  const itemsPerPage = 10;

  // === API CALLS ===
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/categories");
      console.log(response);
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error al obtener categorías", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await deleteElement(
      "categoría",
      `/api/categories/${id}`,
      fetchCategories
    );
    if (!confirm) return;

    try {
      await api.delete(`/api/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error al eliminar categoría", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  console.log(categories);

  // === FILTRADO + PAGINACIÓN ===
  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(filter.toLowerCase()) ||
      c.description?.toLowerCase().includes(filter.toLowerCase())
  );

  const paginatedCategories = filteredCategories.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div>
      <header className="flex flex-col gap-6 px-4 md:px-20 py-6">
        <h1 className="text-2xl text-brown">GESTIÓN DE CATEGORÍAS</h1>

        {/* actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar Categoría"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-brown rounded-lg w-full text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-brown"
            />
          </div>

          <button
            onClick={() => setCreateModal(true)}
            className="flex items-center py-2 w-full md:w-fit justify-center px-6 border border-brown rounded-lg cursor-pointer text-brown"
          >
            <IoMdAdd size={22} />{" "}
            <span className="ml-2">Agregar Categoría</span>
          </button>
        </div>
      </header>

      <section className="w-full md:w-8/9 mx-auto flex flex-col gap-6 border-t border-gray p-4">
        {/* Desktop table */}
        <div className="hidden md:block">
          <div className="grid grid-cols-4 place-items-center py-4 font-semibold">
            <p>Categoría</p>
            <p>Descripción</p>
            <p>Productos</p>
            <p>Acciones</p>
          </div>

          <div className="flex flex-col gap-4">
            {loading ? (
              <p className="text-center">Cargando...</p>
            ) : paginatedCategories.length > 0 ? (
              paginatedCategories.map((category) => (
                <div
                  key={category._id}
                  className="grid grid-cols-4 place-items-center py-3 border-b border-brown/10 rounded-lg"
                >
                  <p>{category.name}</p>
                  <p>{category.description}</p>
                  <p>{category.products.length}</p>

                  {/* Acciones */}
                  <div className="hidden md:flex justify-evenly place-items-center w-full">
                    <FaEye
                      size={20}
                      color="#d9b13b"
                      onClick={() => {
                        setDetailsModal(true);
                        setCategory(category);
                      }}
                      cursor="pointer"
                    />
                    <FaEdit
                      size={20}
                      color="#7588f0"
                      onClick={() => {
                        setEditModal(true);
                        setCategory(category);
                      }}
                      cursor="pointer"
                    />
                    <FaTrash
                      size={19}
                      color="#fa4334"
                      onClick={() =>
                        deleteElement(
                          "Categoria",
                          `/api/categories/${category._id}`,
                          fetchCategories
                        )
                      }
                      cursor="pointer"
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No se encontraron categorías</p>
            )}
          </div>
        </div>

        {/* Mobile cards */}
        <div className="flex flex-col gap-4 md:hidden">
          {loading ? (
            <p className="text-center">Cargando...</p>
          ) : paginatedCategories.length > 0 ? (
            paginatedCategories.map((category) => (
              <div
                key={category._id}
                className="border border-brown rounded-lg p-4 flex flex-col gap-2"
              >
                <p className="font-semibold">{category.name}</p>
                <p className="text-sm text-gray-600">{category.description}</p>
                <p className="text-sm">Productos: {category.products.length}</p>

                {/* Acciones */}
                <div className="hidden md:flex justify-evenly place-items-center w-full">
                  <div className="flex gap-4 mt-2 justify-center">
                    <FaEye
                      size={20}
                      color="#d9b13b"
                      onClick={() => {
                        setDetailsModal(true);
                        setCategory(category);
                      }}
                      cursor="pointer"
                    />
                    <FaEdit
                      size={20}
                      color="#7588f0"
                      onClick={() => {
                        setEditModal(true);
                        setCategory(category);
                      }}
                      cursor="pointer"
                    />
                    <FaTrash
                      size={19}
                      color="#fa4334"
                      onClick={() =>
                        deleteElement(
                          "Servicio",
                          `/api/categories/${category._id}`,
                          fetchCategories
                        )
                      }
                      cursor="pointer"
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No se encontraron categorías</p>
          )}
        </div>

        {/* Paginación */}
        <div className="w-full flex justify-center">
          <Pagination
            count={Math.ceil(filteredCategories.length / itemsPerPage)}
            page={page}
            onChange={(_, value) => setPage(value)}
          />
        </div>
      </section>

      {/* Modales */}
      <CreateCategoryModal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        updateList={() => fetchCategories()}
      />

      <CategoryDetailsModal
        isOpen={detailsModal}
        onClose={() => setDetailsModal(false)}
        extraProps={category}
        updateList={() => fetchCategories()}
      />

      <EditCategoryModal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        extraProps={category}
        updateList={() => fetchCategories()}
      />
    </div>
  );
}

export default Page;
