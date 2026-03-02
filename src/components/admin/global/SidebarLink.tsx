'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Route {
  value: string;
  href: string;
  description?: string;
}

interface SidebarLinkProps {
  groupTitle: string;
  icon: React.ReactNode;
  routes: Route[];
  isOpen: boolean;
  onToggle: () => void;
}

export default function SidebarLink({ groupTitle, icon, routes, isOpen, onToggle }: SidebarLinkProps) {
  const pathname = usePathname();

  const isActive = routes.some(route => pathname === route.href);

  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl
          transition-all duration-200 group
          ${isActive 
            ? 'bg-[#C8A882]/10 text-[#C8A882]' 
            : 'text-white/60 hover:bg-white/5 hover:text-white'
          }`}
      >
        <div className="flex items-center gap-3">
          <span className={`transition-colors ${isActive ? 'text-[#C8A882]' : 'text-white/40 group-hover:text-white/60'}`}>
            {icon}
          </span>
          <span className="text-sm font-medium">{groupTitle}</span>
        </div>
        {isOpen ? 
          <ChevronDown size={16} className="text-white/40" /> : 
          <ChevronRight size={16} className="text-white/40" />
        }
      </button>

      {isOpen && (
        <div className="mt-1 ml-11 space-y-0.5 animate-in slide-in-from-left-2 duration-200">
          {routes.map((route) => {
            const active = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={`block px-3 py-2 rounded-lg text-xs transition-all duration-200
                  ${active
                    ? 'bg-[#C8A882]/10 text-[#C8A882]'
                    : 'text-white/40 hover:bg-white/5 hover:text-white/80'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-1 h-1 rounded-full ${active ? 'bg-[#C8A882]' : 'bg-white/20'}`} />
                  <span>{route.value}</span>
                </div>
                {route.description && (
                  <p className="text-[10px] text-white/20 mt-0.5 ml-3">
                    {route.description}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}