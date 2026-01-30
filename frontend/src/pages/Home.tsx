import { Link } from "react-router-dom";

const Home = () => {
  const features = [
    {
      icon: "🎓",
      title: "Campus Rides",
      description: "Perfect for college students commuting to classes",
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: "👥",
      title: "Shared Adventures",
      description: "Split costs with friends going the same way",
      color: "from-purple-400 to-purple-600",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Book your ride in seconds with our smart search",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: "🛡️",
      title: "Student Safe",
      description: "Verified drivers and 24/7 emergency support",
      color: "from-green-400 to-green-600",
    },
    {
      icon: "💰",
      title: "Budget Friendly",
      description: "Cheapest rides for students on a budget",
      color: "from-pink-400 to-pink-600",
    },
    {
      icon: "🎉",
      title: "Fun Experience",
      description: "Enjoy your ride with our amazing drivers",
      color: "from-indigo-400 to-indigo-600",
    },
  ];

  const user = localStorage.getItem("user");

  return (
    <div className="text-center">
      {/* Hero Section */}
      <div
        className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white py-24 px-4 rounded-2xl mb-12 overflow-hidden shadow-2xl"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="relative z-10">
          <h1 className="text-6xl font-black mb-6 drop-shadow-lg">
            🚗 CampusRide
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto font-medium drop-shadow-md">
            Your perfect ride from campus to anywhere! Share rides, save money,
            and make friends along the way. 🎓✨
          </p>
          <div className="flex justify-center space-x-4">
            {user ? (
              <Link
                to="/search"
                className="bg-white text-purple-600 hover:bg-yellow-300 font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🎯 Find Your Ride
              </Link>
            ) : (
              <Link
                to="/auth"
                className="bg-white text-purple-600 hover:bg-yellow-300 font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🎓 Join CampusRide
              </Link>
            )}
          </div>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-2xl"></div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-gray-100"
          >
            <div
              className={`bg-gradient-to-r ${feature.color} rounded-full w-16 h-16 flex items-center justify-center text-2xl mb-4 mx-auto`}
            >
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              {feature.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Car Showcase Section */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-8 text-gray-800">🚗 Our Fleet</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="relative group overflow-hidden rounded-xl shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1549399735-cef2e2c3f638?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
              alt="Luxury Sedan"
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <h3 className="text-white font-bold text-lg">Premium Sedan</h3>
              <p className="text-gray-200">
                Comfortable rides for special occasions
              </p>
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-xl shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
              alt="SUV"
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <h3 className="text-white font-bold text-lg">Spacious SUV</h3>
              <p className="text-gray-200">
                Perfect for group rides and luggage
              </p>
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-xl shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1549399735-cef2e2c3f638?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
              alt="Compact Car"
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <h3 className="text-white font-bold text-lg">
                Compact Hatchback
              </h3>
              <p className="text-gray-200">Fuel-efficient for daily commutes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-100 rounded-lg py-12 px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          Trusted by Millions
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-4xl font-bold text-yellow-600 mb-2">10M+</div>
            <p className="text-gray-600">Happy Riders</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-yellow-600 mb-2">500K+</div>
            <p className="text-gray-600">Verified Drivers</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-yellow-600 mb-2">50+</div>
            <p className="text-gray-600">Cities Covered</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Ready to ride?
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Join thousands of users who trust us for their daily commute
          </p>
          <Link
            to="/auth"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-lg text-lg transition-colors inline-block"
          >
            Get Started Now 🚀
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
