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

  const { pickup, drop, dateTime, femaleOnly, rideData } = location.state || {};

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
      await rideApi.createRide({
        ...rideData,
        status: "WAITING_FOR_MATCH",
      });

      const searchResponse = await rideApi.getUserRides(user.id);

      if (searchResponse.data?.rides?.length > 0) {
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

  const handleJoinRide = async (_rideId: string) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      await rideApi.createRide({
        requesterId: user.id,
        source: pickup,
        destination: drop,
        route: `${pickup}-${drop}`.toLowerCase().replace(/\s+/g, ""),
        dateTime,
        seats: 1,
        farePerSeat: 50,
        isShared: true,
        femaleOnly,
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
      await rideApi.createRide({
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

  const formatDateTime = (value: string) => new Date(value).toLocaleString();

  if (loading && rideRequests.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
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
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Back
            </button>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
              {error}
            </div>
          )}

          {hasNoMatches && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">No Shared Rides Found</h2>
              <button
                onClick={handleRaiseRequest}
                className="bg-green-600 text-white px-6 py-3 rounded-lg"
              >
                Raise Shared Ride Request
              </button>
            </div>
          )}

          {rideRequests.map((ride) => (
            <div key={ride.id} className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold">
                {ride.source} → {ride.destination}
              </h3>
              <p>{formatDateTime(ride.dateTime)}</p>
              <button
                onClick={() => handleJoinRide(ride.id)}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Join Ride
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SharedRideRequests;
