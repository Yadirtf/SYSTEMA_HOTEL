'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // 1. Detectar tamaño de pantalla para comportamiento responsivo
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false); // Cerrar sidebar por defecto en móvil
      else setIsSidebarOpen(true); // Abrir por defecto en escritorio
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Cargar información de usuario
  useEffect(() => {
    const userInfo = localStorage.getItem('user_info');
    if (!userInfo) {
      router.push('/');
    } else {
      setUser(JSON.parse(userInfo));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    router.push('/');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-x-hidden">
      {/* Componente Sidebar Refactorizado */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        isMobile={isMobile} 
        user={user} 
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main 
        className="flex-1 flex flex-col min-h-screen transition-all duration-300 ease-[0.16, 1, 0.3, 1] min-w-0"
        style={{ 
          paddingLeft: !isMobile ? (isSidebarOpen ? 280 : 80) : 0 
        }}
      >
        {/* Componente Header Refactorizado */}
        <Header 
          isSidebarOpen={isSidebarOpen}
          isMobile={isMobile}
          user={user}
          onToggleSidebar={toggleSidebar}
        />

        {/* Content Body */}
        <div className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full flex-1 min-w-0">
          {children}
        </div>

        {/* Footer sutil */}
        <footer className="p-6 text-center text-[10px] text-slate-300 uppercase tracking-[0.3em] font-bold border-t border-slate-100">
          LuxuryHotel Management Suite &bull; &copy; {new Date().getFullYear()}
        </footer>
      </main>
    </div>
  );
};
