export interface Booking {
  id: string;
  userId: string;
  rideId: string;
  seatsBooked: number;
  totalFare: number;
  status: "confirmed" | "cancelled" | "completed";
  bookingTime: string;
  createdAt: string;
  updatedAt: string;
}
