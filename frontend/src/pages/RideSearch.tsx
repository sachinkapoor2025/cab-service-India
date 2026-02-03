import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { rideApi } from "../services/api";

interface RideResult {
  id: string;
  requesterId: string;
  source: string;
  destination: string;
  dateTime: string;
  maxSeats: number;
  availableSeats: number;
  farePerSeat: number;
  isShared: boolean;
  femaleOnly?: boolean;
  status: string;
  passengers: string[];
  createdAt: string;
}

const RideSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get initial values from location state (from Booking page)
  const initialData =
    (location.state as {
      source?: string;
      destination?: string;
      date?: string;
      time?: string;
      femaleOnly?: boolean;
      route?: string;
      dateTime?: string;
    }) || {};

  const [source, setSource] = useState(initialData.source || "");
  const [destination, setDestination] = useState(initialData.destination || "");
  const [date, setDate] = useState(initialData.date || "");
  const [time, setTime] = useState(initialData.time || "");
  const [femaleOnly, setFemaleOnly] = useState(initialData.femaleOnly || false);
  const [results, setResults] = useState<RideResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Auto-search if we have initial data from Booking page
    if (initialData.source && initialData.destination) {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    if (!source || !destination) {
      alert("Please enter pickup and drop locations");
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      // Create route hash for matching
      const route = `${source}-${destination}`
        .toLowerCase()
        .replace(/\s+/g, "");
      const dateTime =
        initialData.dateTime ||
        (date && time
          ? new Date(`${date}T${time}`).toISOString()
          : new Date().toISOString());

      const response = await rideApi.searchSharedRides({
        route,
        dateTime,
        femaleOnly,
      });

      setResults(response.data.rides || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
      alert("Failed to search for rides. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRide = async (result: RideResult) => {
    if (!user) {
      alert("Please login first");
      navigate("/auth");
      return;
    }

    if (result.availableSeats <= 0) {
      alert("No seats available for this ride");
      return;
    }

    setLoading(true);

    try {
      await rideApi.joinSharedRide({
        rideId: result.id,
        userId: user.id,
      });
      alert("Successfully joined the ride!");
      navigate("/history");
    } catch (error) {
      console.error("Join ride error:", error);
      alert("Failed to join ride. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewRequest = () => {
    navigate("/booking", {
      state: {
        source,
        destination,
        date,
        time,
        rideType: "SHARED",
        femaleOnly,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Find Shared Rides
      </h2>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <input
              type="text"
              placeholder="Pickup location"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <input
              type="text"
              placeholder="Drop location"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="flex items-center mt-6">
              <input
                type="checkbox"
                checked={femaleOnly}
                onChange={(e) => setFemaleOnly(e.target.checked)}
                className="mr-2"
              />
              Female-only rides only
            </label>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Searching..." : "🔍 Search Rides"}
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searched && (
        <div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            Available Shared Rides
          </h3>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Searching for rides...</p>
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No shared rides found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search criteria or create a new ride request
              </p>
              <button
                onClick={handleCreateNewRequest}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Create Ride Request
              </button>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-400"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">👥</span>
                        <span className="font-semibold text-lg">
                          Shared Ride
                        </span>
                        {result.femaleOnly && (
                          <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs">
                            Female Only
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">
                        From {result.source} to {result.destination}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>
                          🕐 {new Date(result.dateTime).toLocaleString()}
                        </span>
                        <span>
                          💺 {result.availableSeats}/{result.maxSeats} seats
                          available
                        </span>
                        <span>👥 {result.passengers.length} passengers</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600 mb-2">
                        ₹{result.farePerSeat}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">per seat</p>
                      <button
                        onClick={() => handleJoinRide(result)}
                        disabled={loading || result.availableSeats <= 0}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Join Ride
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Create New Request Option */}
              <div className="bg-blue-50 rounded-lg shadow-md p-6 border-l-4 border-blue-400">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-800 mb-1">
                      Don't see a matching ride?
                    </h4>
                    <p className="text-blue-600">
                      Create your own ride request and find passengers
                    </p>
                  </div>
                  <button
                    onClick={handleCreateNewRequest}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                  >
                    Create Request
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RideSearch;
