
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // This would be where Firebase logout happens
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    // Redirect to login page
    setTimeout(() => navigate('/login'), 1000);
  };

  return (
    <header className="bg-white border-b">
      <div className="flex justify-between items-center px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 flex justify-center md:justify-end">
          <div className="w-full max-w-lg lg:max-w-xs">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                placeholder="Search leads, contacts..."
                type="search"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 ml-4">
          <button
            type="button"
            className="relative p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          >
            <span className="sr-only">View notifications</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
          </button>
          
          <div className="relative">
            <div>
              <button
                type="button"
                className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                id="user-menu"
                aria-expanded="false"
                aria-haspopup="true"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>
            </div>
            
            {isOpen && (
              <div
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
              >
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Your Profile</Link>
                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Settings</Link>
                <Button onClick={handleLogout} variant="ghost" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Sign out</Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state. */}
      {isOpen && (
        <nav className="md:hidden border-t border-gray-200 pt-4 pb-3">
          <div className="px-4 space-y-1">
            <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">Dashboard</Link>
            <Link to="/leads" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">Leads</Link>
            <Link to="/analytics" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">Analytics</Link>
            <Link to="/tasks" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">Tasks</Link>
            <Link to="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">Settings</Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
