import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, LogOut, Settings } from 'lucide-react';
import { useAuthStore, useUIStore } from '../../stores';
import { useToast } from '../../hooks';
import { ROUTES, APP_NAME } from '../../constants';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const toast = useToast();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TS</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 hidden sm:block">
              {APP_NAME}
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user?.name} {user?.surname}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role || 'No role'}
                </p>
              </div>
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user?.name} {user?.surname}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        navigate(ROUTES.PROFILE);
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate(ROUTES.COMPANY_SETTINGS);
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                  </div>
                  <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
