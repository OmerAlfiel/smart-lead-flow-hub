
import React from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Sign in to your account to continue"
      type="login"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
