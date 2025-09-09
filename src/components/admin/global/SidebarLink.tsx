'use client';

import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';

interface SubRouteProps {
    value: string;
    icon: React.ReactNode;
    href?: string;
}

interface SidebarLinkProps {
    groupTitle: string;
    routes: SubRouteProps[];
}

function SidebarLink({ groupTitle, routes }: SidebarLinkProps) {
    const pathname = usePathname(); // ruta actual

    return (
        <div className='px-4 py-3'>
            {/* título del grupo */}
            <h3 className='text-gray-400 text-xs uppercase tracking-wide mb-2'>{groupTitle}</h3>

            {/* links */}
            <ul className='flex flex-col gap-1'>
                {routes.map((route, i) => {
                    const isActive = pathname === route.href;

                    return (
                        <li key={i}>
                            <Link
                                href={route.href || '#'}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                                    ${
                                        isActive
                                            ? 'border-2 border-brown text-brown-700 bg-brown-50'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                                    }
                                `}>
                                <span className='text-lg'>{route.icon}</span>
                                <span>{route.value}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default SidebarLink;
