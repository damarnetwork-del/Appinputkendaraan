import React from 'react';
import { CarIcon, LogoutIcon } from './icons';
import { AppView, User } from '../types';

interface HeaderProps {
  setCurrentView: (view: AppView) => void;
  onLogout: () => void;
  currentView: AppView;
  currentUser: User | null;
}

export const Header: React.FC<HeaderProps> = ({ setCurrentView, onLogout, currentView, currentUser }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Logo and App Title */}
        <div 
          className="flex items-center cursor-pointer group"
          onClick={() => setCurrentView('home')}
          role="button"
          aria-label="Kembali ke halaman utama"
        >
          <CarIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3 group-hover:animate-pulse" />
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
            Inventaris Kendaraan
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {currentUser && (
            <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
              Halo, <strong className="font-medium">{currentUser.username}</strong>
            </span>
          )}

          {/* Logout button - Only shows on home view */}
          {currentView === 'home' && (
            <button 
              onClick={onLogout} 
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900 transition-colors transform hover:scale-105"
              aria-label="Keluar"
            >
              <LogoutIcon className="w-5 h-5 mr-2" />
              Keluar
            </button>
          )}
        </div>
      </div>
    </header>
  );
};