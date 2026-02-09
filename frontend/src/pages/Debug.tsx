import { useState } from "react";
import { userApi } from "../services/api";

const Debug = () => {
  const [testEmail, setTestEmail] = useState("test1234567890@example.com");
  const [testRole, setTestRole] = useState("STUDENT");
  const [testName, setTestName] = useState("Test User");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestUserCreation = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Extract phone from email (first 10 digits)
      const emailPhone = testEmail.replace(/[^0-9]/g, "").slice(0, 10);
      const phone = emailPhone || "0000000000";

      console.log("Testing user creation with:", {
        phone,
        role: testRole,
        name: testName,
        email: testEmail,
      });

      const response = await userApi.createUser({
        phone,
        role: testRole as "STUDENT" | "DRIVER",
        name: testName,
        email: testEmail,
      });

      setResult(response.data);
      console.log("User creation successful:", response.data);
    } catch (err: any) {
      setError(err.message || "User creation failed");
      console.error("User creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestUserFetch = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Extract phone from email (first 10 digits)
      const emailPhone = testEmail.replace(/[^0-9]/g, "").slice(0, 10);
      const phone = emailPhone || "0000000000";

      console.log("Testing user fetch with phone:", phone);

      // Note: We need to get user by ID, not phone directly
      // This is just for testing the API connection
      const response = await fetch(
        `${process.env.VITE_API_BASE_URL}/users/test-user-id`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        setResult({ error: `HTTP ${response.status}: ${response.statusText}` });
      }
    } catch (err: any) {
      setError(err.message || "User fetch failed");
      console.error("User fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        🔧 Debug User Creation
      </h1>

      {/* API Configuration */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">API Configuration:</h2>
        <p>
          <strong>Base URL:</strong>{" "}
          {process.env.VITE_API_BASE_URL || "Not set"}
        </p>
        <p>
          <strong>Access Token:</strong>{" "}
          {localStorage.getItem("access_token") ? "Present" : "Missing"}
        </p>
        <p>
          <strong>Test Email:</strong> {testEmail}
        </p>
        <p>
          <strong>Extracted Phone:</strong>{" "}
          {testEmail.replace(/[^0-9]/g, "").slice(0, 10) || "0000000000"}
        </p>
      </div>

      {/* Test Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Test User Creation</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Test Email:
            </label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="test1234567890@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role:</label>
            <select
              value={testRole}
              onChange={(e) => setTestRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="STUDENT">STUDENT</option>
              <option value="DRIVER">DRIVER</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Name:</label>
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Test User"
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleTestUserCreation}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Testing..." : "Test User Creation"}
            </button>
            <button
              onClick={handleTestUserFetch}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Testing..." : "Test User Fetch"}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Results:</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          📋 Debug Instructions:
        </h3>
        <ul className="text-yellow-700 space-y-2">
          <li>1. Make sure you're logged in (has access token)</li>
          <li>
            2. Enter a test email with 10 digits (e.g.,
            test1234567890@example.com)
          </li>
          <li>3. Click "Test User Creation" to create a test user</li>
          <li>4. Check the console for detailed logs</li>
          <li>5. Check your DynamoDB table for the created user</li>
        </ul>
      </div>
    </div>
  );
};

export default Debug;
