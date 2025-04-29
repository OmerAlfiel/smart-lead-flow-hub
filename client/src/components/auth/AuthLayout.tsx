
import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  type: 'login' | 'signup' | 'reset';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  type 
}) => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <svg 
              className="h-10 w-10 text-brand-600" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M18 8C18 12.4183 14.4183 16 10 16C5.58172 16 2 12.4183 2 8C2 3.58172 5.58172 0 10 0C14.4183 0 18 3.58172 18 8Z" 
                fill="currentColor" 
              />
              <path 
                d="M22 19C22 21.7614 19.7614 24 17 24C14.2386 24 12 21.7614 12 19C12 16.2386 14.2386 14 17 14C19.7614 14 22 16.2386 22 19Z" 
                fill="currentColor" 
                fillOpacity="0.7" 
              />
              <path 
                d="M7 14C7 17.866 3.86599 21 0 21L0 14H7Z" 
                fill="currentColor" 
                fillOpacity="0.5" 
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900">Smart Lead Flow Hub</h2>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{title}</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>

        <div className="mt-4 text-center text-sm">
          {type === 'login' && (
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-brand-600 hover:text-brand-500">
                Sign up
              </Link>
            </p>
          )}
          {type === 'signup' && (
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500">
                Log in
              </Link>
            </p>
          )}
          {type === 'reset' && (
            <p className="text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500">
                Log in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
