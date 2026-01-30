import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import EmergencyButton from "./components/EmergencyButton";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import RideSearch from "./pages/RideSearch";
import Booking from "./pages/Booking";
import History from "./pages/History";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/search" element={<RideSearch />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
        <EmergencyButton />
      </div>
    </Router>
  );
}

export default App;
