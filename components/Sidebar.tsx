

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, BarChart, X, BarChart3, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const navLinks = [
  { to: '/dashboard', icon: LayoutDashboard, text: 'Dashboard' },
  { to: '/transactions', icon: Wallet, text: 'Transactions' },
  { to: '/budget', icon: BarChart, text: 'Budget' },
];

const NavItem: React.FC<{ to: string; icon: LucideIcon; text: string; onClick: () => void, isCollapsed: boolean }> = ({ to, icon: Icon, text, onClick, isCollapsed }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center px-4 py-2 my-1 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'bg-slate-700 text-white'
          : 'text-slate-300 hover:bg-slate-800'
      } ${isCollapsed ? 'justify-center' : ''}`
    }
  >
    <Icon className={`h-5 w-5 ${!isCollapsed ? 'mr-3' : ''}`} />
    {!isCollapsed && text}
  </NavLink>
);

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen, isCollapsed, setIsCollapsed }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <div
        className={`fixed inset-y-0 left-0 bg-slate-900/80 backdrop-blur-md border-r border-slate-700/50 transform transition-all duration-300 ease-in-out z-30 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'w-20' : 'w-64'} lg:translate-x-0`}
      >
        <div className="relative flex items-center justify-between p-4 border-b border-slate-700/50 h-[65px]">
          {/* Logo/Title Section */}
          <div className="w-full flex items-center">
             {!isCollapsed && <h1 className="text-2xl font-bold text-white">KS|Design</h1>}
             {/* mx-auto will center this because the buttons are absolutely positioned */}
             {isCollapsed && <BarChart3 className="h-8 w-8 text-white mx-auto" />}
          </div>
          
          {/* Buttons Section (Absolutely Positioned) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-4 flex items-center">
            {/* Mobile close button */}
            <button onClick={() => setSidebarOpen(false)} className={`lg:hidden text-slate-400 ${!isCollapsed ? '' : 'hidden'}`}>
              <X className="h-6 w-6" />
            </button>
            {/* Desktop collapse/expand button */}
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:block text-slate-400 hover:text-white">
                {isCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
            </button>
          </div>
        </div>
        
        <nav className="p-4 flex-1">
          {navLinks.map((link) => (
            <NavItem key={link.to} {...link} onClick={() => setSidebarOpen(false)} isCollapsed={isCollapsed} />
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;