export const MODULE_TRANSLATIONS: Record<string, string> = {
    Users: 'Usuarios',
    Roles: 'Roles',
    Products: 'Productos',
    Categories: 'Categorías',
    Services: 'Servicios',
    Visits: 'Visitas',
    Orders: 'Pedidos',
    Quotations: 'Cotizaciones',
    Dashboard: 'Panel de Control',
    Auth: 'Autenticación',
};

export const translateModule = (module: string) => MODULE_TRANSLATIONS[module] || module;
