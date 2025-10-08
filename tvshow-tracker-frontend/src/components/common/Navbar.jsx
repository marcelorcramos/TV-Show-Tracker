cat > src/components/common/Navbar.jsx << 'EOF'
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold flex items-center">
            <span className="mr-2">🎬</span>
            TV Show Tracker
          </Link>

          <div className="flex items-center space-x-6">
            <Link 
              to="/tvshows" 
              className={`hover:text-blue-200 transition ${
                isActive('/tvshows') ? 'text-blue-200 font-semibold' : ''
              }`}
            >
              TV Shows
            </Link>
            <Link 
              to="/actors" 
              className={`hover:text-blue-200 transition ${
                isActive('/actors') ? 'text-blue-200 font-semibold' : ''
              }`}
            >
              Actors
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/favorites" 
                  className={`hover:text-blue-200 transition ${
                    isActive('/favorites') ? 'text-blue-200 font-semibold' : ''
                  }`}
                >
                  My Favorites
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-blue-200 hidden sm:inline">Hello, {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
EOF