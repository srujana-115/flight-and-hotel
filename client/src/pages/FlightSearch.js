import React, { useState, useEffect } from 'react';
import { Search, Plane, Calendar, Users, MapPin } from 'lucide-react';
import { flightAPI } from '../utils/api';
import './Pages.css';

const FlightSearch = () => {
  const [searchForm, setSearchForm] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    travelClass: 'ECONOMY'
  });

  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Set minimum date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSearchForm(prev => ({ ...prev, departureDate: today }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({ ...prev, [name]: value }));
  };

  const searchLocations = async (keyword, type) => {
    if (keyword.length < 2) return;
    
    try {
      const response = await flightAPI.searchLocations(keyword);
      const suggestions = response.data.data || [];
      
      if (type === 'origin') {
        setOriginSuggestions(suggestions);
      } else {
        setDestinationSuggestions(suggestions);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
    }
  };

  const selectLocation = (location, type) => {
    const locationText = `${location.name} (${location.iataCode})`;
    
    if (type === 'origin') {
      setSearchForm(prev => ({ ...prev, origin: locationText, originCode: location.iataCode }));
      setOriginSuggestions([]);
    } else {
      setSearchForm(prev => ({ ...prev, destination: locationText, destinationCode: location.iataCode }));
      setDestinationSuggestions([]);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!searchForm.originCode || !searchForm.destinationCode) {
      setError('Please select origin and destination from suggestions');
      setLoading(false);
      return;
    }

    try {
      const params = {
        originLocationCode: searchForm.originCode,
        destinationLocationCode: searchForm.destinationCode,
        departureDate: searchForm.departureDate,
        adults: searchForm.adults,
        travelClass: searchForm.travelClass
      };

      if (searchForm.returnDate) {
        params.returnDate = searchForm.returnDate;
      }

      const response = await flightAPI.searchFlights(params);
      setFlights(response.data.data || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Error searching flights');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (duration) => {
    return duration?.replace('PT', '').replace('H', 'h ').replace('M', 'm') || 'N/A';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Flight</h1>
          <p className="text-lg text-gray-600">Search and book flights to your favorite destinations</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Origin */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  From
                </label>
                <input
                  type="text"
                  name="origin"
                  value={searchForm.origin}
                  onChange={(e) => {
                    handleInputChange(e);
                    searchLocations(e.target.value, 'origin');
                  }}
                  placeholder="Enter origin city/airport"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="off"
                />
                {originSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
                    {originSuggestions.map((location, index) => (
                      <div
                        key={index}
                        onClick={() => selectLocation(location, 'origin')}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {location.name} ({location.iataCode}) - {location.address?.cityName}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  To
                </label>
                <input
                  type="text"
                  name="destination"
                  value={searchForm.destination}
                  onChange={(e) => {
                    handleInputChange(e);
                    searchLocations(e.target.value, 'destination');
                  }}
                  placeholder="Enter destination city/airport"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="off"
                />
                {destinationSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
                    {destinationSuggestions.map((location, index) => (
                      <div
                        key={index}
                        onClick={() => selectLocation(location, 'destination')}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {location.name} ({location.iataCode}) - {location.address?.cityName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Departure Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Departure Date
                </label>
                <input
                  type="date"
                  name="departureDate"
                  value={searchForm.departureDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Return Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Return Date (Optional)
                </label>
                <input
                  type="date"
                  name="returnDate"
                  value={searchForm.returnDate}
                  onChange={handleInputChange}
                  min={searchForm.departureDate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Adults */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline h-4 w-4 mr-1" />
                  Adults
                </label>
                <input
                  type="number"
                  name="adults"
                  value={searchForm.adults}
                  onChange={handleInputChange}
                  min="1"
                  max="9"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Travel Class */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cabin Class
                </label>
                <select
                  name="travelClass"
                  value={searchForm.travelClass}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ECONOMY">Economy</option>
                  <option value="PREMIUM_ECONOMY">Premium Economy</option>
                  <option value="BUSINESS">Business</option>
                  <option value="FIRST">First</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
              >
                <Search className="h-5 w-5 mr-2" />
                {loading ? 'Searching...' : 'Search Flights'}
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Flight Results */}
        {flights.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Found {flights.length} flight{flights.length > 1 ? 's' : ''}
            </h2>
            
            {flights.map((flight, index) => {
              const segment = flight.itineraries[0].segments[0];
              return (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <Plane className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-lg">
                          {segment.carrierCode || 'Airline'}
                        </span>
                      </div>
                      
                      <div className="text-gray-600 mb-2">
                        <span className="font-medium">
                          {segment.departure.iataCode} → {segment.arrival.iataCode}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        <div>Departure: {new Date(segment.departure.at).toLocaleString()}</div>
                        <div>Arrival: {new Date(segment.arrival.at).toLocaleString()}</div>
                        <div>Duration: {formatDuration(flight.itineraries[0].duration)}</div>
                      </div>
                    </div>
                    
                    <div className="text-right mt-4 md:mt-0">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {formatPrice(flight.price.total)}
                      </div>
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!loading && flights.length === 0 && searchForm.originCode && searchForm.destinationCode && (
          <div className="text-center py-12">
            <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No flights found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightSearch;
