import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-company">
            <div className="footer-logo">
              <Plane className="footer-logo-icon" />
              <span className="footer-logo-text">TravelEase</span>
            </div>
            <p className="footer-description">
              Your ultimate flight and hotel booking companion. Find the best deals, 
              book with confidence, and travel with ease. Making your journey memorable 
              from start to finish.
            </p>
            <div className="footer-social">
              <a href="#" className="footer-social-link">
                <Facebook className="footer-social-icon" />
              </a>
              <a href="#" className="footer-social-link">
                <Twitter className="footer-social-icon" />
              </a>
              <a href="#" className="footer-social-link">
                <Instagram className="footer-social-icon" />
              </a>
              <a href="#" className="footer-social-link">
                <Linkedin className="footer-social-icon" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer-section-title">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/flights" className="footer-link">
                  Search Flights
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="footer-link">
                  Find Hotels
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="footer-link">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="footer-section-title">Contact Us</h3>
            <div className="footer-contact">
              <div className="footer-contact-item">
                <Mail className="footer-contact-icon" />
                <span className="footer-contact-text">support@travelease.com</span>
              </div>
              <div className="footer-contact-item">
                <Phone className="footer-contact-icon" />
                <span className="footer-contact-text">+91 1800-123-4567</span>
              </div>
              <div className="footer-contact-item">
                <MapPin className="footer-contact-icon" />
                <span className="footer-contact-text">Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © 2025 TravelEase. All rights reserved.
            </p>
            <div className="footer-legal">
              <a href="#" className="footer-legal-link">
                Privacy Policy
              </a>
              <a href="#" className="footer-legal-link">
                Terms of Service
              </a>
              <a href="#" className="footer-legal-link">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
