const mongoose = require('mongoose');
const Hotel = require('../models/Hotel');
require('dotenv').config();

const hotels = [
  {
    name: "Taj Palace",
    location: "Mumbai",
    address: {
      street: "Apollo Bunder",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      zipCode: "400001"
    },
    price: 15000,
    rating: 5,
    facilities: ["Free Wi-Fi", "Swimming Pool", "Spa", "Gym", "Restaurant", "Room Service", "Concierge"],
    images: ["tajpalace.png"],
    description: "Luxury hotel in the heart of Mumbai with stunning views of the Gateway of India and Arabian Sea.",
    rooms: [
      { type: "Deluxe Room", price: 15000, available: 10 },
      { type: "Executive Suite", price: 25000, available: 5 },
      { type: "Presidential Suite", price: 50000, available: 2 }
    ],
    contact: {
      phone: "+91-22-6665-3366",
      email: "reservations@tajpalace.com"
    }
  },
  {
    name: "Hotel Patna Inn",
    location: "Patna",
    address: {
      street: "Fraser Road",
      city: "Patna",
      state: "Bihar",
      country: "India",
      zipCode: "800001"
    },
    price: 5000,
    rating: 4,
    facilities: ["Free Breakfast", "Wi-Fi", "Parking", "AC Rooms", "Restaurant"],
    images: ["hotelpatnainn.png"],
    description: "Comfortable business hotel in the center of Patna with modern amenities.",
    rooms: [
      { type: "Standard Room", price: 5000, available: 15 },
      { type: "Deluxe Room", price: 7000, available: 8 },
      { type: "Suite", price: 10000, available: 3 }
    ],
    contact: {
      phone: "+91-612-222-3333",
      email: "info@patnainn.com"
    }
  },
  {
    name: "Delhi Grand",
    location: "Delhi",
    address: {
      street: "Connaught Place",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      zipCode: "110001"
    },
    price: 12000,
    rating: 4,
    facilities: ["Gym", "Restaurant", "Pool", "Wi-Fi", "Parking", "Business Center"],
    images: ["delhigrnad.png"],
    description: "Premium hotel in the heart of Delhi with easy access to major attractions.",
    rooms: [
      { type: "Superior Room", price: 12000, available: 12 },
      { type: "Executive Room", price: 18000, available: 6 },
      { type: "Grand Suite", price: 30000, available: 4 }
    ],
    contact: {
      phone: "+91-11-4567-8900",
      email: "bookings@delhigrand.com"
    }
  },
  {
    name: "Hyderabad Stay",
    location: "Hyderabad",
    address: {
      street: "Banjara Hills",
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
      zipCode: "500034"
    },
    price: 8000,
    rating: 3,
    facilities: ["Wi-Fi", "Parking", "Restaurant", "AC Rooms", "24/7 Front Desk"],
    images: ["hydrabadstay.png"],
    description: "Modern hotel in the upscale Banjara Hills area with great connectivity.",
    rooms: [
      { type: "Standard Room", price: 8000, available: 20 },
      { type: "Premium Room", price: 12000, available: 10 },
      { type: "Family Suite", price: 18000, available: 5 }
    ],
    contact: {
      phone: "+91-40-1234-5678",
      email: "reservations@hyderabadstay.com"
    }
  },
  {
    name: "Budget Inn Delhi",
    location: "Delhi",
    address: {
      street: "Paharganj",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      zipCode: "110055"
    },
    price: 2000,
    rating: 2,
    facilities: ["Wi-Fi", "Parking", "24/7 Reception"],
    images: ["delhiinn.png"],
    description: "Budget-friendly accommodation near New Delhi Railway Station.",
    rooms: [
      { type: "Economy Room", price: 2000, available: 25 },
      { type: "Standard Room", price: 3000, available: 15 }
    ],
    contact: {
      phone: "+91-11-2356-7890",
      email: "info@budgetinndelhi.com"
    }
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travelease', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing hotels
    await Hotel.deleteMany({});
    console.log('Cleared existing hotels');

    // Insert new hotels
    const insertedHotels = await Hotel.insertMany(hotels);
    console.log(`Inserted ${insertedHotels.length} hotels`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, hotels };
