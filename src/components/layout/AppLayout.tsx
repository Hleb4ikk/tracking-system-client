import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useUIStore } from '../../stores';

export const AppLayout: React.FC = () => {
  const { isSidebarOpen } = useUIStore();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main
          className={`
            flex-1 transition-all duration-300
            ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}
          `}
        >
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
