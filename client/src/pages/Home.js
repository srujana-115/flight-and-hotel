import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Hotel, Search, Star, Users, Shield } from 'lucide-react';
import './Pages.css';

const Home = () => {
  const destinations = [
    { name: 'Mumbai', image: '/images/mumbai.png', description: 'The financial capital of India' },
    { name: 'Delhi', image: '/images/delhi.png', description: 'The heart of India' },
    { name: 'Hyderabad', image: '/images/hydrabad.png', description: 'The city of pearls' },
    { name: 'Patna', image: '/images/patna.png', description: 'Historical city of Bihar' }
  ];

  const features = [
    {
      icon: <Search className="feature-icon" />,
      title: 'Easy Search',
      description: 'Find flights and hotels with our intuitive search interface'
    },
    {
      icon: <Star className="feature-icon" />,
      title: 'Best Prices',
      description: 'Get the best deals on flights and accommodation'
    },
    {
      icon: <Users className="feature-icon" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your needs'
    },
    {
      icon: <Shield className="feature-icon" />,
      title: 'Secure Booking',
      description: 'Safe and secure payment processing'
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div>
            <h1 className="hero-title">
              Fly with Ease, Explore the World
            </h1>
            <p className="hero-subtitle">
              Book flights to your favorite destinations effortlessly and enjoy your journey!
            </p>
            <div className="hero-buttons">
              <Link
                to="/flights"
                className="hero-btn hero-btn-primary"
              >
                <Plane className="hero-icon" />
                Search Flights
              </Link>
              <Link
                to="/hotels"
                className="hero-btn hero-btn-secondary"
              >
                <Hotel className="hero-icon" />
                Find Hotels
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="text-center mb-6">
            <h2 className="features-title">
              Why Choose TravelEase?
            </h2>
            <p className="text-lg" style={{color: '#6b7280', maxWidth: '48rem', margin: '0 auto'}}>
              TravelEase helps you find the best flights at unbeatable prices. Our fast, 
              user-friendly platform makes planning your next trip effortless.
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div>
                  {feature.icon}
                </div>
                <h3 className="feature-title">
                  {feature.title}
                </h3>
                <p className="feature-description">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{padding: '4rem 0'}}>
        <div className="features-container">
          <div className="text-center mb-6">
            <h2 className="features-title">
              Our Services
            </h2>
          </div>
          
          <div className="grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
            <div className="feature-card" style={{textAlign: 'center', padding: '2rem'}}>
              <Plane style={{height: '4rem', width: '4rem', color: '#2563eb', margin: '0 auto 1rem'}} />
              <h3 className="feature-title" style={{fontSize: '1.5rem', marginBottom: '1rem'}}>Flight Booking</h3>
              <p className="feature-description" style={{marginBottom: '1.5rem'}}>
                Find and book flights easily with real-time pricing and availability.
              </p>
              <Link
                to="/flights"
                className="btn btn-primary"
              >
                Search Flights
              </Link>
            </div>
            
            <div className="feature-card" style={{textAlign: 'center', padding: '2rem'}}>
              <Hotel style={{height: '4rem', width: '4rem', color: '#2563eb', margin: '0 auto 1rem'}} />
              <h3 className="feature-title" style={{fontSize: '1.5rem', marginBottom: '1rem'}}>Hotel Booking</h3>
              <p className="feature-description" style={{marginBottom: '1.5rem'}}>
                Secure your stay at top hotels worldwide with ease and convenience.
              </p>
              <Link
                to="/hotels"
                className="btn btn-primary"
              >
                Find Hotels
              </Link>
            </div>
            
            <div className="feature-card" style={{textAlign: 'center', padding: '2rem'}}>
              <Users style={{height: '4rem', width: '4rem', color: '#2563eb', margin: '0 auto 1rem'}} />
              <h3 className="feature-title" style={{fontSize: '1.5rem', marginBottom: '1rem'}}>Travel Assistance</h3>
              <p className="feature-description" style={{marginBottom: '1.5rem'}}>
                Get personalized travel support to make your journey smooth.
              </p>
              <Link
                to="/contact"
                className="btn btn-primary"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="destinations-section">
        <div className="destinations-container">
          <div className="text-center mb-6">
            <h2 className="destinations-title">
              Popular Destinations
            </h2>
          </div>
          
          <div className="destinations-grid">
            {destinations.map((destination, index) => (
              <div key={index} className="destination-card">
                <div style={{height: '12rem', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{color: '#6b7280'}}>Image: {destination.name}</span>
                </div>
                <div className="destination-content">
                  <h4 className="destination-name">
                    {destination.name}
                  </h4>
                  <p className="destination-description">
                    {destination.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
