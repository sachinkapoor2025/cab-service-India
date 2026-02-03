export type RideStatus =
  | "REQUESTED"
  | "WAITING_FOR_MATCH"
  | "READY_FOR_DRIVER"
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface Ride {
  id: string;
  requesterId: string; // student who requested
  driverId?: string; // assigned when READY_FOR_DRIVER
  source: string;
  destination: string;
  route: string; // hashed route for matching
  dateTime: string;
  maxSeats: number;
  availableSeats: number;
  farePerSeat: number;
  isShared: boolean;
  femaleOnly?: boolean;
  status: RideStatus;
  passengers: string[]; // array of user IDs who joined
  createdAt: string;
  updatedAt: string;
}
