const express = require('express');
const axios = require('axios');

const router = express.Router();

// Amadeus API configuration
let accessToken = null;

// Get Amadeus access token
const getAccessToken = async () => {
  if (accessToken) return accessToken;

  try {
    const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', 
      `grant_type=client_credentials&client_id=${process.env.AMADEUS_API_KEY}&client_secret=${process.env.AMADEUS_API_SECRET}`,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );
    
    accessToken = response.data.access_token;
    
    // Reset token after expiry (usually 30 minutes)
    setTimeout(() => { accessToken = null; }, 25 * 60 * 1000);
    
    return accessToken;
  } catch (error) {
    console.error('Error getting Amadeus token:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Amadeus API');
  }
};

// @route   GET /api/flights/locations
// @desc    Search for airport/city locations
// @access  Public
router.get('/locations', async (req, res) => {
  try {
    const { keyword } = req.query;
    
    if (!keyword || keyword.length < 2) {
      return res.status(400).json({ message: 'Keyword must be at least 2 characters' });
    }

    const token = await getAccessToken();
    
    const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        subType: 'CITY,AIRPORT',
        keyword: keyword
      }
    });

    res.json({
      success: true,
      data: response.data.data || []
    });
  } catch (error) {
    console.error('Location search error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Error searching locations',
      error: error.response?.data?.error_description || error.message 
    });
  }
});

// @route   GET /api/flights/search
// @desc    Search for flights
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { 
      originLocationCode, 
      destinationLocationCode, 
      departureDate, 
      returnDate, 
      adults = 1, 
      travelClass = 'ECONOMY' 
    } = req.query;

    // Validate required parameters
    if (!originLocationCode || !destinationLocationCode || !departureDate) {
      return res.status(400).json({ 
        message: 'Origin, destination, and departure date are required' 
      });
    }

    const token = await getAccessToken();
    
    const params = {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      adults: parseInt(adults),
      currencyCode: 'INR',
      travelClass
    };

    if (returnDate) {
      params.returnDate = returnDate;
    }

    const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
      headers: { Authorization: `Bearer ${token}` },
      params
    });

    res.json({
      success: true,
      data: response.data.data || [],
      meta: response.data.meta || {}
    });
  } catch (error) {
    console.error('Flight search error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Error searching flights',
      error: error.response?.data?.error_description || error.message 
    });
  }
});

// @route   POST /api/flights/price
// @desc    Get flight price confirmation
// @access  Public
router.post('/price', async (req, res) => {
  try {
    const { flightOffers } = req.body;

    if (!flightOffers || !Array.isArray(flightOffers)) {
      return res.status(400).json({ message: 'Flight offers are required' });
    }

    const token = await getAccessToken();
    
    const response = await axios.post('https://test.api.amadeus.com/v1/shopping/flight-offers/pricing', 
      { data: { type: 'flight-offers-pricing', flightOffers } },
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      data: response.data.data || {}
    });
  } catch (error) {
    console.error('Flight pricing error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Error getting flight pricing',
      error: error.response?.data?.error_description || error.message 
    });
  }
});

module.exports = router;
