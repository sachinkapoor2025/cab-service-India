import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface RideResult {
  id: string;
  driver: string;
  vehicle: string;
  rating: number;
  fare: number;
  seats: number;
  time: string;
}

const RideSearch = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [rideType, setRideType] = useState("shared");
  const [results, setResults] = useState<RideResult[]>([]);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    // Mock search results
    const mockResults: RideResult[] = [
      {
        id: "1",
        driver: "Rajesh Kumar",
        vehicle: "Honda City (White)",
        rating: 4.8,
        fare: rideType === "shared" ? 50 : 200,
        seats: rideType === "shared" ? 3 : 1,
        time: "2:30 PM",
      },
      {
        id: "2",
        driver: "Priya Sharma",
        vehicle: "Toyota Innova (Black)",
        rating: 4.9,
        fare: rideType === "shared" ? 55 : 220,
        seats: rideType === "shared" ? 2 : 1,
        time: "3:00 PM",
      },
      {
        id: "3",
        driver: "Amit Singh",
        vehicle: "Maruti Swift (Blue)",
        rating: 4.7,
        fare: rideType === "shared" ? 45 : 180,
        seats: rideType === "shared" ? 4 : 1,
        time: "3:15 PM",
      },
    ];
    setResults(mockResults);
    setSearched(true);
  };

  const handleBook = (result: RideResult) => {
    navigate("/booking", {
      state: {
        source,
        destination,
        date,
        time,
        rideType,
        driver: result.driver,
        fare: result.fare,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Find Your Ride</h2>

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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ride Type
            </label>
            <select
              value={rideType}
              onChange={(e) => setRideType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="shared">🚗 Shared Ride</option>
              <option value="private">🏎️ Private Ride</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-colors"
            >
              🔍 Search Rides
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searched && (
        <div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            Available Rides
          </h3>
          {results.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <div className="text-6xl mb-4">🚫</div>
              <h4 className="text-xl font-semibold text-gray-600 mb-2">
                No rides found
              </h4>
              <p className="text-gray-500">Try different locations or times</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-400"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">👤</span>
                        <span className="font-semibold text-lg">
                          {result.driver}
                        </span>
                        <span className="text-yellow-500">
                          ⭐ {result.rating}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{result.vehicle}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>🕐 {result.time}</span>
                        <span>💺 {result.seats} seats available</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600 mb-2">
                        ₹{result.fare}
                      </p>
                      <button
                        onClick={() => handleBook(result)}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RideSearch;
