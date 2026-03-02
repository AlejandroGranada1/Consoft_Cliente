export const MODULE_TRANSLATIONS: Record<string, string> = {
    users: 'Usuarios',
    roles: 'Roles',
    products: 'Productos',
    categories: 'Categorías',
    services: 'Servicios',
    visits: 'Visitas',
    orders: 'Pedidos',
    sales: 'Ventas',
    permissions: 'Permisos',
    quotations: 'Cotizaciones',
    dashboard: 'Panel de Control',
    auth: 'Autenticación',
    payments: 'Pagos',
};

export const translateModule = (module: string) => {
    if (!module) return module;
    return MODULE_TRANSLATIONS[module.toLowerCase()] || module;
};
