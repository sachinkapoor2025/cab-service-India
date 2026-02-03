import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { COGNITO_DOMAIN, COGNITO_CLIENT_ID } from "../config";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get("role") || "STUDENT";

  useEffect(() => {
    // Redirect to Cognito Hosted UI
    const domain = COGNITO_DOMAIN;
    const clientId = COGNITO_CLIENT_ID;
    const redirectUri = `${window.location.origin}/callback`;

    const cognitoUrl = `https://${domain}.auth.ap-south-1.amazoncognito.com/oauth2/authorize?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&state=${encodeURIComponent(JSON.stringify({ role }))}`;

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
