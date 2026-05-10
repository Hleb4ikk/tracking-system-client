import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { useAuthStore } from '../../stores';
import { useToast } from '../../hooks';
import { registerSchema, RegisterFormData } from '../../schemas';
import { Button, Input, Card, CardContent } from '../../components/ui';
import { ROUTES } from '../../constants';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
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

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);
      toast.success('Account created successfully!');
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      // Error handled by store and useEffect
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
              <UserPlus className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Sign up to get started with Tracking System
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Username"
              type="text"
              placeholder="user72674"
              error={errors.username?.message}
              {...register('username')}
            />
            <Input
              label="First Name"
              type="text"
              placeholder="John"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Last Name"
              type="text"
              placeholder="Doe"
              error={errors.surname?.message}
              {...register('surname')}
            />

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
              helperText="At least 6 characters"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to={ROUTES.LOGIN}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
