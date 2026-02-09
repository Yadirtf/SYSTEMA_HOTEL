'use client';

import {
  Users,
  LayoutDashboard,
  Hotel,
  LogOut,
  X,
  User as UserIcon,
  ChevronRight,
  Layers,
  ShieldCheck,
  ShoppingBag,
  History,
  Tag,
  ChevronDown,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/shared/utils';

import { LucideIcon } from 'lucide-react';
import { SessionUser } from '@/presentation/types/SessionUser';

interface MenuItem {
  name: string;
  icon: LucideIcon;
  href?: string;
  roles?: string[];
  submenu?: { name: string; href: string; roles?: string[] }[];
}

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  user: SessionUser | null;
  onClose: () => void;
  onLogout: () => void;
}

export const Sidebar = ({ isOpen, isMobile, user, onClose, onLogout }: SidebarProps) => {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const menuItems: MenuItem[] = [
    { name: 'Resumen', icon: LayoutDashboard, href: '/dashboard' },
    {
      name: 'Habitaciones',
      icon: Hotel,
      submenu: [
        { name: 'Inventario', href: '/rooms' },
        { name: 'Pisos', href: '/floors', roles: ['ADMIN'] },
        { name: 'Categorías', href: '/room-types', roles: ['ADMIN'] },
      ]
    },
    {
      name: 'Tienda',
      icon: ShoppingBag,
      submenu: [
        { name: 'Catálogo', href: '/products' },
        { name: 'Ventas', href: '/sales' },
        { name: 'Kardex', href: '/kardex' },
        { name: 'Configuración', href: '/store-settings', roles: ['ADMIN'] },
      ]
    },
    { name: 'Personal', icon: Users, href: '/users', roles: ['ADMIN'] },
  ];

  // Auto-abrir menús basados en la ruta actual
  useEffect(() => {
    const currentMenu = menuItems.find(item =>
      item.submenu?.some(sub => pathname === sub.href)
    );
    if (currentMenu) {
      setOpenMenus(prev => ({ ...prev, [currentMenu.name]: true }));
    }
  }, [pathname]);

  const toggleSubmenu = (name: string) => {
    setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const filteredMenu = menuItems.filter(item =>
    !item.roles || (user && item.roles.includes(user.role))
  );

  const sidebarVariants: any = {
    open: {
      width: 280,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    closed: {
      width: isMobile ? 0 : 80,
      x: isMobile ? -280 : 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <>
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={cn(
          "fixed inset-y-0 left-0 bg-slate-900 text-white z-[70] flex flex-col shadow-2xl overflow-hidden",
          isMobile && "w-[280px]"
        )}
      >
        <div className="p-6 flex items-center justify-between h-20 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl shrink-0">
              <Hotel className="h-6 w-6 text-white" />
            </div>
            {(isOpen || isMobile) && (
              <span className="font-bold tracking-tight text-lg">LuxuryHotel</span>
            )}
          </div>
          {isMobile && (
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
          {filteredMenu.map((item) => {
            const isMenuOpen = openMenus[item.name];
            const hasSubmenu = !!item.submenu;
            const isActive = pathname === item.href || item.submenu?.some(sub => pathname === sub.href);

            return (
              <div key={item.name} className="space-y-1">
                {item.href ? (
                  <Link href={item.href} onClick={() => isMobile && onClose()}>
                    <div className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group cursor-pointer",
                      pathname === item.href ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}>
                      <item.icon className={cn("h-5 w-5 shrink-0", pathname === item.href ? "text-white" : "text-slate-500 group-hover:text-white")} />
                      {(isOpen || isMobile) && <span className="text-sm font-medium flex-1 truncate">{item.name}</span>}
                    </div>
                  </Link>
                ) : (
                  <div
                    onClick={() => toggleSubmenu(item.name)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group cursor-pointer",
                      isActive ? "text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "text-slate-500 group-hover:text-white")} />
                    {(isOpen || isMobile) && (
                      <>
                        <span className="text-sm font-medium flex-1 truncate">{item.name}</span>
                        <ChevronDown className={cn("h-4 w-4 transition-transform", isMenuOpen && "rotate-180")} />
                      </>
                    )}
                  </div>
                )}

                {/* SUBMENU */}
                <AnimatePresence>
                  {hasSubmenu && isMenuOpen && (isOpen || isMobile) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-11 pr-2 space-y-1"
                    >
                      {item.submenu?.filter(sub => !sub.roles || (user && sub.roles.includes(user.role))).map((sub) => (
                        <Link key={sub.href} href={sub.href} onClick={() => isMobile && onClose()}>
                          <div className={cn(
                            "px-3 py-2 rounded-lg text-xs font-medium transition-all",
                            pathname === sub.href ? "bg-white/5 text-white" : "text-slate-500 hover:text-slate-200"
                          )}>
                            {sub.name}
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-3 bg-slate-900/50 backdrop-blur-md">
          {(isOpen || isMobile) && (
            <div className="px-3 py-3 bg-white/5 rounded-2xl flex items-center gap-3 border border-white/5">
              <div className="bg-slate-700 h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border border-white/10">
                <UserIcon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold truncate uppercase tracking-widest text-slate-500">{user?.role}</p>
                <p className="text-xs font-medium text-slate-200 truncate">{user?.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all group"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {(isOpen || isMobile) && <span className="text-sm font-medium">Cerrar Sesión</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
};
