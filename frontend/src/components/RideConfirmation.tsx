import React from "react";
import { useNavigate } from "react-router-dom";

interface RideConfirmationProps {
  rideDetails: {
    source: string;
    destination: string;
    dateTime: string;
    rideType: string;
    fare: number;
    isShared?: boolean;
    femaleOnly?: boolean;
  };
  onConfirm: () => void;
  onCancel: () => void;
}

const RideConfirmation: React.FC<RideConfirmationProps> = ({
  rideDetails,
  onConfirm,
  onCancel,
}) => {
  const navigate = useNavigate();

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Confirm Your Ride
            </h2>
            <p className="text-gray-600">
              Please review your ride details before confirming
            </p>
          </div>

          {/* Ride Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">From:</span>
                <span className="font-semibold">{rideDetails.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">To:</span>
                <span className="font-semibold">{rideDetails.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-semibold">
                  {formatDateTime(rideDetails.dateTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ride Type:</span>
                <span className="font-semibold">
                  {rideDetails.isShared ? "Shared Ride" : "Private Ride"}
                </span>
              </div>
              {rideDetails.femaleOnly && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Preference:</span>
                  <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-sm">
                    Female Only
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-600">Total Fare:</span>
                <span className="text-2xl font-bold text-green-600">
                  ₹{rideDetails.fare}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Confirm Ride
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideConfirmation;
