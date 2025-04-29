
import React from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import SignupForm from '@/components/auth/SignupForm';

const Signup: React.FC = () => {
  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Sign up to get started with Smart Lead Flow Hub"
      type="signup"
    >
      <SignupForm />
    </AuthLayout>
  );
};

export default Signup;
