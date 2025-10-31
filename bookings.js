const express = require('express');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { type, flightDetails, hotelDetails, totalAmount, notes } = req.body;

    // Validate booking type
    if (!['flight', 'hotel'].includes(type)) {
      return res.status(400).json({ message: 'Invalid booking type' });
    }

    // Validate required details based on type
    if (type === 'flight' && !flightDetails) {
      return res.status(400).json({ message: 'Flight details are required for flight booking' });
    }

    if (type === 'hotel' && !hotelDetails) {
      return res.status(400).json({ message: 'Hotel details are required for hotel booking' });
    }

    // For hotel bookings, verify hotel exists
    if (type === 'hotel' && hotelDetails.hotel) {
      const hotel = await Hotel.findById(hotelDetails.hotel);
      if (!hotel || !hotel.isActive) {
        return res.status(404).json({ message: 'Hotel not found' });
      }
    }

    // Create booking
    const booking = new Booking({
      user: req.user.id,
      type,
      flightDetails: type === 'flight' ? flightDetails : undefined,
      hotelDetails: type === 'hotel' ? hotelDetails : undefined,
      totalAmount,
      notes
    });

    await booking.save();

    // Add booking to user's bookings array
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { bookings: booking._id } }
    );

    // Populate hotel details if it's a hotel booking
    if (type === 'hotel') {
      await booking.populate('hotelDetails.hotel');
    }

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ 
      message: 'Error creating booking',
      error: error.message 
    });
  }
});

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { type, status, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = { user: req.user.id };
    
    if (type) filter.type = type;
    if (status) filter.status = status;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const bookings = await Booking.find(filter)
      .populate('hotelDetails.hotel')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('hotelDetails.hotel');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Error fetching booking' });
  }
});

// @route   PUT /api/bookings/:id
// @desc    Update booking status
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, paymentStatus, notes } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (notes !== undefined) updateData.notes = notes;

    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true, runValidators: true }
    ).populate('hotelDetails.hotel');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ 
      message: 'Error updating booking',
      error: error.message 
    });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel booking
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: 'cancelled' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Error cancelling booking' });
  }
});

module.exports = router;
