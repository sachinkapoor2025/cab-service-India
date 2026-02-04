import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { COGNITO_AUTH_URL, COGNITO_CLIENT_ID } from "../config";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "STUDENT";

  useEffect(() => {
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

    window.location.href = cognitoUrl;
  }, [role]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
        <div className="text-6xl mb-4">{role === "STUDENT" ? "🎓" : "🚗"}</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {role === "STUDENT" ? "Student Login" : "Driver Login"}
        </h2>
        <p className="text-gray-600 mb-6">
          Redirecting to secure authentication...
        </p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
        <p className="text-sm text-gray-500 mt-4">
          You'll be redirected to our secure login page
        </p>
      </div>
    </div>
  );
};

export default Auth;
