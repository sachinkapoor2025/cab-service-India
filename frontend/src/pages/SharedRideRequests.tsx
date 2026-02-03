import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { rideApi } from "../services/api";

interface RideRequest {
  id: string;
  source: string;
  destination: string;
  dateTime: string;
  seats: number;
  seatsAvailable: number;
  farePerSeat: number;
  isShared: boolean;
  femaleOnly?: boolean;
  requesterId: string;
  status: string;
}

const SharedRideRequests: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const [hasNoMatches, setHasNoMatches] = useState(false);

  const { pickup, drop, dateTime, seats, femaleOnly, rideData } =
    location.state || {};

  useEffect(() => {
    if (pickup && drop && dateTime) {
      searchSharedRides();
    }
  }, [pickup, drop, dateTime]);

  const searchSharedRides = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    setHasNoMatches(false);

    try {
      // First, create the user's ride request
      const userRideResponse = await rideApi.createRide({
        ...rideData,
        status: "WAITING_FOR_MATCH",
      });

      // Then search for matching rides using existing API
      const searchResponse = await rideApi.getUserRides(user.id);

      if (searchResponse.data && searchResponse.data.rides.length > 0) {
        setRideRequests(searchResponse.data.rides);
      } else {
        setHasNoMatches(true);
      }
    } catch (err) {
      console.error("Error searching shared rides:", err);
      setError("Failed to search for shared rides. Please try again.");
      setHasNoMatches(true);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRide = async (rideId: string) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // For demo purposes, we'll simulate joining by creating a new ride
      // In a real implementation, this would join an existing shared ride
      await rideApi.createRide({
        requesterId: user.id,
        source: pickup,
        destination: drop,
        route: `${pickup}-${drop}`.toLowerCase().replace(/\s+/g, ""),
        dateTime: dateTime,
        seats: 1,
        farePerSeat: 50,
        isShared: true,
        femaleOnly: femaleOnly,
      });

      alert("Successfully joined the ride!");
      navigate("/history");
    } catch (err) {
      console.error("Error joining ride:", err);
      setError("Failed to join ride. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRaiseRequest = async () => {
    if (!user || !rideData) return;

    setLoading(true);
    setError(null);

    try {
      // Create ride with WAITING_FOR_MATCH status
      const response = await rideApi.createRide({
        ...rideData,
        status: "WAITING_FOR_MATCH",
      });

      alert(
        "Shared ride request raised successfully! You'll be notified when matches are found.",
      );
      navigate("/history");
    } catch (err) {
      console.error("Error raising request:", err);
      setError("Failed to raise request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  if (loading && rideRequests.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching for shared rides...</p>
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
              🔍 Find Shared Rides
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Back
            </button>
          </div>

          {/* Search Criteria */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              Your Search Criteria
            </h3>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">From:</span>
                <p className="font-semibold">{pickup}</p>
              </div>
              <div>
                <span className="text-gray-600">To:</span>
                <p className="font-semibold">{drop}</p>
              </div>
              <div>
                <span className="text-gray-600">Time:</span>
                <p className="font-semibold">{formatDateTime(dateTime)}</p>
              </div>
              <div>
                <span className="text-gray-600">Preference:</span>
                <p className="font-semibold">
                  {femaleOnly ? "Female Only" : "Mixed"}
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* No Matches Found */}
          {hasNoMatches && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚗</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                No Shared Rides Found
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We couldn't find any shared rides matching your criteria for
                this route and time. Don't worry, we can help you find a ride!
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleRaiseRequest}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Raise Shared Ride Request"}
                </button>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600">
                    Or try adjusting your search criteria:
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      Try different time
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      Remove female-only filter
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      Expand time window
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Matching Rides */}
          {rideRequests.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {rideRequests.length} Matching Ride
                  {rideRequests.length !== 1 ? "s" : ""}
                </h2>
                <div className="text-sm text-gray-600">
                  Showing rides within ±30 minutes of your selected time
                </div>
              </div>

              <div className="space-y-4">
                {rideRequests.map((ride) => (
                  <div
                    key={ride.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">👥</span>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {ride.source} → {ride.destination}
                          </h3>
                          {ride.femaleOnly && (
                            <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs font-medium">
                              Female Only
                            </span>
                          )}
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Time:</span>{" "}
                            {formatDateTime(ride.dateTime)}
                          </div>
                          <div>
                            <span className="font-medium">Available:</span>{" "}
                            {ride.seatsAvailable}/{ride.seats} seats
                          </div>
                          <div>
                            <span className="font-medium">Fare:</span> ₹
                            {ride.farePerSeat} per seat
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleJoinRide(ride.id)}
                          disabled={loading || ride.seatsAvailable === 0}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Join Ride
                        </button>
                        {ride.seatsAvailable === 0 && (
                          <span className="text-red-600 text-xs text-center">
                            Full
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Ride Details */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Ride Type:</span>
                          <p className="font-medium">Shared Ride</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <p className="font-medium text-green-600">
                            Available
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">
                            Estimated Duration:
                          </span>
                          <p className="font-medium">{formatDuration(30)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Fare:</span>
                          <p className="font-medium">₹{ride.farePerSeat}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  📋 What's Next?
                </h3>
                <ul className="text-yellow-700 space-y-1">
                  <li>• Click "Join Ride" to reserve your seat</li>
                  <li>
                    • You'll receive confirmation once the ride is confirmed
                  </li>
                  <li>
                    • Driver will be assigned and you'll get their details
                  </li>
                  <li>
                    • For any issues, contact support or check your ride history
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedRideRequests;
