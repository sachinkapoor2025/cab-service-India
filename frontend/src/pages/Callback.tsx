import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { COGNITO_DOMAIN, COGNITO_CLIENT_ID } from "../config";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const error = urlParams.get("error");

    if (error) {
      console.error("OAuth error:", error);
      navigate("/auth");
      return;
    }

    if (code) {
      // Exchange authorization code for tokens
      exchangeCodeForTokens(code);
    } else {
      navigate("/auth");
    }
  }, [navigate]);

  const exchangeCodeForTokens = async (code: string) => {
    try {
      const domain = COGNITO_DOMAIN;
      const clientId = COGNITO_CLIENT_ID;
      const redirectUri = `${window.location.origin}/callback`;

      const tokenEndpoint = `https://${domain}.auth.ap-south-1.amazoncognito.com/oauth2/token`;

      const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: clientId,
          code: code,
          redirect_uri: redirectUri,
        }),
      });

      if (response.ok) {
        const tokens = await response.json();
        // Store tokens in localStorage or context
        localStorage.setItem("access_token", tokens.access_token);
        localStorage.setItem("id_token", tokens.id_token);
        localStorage.setItem("refresh_token", tokens.refresh_token);

        console.log("Tokens received:", tokens);
        navigate("/");
      } else {
        console.error("Failed to exchange code for tokens");
        navigate("/auth");
      }
    } catch (error) {
      console.error("Error exchanging code:", error);
      navigate("/auth");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          Processing authentication...
        </h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
};

export default Callback;
