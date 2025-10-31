const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hotel name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    default: 3
  },
  facilities: {
    type: [String],
    default: []
  },
  images: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  rooms: [{
    type: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    available: {
      type: Number,
      default: 10
    }
  }],
  contact: {
    phone: String,
    email: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for location-based searches
hotelSchema.index({ location: 1, price: 1, rating: 1 });

module.exports = mongoose.model('Hotel', hotelSchema);
