import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  MapPin,
  Building2,
  UserCircle,
  ShoppingCart,
  Network,
  X,
} from 'lucide-react';
import { useAuthStore, useUIStore } from '../../stores';
import { ROUTES, ROLES } from '../../constants';
import { useBreakpoint } from '../../hooks';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles?: string[];
}

const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: 'Orders',
    path: ROUTES.ORDERS,
    icon: <ShoppingCart className="w-5 h-5" />,
    roles: [ROLES.CO_FOUNDER, ROLES.LOGISTICIAN, ROLES.EXPEDITOR],
  },
  {
    label: 'Cargos',
    path: ROUTES.CARGOS,
    icon: <Package className="w-5 h-5" />,
    roles: [ROLES.CO_FOUNDER, ROLES.LOGISTICIAN, ROLES.EXPEDITOR],
  },
  {
    label: 'Vehicles',
    path: ROUTES.VEHICLES,
    icon: <Truck className="w-5 h-5" />,
    roles: [ROLES.CO_FOUNDER, ROLES.LOGISTICIAN, ROLES.EXPEDITOR],
  },
  {
    label: 'Supply Chains',
    path: ROUTES.SUPPLY_CHAINS,
    icon: <Network className="w-5 h-5" />,
    roles: [ROLES.CO_FOUNDER, ROLES.LOGISTICIAN],
  },
  {
    label: 'Supply Nodes',
    path: ROUTES.SUPPLY_NODES,
    icon: <MapPin className="w-5 h-5" />,
    roles: [ROLES.CO_FOUNDER, ROLES.LOGISTICIAN],
  },
  {
    label: 'Receivers',
    path: ROUTES.RECEIVERS,
    icon: <UserCircle className="w-5 h-5" />,
    roles: [ROLES.CO_FOUNDER, ROLES.LOGISTICIAN],
  },
  {
    label: 'Company',
    path: ROUTES.COMPANY,
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    label: 'Team',
    path: ROUTES.COMPANY_TEAM,
    icon: <Users className="w-5 h-5" />,
    roles: [ROLES.CO_FOUNDER],
  },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();
  const { isSidebarOpen, setSidebarOpen } = useUIStore();

  const {isDesktop} = useBreakpoint();

  useEffect(()=> {

    if(isDesktop){
      setSidebarOpen(true)
    }

  },[isDesktop])

  const hasAccess = (roles?: string[]) => {
    if (!roles || roles.length === 0) return true;
    if (!user?.role) return false;
    return roles.includes(user.role);
  };
  const filteredItems = navigationItems.filter((item) => hasAccess(item.roles));


  return (
    <>
      <aside
        className={`
          fixed top-16 left-0 z-40 h-[calc(100vh-4rem)]
          w-64 bg-white dark:bg-gray-800
          border-r border-gray-200 dark:border-gray-700
          transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <nav className="pl-2 pr-12 py-4 lg:px-4 space-y-1 overflow-y-auto h-full">
          {filteredItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {!isDesktop && setSidebarOpen(false)}}
              className={({ isActive }) =>
                `
                flex items-start gap-3 px-3 py-2 rounded-lg
                transition-colors duration-200
                ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `
              }
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};
