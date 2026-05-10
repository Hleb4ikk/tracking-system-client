import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { router } from './routes';
import { ToastContainer } from './components/ui';
import { useAuthStore } from './stores';

function App() {
  const { checkAuth, isInitialized } = useAuthStore();

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
    </>
  );
}

export default App;
