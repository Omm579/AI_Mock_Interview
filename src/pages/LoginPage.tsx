import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAppContext } from '../context/AppContext';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAppContext();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center bg-gray-50 py-12">
      <div className="container-custom">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;