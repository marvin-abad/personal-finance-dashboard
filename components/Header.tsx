import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';
import { Menu, User as UserIcon, LogOut, Edit } from 'lucide-react';
import { Modal } from './ui/Modal';
import ProfileForm from './ProfileForm';

interface HeaderProps {
    setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="flex items-center justify-between p-4 bg-transparent h-[65px]">
        <div className="flex items-center">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-400 focus:outline-none lg:hidden mr-4">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-slate-200">{getPageTitle()}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(prev => !prev)} className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-600 text-white flex items-center justify-center font-bold">
                    {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
                  </div>
                  <span className="hidden md:block text-slate-300">{user?.firstName} {user?.lastName}</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-md shadow-lg z-10 animate-fade-in-up">
                    <button 
                      onClick={() => { setIsProfileModalOpen(true); setIsDropdownOpen(false); }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                    >
                      <Edit size={16} className="mr-2" />
                      Edit Profile
                    </button>
                    <button onClick={logout} className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                </div>
              )}
          </div>
        </div>
      </header>
       {isProfileModalOpen && (
        <Modal onClose={() => setIsProfileModalOpen(false)}>
          <ProfileForm onClose={() => setIsProfileModalOpen(false)} />
        </Modal>
      )}
    </>
  );
};

export default Header;