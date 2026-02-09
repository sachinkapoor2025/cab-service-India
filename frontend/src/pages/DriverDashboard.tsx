import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { driverApi, rideApi } from "../services/api";

interface AvailableRide {
  id: string;
  source: string;
  destination: string;
  dateTime: string;
  seats: number;
  farePerSeat: number;
  isShared: boolean;
  femaleOnly?: boolean;
  requesterId: string;
}

const DriverDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [availableRides, setAvailableRides] = useState<AvailableRide[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailableRides();
  }, []);

  const fetchAvailableRides = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const driverResponse = await driverApi.getDriver(user.id);
      if (!driverResponse.data) {
        setAvailableRides([
          {
            id: "1",
            source: "Delhi University",
            destination: "IIT Delhi",
            dateTime: "2024-01-15T10:00:00Z",
            seats: 2,
            farePerSeat: 50,
            isShared: true,
            femaleOnly: false,
            requesterId: "student1",
          },
          {
            id: "2",
            source: "JNU",
            destination: "AIIMS",
            dateTime: "2024-01-15T14:30:00Z",
            seats: 1,
            farePerSeat: 200,
            isShared: false,
            femaleOnly: true,
            requesterId: "student2",
          },
        ]);
        return;
      }

      const response = await rideApi.getUserRides(user.id);
      setAvailableRides(response.data.rides || []);
    } catch (err) {
      console.error("Error fetching rides:", err);
      setError("Failed to fetch available rides. Please try again.");
      setAvailableRides([
        {
          id: "1",
          source: "Delhi University",
          destination: "IIT Delhi",
          dateTime: "2024-01-15T10:00:00Z",
          seats: 2,
          farePerSeat: 50,
          isShared: true,
          femaleOnly: false,
          requesterId: "student1",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRide = async (rideId: string) => {
    if (!user) return;

    try {
      await rideApi.assignDriver(rideId, user.id);
      alert("Ride accepted successfully!");
      fetchAvailableRides();
    } catch (error) {
      console.error("Error accepting ride:", error);
      alert("Failed to accept ride. Please try again.");
    }
  };

  const handleRejectRide = (rideId: string) => {
    setAvailableRides((prev) => prev.filter((ride) => ride.id !== rideId));
  };

  const handleLogout = () => {
    logout();
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              🚗 Driver Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                👤 Driver Information
              </h2>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Name:</span>{" "}
                  {user?.name || "Not provided"}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Phone:</span> {user?.phone}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span>{" "}
                  {user?.email || "Not provided"}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Role:</span>{" "}
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    {user?.role}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">
                📋 Available Rides
              </h2>

              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                  <p className="mt-2 text-green-600">Loading rides...</p>
                </div>
              ) : error ? (
                <div className="text-red-600 text-center py-4">{error}</div>
              ) : availableRides.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No available rides at the moment. Please check back later.
                </div>
              ) : (
                <div className="space-y-4">
                  {availableRides.map((ride) => (
                    <div
                      key={ride.id}
                      className="bg-white border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-lg">
                              {ride.isShared ? "👥" : "🏎️"}
                            </span>
                            <span className="font-semibold">
                              {ride.source} → {ride.destination}
                            </span>
                            {ride.femaleOnly && (
                              <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs">
                                Female Only
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            🕐 {formatDateTime(ride.dateTime)}
                          </p>
                          <p className="text-sm text-gray-600">
                            💺 {ride.seats} seat
                            {ride.seats !== 1 ? "s" : ""} • ₹{ride.farePerSeat}{" "}
                            per seat
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAcceptRide(ride.id)}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectRide(ride.id)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-1 px-3 rounded text-sm transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              🎉 Welcome to CampusRide Driver!
            </h3>
            <p className="text-yellow-700">
              Accept rides from the list above to start earning. Make sure your
              driver profile is complete and keep your availability status
              updated. Provide excellent service to get great ratings from
              students!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
