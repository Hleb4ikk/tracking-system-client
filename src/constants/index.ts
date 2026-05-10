export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Tracking System';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  COMPANY_ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  ORDERS: '/orders',
  ORDER_DETAILS: '/orders/:id',
  ORDER_CREATE: '/orders/new',
  ORDER_EDIT: '/orders/:id/edit',
  CARGOS: '/cargos',
  CARGO_DETAILS: '/cargos/:id',
  CARGO_CREATE: '/cargos/new',
  CARGO_EDIT: '/cargos/:id/edit',
  VEHICLES: '/vehicles',
  VEHICLE_DETAILS: '/vehicles/:id',
  VEHICLE_CREATE: '/vehicles/new',
  SUPPLY_CHAINS: '/supply-chains',
  SUPPLY_CHAIN_DETAILS: '/supply-chains/:id',
  SUPPLY_CHAIN_CREATE: '/supply-chains/new',
  SUPPLY_NODES: '/supply-nodes',
  SUPPLY_NODE_DETAILS: '/supply-nodes/:id',
  SUPPLY_NODE_CREATE: '/supply-nodes/new',
  RECEIVERS: '/receivers',
  RECEIVER_DETAILS: '/receivers/:id',
  RECEIVER_CREATE: '/receivers/new',
  COMPANY: '/company',
  COMPANY_TEAM: '/company/team',
  COMPANY_INVITATIONS: '/company/invitations',
  COMPANY_SETTINGS: '/company/settings',
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  PROFILE_SECURITY: '/profile/security',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
} as const;

export const CARGO_STATUS = {
  ASSEMBLY: 'assembly',
  ON_THE_WAY: 'on the way',
  DELAYED: 'delayed',
  DELIVERED: 'delivered',
} as const;

export const ROLES = {
  CO_FOUNDER: 'co-founder',
  LOGISTICIAN: 'logistician',
  EXPEDITOR: 'expeditor',
  COURIER: 'сourier',
} as const;

export const CARGO_STATUS_COLORS = {
  [CARGO_STATUS.ASSEMBLY]: 'blue',
  [CARGO_STATUS.ON_THE_WAY]: 'yellow',
  [CARGO_STATUS.DELAYED]: 'red',
  [CARGO_STATUS.DELIVERED]: 'green',
} as const;

export const ROLE_LABELS = {
  [ROLES.CO_FOUNDER]: 'Co-Founder',
  [ROLES.LOGISTICIAN]: 'Logistician',
  [ROLES.EXPEDITOR]: 'Expeditor',
  [ROLES.COURIER]: 'Courier',
} as const;
