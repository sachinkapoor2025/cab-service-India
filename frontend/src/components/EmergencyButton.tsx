import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { rideApi } from "../services/api";

interface EmergencyContact {
  name: string;
  phone: string;
}

const EmergencyButton: React.FC = () => {
  const { user } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [hasActiveRide, setHasActiveRide] = useState(false);
  const [currentRide, setCurrentRide] = useState<any>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<
    EmergencyContact[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Check for emergency contacts in localStorage
  useEffect(() => {
    const savedContacts = localStorage.getItem("emergencyContacts");
    if (savedContacts) {
      setEmergencyContacts(JSON.parse(savedContacts));
    }
  }, []);

  // Check for active ride
  useEffect(() => {
    if (user) {
      checkActiveRide();
    }
  }, [user]);

  const checkActiveRide = async () => {
    if (!user) return;

    try {
      const response = await rideApi.getUserRides(user.id);
      const rides = response.data.rides || [];

      // Check for rides with status IN_PROGRESS or SCHEDULED
      const activeRide = rides.find(
        (ride: any) =>
          ride.status === "IN_PROGRESS" || ride.status === "SCHEDULED",
      );

      if (activeRide) {
        setHasActiveRide(true);
        setCurrentRide(activeRide);
      } else {
        setHasActiveRide(false);
        setCurrentRide(null);
      }
    } catch (error) {
      console.error("Error checking active ride:", error);
      // Fallback: show button for demo purposes
      setHasActiveRide(true);
      setCurrentRide({
        id: "demo-ride-1",
        source: "Delhi University",
        destination: "IIT Delhi",
        status: "IN_PROGRESS",
      });
    }
  };

  const handleEmergency = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    // Check if emergency contacts are set
    if (emergencyContacts.length < 2) {
      setShowContactsModal(true);
      setShowConfirm(false);
      return;
    }

    setLoading(true);

    try {
      // Get current location (placeholder for GPS)
      const location = {
        lat: 28.6139, // Delhi coordinates as placeholder
        lng: 77.209,
      };

      // Call the emergency trigger API
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/emergency/trigger`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          userId: user.id,
          rideId: currentRide?.id,
          emergencyContacts: emergencyContacts.map((contact) => contact.phone),
          location,
        }),
      });

      setSuccess(true);
      setShowConfirm(false);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Emergency API failed:", error);
      alert(
        "Emergency alert failed to send. Please call emergency services directly.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContacts = () => {
    if (emergencyContacts.length < 2) {
      alert("Please add exactly 2 emergency contacts.");
      return;
    }

    localStorage.setItem(
      "emergencyContacts",
      JSON.stringify(emergencyContacts),
    );
    setShowContactsModal(false);

    // Now trigger the emergency after saving contacts
    handleEmergency();
  };

  const addContact = () => {
    setEmergencyContacts([...emergencyContacts, { name: "", phone: "" }]);
  };

  const updateContact = (
    index: number,
    field: "name" | "phone",
    value: string,
  ) => {
    const updatedContacts = [...emergencyContacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setEmergencyContacts(updatedContacts);
  };

  const removeContact = (index: number) => {
    const updatedContacts = emergencyContacts.filter((_, i) => i !== index);
    setEmergencyContacts(updatedContacts);
  };

  // Only show button if user has an active ride
  if (!hasActiveRide || !user) {
    return null;
  }

  return (
    <>
      {/* Emergency Button */}
      <button
        onClick={() => setShowConfirm(true)}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-full shadow-lg z-50 animate-pulse transition-all duration-300 hover:scale-110"
        style={{
          boxShadow:
            "0 10px 25px -5px rgba(239, 68, 68, 0.5), 0 8px 10px -6px rgba(239, 68, 68, 0.5)",
        }}
      >
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🚨</span>
          <span className="font-bold text-lg">EMERGENCY</span>
        </div>
      </button>

      {/* Success Message */}
      {success && (
        <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right-full duration-300">
          Emergency alert sent successfully!
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-3xl">🚨</span>
              <h3 className="text-xl font-bold text-red-600">
                Emergency Alert
              </h3>
            </div>
            <p className="text-gray-700 mb-6">
              This will send an emergency alert to authorities and your
              emergency contacts. Are you sure you want to proceed?
            </p>
            <div className="space-y-3">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">
                  <strong>Ride:</strong> {currentRide?.source} →{" "}
                  {currentRide?.destination}
                </p>
                <p className="text-sm text-red-700">
                  <strong>Status:</strong> {currentRide?.status}
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleEmergency}
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Yes, Send Alert"}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Contacts Modal */}
      {showContactsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 w-full">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">📱</span>
              <h3 className="text-xl font-bold text-gray-800">
                Emergency Contacts
              </h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Please provide 2 emergency contacts to receive alerts.
            </p>

            <div className="space-y-4 mb-6">
              {emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-3"
                >
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Contact name"
                      value={contact.name}
                      onChange={(e) =>
                        updateContact(index, "name", e.target.value)
                      }
                      className="p-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={contact.phone}
                      onChange={(e) =>
                        updateContact(index, "phone", e.target.value)
                      }
                      className="p-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <button
                    onClick={() => removeContact(index)}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}

              {emergencyContacts.length < 2 && (
                <button
                  onClick={addContact}
                  className="w-full bg-blue-50 text-blue-600 py-2 px-4 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  + Add Contact
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSaveContacts}
                disabled={emergencyContacts.length < 2}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save & Send Alert
              </button>
              <button
                onClick={() => setShowContactsModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
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
