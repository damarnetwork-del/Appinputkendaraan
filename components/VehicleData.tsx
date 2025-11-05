import React, { useState, FormEvent, useEffect } from 'react';
import { Vehicle, VehicleStatus } from '../types';
import { PlusIcon, PencilIcon, TrashIcon, TruckIcon, ExportIcon, PdfIcon } from './icons';
import { exportToCSV } from '../utils/csv';
import { exportToPDF } from '../utils/pdf';

interface VehicleDataProps {
  vehicles: Vehicle[];
  onAdd: (vehicle: Omit<Vehicle, 'id'>) => boolean;
  onUpdate: (vehicle: Vehicle) => boolean;
  onDelete: (id: string) => void;
}

const VehicleData: React.FC<VehicleDataProps> = ({ vehicles, onAdd, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState<Vehicle | null>(null);
  const [licensePlate, setLicensePlate] = useState('');
  const [subBranch, setSubBranch] = useState('');
  const [driverName, setDriverName] = useState('');
  const [status, setStatus] = useState<VehicleStatus>(VehicleStatus.Delivery);

  useEffect(() => {
    if (isEditing) {
      setLicensePlate(isEditing.licensePlate);
      setSubBranch(isEditing.subBranch);
      setDriverName(isEditing.driverName);
      setStatus(isEditing.status || VehicleStatus.Delivery); // Fallback for old data
    } else {
      resetForm();
    }
  }, [isEditing]);

  const resetForm = () => {
    setLicensePlate('');
    setSubBranch('');
    setDriverName('');
    setStatus(VehicleStatus.Delivery);
    setIsEditing(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!licensePlate.trim() || !subBranch.trim() || !driverName.trim() || !status) {
        alert("Semua field harus diisi.");
        return;
    }

    let success = false;
    if (isEditing) {
      success = onUpdate({ id: isEditing.id, licensePlate, subBranch, driverName, status });
    } else {
      success = onAdd({ licensePlate, subBranch, driverName, status });
    }
    if (success) {
        resetForm();
    }
  };

  const handleExportCsv = () => {
    const dataToExport = vehicles.map(v => ({
      licensePlate: v.licensePlate,
      subBranch: v.subBranch,
      driverName: v.driverName,
      status: v.status
    }));
  
    const headers = {
      licensePlate: 'No. Polisi',
      subBranch: 'Sub Cabang',
      driverName: 'Nama Sopir',
      status: 'Status'
    };
  
    exportToCSV(dataToExport, headers, 'data_kendaraan.csv');
  };

  const handleExportPdf = () => {
    const title = "Daftar Kendaraan";
    const head = [['No. Polisi', 'Sub Cabang', 'Nama Sopir', 'Status']];
    const body = vehicles.map(v => [
        v.licensePlate,
        v.subBranch,
        v.driverName,
        v.status
    ]);
    exportToPDF(head, body, title, 'data_kendaraan.pdf');
  };

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center">
          <TruckIcon className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400"/>
          {isEditing ? 'Edit Data Kendaraan' : 'Tambah Data Kendaraan'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
          <div className="lg:col-span-1">
            <label htmlFor="masterLicensePlate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nomor Polisi
            </label>
            <input
              type="text"
              id="masterLicensePlate"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              placeholder="e.g. B 1234 ABC"
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:text-gray-200"
            />
          </div>
          <div className="lg:col-span-1">
            <label htmlFor="subBranch" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sub Cabang
            </label>
            <select
              id="subBranch"
              value={subBranch}
              onChange={(e) => setSubBranch(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:text-gray-200"
            >
              <option value="" disabled>Pilih cabang</option>
              <option value="Bogor">Bogor</option>
              <option value="Sawangan">Sawangan</option>
            </select>
          </div>
          <div className="lg:col-span-1">
            <label htmlFor="driverName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nama Sopir
            </label>
            <input
              type="text"
              id="driverName"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              placeholder="e.g. John Doe"
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:text-gray-200"
            />
          </div>
          <div className="lg:col-span-1">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as VehicleStatus)}
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:text-gray-200"
            >
              <option value={VehicleStatus.Delivery}>Delivery</option>
              <option value={VehicleStatus.SalesVan}>Sales Van</option>
            </select>
          </div>
          <div className="lg:col-span-1 flex justify-end gap-2">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full px-4 py-2 bg-gray-500 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 transition-colors"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              {isEditing ? 'Update' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Daftar Kendaraan</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCsv}
                disabled={vehicles.length === 0}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ExportIcon className="w-4 h-4 mr-2" />
                CSV
              </button>
              <button
                onClick={handleExportPdf}
                disabled={vehicles.length === 0}
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PdfIcon className="w-4 h-4 mr-2" />
                PDF
              </button>
            </div>
        </div>
        <div className="max-h-[32rem] overflow-y-auto pr-2">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max text-left">
                <thead className="border-b border-gray-200 dark:border-gray-600 sticky top-0 bg-white dark:bg-gray-800">
                  <tr>
                    <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">No. Polisi</th>
                    <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Sub Cabang</th>
                    <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Nama Sopir</th>
                    <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                    <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                            Tidak ada data kendaraan.
                        </td>
                    </tr>
                  ) : (
                    vehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{vehicle.licensePlate}</td>
                        <td className="p-3 text-gray-600 dark:text-gray-400">{vehicle.subBranch}</td>
                        <td className="p-3 text-gray-600 dark:text-gray-400">{vehicle.driverName}</td>
                        <td className="p-3 text-gray-600 dark:text-gray-400">{vehicle.status}</td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setIsEditing(vehicle)} className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-full transition-colors" aria-label="Edit">
                              <PencilIcon className="w-5 h-5" />
                            </button>
                            <button onClick={() => onDelete(vehicle.id)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-gray-700 rounded-full transition-colors" aria-label="Hapus">
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleData;