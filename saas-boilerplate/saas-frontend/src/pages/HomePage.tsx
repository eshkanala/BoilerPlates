import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/login'); // Redirect if not authenticated
    }
  }, [auth.isAuthenticated, navigate]);

  if (!auth.isAuthenticated) {
    return null; // Or a loading spinner, as redirect happens in useEffect
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Welcome to your Dashboard, {auth.user?.name || 'User'}!</h2>
      {/* ... Dashboard content ... */}
      <button onClick={auth.logout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
        Logout
      </button>
    </div>
  );
};

export default DashboardPage;