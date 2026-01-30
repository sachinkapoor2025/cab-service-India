import { useState, useEffect } from "react";

interface RideHistory {
  id: string;
  source: string;
  destination: string;
  date: string;
  fare: number;
  status: string;
}

const History = () => {
  const [rides, setRides] = useState<RideHistory[]>([]);

  useEffect(() => {
    // Load from localStorage for demo
    const savedRides = localStorage.getItem("rideHistory");
    if (savedRides) {
      setRides(JSON.parse(savedRides));
    } else {
      // Mock data
      setRides([
        {
          id: "1",
          source: "Delhi",
          destination: "Gurgaon",
          date: "2024-01-15",
          fare: 250,
          status: "completed",
        },
        {
          id: "2",
          source: "Mumbai",
          destination: "Pune",
          date: "2024-01-20",
          fare: 300,
          status: "completed",
        },
      ]);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Ride History</h2>
      {rides.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚗</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No rides yet
          </h3>
          <p className="text-gray-500">Your completed rides will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rides.map((ride) => (
            <div
              key={ride.id}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-400"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">📍</span>
                    <span className="font-semibold text-lg">
                      {ride.source} → {ride.destination}
                    </span>
                  </div>
                  <p className="text-gray-600">{ride.date}</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      ride.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {ride.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    ₹{ride.fare}
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
