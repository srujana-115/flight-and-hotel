import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plane, LogOut, User, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <div className="navbar-logo">
            <Link to="/" className="navbar-logo-link">
              <Plane className="navbar-logo-icon" />
              <span className="navbar-logo-text">TravelEase</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-desktop">
            <Link to="/" className="navbar-link">
              Home
            </Link>
            <Link to="/flights" className="navbar-link">
              Flights
            </Link>
            <Link to="/hotels" className="navbar-link">
              Hotels
            </Link>
            
            {isAuthenticated ? (
              <div className="navbar-user-section">
                <Link to="/dashboard" className="navbar-link">
                  Dashboard
                </Link>
                <div className="navbar-user-info">
                  <User className="navbar-user-icon" />
                  <span className="navbar-user-name">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="navbar-logout-btn"
                >
                  <LogOut className="navbar-logout-icon" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="navbar-user-section">
                <Link
                  to="/login"
                  className="navbar-link"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="navbar-register-btn"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="navbar-mobile-btn">
            <button
              onClick={toggleMenu}
              className="navbar-mobile-btn"
            >
              {isMenuOpen ? <X className="navbar-mobile-icon" /> : <Menu className="navbar-mobile-icon" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="navbar-mobile-menu">
            <div className="navbar-mobile-content">
              <Link
                to="/"
                className="navbar-mobile-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/flights"
                className="navbar-mobile-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Flights
              </Link>
              <Link
                to="/hotels"
                className="navbar-mobile-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Hotels
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="navbar-mobile-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="navbar-mobile-user">
                    <span className="navbar-mobile-user-text">Welcome, {user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="navbar-mobile-logout"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="navbar-mobile-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="navbar-mobile-register"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
