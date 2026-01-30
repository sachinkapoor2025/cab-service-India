import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

interface BookingState {
  source: string;
  destination: string;
  date: string;
  time: string;
  rideType: string;
  driver?: string;
  fare?: number;
}

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { source, destination, date, time, rideType } =
    (location.state as BookingState) || {};
  const [seats, setSeats] = useState(1);

  const handleBook = async () => {
    try {
      // Mock booking API call
      await axios.post<{ id: string }>(
        `${import.meta.env.VITE_API_URL}/bookings`,
        {
          rideId: "mock-ride-id", // In real app, get from search results
          seatsBooked: seats,
        },
      );
      alert("Booking confirmed!");
      navigate("/");
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed - using demo mode");
      // Demo mode: save to localStorage
      const booking = {
        id: "demo-" + Date.now(),
        source,
        destination,
        date,
        time,
        rideType,
        seats,
        fare: totalFare,
        status: "confirmed",
      };
      const existingBookings = JSON.parse(
        localStorage.getItem("rideHistory") || "[]",
      );
      existingBookings.push(booking);
      localStorage.setItem("rideHistory", JSON.stringify(existingBookings));
      alert("Booking confirmed in demo mode!");
      navigate("/history");
    }
  };

  const totalFare = rideType === "shared" ? 50 * seats : 200; // Mock pricing

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Confirm Booking</h2>
      <div className="space-y-4">
        <div>
          <p>
            <strong>From:</strong> {source}
          </p>
          <p>
            <strong>To:</strong> {destination}
          </p>
          <p>
            <strong>Date:</strong> {date}
          </p>
          <p>
            <strong>Time:</strong> {time}
          </p>
          <p>
            <strong>Type:</strong> {rideType}
          </p>
        </div>
        {rideType === "shared" && (
          <div>
            <label className="block mb-2">Seats:</label>
            <input
              type="number"
              min="1"
              max="4"
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
        )}
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-lg font-bold">Total Fare: ₹{totalFare}</p>
          {rideType === "shared" && <p className="text-sm">₹50 per seat</p>}
        </div>
        <button
          onClick={handleBook}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default Booking;
