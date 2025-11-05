import React, { useState } from 'react';
import { VehicleLog, Vehicle, VehicleStatus } from '../types';
import { formatDateTime, calculateDuration } from '../utils/time';
import { exportToCSV } from '../utils/csv';
import { exportToPDF } from '../utils/pdf';
import { TachometerIcon, TimeDurationIcon, ExportIcon, PdfIcon, SearchIcon, RefreshIcon } from './icons';

interface VehicleHistoryProps {
  history: VehicleLog[];
  vehicles: Vehicle[];
}

const VehicleHistory: React.FC<VehicleHistoryProps> = ({ history, vehicles }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const vehicleDetailsMap = new Map<string, Vehicle>(vehicles.map(v => [v.licensePlate, v]));

  const resetFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setStatusFilter('');
  };

  const filteredHistory = history.filter(log => {
    const vehicleDetails = vehicleDetailsMap.get(log.licensePlate);

    // Filter by search term (license plate)
    if (searchTerm && !log.licensePlate.toLowerCase().includes(searchTerm.toLowerCase().trim())) {
      return false;
    }

    // Filter by date range (entryTime)
    if (startDate) {
      const logDate = log.entryTime;
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // Set to start of the day
      if (logDate < start) return false;
    }
    if (endDate) {
      const logDate = log.entryTime;
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Set to end of the day
      if (logDate > end) return false;
    }

    // Filter by status
    if (statusFilter && (!vehicleDetails || vehicleDetails.status !== statusFilter)) {
      return false;
    }

    return true;
  });

  const handleExportCsv = () => {
    const dataToExport = filteredHistory.map(log => {
      const details = vehicleDetailsMap.get(log.licensePlate);
      const distance = (typeof log.exitKm === 'number' && typeof log.entryKm === 'number')
        ? log.exitKm - log.entryKm
        : null;
      const duration = log.exitTime ? calculateDuration(log.entryTime, log.exitTime) : '-';

      return {
        licensePlate: log.licensePlate,
        subBranch: details?.subBranch || '-',
        driverName: details?.driverName || '-',
        status: details?.status || '-',
        entryTime: formatDateTime(log.entryTime),
        exitTime: log.exitTime ? formatDateTime(log.exitTime) : '-',
        entryKm: log.entryKm ?? '-',
        exitKm: log.exitKm ?? '-',
        distance: distance !== null ? distance : '-',
        duration: duration,
        purpose: log.purpose || '-',
      };
    });

    const headers = {
      licensePlate: 'No. Polisi',
      subBranch: 'Sub Cabang',
      driverName: 'Nama Sopir',
      status: 'Status',
      entryTime: 'Waktu Keluar (Trip)',
      exitTime: 'Waktu Masuk (Trip)',
      entryKm: 'KM Keluar',
      exitKm: 'KM Masuk',
      distance: 'Jarak (KM)',
      duration: 'Durasi',
      purpose: 'Tujuan',
    };

    exportToCSV(dataToExport, headers, 'riwayat_kendaraan.csv');
  };
  
  const handleExportPdf = () => {
    const title = 'Riwayat Kendaraan';
    const head = [[
      'No. Polisi',
      'Sub Cabang',
      'Nama Sopir',
      'Status',
      'Waktu Keluar (Trip)',
      'Waktu Masuk (Trip)',
      'KM Keluar',
      'KM Masuk',
      'Jarak (KM)',
      'Durasi',
      'Tujuan'
    ]];
    
    const body = filteredHistory.map(log => {
      const details = vehicleDetailsMap.get(log.licensePlate);
      const distance = (typeof log.exitKm === 'number' && typeof log.entryKm === 'number')
        ? log.exitKm - log.entryKm
        : '-';
      const duration = log.exitTime ? calculateDuration(log.entryTime, log.exitTime) : '-';
      
      return [
        log.licensePlate,
        details?.subBranch || '-',
        details?.driverName || '-',
        details?.status || '-',
        formatDateTime(log.entryTime),
        log.exitTime ? formatDateTime(log.exitTime) : '-',
        log.entryKm?.toLocaleString('id-ID') ?? '-',
        log.exitKm?.toLocaleString('id-ID') ?? '-',
        distance !== '-' ? distance.toLocaleString('id-ID') : '-',
        duration,
        log.purpose || '-',
      ];
    });

    exportToPDF(head, body, title, 'riwayat_kendaraan.pdf');
  };


  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Riwayat Kendaraan</h2>
        <div className="flex items-center gap-2">
           <button
            onClick={handleExportCsv}
            disabled={filteredHistory.length === 0}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ExportIcon className="w-4 h-4 mr-2" />
            CSV
          </button>
           <button
            onClick={handleExportPdf}
            disabled={filteredHistory.length === 0}
            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PdfIcon className="w-4 h-4 mr-2" />
            PDF
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="relative md:col-span-2 lg:col-span-2">
          <label htmlFor="search" className="sr-only">Cari No. Polisi</label>
          <input
            type="text"
            id="search"
            placeholder="Cari No. Polisi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:text-gray-200"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <div>
          <label htmlFor="startDate" className="sr-only">Tanggal Mulai</label>
           <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:text-gray-200"
            aria-label="Tanggal Mulai"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="sr-only">Tanggal Selesai</label>
           <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:text-gray-200"
            aria-label="Tanggal Selesai"
          />
        </div>
        <div className="flex flex-col md:flex-row md:col-span-2 lg:col-span-1 lg:flex-col gap-4">
          <div className="flex-grow">
            <label htmlFor="statusFilter" className="sr-only">Status Kendaraan</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:text-gray-200"
            >
              <option value="">Semua Status</option>
              <option value={VehicleStatus.Delivery}>Delivery</option>
              <option value={VehicleStatus.SalesVan}>Sales Van</option>
            </select>
          </div>
          <button
            onClick={resetFilters}
            className="flex-grow flex items-center justify-center px-4 py-2 bg-gray-500 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 transition-colors"
          >
            <RefreshIcon className="w-5 h-5 mr-2"/>
            Reset
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto pr-2">
        {filteredHistory.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">Tidak ada riwayat yang cocok dengan filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-sm text-left">
              <thead className="border-b border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 sticky top-0 z-[1]">
                <tr>
                  <th className="p-3 text-xs font-bold uppercase text-gray-600 dark:text-gray-300 tracking-wider">No. Polisi</th>
                  <th className="p-3 text-xs font-bold uppercase text-gray-600 dark:text-gray-300 tracking-wider hidden lg:table-cell">Sub Cabang</th>
                  <th className="p-3 text-xs font-bold uppercase text-gray-600 dark:text-gray-300 tracking-wider hidden md:table-cell">Nama Sopir</th>
                  <th className="p-3 text-xs font-bold uppercase text-gray-600 dark:text-gray-300 tracking-wider hidden xl:table-cell">Status</th>
                  <th className="p-3 text-xs font-bold uppercase text-gray-600 dark:text-gray-300 tracking-wider hidden md:table-cell">Waktu Keluar</th>
                  <th className="p-3 text-xs font-bold uppercase text-gray-600 dark:text-gray-300 tracking-wider hidden md:table-cell">Waktu Masuk</th>
                  <th className="p-3 text-xs font-bold uppercase text-gray-600 dark:text-gray-300 tracking-wider hidden lg:table-cell">KM Keluar</th>
                  <th className="p-3 text-xs font-bold uppercase text-gray-600 dark:text-gray-300 tracking-wider hidden lg:table-cell">KM Masuk</th>
                  <th className="p-3 text-xs font-bold uppercase text-gray-600 dark:text-gray-300 tracking-wider">Jarak</th>
                  <th className="p-3 text-xs font-bold uppercase text-gray-600 dark:text-gray-300 tracking-wider">Durasi</th>
                  <th className="p-3 text-xs font-bold uppercase text-gray-600 dark:text-gray-300 tracking-wider hidden md:table-cell">Tujuan</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((log) => {
                  const details = vehicleDetailsMap.get(log.licensePlate);
                  const distance = (typeof log.exitKm === 'number' && typeof log.entryKm === 'number')
                    ? log.exitKm - log.entryKm
                    : null;
                  return (
                    <tr key={log.id} className="border-b border-gray-200 dark:border-gray-700 odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{log.licensePlate}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400 hidden lg:table-cell">{details?.subBranch || '-'}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400 hidden md:table-cell">{details?.driverName || '-'}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400 hidden xl:table-cell">{details?.status || '-'}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400 hidden md:table-cell">{formatDateTime(log.entryTime)}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400 hidden md:table-cell">{log.exitTime ? formatDateTime(log.exitTime) : '-'}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400 hidden lg:table-cell">{typeof log.entryKm === 'number' ? `${log.entryKm.toLocaleString('id-ID')} km` : '-'}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400 hidden lg:table-cell">{typeof log.exitKm === 'number' ? `${log.exitKm.toLocaleString('id-ID')} km` : '-'}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                           <TachometerIcon className="w-4 h-4 mr-2 text-green-500"/>
                           {distance !== null ? `${distance.toLocaleString('id-ID')} km` : '-'}
                        </div>
                      </td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <TimeDurationIcon className="w-4 h-4 mr-2 text-purple-500"/>
                            {log.exitTime ? calculateDuration(log.entryTime, log.exitTime) : '-'}
                          </div>
                      </td>
                      <td className="p-3 text-gray-600 dark:text-gray-400 hidden md:table-cell">{log.purpose || '-'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleHistory;