import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  COGNITO_AUTH_URL,
  COGNITO_CLIENT_ID,
  REDIRECT_URI,
  LOGOUT_URI,
} from "../config";
import { userApi } from "../services/api";

const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState("Processing authentication...");

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");
      const error = urlParams.get("error");

      if (error) {
        console.error("OAuth error:", error);
        navigate("/auth");
        return;
      }

      if (code) {
        try {
          setStatus("Exchanging code for tokens...");
          const tokens = await exchangeCodeForTokens(code);

          setStatus("Getting user info from Cognito...");
          const userInfo = await getUserInfo(tokens.access_token);

          setStatus("Creating/updating user profile...");

          // Extract role from state parameter
          let userRole = "STUDENT"; // default role
          if (state) {
            try {
              const stateObj = JSON.parse(decodeURIComponent(state));
              userRole = stateObj.role || "STUDENT";
            } catch (e) {
              console.warn("Failed to parse state parameter:", e);
            }
          }

          const userProfile = await createOrGetUserProfile(userInfo, userRole);

          // Store user profile and auth data
          localStorage.setItem("user", JSON.stringify(userProfile));
          localStorage.setItem("role", userRole);
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("access_token", tokens.access_token);
          localStorage.setItem("id_token", tokens.id_token);
          localStorage.setItem("refresh_token", tokens.refresh_token);

          setStatus("Login successful! Redirecting...");

          // Redirect based on role
          setTimeout(() => {
            if (userRole === "DRIVER") {
              navigate("/driver-dashboard");
            } else {
              navigate("/");
            }
          }, 1000);
        } catch (error) {
          console.error("Authentication error:", error);
          navigate("/auth");
        }
      } else {
        navigate("/auth");
      }
    };

    handleCallback();
  }, [navigate, location]);

  const exchangeCodeForTokens = async (code: string) => {
    const tokenEndpoint = `${COGNITO_AUTH_URL}/oauth2/token`;

    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: COGNITO_CLIENT_ID,
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to exchange code for tokens");
    }

    const tokens = await response.json();
    return tokens;
  };

  const getUserInfo = async (accessToken: string) => {
    const userInfoEndpoint = `${COGNITO_AUTH_URL}/oauth2/userInfo`;

    const response = await fetch(userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get user info");
    }

    return await response.json();
  };

  const createOrGetUserProfile = async (userInfo: any, role: string) => {
    // Extract phone from email (assuming email contains phone for Cognito)
    // In production, you'd need to map Cognito user to your user system properly
    const phone =
      userInfo.email?.replace(/[^0-9]/g, "").slice(-10) || "0000000000";

    const response = await userApi.createUser({
      phone,
      role: role as "STUDENT" | "DRIVER",
      name: userInfo.name || userInfo.given_name,
      email: userInfo.email,
    });

    return response.data.user;
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">{status}</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
};

export default Callback;
