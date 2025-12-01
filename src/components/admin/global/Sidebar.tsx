import SidebarLink from './SidebarLink';
import { FaChartLine, FaFileInvoiceDollar } from 'react-icons/fa';
import { HiUsers } from 'react-icons/hi';
import { FaCartShopping, FaGear, FaMoneyBillTrendUp } from 'react-icons/fa6';
import { GiPayMoney } from 'react-icons/gi';
import { VscServerEnvironment } from 'react-icons/vsc';
import { CiLocationOn } from 'react-icons/ci';
import { TbCategoryPlus } from 'react-icons/tb';
import Link from 'next/link';

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
                            icon: <FaCartShopping />,
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
