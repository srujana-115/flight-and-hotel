const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['flight', 'hotel'],
    required: true
  },
  // Flight booking details
  flightDetails: {
    origin: String,
    destination: String,
    departureDate: Date,
    returnDate: Date,
    passengers: Number,
    cabin: String,
    airline: String,
    flightNumber: String,
    price: Number
  },
  // Hotel booking details
  hotelDetails: {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel'
    },
    checkIn: Date,
    checkOut: Date,
    guests: Number,
    roomType: String,
    nights: Number,
    price: Number
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  bookingReference: {
    type: String,
    unique: true,
    required: true
  },
  notes: String
}, {
  timestamps: true
});

// Generate booking reference before saving
bookingSchema.pre('save', function(next) {
  if (!this.bookingReference) {
    const prefix = this.type === 'flight' ? 'FL' : 'HT';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.bookingReference = `${prefix}${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
