import { useState } from "react";
import axios from "axios";

type AuthMode = "login" | "signup";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const handleSendOtp = async () => {
    try {
      // Mock OTP send
      alert(
        `OTP sent to ${phone}${mode === "signup" ? " for registration" : ""}`,
      );
      setShowOtp(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post<{ id: string; phone: string }>(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          phone,
        },
      );
      alert(`${mode === "login" ? "Logged in" : "Signed up"} successfully! 🎉`);
      // Store user data
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert(
        `${mode === "login" ? "Login" : "Signup"} failed - using demo mode`,
      );
      // Demo mode: create mock user
      const mockUser = { id: "demo-" + Date.now(), phone };
      localStorage.setItem("user", JSON.stringify(mockUser));
      window.location.reload(); // Refresh to show logged in state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎓</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Students!
          </h2>
          <p className="text-gray-600">Your campus ride awaits 🚗</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => {
              setMode("login");
              setShowOtp(false);
              setOtp("");
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === "login"
                ? "bg-purple-600 text-white shadow-md"
                : "text-gray-600 hover:text-purple-600"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setMode("signup");
              setShowOtp(false);
              setOtp("");
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === "signup"
                ? "bg-pink-600 text-white shadow-md"
                : "text-gray-600 hover:text-pink-600"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📱 Phone Number
            </label>
            <input
              type="tel"
              placeholder="Enter your 10-digit number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>

          {!showOtp ? (
            <button
              onClick={handleSendOtp}
              disabled={!phone || phone.length !== 10}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
            >
              📩 Send OTP
            </button>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔐 Enter OTP
                </label>
                <input
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all text-center text-2xl font-mono"
                  maxLength={6}
                />
              </div>
              <button
                onClick={handleVerifyOtp}
                disabled={!otp || otp.length !== 6}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
              >
                {mode === "login" ? "🚀 Login" : "🎉 Sign Up"}
              </button>
              <button
                onClick={() => setShowOtp(false)}
                className="w-full text-gray-500 hover:text-gray-700 font-medium py-2"
              >
                ← Back
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {mode === "login"
              ? "New to CampusRide? Switch to Sign Up!"
              : "Already have an account? Switch to Login!"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
