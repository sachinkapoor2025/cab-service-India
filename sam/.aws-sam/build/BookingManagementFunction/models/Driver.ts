export interface Driver {
  id: string;
  userId: string; // linked to User
  name: string;
  phone: string;
  email?: string;
  vehicleType: string;
  vehicleNumber: string;
  documents: {
    licenseNumber: string;
    licenseExpiry: string;
    aadharNumber: string; // metadata only
  };
  isActive: boolean;
  isAvailable: boolean;
  currentRideId?: string;
  createdAt: string;
  updatedAt: string;
}
