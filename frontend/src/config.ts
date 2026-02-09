export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
export const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID || "";
export const COGNITO_DOMAIN =
  import.meta.env.VITE_COGNITO_DOMAIN || "cab-campus-auth-cab-mobility-app-1";
export const COGNITO_REGION =
  import.meta.env.VITE_COGNITO_REGION || "ap-south-1";
export const COGNITO_USER_POOL_ID =
  import.meta.env.VITE_COGNITO_USER_POOL_ID || "";
export const REDIRECT_URI =
  import.meta.env.VITE_REDIRECT_URI || `${window.location.origin}/Callback`;
export const LOGOUT_URI =
  import.meta.env.VITE_LOGOUT_URI ||
  `${window.location.origin}/auth/logout-success.html`;

// Cognito URLs
export const COGNITO_AUTH_URL = `https://${COGNITO_DOMAIN}.auth.${COGNITO_REGION}.amazoncognito.com`;
export const COGNITO_LOGOUT_URL = `${COGNITO_AUTH_URL}/logout`;
