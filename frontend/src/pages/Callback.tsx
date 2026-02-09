import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { COGNITO_AUTH_URL, COGNITO_CLIENT_ID, REDIRECT_URI } from "../config";
import { userApi } from "../services/api";

const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState("Processing authentication...");

  const hasRunRef = useRef(false);

  // 🔒 HARD LOCK to block auth guards
  useEffect(() => {
    localStorage.setItem("auth_in_progress", "true");
    return () => {
      localStorage.removeItem("auth_in_progress");
    };
  }, []);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const handleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");
      const error = urlParams.get("error");

      if (error || !code) {
        window.location.replace("/auth");
        return;
      }

      try {
        setStatus("Exchanging code for tokens...");
        const tokens = await exchangeCodeForTokens(code);

        console.log("ACCESS TOKEN:", tokens.access_token);

        setStatus("Getting user info from Cognito...");
        const userInfo = await getUserInfo(tokens.access_token);

        let userRole = "STUDENT";
        if (state) {
          try {
            const stateObj = JSON.parse(decodeURIComponent(state));
            userRole = stateObj.role || "STUDENT";
          } catch {}
        }

        const userProfile = await createOrGetUserProfile(userInfo, userRole);

        localStorage.setItem("user", JSON.stringify(userProfile));
        localStorage.setItem("role", userRole);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("access_token", tokens.access_token);
        localStorage.setItem("id_token", tokens.id_token);
        localStorage.setItem("refresh_token", tokens.refresh_token);

        // 🔥 Remove OAuth params completely
        window.history.replaceState({}, document.title, "/");

        setTimeout(() => {
          navigate(userRole === "DRIVER" ? "/driver-dashboard" : "/booking", {
            replace: true,
          });
        }, 300);
      } catch (err) {
        console.error(err);
        window.location.replace("/auth");
      }
    };

    handleCallback();
  }, [location.search, navigate]);

  const exchangeCodeForTokens = async (code: string) => {
    const response = await fetch(`${COGNITO_AUTH_URL}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: COGNITO_CLIENT_ID,
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!response.ok) throw new Error("Token exchange failed");
    return response.json();
  };

  const getUserInfo = async (accessToken: string) => {
    const response = await fetch(`${COGNITO_AUTH_URL}/oauth2/userinfo`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) throw new Error("UserInfo failed");
    return response.json();
  };

  const createOrGetUserProfile = async (userInfo: any, role: string) => {
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
