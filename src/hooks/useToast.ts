import { useUIStore } from '../stores';

export const useToast = () => {
  const { addToast } = useUIStore();

  return {
    success: (message: string, duration?: number) => {
      addToast({ message, type: 'success', duration });
    },
    error: (message: string, duration?: number) => {
      addToast({ message, type: 'error', duration });
    },
    warning: (message: string, duration?: number) => {
      addToast({ message, type: 'warning', duration });
    },
    info: (message: string, duration?: number) => {
      addToast({ message, type: 'info', duration });
    },
  };
};
