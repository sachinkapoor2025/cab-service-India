import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";
import EmergencyButton from "./components/EmergencyButton";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import RideSearch from "./pages/RideSearch";
import Booking from "./pages/Booking";
import History from "./pages/History";
import Callback from "./pages/Callback";
import DriverDashboard from "./pages/DriverDashboard";
import DriverProfile from "./pages/DriverProfile";
import DriverRide from "./pages/DriverRide";
import SharedRideRequests from "./pages/SharedRideRequests";

// Protected Route Component
const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: string;
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role === "DRIVER") {
    return <Navigate to="/driver-dashboard" replace />;
  }

  return <Navigate to="/" replace />;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/callback" element={<Callback />} />

          {/* Student Routes */}
          <Route
            path="/booking"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <RideSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <History />
              </ProtectedRoute>
            }
          />

          {/* Driver Routes */}
          <Route
            path="/driver-dashboard"
            element={
              <ProtectedRoute requiredRole="DRIVER">
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver-profile"
            element={
              <ProtectedRoute requiredRole="DRIVER">
                <DriverProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver-ride"
            element={
              <ProtectedRoute requiredRole="DRIVER">
                <DriverRide />
              </ProtectedRoute>
            }
          />

          {/* Shared Ride Discovery */}
          <Route
            path="/shared-ride-requests"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <SharedRideRequests />
              </ProtectedRoute>
            }
          />

          {/* Auto-redirect based on role */}
          <Route path="/dashboard" element={<RoleBasedRedirect />} />
        </Routes>
      </main>
      <EmergencyButton />
    </div>
  );
}

export default App;
