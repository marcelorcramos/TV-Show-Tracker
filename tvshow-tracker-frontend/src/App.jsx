cat > src/App.jsx << 'EOF'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';

// Placeholder pages
const Login = () => (
  <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
    <p className="text-gray-600 text-center">Login page coming soon...</p>
  </div>
);

const Register = () => (
  <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
    <p className="text-gray-600 text-center">Register page coming soon...</p>
  </div>
);

const TvShows = () => (
  <div>
    <h1 className="text-3xl font-bold mb-6 text-center">TV Shows</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Mock TV Show Cards */}
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="bg-white rounded-lg shadow-md p-6">
          <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
            <span className="text-gray-500">TV Show Image</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">TV Show {item}</h3>
          <p className="text-gray-600 mb-2">Genre: Drama</p>
          <p className="text-gray-600 mb-4">Rating: 8.{item}</p>
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            View Details
          </button>
        </div>
      ))}
    </div>
  </div>
);

const Actors = () => (
  <div>
    <h1 className="text-3xl font-bold mb-6 text-center">Actors</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-gray-500">Actor Photo</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Actor {item}</h3>
          <p className="text-gray-600 mb-4">Nationality: American</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            View Profile
          </button>
        </div>
      ))}
    </div>
  </div>
);

const Favorites = () => (
  <div className="max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold mb-6 text-center">My Favorite TV Shows</h1>
    <div className="bg-white rounded-lg shadow-md p-6">
      <p className="text-gray-600 text-center">Your favorite shows will appear here once you add them.</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<TvShows />} />
              <Route path="/tvshows" element={<TvShows />} />
              <Route path="/actors" element={<Actors />} />
              <Route 
                path="/favorites" 
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
EOF