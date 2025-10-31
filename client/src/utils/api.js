import axios from 'axios';

// Set base URL for API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Flight API calls
export const flightAPI = {
  searchLocations: (keyword) => api.get(`/api/flights/locations?keyword=${keyword}`),
  searchFlights: (params) => api.get('/api/flights/search', { params }),
  getFlightPrice: (flightOffers) => api.post('/api/flights/price', { flightOffers })
};

// Hotel API calls
export const hotelAPI = {
  getHotels: (params) => api.get('/api/hotels', { params }),
  getHotel: (id) => api.get(`/api/hotels/${id}`),
  createHotel: (hotelData) => api.post('/api/hotels', hotelData),
  updateHotel: (id, hotelData) => api.put(`/api/hotels/${id}`, hotelData),
  deleteHotel: (id) => api.delete(`/api/hotels/${id}`)
};

// Booking API calls
export const bookingAPI = {
  createBooking: (bookingData) => api.post('/api/bookings', bookingData),
  getBookings: (params) => api.get('/api/bookings', { params }),
  getBooking: (id) => api.get(`/api/bookings/${id}`),
  updateBooking: (id, updateData) => api.put(`/api/bookings/${id}`, updateData),
  cancelBooking: (id) => api.delete(`/api/bookings/${id}`)
};

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getMe: () => api.get('/api/auth/me')
};

export default api;
