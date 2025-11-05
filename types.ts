export interface VehicleLog {
  id: string;
  licensePlate: string;
  entryTime: Date;
  exitTime?: Date;
  entryKm?: number;
  exitKm?: number;
  purpose?: string;
}

export type AppView = 'home' | 'inventory' | 'vehicleData' | 'settings';

export enum VehicleStatus {
  Delivery = 'Delivery',
  SalesVan = 'Sales Van',
}

export interface Vehicle {
  id: string;
  licensePlate: string;
  subBranch: string;
  driverName: string;
  status: VehicleStatus;
}

export interface User {
  id: string;
  username: string;
  password: string;
}
