import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { ROUTES } from '../../constants';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const routeLabels: Record<string, string> = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.ORDERS]: 'Orders',
  [ROUTES.CARGOS]: 'Cargos',
  [ROUTES.VEHICLES]: 'Vehicles',
  [ROUTES.SUPPLY_CHAINS]: 'Supply Chains',
  [ROUTES.SUPPLY_NODES]: 'Supply Nodes',
  [ROUTES.RECEIVERS]: 'Receivers',
  [ROUTES.COMPANY]: 'Company',
  [ROUTES.COMPANY_TEAM]: 'Team',
  [ROUTES.COMPANY_INVITATIONS]: 'Invitations',
  [ROUTES.COMPANY_SETTINGS]: 'Settings',
  [ROUTES.PROFILE]: 'Profile',
  [ROUTES.PROFILE_EDIT]: 'Edit Profile',
  [ROUTES.PROFILE_SECURITY]: 'Security',
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: ROUTES.DASHBOARD },
  ];

  let currentPath = '';
  pathnames.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = routeLabels[currentPath] || segment;
    breadcrumbs.push({ label, path: currentPath });
  });

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
            )}
            {isLast ? (
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1"
              >
                {index === 0 && <Home className="w-4 h-4" />}
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
