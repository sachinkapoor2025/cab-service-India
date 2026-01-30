export interface Ride {
  id: string;
  driverId: string;
  source: string;
  destination: string;
  route: string; // hashed route for matching
  dateTime: string;
  maxSeats: number;
  availableSeats: number;
  farePerSeat: number;
  isShared: boolean;
  femaleOnly?: boolean;
  status: "active" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}
