import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import VehicleEntryForm from './components/VehicleEntryForm';
import VehicleCheckOutForm from './components/VehicleCheckOutForm';
import CurrentVehicles from './components/CurrentVehicles';
import VehicleHistory from './components/VehicleHistory';
import VehicleData from './components/VehicleData';
import Summary from './components/Summary';
import Login from './components/Login';
import Home from './components/Home'; // Import the new Home component
import { VehicleLog, AppView, Vehicle, VehicleStatus } from './types';
import { BackArrowIcon } from './components/icons';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('home');
  
  // State for vehicle logs
  const [vehicleLogs, setVehicleLogs] = useState<VehicleLog[]>(() => {
    try {
      const savedLogs = localStorage.getItem('vehicleLogs');
      const parsedLogs = savedLogs ? JSON.parse(savedLogs) : [];
       // Deserialize dates and ensure a clean structure for forward/backward compatibility
      return parsedLogs.map((log: any) => ({
        id: log.id,
        licensePlate: log.licensePlate,
        entryTime: new Date(log.entryTime),
        exitTime: log.exitTime ? new Date(log.exitTime) : undefined,
        entryKm: log.entryKm,
        exitKm: log.exitKm,
        purpose: log.purpose,
      }));
    } catch (error) {
      console.error("Failed to parse vehicle logs from localStorage", error);
      return [];
    }
  });

  // State for master vehicle data
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const savedVehicles = localStorage.getItem('masterVehicles');
      const parsedVehicles = savedVehicles ? JSON.parse(savedVehicles) : [
        { id: '1', licensePlate: 'B 1234 ABC', subBranch: 'Bogor', driverName: 'John Doe', status: VehicleStatus.Delivery },
        { id: '2', licensePlate: 'F 5678 XYZ', subBranch: 'Sawangan', driverName: 'Jane Smith', status: VehicleStatus.SalesVan },
      ];
      return parsedVehicles.map((v: Vehicle) => ({
          ...v,
          status: v.status || VehicleStatus.Delivery
      }));
    } catch (error) {
      console.error("Failed to parse master vehicles from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('vehicleLogs', JSON.stringify(vehicleLogs));
  }, [vehicleLogs]);

  useEffect(() => {
    localStorage.setItem('masterVehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  const handleLogin = (username: string, password: string):boolean => {
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      setCurrentView('home'); // Go to home on login
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLogin} />;
  }


  // A vehicle is "ON TRIP" if it has a log without an exitTime
  const vehiclesOnTrip = vehicleLogs.filter((log) => !log.exitTime);
  const licensePlatesOnTrip = vehiclesOnTrip.map(v => v.licensePlate);
  
  // A vehicle is "AVAILABLE" if it's in the master list and not on a trip
  const availableVehiclesForTrip = vehicles.filter(v => !licensePlatesOnTrip.includes(v.licensePlate));

  // This function STARTS a trip (vehicle leaves the garage)
  const handleVehicleExit = (licensePlate: string, entryTime: Date, entryKm: number, purpose: string) => {
    if (!licensePlate) {
      alert('Nomor polisi harus dipilih.');
      return;
    }

    const newLog: VehicleLog = {
      id: new Date().toISOString(),
      licensePlate: licensePlate,
      entryTime: entryTime, // This is the "exit" time from the user's perspective
      entryKm: entryKm,     // This is the "exit" KM from the user's perspective
      purpose: purpose,
    };

    setVehicleLogs((prevLogs) => [newLog, ...prevLogs]);
  };
  
  // This function ENDS a trip (vehicle enters the garage)
  const handleVehicleEnter = (licensePlate: string, exitTime: Date, exitKm: number) => {
    const upperCaseLicensePlate = licensePlate.toUpperCase().trim();
    if (!upperCaseLicensePlate) {
        alert('Nomor polisi tidak boleh kosong.');
        return;
    }

    const logToComplete = vehicleLogs.find(
      (log) => log.licensePlate === upperCaseLicensePlate && !log.exitTime
    );

    if (!logToComplete) {
      alert(`Kendaraan dengan nomor polisi ${upperCaseLicensePlate} tidak ditemukan dalam perjalanan.`);
      return;
    }
      
    if (exitTime < logToComplete.entryTime) {
        alert('Waktu masuk tidak boleh lebih awal dari waktu keluar.');
        return;
    }

    if (typeof logToComplete.entryKm === 'number' && exitKm < logToComplete.entryKm) {
        alert('KM masuk tidak boleh lebih kecil dari KM keluar.');
        return;
    }
    
    setVehicleLogs((prevLogs) => 
        prevLogs.map(log => 
            log.id === logToComplete.id 
                ? { ...log, exitTime, exitKm } 
                : log
        )
    );
  };

  // Handlers for Master Vehicle Data
  const handleAddVehicle = (vehicle: Omit<Vehicle, 'id'>): boolean => {
    const upperCaseLicensePlate = vehicle.licensePlate.toUpperCase().trim();
    if (vehicles.some(v => v.licensePlate === upperCaseLicensePlate)) {
        alert(`Kendaraan dengan nomor polisi ${upperCaseLicensePlate} sudah ada di data master.`);
        return false;
    }
    const newVehicle: Vehicle = { ...vehicle, id: new Date().toISOString(), licensePlate: upperCaseLicensePlate };
    setVehicles(prev => [newVehicle, ...prev]);
    return true;
  };

  const handleUpdateVehicle = (updatedVehicle: Vehicle): boolean => {
    const upperCaseLicensePlate = updatedVehicle.licensePlate.toUpperCase().trim();
    if (vehicles.some(v => v.licensePlate === upperCaseLicensePlate && v.id !== updatedVehicle.id)) {
        alert(`Kendaraan dengan nomor polisi ${upperCaseLicensePlate} sudah ada di data master.`);
        return false;
    }
    setVehicles(prev => prev.map(v => v.id === updatedVehicle.id ? {...updatedVehicle, licensePlate: upperCaseLicensePlate} : v));
    return true;
  };

  const handleDeleteVehicle = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data kendaraan ini?")) {
        setVehicles(prev => prev.filter(v => v.id !== id));
    }
  };

  const vehicleHistory = vehicleLogs.filter((log) => log.exitTime);

  // Summary Data Calculation
  const isToday = (someDate: Date) => {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
           someDate.getMonth() === today.getMonth() &&
           someDate.getFullYear() === today.getFullYear();
  };

  const vehiclesOutToday = vehicleLogs.filter(log => isToday(log.entryTime)).length;
  const totalRegisteredVehicles = vehicles.length;

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <Home onNavigate={setCurrentView} />;
      case 'inventory':
        return (
          <div>
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center mb-6 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
              aria-label="Kembali ke menu utama"
            >
              <BackArrowIcon className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
              <span>Kembali ke Menu Utama</span>
            </button>
            <div className="space-y-8">
              <Summary 
                vehiclesOutToday={vehiclesOutToday}
                vehiclesOnTrip={vehiclesOnTrip.length}
                totalRegisteredVehicles={totalRegisteredVehicles}
              />
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                  <VehicleCheckOutForm onVehicleExit={handleVehicleExit} availableVehicles={availableVehiclesForTrip} />
                  <VehicleEntryForm onVehicleEnter={handleVehicleEnter} vehiclesOnTrip={vehiclesOnTrip} />
                </div>
                <div className="lg:col-span-3">
                  <CurrentVehicles vehiclesOnTrip={vehiclesOnTrip} masterVehicles={vehicles} />
                </div>
              </div>
              <VehicleHistory history={vehicleHistory} vehicles={vehicles} />
            </div>
          </div>
        );
      case 'vehicleData':
        return (
          <div>
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center mb-6 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
              aria-label="Kembali ke menu utama"
            >
              <BackArrowIcon className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
              <span>Kembali ke Menu Utama</span>
            </button>
            <VehicleData 
              vehicles={vehicles}
              onAdd={handleAddVehicle}
              onUpdate={handleUpdateVehicle}
              onDelete={handleDeleteVehicle}
            />
          </div>
        );
      default:
        return <Home onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col font-sans">
      <Header setCurrentView={setCurrentView} onLogout={handleLogout} currentView={currentView} />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;