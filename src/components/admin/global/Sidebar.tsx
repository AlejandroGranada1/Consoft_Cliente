import SidebarLink from './SidebarLink';
import { FaChartLine, FaElementor, FaFileInvoiceDollar, FaProductHunt } from 'react-icons/fa';
import { HiUsers } from 'react-icons/hi';
import { FaCartShopping, FaGear, FaMessage, FaMoneyBillTrendUp } from 'react-icons/fa6';
import { GiPayMoney } from 'react-icons/gi';
import { VscServerEnvironment } from 'react-icons/vsc';
import { CiLocationOn, CiMoneyBill } from 'react-icons/ci';
import { TbCategoryPlus } from 'react-icons/tb';
import Link from 'next/link';
import { ItemIndicator } from '@radix-ui/react-dropdown-menu';
import ListItemIcon from '@mui/material/ListItemIcon';

function Sidebar() {
    return (
        <aside className='h-screen w-[240px] bg-white flex flex-col'>
            {/* Logo + TopBar */}
            <div className='flex items-center justify-between px-4 py-3 border-b border-gray-200 h-20'>
                <Link href={"/client"} className='font-bold text-lg text-brown'>Confort & Estilo</Link>
            </div>

            {/* Links */}
            <nav className='flex-1 flex flex-col justify-evenly overflow-y-auto border-r border-gray'>
                <SidebarLink
                groupTitle='Chats'
                routes={[{value: "Chats", icon: <FaMessage/>, href: "/admin/chats"}]}
                >
                    
                </SidebarLink>
                <SidebarLink
                    groupTitle='Configuración'
                    routes={[{ value: 'Roles', icon: <FaGear />, href: '/admin/configuracion' }]}
                />
                <SidebarLink
                    groupTitle='Usuarios'
                    routes={[{ value: 'Usuarios', icon: <HiUsers />, href: '/admin/usuarios' }]}
                />
                <SidebarLink
                    groupTitle='Ventas'
                    routes={[
                        {
                            value: 'Pedidos',
                            icon: <FaFileInvoiceDollar />,
                            href: '/admin/ventas/pedidos',
                        },
                        { value: 'Pagos', icon: <GiPayMoney />, href: '/admin/ventas/pagos' },
                        { value: 'Ventas', icon: <FaMoneyBillTrendUp />, href: '/admin/ventas' },
                        { value: 'Cotizaciones', icon: <FaCartShopping />, href: '/admin/ventas/cotizaciones' },
                    ]}
                />
                <SidebarLink
                    groupTitle='Servicios'
                    routes={[
                        {
                            value: 'Servicios',
                            icon: <VscServerEnvironment />,
                            href: '/admin/servicios',
                        },
                        {
                            value: 'Visitas',
                            icon: <CiLocationOn />,
                            href: '/admin/servicios/visitas',
                        },
                    ]}
                />
                <SidebarLink
                    groupTitle='Compras'
                    routes={[
                        {
                            value: 'Categorías',
                            icon: <TbCategoryPlus />,
                            href: '/admin/compras/categorias',
                        },
                        {
                            value: 'Productos',
                            icon: <FaElementor />,
                            href: '/admin/compras/productos',
                        },
                    ]}
                />
                <SidebarLink
                    groupTitle='Desempeño'
                    routes={[
                        { value: 'Desempeño', icon: <FaChartLine />, href: '/admin/desempeno' },
                    ]}
                />
            </nav>
        </aside>
    );
}

export default Sidebar;
