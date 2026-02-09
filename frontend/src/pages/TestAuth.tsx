import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { COGNITO_AUTH_URL, COGNITO_CLIENT_ID } from "../config";

const TestAuth = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "STUDENT";
  const [config, setConfig] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Test configuration
    const testConfig = {
      COGNITO_AUTH_URL,
      COGNITO_CLIENT_ID,
      windowLocationOrigin: window.location.origin,
      redirectUri: `${window.location.origin}/callback`,
      role,
    };

    setConfig(testConfig);
    console.log("Test Auth Configuration:", testConfig);

    // Validate configuration
    if (!COGNITO_AUTH_URL) {
      setError("COGNITO_AUTH_URL is missing");
    } else if (!COGNITO_CLIENT_ID) {
      setError("COGNITO_CLIENT_ID is missing");
    } else if (!window.location.origin) {
      setError("window.location.origin is missing");
    } else {
      setError(null);
    }
  }, [role]);

  const handleTestRedirect = () => {
    try {
      const redirectUri = `${window.location.origin}/callback`;

      const cognitoUrl =
        `${COGNITO_AUTH_URL}/oauth2/authorize?` +
        new URLSearchParams({
          client_id: COGNITO_CLIENT_ID,
          response_type: "code",
          scope: "openid email profile",
          redirect_uri: redirectUri,
          state: JSON.stringify({ role }),
        });

      console.log("Testing redirect to:", cognitoUrl);
      window.location.href = cognitoUrl;
    } catch (err) {
      console.error("Redirect error:", err);
      setError("Failed to create redirect URL");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        🔧 Test Auth Configuration
      </h1>

      {/* Configuration Display */}
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Configuration Status:</h2>
        <div className="space-y-2">
          <div
            className={`p-2 rounded ${config.COGNITO_AUTH_URL ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            <strong>COGNITO_AUTH_URL:</strong>{" "}
            {config.COGNITO_AUTH_URL || "MISSING"}
          </div>
          <div
            className={`p-2 rounded ${config.COGNITO_CLIENT_ID ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            <strong>COGNITO_CLIENT_ID:</strong>{" "}
            {config.COGNITO_CLIENT_ID || "MISSING"}
          </div>
          <div
            className={`p-2 rounded ${config.windowLocationOrigin ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            <strong>Window Origin:</strong>{" "}
            {config.windowLocationOrigin || "MISSING"}
          </div>
          <div
            className={`p-2 rounded ${config.redirectUri ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            <strong>Redirect URI:</strong> {config.redirectUri || "MISSING"}
          </div>
          <div className="p-2 rounded bg-blue-100 text-blue-800">
            <strong>Role:</strong> {config.role}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Test Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Actions:</h2>

        <div className="space-y-4">
          <button
            onClick={handleTestRedirect}
            disabled={!!error}
            className={`w-full py-3 px-6 rounded-lg font-bold transition-colors ${
              error
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Test Cognito Redirect
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full py-3 px-6 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-bold transition-colors"
          >
            Go to Home Page
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          📋 Test Instructions:
        </h3>
        <ul className="text-yellow-700 space-y-2">
          <li>
            1. Check if all configuration values are present (green background)
          </li>
          <li>2. If any are missing (red background), check your .env file</li>
          <li>3. Click "Test Cognito Redirect" to test the OAuth2.0 flow</li>
          <li>4. Check browser console for detailed logs</li>
        </ul>
      </div>
    </div>
  );
};

export default TestAuth;
