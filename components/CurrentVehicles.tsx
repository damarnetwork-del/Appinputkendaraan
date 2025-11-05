import React from 'react';
import { VehicleLog, Vehicle, VehicleStatus } from '../types';
import { formatDateTime } from '../utils/time';
import { ClockIcon, TachometerIcon, MapPinIcon, UserIcon, TruckIcon } from './icons';

interface CurrentVehiclesProps {
  vehiclesOnTrip: VehicleLog[];
  masterVehicles: Vehicle[];
}

const CurrentVehicles: React.FC<CurrentVehiclesProps> = ({ vehiclesOnTrip, masterVehicles }) => {
  const vehicleDetailsMap = new Map<string, Vehicle>(masterVehicles.map(v => [v.licensePlate, v]));

  const getStatusChipClasses = (status?: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.Delivery:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case VehicleStatus.SalesVan:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Kendaraan Dalam Perjalanan</h2>
      <div className="max-h-[34rem] overflow-y-auto pr-2 -mr-2">
        {vehiclesOnTrip.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <TruckIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Tidak ada kendaraan dalam perjalanan.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Semua kendaraan berada di garasi.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {vehiclesOnTrip.map((log) => {
              const vehicleDetails = vehicleDetailsMap.get(log.licensePlate);
              return (
                <li key={log.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className={`border-l-4 ${vehicleDetails?.status === VehicleStatus.SalesVan ? 'border-green-500' : 'border-blue-500'} p-4 flex flex-col gap-3`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-lg text-gray-800 dark:text-gray-100 tracking-wider">{log.licensePlate}</p>
                         {vehicleDetails?.driverName && (
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <UserIcon className="w-4 h-4 mr-2" />
                            <span>{vehicleDetails.driverName}</span>
                          </div>
                        )}
                      </div>
                      {vehicleDetails?.status && (
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusChipClasses(vehicleDetails.status)}`}>
                          {vehicleDetails.status}
                        </span>
                      )}
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-2 text-sm">
                      {log.purpose && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <MapPinIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>{log.purpose}</span>
                        </div>
                      )}
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <ClockIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>Keluar: {formatDateTime(log.entryTime)}</span>
                      </div>
                      {typeof log.entryKm === 'number' && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <TachometerIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>KM Keluar: {log.entryKm.toLocaleString('id-ID')} km</span>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CurrentVehicles;