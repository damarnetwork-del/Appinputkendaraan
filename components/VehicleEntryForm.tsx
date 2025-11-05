import React, { useState, FormEvent, useEffect } from 'react';
import { VehicleLog } from '../types';
import { formatToDateTimeLocal } from '../utils/time';
import { LoginIcon } from './icons';

interface VehicleEntryFormProps {
  onVehicleEnter: (licensePlate: string, exitTime: Date, exitKm: number) => void;
  vehiclesOnTrip: VehicleLog[];
}

const VehicleEntryForm: React.FC<VehicleEntryFormProps> = ({ onVehicleEnter, vehiclesOnTrip }) => {
  const [licensePlate, setLicensePlate] = useState('');
  const [entryTime, setEntryTime] = useState(formatToDateTimeLocal(new Date()));
  const [entryKm, setEntryKm] = useState('');

  useEffect(() => {
    if (vehiclesOnTrip.length > 0) {
      setLicensePlate(vehiclesOnTrip[0].licensePlate);
    } else {
      setLicensePlate('');
    }
  }, [vehiclesOnTrip]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (vehiclesOnTrip.length === 0 || !licensePlate) {
      alert('Tidak ada kendaraan dalam perjalanan untuk dicatat masuk.');
      return;
    }
    if (!entryKm.trim()) {
      alert('KM masuk tidak boleh kosong.');
      return;
    }
    const km = parseInt(entryKm, 10);
    if (isNaN(km) || km < 0) {
      alert('KM masuk harus berupa angka positif.');
      return;
    }
    if (!entryTime) {
      alert('Jam masuk tidak boleh kosong.');
      return;
    }
    onVehicleEnter(licensePlate, new Date(entryTime), km);
    setEntryTime(formatToDateTimeLocal(new Date()));
    setEntryKm('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Catat Kendaraan Masuk</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nomor Polisi
          </label>
          <select
            id="licensePlate"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            required
            disabled={vehiclesOnTrip.length === 0}
            className="mt-1 w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent dark:focus:ring-blue-500 dark:text-gray-200 disabled:bg-gray-200 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {vehiclesOnTrip.length === 0 ? (
              <option value="">Semua kendaraan ada di dalam</option>
            ) : (
              vehiclesOnTrip.map(v => <option key={v.id} value={v.licensePlate}>{v.licensePlate}</option>)
            )}
          </select>
        </div>
        <div>
          <label htmlFor="entryKm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            KM Masuk
          </label>
          <input
            type="number"
            id="entryKm"
            value={entryKm}
            onChange={(e) => setEntryKm(e.target.value)}
            placeholder="e.g. 50000"
            required
            min="0"
            disabled={vehiclesOnTrip.length === 0}
            className="mt-1 w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent dark:focus:ring-blue-500 dark:text-gray-200 disabled:bg-gray-200 dark:disabled:bg-gray-600"
          />
        </div>
        <div>
           <label htmlFor="entryTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Jam Masuk
          </label>
          <input
            type="datetime-local"
            id="entryTime"
            value={entryTime}
            onChange={(e) => setEntryTime(e.target.value)}
            required
            disabled={vehiclesOnTrip.length === 0}
            className="mt-1 w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent dark:focus:ring-blue-500 dark:text-gray-200 disabled:bg-gray-200 dark:disabled:bg-gray-600"
          />
        </div>
        <button
          type="submit"
          disabled={vehiclesOnTrip.length === 0}
          className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-md shadow-md hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transform hover:-translate-y-px transition-all duration-200 disabled:from-blue-300 disabled:to-blue-400 disabled:cursor-not-allowed"
        >
          <LoginIcon className="w-5 h-5 mr-2" />
          Catat Masuk
        </button>
      </form>
    </div>
  );
};

export default VehicleEntryForm;