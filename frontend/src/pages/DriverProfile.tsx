import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { driverApi } from "../services/api";

interface DriverProfile {
  id?: string;
  phone: string;
  name: string;
  email?: string;
  vehicleType: string;
  vehicleNumber: string;
  licenseNumber: string;
  licenseExpiry: string;
  aadharNumber?: string;
  isAvailable: boolean;
}

const DriverProfile: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<DriverProfile>({
    phone: user?.phone || "",
    name: user?.name || "",
    email: user?.email || "",
    vehicleType: "",
    vehicleNumber: "",
    licenseNumber: "",
    licenseExpiry: "",
    aadharNumber: "",
    isAvailable: true,
  });

  useEffect(() => {
    if (user) {
      fetchDriverProfile();
    }
  }, [user]);

  const fetchDriverProfile = async () => {
    if (!user) return;

    try {
      const response = await driverApi.getDriver(user.id);
      if (response.data) {
        setFormData({
          ...response.data,
          phone: user.phone,
          name: user.name || "",
          email: user.email || "",
        });
      }
    } catch (err) {
      console.error("Error fetching driver profile:", err);
      // Continue with empty form for new driver
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const driverData = {
        phone: user.phone,
        name: formData.name,
        email: formData.email,
        vehicleType: formData.vehicleType,
        vehicleNumber: formData.vehicleNumber,
        licenseNumber: formData.licenseNumber,
        licenseExpiry: formData.licenseExpiry,
        aadharNumber: formData.aadharNumber,
      };

      if (formData.id) {
        // Update existing driver profile
        await driverApi.updateDriver(formData.id, driverData);
        setSuccess("Driver profile updated successfully!");
      } else {
        // Create new driver profile
        await driverApi.createDriver(driverData);
        setSuccess("Driver profile created successfully!");
      }

      // Update availability status
      await driverApi.setAvailability(user.id, formData.isAvailable);
    } catch (err) {
      console.error("Error saving driver profile:", err);
      setError("Failed to save driver profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityToggle = async () => {
    if (!user) return;

    const newStatus = !formData.isAvailable;
    setFormData((prev) => ({ ...prev, isAvailable: newStatus }));

    try {
      await driverApi.setAvailability(user.id, newStatus);
      setSuccess(
        `Availability updated to ${newStatus ? "Available" : "Not Available"}`,
      );
    } catch (err) {
      console.error("Error updating availability:", err);
      setError("Failed to update availability. Please try again.");
      // Revert the change if API call fails
      setFormData((prev) => ({ ...prev, isAvailable: !newStatus }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            🚗 Driver Profile
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhar Number
                </label>
                <input
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber || ""}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional"
                />
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type *
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select vehicle type</option>
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                  <option value="scooter">Scooter</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Number *
                </label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., DL01AB1234"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Number *
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Expiry *
                </label>
                <input
                  type="date"
                  name="licenseExpiry"
                  value={formData.licenseExpiry}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Availability Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    📍 Availability Status
                  </h3>
                  <p className="text-blue-600">
                    Toggle your availability to receive ride requests
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-2 rounded-full text-sm font-medium ${
                      formData.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {formData.isAvailable ? "Available" : "Not Available"}
                  </span>
                  <button
                    type="button"
                    onClick={handleAvailabilityToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isAvailable ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Saving..."
                  : formData.id
                    ? "Update Profile"
                    : "Create Profile"}
              </button>
            </div>
          </form>

          {/* Instructions */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              📋 Important Notes
            </h3>
            <ul className="text-yellow-700 space-y-1">
              <li>• All fields marked with * are required</li>
              <li>
                • Ensure your vehicle number and license details are accurate
              </li>
              <li>
                • Keep your availability status updated to receive ride requests
              </li>
              <li>• License expiry date must be in the future</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
