const express = require('express');
const Hotel = require('../models/Hotel');

const router = express.Router();

// @route   GET /api/hotels
// @desc    Get all hotels with filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      location, 
      minPrice, 
      maxPrice, 
      rating, 
      page = 1, 
      limit = 10,
      sortBy = 'price'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (location) {
      filter.location = new RegExp(location, 'i');
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    
    if (rating) {
      filter.rating = { $gte: parseInt(rating) };
    }

    // Build sort object
    const sortOptions = {};
    switch (sortBy) {
      case 'price_asc':
        sortOptions.price = 1;
        break;
      case 'price_desc':
        sortOptions.price = -1;
        break;
      case 'rating':
        sortOptions.rating = -1;
        break;
      case 'name':
        sortOptions.name = 1;
        break;
      default:
        sortOptions.price = 1;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const hotels = await Hotel.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await Hotel.countDocuments(filter);

    res.json({
      success: true,
      data: hotels,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total
      }
    });
  } catch (error) {
    console.error('Get hotels error:', error);
    res.status(500).json({ message: 'Error fetching hotels' });
  }
});

// @route   GET /api/hotels/:id
// @desc    Get single hotel
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel || !hotel.isActive) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    console.error('Get hotel error:', error);
    res.status(500).json({ message: 'Error fetching hotel' });
  }
});

// @route   POST /api/hotels
// @desc    Create a new hotel (Admin only - for demo purposes)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();

    res.status(201).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    console.error('Create hotel error:', error);
    res.status(500).json({ 
      message: 'Error creating hotel',
      error: error.message 
    });
  }
});

// @route   PUT /api/hotels/:id
// @desc    Update hotel
// @access  Public (should be admin only in production)
router.put('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    console.error('Update hotel error:', error);
    res.status(500).json({ 
      message: 'Error updating hotel',
      error: error.message 
    });
  }
});

// @route   DELETE /api/hotels/:id
// @desc    Delete hotel (soft delete)
// @access  Public (should be admin only in production)
router.delete('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json({
      success: true,
      message: 'Hotel deleted successfully'
    });
  } catch (error) {
    console.error('Delete hotel error:', error);
    res.status(500).json({ message: 'Error deleting hotel' });
  }
});

module.exports = router;
