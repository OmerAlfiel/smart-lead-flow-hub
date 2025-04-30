import api from '@/services/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const InitialSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    adminEmail: '',
    adminPassword: '',
    companyName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/initial-setup', formData);
      navigate('/login');
    } catch (error) {
      console.error('Setup failed:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Initial Setup</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="space-y-4">
          <div>
            <label htmlFor="companyName" className="block mb-1">Company Name</label>
            <input
              type="text"
              id="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="adminEmail" className="block mb-1">Admin Email</label>
            <input
              type="email"
              id="adminEmail"
              value={formData.adminEmail}
              onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="adminPassword" className="block mb-1">Admin Password</label>
            <input
              type="password"
              id="adminPassword"
              value={formData.adminPassword}
              onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white p-2 rounded hover:bg-primary/90"
          >
            Complete Setup
          </button>
        </div>
      </form>
    </div>
  );
};

export default InitialSetup;