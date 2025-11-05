import React, { useState, FormEvent, useEffect } from 'react';
import { LogoutIcon } from './icons';
import { formatToDateTimeLocal } from '../utils/time';
import { Vehicle } from '../types';

interface VehicleCheckOutFormProps {
  onVehicleExit: (licensePlate: string, entryTime: Date, entryKm: number, purpose:string) => void;
  availableVehicles: Vehicle[];
}

const VehicleCheckOutForm: React.FC<VehicleCheckOutFormProps> = ({ onVehicleExit, availableVehicles }) => {
  const [licensePlate, setLicensePlate] = useState('');
  const [exitTime, setExitTime] = useState(formatToDateTimeLocal(new Date()));
  const [exitKm, setExitKm] = useState('');
  const [purpose, setPurpose] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (availableVehicles.length === 0 || !licensePlate) {
        alert("Tidak ada kendaraan yang tersedia untuk memulai perjalanan.");
        return;
    }
     if (!exitKm.trim()) {
      alert('KM keluar tidak boleh kosong.');
      return;
    }
    const km = parseInt(exitKm, 10);
    if (isNaN(km) || km < 0) {
        alert('KM keluar harus berupa angka positif.');
        return;
    }
    if (!purpose.trim()) {
      alert('Tujuan/keterangan tidak boleh kosong.');
      return;
    }
    if (!exitTime) {
      alert("Jam keluar tidak boleh kosong.");
      return;
    }
    onVehicleExit(licensePlate, new Date(exitTime), km, purpose);
    setExitTime(formatToDateTimeLocal(new Date()));
    setExitKm('');
    setPurpose('');
  };

  // Set default selection when list changes
  useEffect(() => {
    if (availableVehicles.length > 0) {
        setLicensePlate(availableVehicles[0].licensePlate);
    } else {
        setLicensePlate('');
    }
  }, [availableVehicles]);


  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Catat Kendaraan Keluar</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="checkoutLicensePlate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nomor Polisi
          </label>
          <select
            id="checkoutLicensePlate"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            required
            disabled={availableVehicles.length === 0}
            className="mt-1 w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent dark:focus:ring-blue-500 dark:text-gray-200 disabled:bg-gray-200 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {availableVehicles.length === 0 ? (
                <option value="">Semua kendaraan sedang dalam perjalanan</option>
            ) : (
                availableVehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.licensePlate}>
                    {vehicle.licensePlate} - {vehicle.driverName}
                  </option>
                ))
            )}
          </select>
        </div>
        <div>
          <label htmlFor="exitKm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            KM Keluar
          </label>
          <input
            type="number"
            id="exitKm"
            value={exitKm}
            onChange={(e) => setExitKm(e.target.value)}
            placeholder="e.g. 50100"
            required
            min="0"
            disabled={availableVehicles.length === 0}
            className="mt-1 w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent dark:focus:ring-blue-500 dark:text-gray-200 disabled:bg-gray-200 dark:disabled:bg-gray-600"
          />
        </div>
        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tujuan / Keterangan
          </label>
          <input
            type="text"
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g. Pengiriman ke Depok"
            required
            disabled={availableVehicles.length === 0}
            className="mt-1 w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent dark:focus:ring-blue-500 dark:text-gray-200 disabled:bg-gray-200 dark:disabled:bg-gray-600"
          />
        </div>
        <div>
           <label htmlFor="exitTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Jam Keluar
          </label>
          <input
            type="datetime-local"
            id="exitTime"
            value={exitTime}
            onChange={(e) => setExitTime(e.target.value)}
            required
            disabled={availableVehicles.length === 0}
            className="mt-1 w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent dark:focus:ring-blue-500 dark:text-gray-200 disabled:bg-gray-200 dark:disabled:bg-gray-600"
          />
        </div>
        <button
          type="submit"
          disabled={availableVehicles.length === 0}
          className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-md shadow-md hover:from-red-600 hover:to-red-700 hover:shadow-lg transform hover:-translate-y-px transition-all duration-200 disabled:from-red-300 disabled:to-red-400 disabled:cursor-not-allowed"
        >
          <LogoutIcon className="w-5 h-5 mr-2" />
          Catat Keluar
        </button>
      </form>
    </div>
  );
};

export default VehicleCheckOutForm;