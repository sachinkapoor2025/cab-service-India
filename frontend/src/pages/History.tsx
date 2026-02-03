import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { rideApi } from "../services/api";

interface RideHistory {
  id: string;
  source: string;
  destination: string;
  dateTime: string;
  farePerSeat: number;
  isShared: boolean;
  status: string;
  passengers: string[];
  requesterId: string;
}

const History = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState<RideHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRides();
    }
  }, [user]);

  const fetchRides = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const response = await rideApi.getUserRides(user.id);
      setRides(response.data.rides || []);
    } catch (error) {
      console.error("Failed to fetch rides:", error);
      // Fallback to mock data for demo
      setRides([
        {
          id: "1",
          source: "Delhi",
          destination: "Gurgaon",
          dateTime: "2024-01-15T10:00:00Z",
          farePerSeat: 250,
          isShared: true,
          status: "completed",
          passengers: ["user1", "user2"],
          requesterId: user.id,
        },
        {
          id: "2",
          source: "Mumbai",
          destination: "Pune",
          dateTime: "2024-01-20T14:30:00Z",
          farePerSeat: 300,
          isShared: false,
          status: "completed",
          passengers: [user.id],
          requesterId: user.id,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Ride History</h2>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading rides...</p>
        </div>
      )}

      {!loading && rides.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚗</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No rides yet
          </h3>
          <p className="text-gray-500 mb-6">
            Your completed and upcoming rides will appear here
          </p>
          <button
            onClick={() => (window.location.href = "/search")}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Find a Ride
          </button>
        </div>
      )}

      {!loading && rides.length > 0 && (
        <div className="space-y-4">
          {rides.map((ride) => (
            <div
              key={ride.id}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-400"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">
                      {ride.isShared ? "👥" : "🏎️"}
                    </span>
                    <span className="font-semibold text-lg">
                      {ride.isShared ? "Shared Ride" : "Private Ride"}
                    </span>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        ride.status,
                      )}`}
                    >
                      {ride.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">
                    From {ride.source} to {ride.destination}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>🕐 {formatDateTime(ride.dateTime)}</span>
                    <span>
                      💺 {ride.passengers.length} passenger
                      {ride.passengers.length !== 1 ? "s" : ""}
                    </span>
                    {ride.isShared && <span>👥 Shared ride</span>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    ₹{ride.farePerSeat}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {ride.isShared ? "per seat" : "total"}
                  </p>
                  <button className="text-yellow-600 hover:text-yellow-800 font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
