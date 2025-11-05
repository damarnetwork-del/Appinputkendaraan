import React from 'react';
import { AppView } from '../types';
import { ClipboardListIcon, TruckIcon } from './icons';

interface HomeProps {
  onNavigate: (view: AppView) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Selamat Datang, Admin!</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
        Pilih menu di bawah ini untuk memulai.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Card for Inventory */}
        <div
          onClick={() => onNavigate('inventory')}
          className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
          role="button"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-5 rounded-full group-hover:bg-blue-200 dark:group-hover:bg-blue-900 transition-colors">
              <ClipboardListIcon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Input Kendaraan</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Catat kendaraan yang keluar dan masuk, lihat daftar kendaraan yang sedang dalam perjalanan, dan kelola riwayat perjalanan.
          </p>
        </div>

        {/* Card for Vehicle Data */}
        <div
          onClick={() => onNavigate('vehicleData')}
          className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
          role="button"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 dark:bg-green-900/50 p-5 rounded-full group-hover:bg-green-200 dark:group-hover:bg-green-900 transition-colors">
              <TruckIcon className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Data Kendaraan</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Kelola data master semua kendaraan, termasuk nomor polisi, nama sopir, sub cabang, dan status kendaraan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
