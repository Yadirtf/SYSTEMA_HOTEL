'use client';

import { Menu, X, Hotel } from 'lucide-react';
import { UserProfile } from '../ui/UserProfile';

interface HeaderProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  user: any;
  onToggleSidebar: () => void;
}

export const Header = ({ isSidebarOpen, isMobile, user, onToggleSidebar }: HeaderProps) => {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-[40]">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 text-slate-600 active:scale-90"
          aria-label={isSidebarOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isSidebarOpen && !isMobile ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
        
        {/* Logo visible solo en móvil cuando el sidebar está cerrado */}
        <div className="lg:hidden flex items-center gap-2">
          <Hotel className="h-5 w-5 text-slate-900" />
          <span className="font-bold text-slate-900 text-sm uppercase tracking-wider">LuxuryHotel</span>
        </div>
      </div>
      
      <UserProfile user={user} />
    </header>
  );
};

