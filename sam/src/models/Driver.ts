export interface Driver {
  id: string;
  phone: string;
  name: string;
  email?: string;
  vehicleType: string;
  vehicleNumber: string;
  licenseNumber: string;
  rating?: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}
