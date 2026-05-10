import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface Modal {
  id: string;
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
}

interface DrawerState {
  isOpen: boolean;
  title: string;
  content: React.ReactNode | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
}

interface UIState {
  toasts: Toast[];
  modals: Modal[];
  isSidebarOpen: boolean;
  drawer: DrawerState;
  
  // Toast actions
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Modal actions
  openModal: (modal: Omit<Modal, 'isOpen'>) => void;
  closeModal: (id: string) => void;
  
  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  
  // Drawer actions
  openDrawer: (config: Omit<DrawerState, 'isOpen'>) => void;
  closeDrawer: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  modals: [],
  isSidebarOpen: window.innerWidth >= 1024, // Open by default on desktop
  drawer: {
    isOpen: false,
    title: '',
    content: null,
    size: 'md',
  },

  addToast: (toast) => {
    const id = Math.random().toString(36).substring(7);
    const newToast = { ...toast, id };
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, toast.duration || 5000);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  openModal: (modal) => {
    set((state) => ({
      modals: [...state.modals, { ...modal, isOpen: true }],
    }));
  },

  closeModal: (id) => {
    set((state) => ({
      modals: state.modals.filter((m) => m.id !== id),
    }));
  },

  toggleSidebar: () => {
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
    }));
  },

  setSidebarOpen: (isOpen) => {
    set({ isSidebarOpen: isOpen });
  },

  openDrawer: (config) => {
    set({
      drawer: {
        ...config,
        isOpen: true,
      },
    });
  },

  closeDrawer: () => {
    set((state) => ({
      drawer: {
        ...state.drawer,
        isOpen: false,
      },
    }));
    // Clear content after animation
    setTimeout(() => {
      set({
        drawer: {
          isOpen: false,
          title: '',
          content: null,
          size: 'md',
        },
      });
    }, 300);
  },
}));
