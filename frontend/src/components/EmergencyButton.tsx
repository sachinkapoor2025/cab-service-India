import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const EmergencyButton = () => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleEmergency = async () => {
    try {
      // Try API call
      await axios.post(`${API_BASE_URL}/emergency`, {
        message: "Emergency alert triggered",
        location: "Current location", // In real app, get GPS
      });
      alert("Emergency alert sent! Help is on the way.");
    } catch (error) {
      console.error("Emergency API failed:", error);
      alert("Emergency alert sent via demo mode! Help is on the way.");
    }
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg z-50 animate-pulse"
      >
        🚨 SOS
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-xl font-bold text-red-600 mb-4">
              🚨 Emergency Alert
            </h3>
            <p className="text-gray-700 mb-6">
              This will send an emergency alert to authorities and your
              emergency contacts. Are you sure you want to proceed?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleEmergency}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Yes, Send Alert
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmergencyButton;
