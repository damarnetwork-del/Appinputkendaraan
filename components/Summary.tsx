import React from 'react';
import { TrendingUpIcon, TruckIcon, ClipboardListIcon } from './icons';

interface SummaryProps {
  vehiclesOutToday: number;
  vehiclesOnTrip: number;
  totalRegisteredVehicles: number;
}

const SummaryCard: React.FC<{ icon: React.ReactNode; value: number; label: string; color: string }> = ({ icon, value, label, color }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex items-center gap-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl border border-gray-200 dark:border-gray-700">
    <div className={`p-4 rounded-full ${color} shadow-lg`}>
      {icon}
    </div>
    <div>
      <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

const Summary: React.FC<SummaryProps> = ({ vehiclesOutToday, vehiclesOnTrip, totalRegisteredVehicles }) => {
  return (
    <div>
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Dashboard</h2>
      <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">Tinjauan cepat aktivitas kendaraan hari ini.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard 
          icon={<TrendingUpIcon className="w-8 h-8 text-white" />}
          value={vehiclesOutToday}
          label="Keluar Hari Ini"
          color="bg-green-500"
        />
        <SummaryCard 
          icon={<TruckIcon className="w-8 h-8 text-white" />}
          value={vehiclesOnTrip}
          label="Dalam Perjalanan"
          color="bg-yellow-500"
        />
        <SummaryCard 
          icon={<ClipboardListIcon className="w-8 h-8 text-white" />}
          value={totalRegisteredVehicles}
          label="Total Terdaftar"
          color="bg-blue-500"
        />
      </div>
    </div>
  );
};

export default Summary;