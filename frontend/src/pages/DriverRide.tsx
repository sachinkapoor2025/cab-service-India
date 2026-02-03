import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { rideApi } from "../services/api";

interface AssignedRide {
  id: string;
  source: string;
  destination: string;
  dateTime: string;
  seats: number;
  farePerSeat: number;
  isShared: boolean;
  femaleOnly?: boolean;
  requesterId: string;
  status: string;
  passengers: string[];
  driverId?: string;
}

const DriverRide: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ride, setRide] = useState<AssignedRide | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get ride from location state (passed from dashboard)
  const initialRide = location.state?.ride as AssignedRide;

  useEffect(() => {
    if (initialRide) {
      setRide(initialRide);
    } else if (user) {
      fetchCurrentRide();
    }
  }, [initialRide, user]);

  const fetchCurrentRide = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch user's rides and find the one assigned to this driver
      const response = await rideApi.getUserRides(user.id);
      const currentRide = response.data.rides?.find(
        (r: AssignedRide) => r.driverId === user.id && r.status === "ASSIGNED",
      );

      if (currentRide) {
        setRide(currentRide);
      } else {
        // No current ride, use mock data for demo
        setRide({
          id: "current-ride-1",
          source: "Delhi University",
          destination: "IIT Delhi",
          dateTime: "2024-01-15T10:00:00Z",
          seats: 2,
          farePerSeat: 50,
          isShared: true,
          femaleOnly: false,
          requesterId: "student1",
          status: "ASSIGNED",
          passengers: ["student1", "student2"],
          driverId: user.id,
        });
      }
    } catch (err) {
      console.error("Error fetching current ride:", err);
      setError("Failed to fetch current ride. Please try again.");
      // Fallback to mock data
      setRide({
        id: "current-ride-1",
        source: "Delhi University",
        destination: "IIT Delhi",
        dateTime: "2024-01-15T10:00:00Z",
        seats: 2,
        farePerSeat: 50,
        isShared: true,
        femaleOnly: false,
        requesterId: "student1",
        status: "ASSIGNED",
        passengers: ["student1", "student2"],
        driverId: user.id,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartRide = async () => {
    if (!ride) return;

    setLoading(true);
    setError(null);

    try {
      await rideApi.startRide(ride.id);
      setRide((prev) => (prev ? { ...prev, status: "IN_PROGRESS" } : null));
      alert("Ride started successfully!");
    } catch (err) {
      console.error("Error starting ride:", err);
      setError("Failed to start ride. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRide = async () => {
    if (!ride) return;

    setLoading(true);
    setError(null);

    try {
      await rideApi.completeRide(ride.id);
      setRide((prev) => (prev ? { ...prev, status: "COMPLETED" } : null));
      alert("Ride completed successfully!");
      // Navigate back to dashboard after completion
      setTimeout(() => navigate("/driver-dashboard"), 2000);
    } catch (err) {
      console.error("Error completing ride:", err);
      setError("Failed to complete ride. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRide = async () => {
    if (!ride) return;

    if (!window.confirm("Are you sure you want to cancel this ride?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await rideApi.cancelRide(ride.id);
      setRide((prev) => (prev ? { ...prev, status: "CANCELLED" } : null));
      alert("Ride cancelled successfully!");
      // Navigate back to dashboard after cancellation
      setTimeout(() => navigate("/driver-dashboard"), 2000);
    } catch (err) {
      console.error("Error cancelling ride:", err);
      setError("Failed to cancel ride. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ASSIGNED":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const getRideStatus = (status: string) => {
    switch (status.toUpperCase()) {
      case "ASSIGNED":
        return "Ride Assigned - Waiting to Start";
      case "IN_PROGRESS":
        return "Ride In Progress";
      case "COMPLETED":
        return "Ride Completed";
      case "CANCELLED":
        return "Ride Cancelled";
      default:
        return status;
    }
  };

  if (loading && !ride) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ride details...</p>
        </div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🚗</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Active Ride
            </h2>
            <p className="text-gray-600 mb-6">
              You don't have any active rides at the moment.
            </p>
            <button
              onClick={() => navigate("/driver-dashboard")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              🚗 Current Ride
            </h1>
            <button
              onClick={() => navigate("/driver-dashboard")}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Ride Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Route Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                🗺️ Route Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="font-semibold">{ride.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-semibold">{ride.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-semibold">
                    {formatDateTime(ride.dateTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ride Type:</span>
                  <span className="font-semibold">
                    {ride.isShared ? "Shared Ride" : "Private Ride"}
                  </span>
                </div>
                {ride.femaleOnly && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Preference:</span>
                    <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-sm">
                      Female Only
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Ride Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">
                📊 Ride Status
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      ride.status,
                    )}`}
                  >
                    {getRideStatus(ride.status)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Passengers:</span>
                  <span className="font-semibold">
                    {ride.passengers.length}/{ride.seats}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fare per Seat:</span>
                  <span className="font-semibold text-green-600">
                    ₹{ride.farePerSeat}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Earnings:</span>
                  <span className="font-semibold text-green-600">
                    ₹{ride.farePerSeat * ride.passengers.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4">
              ⚡ Ride Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleStartRide}
                disabled={ride.status !== "ASSIGNED" || loading}
                className={`font-bold py-3 px-6 rounded-lg transition-colors ${
                  ride.status === "ASSIGNED"
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Start Ride
              </button>
              <button
                onClick={handleCompleteRide}
                disabled={ride.status !== "IN_PROGRESS" || loading}
                className={`font-bold py-3 px-6 rounded-lg transition-colors ${
                  ride.status === "IN_PROGRESS"
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Complete Ride
              </button>
              <button
                onClick={handleCancelRide}
                disabled={ride.status === "COMPLETED" || loading}
                className={`font-bold py-3 px-6 rounded-lg transition-colors ${
                  ride.status !== "COMPLETED"
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Cancel Ride
              </button>
            </div>
            <p className="text-yellow-700 text-sm mt-4">
              Note: Only the driver who accepted the ride can perform these
              actions.
            </p>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              📋 Ride Instructions
            </h3>
            <ul className="text-blue-700 space-y-2">
              <li>
                • <strong>Start Ride:</strong> Click when you begin the journey
              </li>
              <li>
                • <strong>Complete Ride:</strong> Click when you reach the
                destination
              </li>
              <li>
                • <strong>Cancel Ride:</strong> Use only if absolutely necessary
              </li>
              <li>• Always maintain good communication with passengers</li>
              <li>• Follow traffic rules and drive safely</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverRide;
