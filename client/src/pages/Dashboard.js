import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingAPI } from '../utils/api';
import { Plane, Hotel, Calendar, CreditCard, User, MapPin } from 'lucide-react';
import './Pages.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getBookings();
      setBookings(response.data.data || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.type === activeTab;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Plane className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Flight Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {bookings.filter(b => b.type === 'flight').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Hotel className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hotel Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {bookings.filter(b => b.type === 'hotel').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatPrice(bookings.reduce((sum, booking) => sum + booking.totalAmount, 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <div className="px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Bookings</h2>
            </div>
            
            {/* Tabs */}
            <div className="px-6">
              <nav className="flex space-x-8">
                {[
                  { key: 'all', label: 'All Bookings', count: bookings.length },
                  { key: 'flight', label: 'Flights', count: bookings.filter(b => b.type === 'flight').length },
                  { key: 'hotel', label: 'Hotels', count: bookings.filter(b => b.type === 'hotel').length }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Bookings List */}
          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            )}

            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  {activeTab === 'flight' ? <Plane className="h-16 w-16 mx-auto" /> : 
                   activeTab === 'hotel' ? <Hotel className="h-16 w-16 mx-auto" /> :
                   <Calendar className="h-16 w-16 mx-auto" />}
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">No bookings found</h3>
                <p className="text-gray-500">
                  {activeTab === 'all' ? 'You haven\'t made any bookings yet.' :
                   `You haven't made any ${activeTab} bookings yet.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div key={booking._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="bg-gray-100 p-2 rounded-full">
                          {booking.type === 'flight' ? 
                            <Plane className="h-5 w-5 text-blue-600" /> :
                            <Hotel className="h-5 w-5 text-green-600" />
                          }
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {booking.type === 'flight' ? 'Flight Booking' : 'Hotel Booking'}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-1">
                            Booking Reference: <span className="font-medium">{booking.bookingReference}</span>
                          </p>
                          
                          {booking.type === 'flight' && booking.flightDetails && (
                            <div className="text-sm text-gray-600">
                              <div className="flex items-center space-x-4">
                                <span>{booking.flightDetails.origin} → {booking.flightDetails.destination}</span>
                                <span>•</span>
                                <span>{new Date(booking.flightDetails.departureDate).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{booking.flightDetails.passengers} passenger(s)</span>
                              </div>
                            </div>
                          )}
                          
                          {booking.type === 'hotel' && booking.hotelDetails && (
                            <div className="text-sm text-gray-600">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span>Hotel Booking</span>
                                </div>
                                <span>•</span>
                                <span>{booking.hotelDetails.nights} night(s)</span>
                                <span>•</span>
                                <span>{booking.hotelDetails.guests} guest(s)</span>
                              </div>
                            </div>
                          )}
                          
                          <p className="text-xs text-gray-500 mt-2">
                            Booked on {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatPrice(booking.totalAmount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.paymentStatus}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
