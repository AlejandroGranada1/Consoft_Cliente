export const MODULE_TRANSLATIONS: Record<string, string> = {
    roles: "Roles",
    sales: "Ventas",
    orders: "Pedidos",
    permissions: "Permisos",
    dashboard: "Dashboard",
    users: "Usuarios",
    payments: "Pagos",
    categories: "Categorias",
    visits: "Visitas",
    services: "Servicios",
    products: "Productos",
    quotations: "Cotizaciones"

};

export const translateModule = (module: string) => {
    if (!module) return module;
    return MODULE_TRANSLATIONS[module.toLowerCase()] || module;
};
