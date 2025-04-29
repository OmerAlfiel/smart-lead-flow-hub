
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems: SidebarItem[] = [
    {
      label: 'Dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      ),
      href: '/dashboard',
    },
    {
      label: 'Leads',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      href: '/leads',
    },
    {
      label: 'Analytics',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      href: '/analytics',
    },
    {
      label: 'Tasks',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      ),
      href: '/tasks',
    },
    {
      label: 'Settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      ),
      href: '/settings',
    },
  ];

  return (
    <aside className="w-64 bg-white border-r hidden md:block">
      <div className="flex items-center justify-center h-16 border-b">
        <div className="flex items-center space-x-2">
          <svg 
            className="h-8 w-8 text-brand-600" 
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
          <h2 className="text-lg font-bold text-gray-900">Smart Lead Flow</h2>
        </div>
      </div>
      <nav className="mt-6 px-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full",
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <span className={cn(
                  "mr-3 flex-shrink-0",
                  isActive ? "text-brand-600" : "text-gray-400 group-hover:text-gray-500"
                )}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
