import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { rideApi } from "../services/api";
import RideConfirmation from "../components/RideConfirmation";

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
  const { user } = useAuth();
  const { source, destination, date, time, rideType } =
    (location.state as BookingState) || {};

  const [formData, setFormData] = useState({
    source: source || "",
    destination: destination || "",
    date: date || "",
    time: time || "",
    rideType: rideType || "PRIVATE",
    seats: 1,
    femaleOnly: false,
    isScheduled: false,
  });

  const [isShared, setIsShared] = useState(rideType === "SHARED");
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const totalFare = isShared ? 50 * formData.seats : 200; // Mock pricing

  const handleBook = async () => {
    if (!user) {
      alert("Please login first");
      navigate("/auth");
      return;
    }

    // Show confirmation modal for private rides
    if (!isShared) {
      setShowConfirmation(true);
      return;
    }

    // For shared rides, navigate to search with form data
    navigate("/search", {
      state: {
        source: formData.source,
        destination: formData.destination,
        date: formData.date,
        time: formData.time,
        femaleOnly: formData.femaleOnly,
        route: `${formData.source}-${formData.destination}`
          .toLowerCase()
          .replace(/\s+/g, ""),
        dateTime: formData.isScheduled
          ? new Date(`${formData.date}T${formData.time}`).toISOString()
          : new Date().toISOString(),
      },
    });
  };

  const confirmBooking = async () => {
    setLoading(true);
    setShowConfirmation(false);

    try {
      // Create route hash for matching
      const route = `${formData.source}-${formData.destination}`
        .toLowerCase()
        .replace(/\s+/g, "");

      const dateTime = formData.isScheduled
        ? new Date(`${formData.date}T${formData.time}`).toISOString()
        : new Date().toISOString();

      // For private rides, create the ride directly
      const response = await rideApi.createRide({
        requesterId: user!.id,
        source: formData.source,
        destination: formData.destination,
        route,
        dateTime,
        seats: 1, // Private ride - requester takes 1 seat
        farePerSeat: 200, // Fixed private ride fare
        isShared: false,
        femaleOnly: formData.femaleOnly,
      });

      alert("Private ride booked successfully!");
      navigate("/history");
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed - please try again");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h2 className="text-2xl font-bold mb-6">Book Your Ride</h2>
      <div className="space-y-6">
        {/* Route Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <p>
            <strong>From:</strong> {formData.source}
          </p>
          <p>
            <strong>To:</strong> {formData.destination}
          </p>
          <p>
            <strong>Date:</strong> {formData.date}
          </p>
          <p>
            <strong>Time:</strong> {formData.time}
          </p>
        </div>

        {/* Ride Options */}
        <div className="space-y-4">
          {/* Ride Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Ride Type</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!isShared}
                  onChange={() => setIsShared(false)}
                  className="mr-2"
                />
                Private
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={isShared}
                  onChange={() => setIsShared(true)}
                  className="mr-2"
                />
                Shared
              </label>
            </div>
          </div>

          {/* Booking Type */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Booking Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!formData.isScheduled}
                  onChange={() =>
                    setFormData({ ...formData, isScheduled: false })
                  }
                  className="mr-2"
                />
                Book Now
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={formData.isScheduled}
                  onChange={() =>
                    setFormData({ ...formData, isScheduled: true })
                  }
                  className="mr-2"
                />
                Schedule
              </label>
            </div>
          </div>

          {/* Female Only */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.femaleOnly}
                onChange={(e) =>
                  setFormData({ ...formData, femaleOnly: e.target.checked })
                }
                className="mr-2"
              />
              Female-only ride
            </label>
          </div>

          {/* Seats */}
          {isShared && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Number of Seats
              </label>
              <input
                type="number"
                min="1"
                max="4"
                value={formData.seats}
                onChange={(e) =>
                  setFormData({ ...formData, seats: Number(e.target.value) })
                }
                className="w-full p-2 border rounded"
              />
            </div>
          )}
        </div>

        {/* Fare Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-lg font-bold text-blue-800">
            Total Fare: ₹{totalFare}
          </p>
          <p className="text-sm text-blue-600">
            {isShared ? `₹50 per seat` : "Private ride"}
          </p>
        </div>

        {/* Book Button */}
        <button
          onClick={handleBook}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          {loading
            ? "Processing..."
            : isShared
              ? "Search Shared Rides"
              : "Book Private Ride"}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <RideConfirmation
          rideDetails={{
            source: formData.source,
            destination: formData.destination,
            dateTime: formData.isScheduled
              ? `${formData.date}T${formData.time}`
              : new Date().toISOString(),
            rideType: "Private",
            fare: totalFare,
            isShared: false,
            femaleOnly: formData.femaleOnly,
          }}
          onConfirm={confirmBooking}
          onCancel={cancelBooking}
        />
      )}
    </div>
  );
};

export default Booking;
