import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { router } from './routes';
import { ToastContainer, Drawer } from './components/ui';
import { useAuthStore, useUIStore } from './stores';

function App() {
  const { checkAuth, isInitialized } = useAuthStore();
  const { drawer, closeDrawer } = useUIStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
      
      {/* Global Drawer */}
      <Drawer
        isOpen={drawer.isOpen}
        onClose={closeDrawer}
        title={drawer.title}
        size={drawer.size}
        footer={drawer.footer}
      >
        {drawer.content}
      </Drawer>
    </>
  );
}

export default App;
