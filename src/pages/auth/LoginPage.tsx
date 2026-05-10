import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import { useAuthStore } from '../../stores';
import { useToast } from '../../hooks';
import { loginSchema, LoginFormData } from '../../schemas';
import { Button, Input, Card, CardContent } from '../../components/ui';
import { ROUTES } from '../../constants';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, toast, clearError]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      toast.success('Successfully logged in!');
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                to={ROUTES.REGISTER}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
