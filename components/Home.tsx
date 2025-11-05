import React from 'react';
import { AppView, User } from '../types';
import { ClipboardListIcon, TruckIcon, SettingsIcon } from './icons';

interface HomeProps {
  onNavigate: (view: AppView) => void;
  currentUser: User | null;
}

const Home: React.FC<HomeProps> = ({ onNavigate, currentUser }) => {

  const NavCard: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
    color: 'blue' | 'green';
  }> = ({ title, description, icon, onClick, color }) => {
    const colorClasses = {
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/50',
        groupHoverBg: 'group-hover:bg-blue-200 dark:group-hover:bg-blue-900',
        text: 'text-blue-600 dark:text-blue-400'
      },
      green: {
        bg: 'bg-green-100 dark:bg-green-900/50',
        groupHoverBg: 'group-hover:bg-green-200 dark:group-hover:bg-green-900',
        text: 'text-green-600 dark:text-green-400'
      },
    };
    
    const selectedColor = colorClasses[color];

    return (
      <div
        onClick={onClick}
        className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
        role="button"
      >
        <div className="flex justify-center mb-6">
          <div className={`${selectedColor.bg} p-5 rounded-full ${selectedColor.groupHoverBg} transition-colors`}>
            {React.cloneElement(icon as React.ReactElement, { className: `w-12 h-12 ${selectedColor.text}` })}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</h2>
        <p className="text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    );
  };

  return (
    <div className="relative min-h-[calc(100vh-220px)] text-center">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Selamat Datang, {currentUser?.username}!</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
          Pilih menu di bawah ini untuk memulai.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <NavCard
            title="Input Kendaraan"
            description="Catat kendaraan keluar/masuk, lihat kendaraan dalam perjalanan, dan kelola riwayat."
            icon={<ClipboardListIcon />}
            onClick={() => onNavigate('inventory')}
            color="blue"
          />
          <NavCard
            title="Data Kendaraan"
            description="Kelola data master semua kendaraan, termasuk sopir, cabang, dan status."
            icon={<TruckIcon />}
            onClick={() => onNavigate('vehicleData')}
            color="green"
          />
        </div>
      </div>

      {/* Settings button - positioned at the bottom left, only for admin */}
      {currentUser?.username === 'admin' && (
        <button
          onClick={() => onNavigate('settings')}
          className="absolute bottom-0 left-0 flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white dark:bg-gray-700/80 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
          aria-label="Buka Pengaturan"
        >
          <SettingsIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="hidden sm:inline">Pengaturan</span>
        </button>
      )}
    </div>
  );
};

export default Home;