import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center space-x-2 text-2xl font-bold hover:scale-105 transition-transform"
        >
          <span className="text-3xl">🎓</span>
          <span>CampusRide</span>
        </Link>
        <nav className="flex space-x-6">
          <Link
            to="/search"
            className="hover:text-yellow-300 transition-colors font-medium flex items-center space-x-1"
          >
            <span>🔍</span>
            <span>Find Ride</span>
          </Link>
          {user ? (
            <>
              <Link
                to="/history"
                className="hover:text-yellow-300 transition-colors font-medium flex items-center space-x-1"
              >
                <span>📚</span>
                <span>My Rides</span>
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-yellow-300 transition-colors font-medium flex items-center space-x-1"
              >
                <span>👋</span>
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="bg-white text-purple-600 px-4 py-2 rounded-full font-bold hover:bg-yellow-300 transition-colors flex items-center space-x-1"
            >
              <span>🎓</span>
              <span>Student Login</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
