#!/bin/bash

echo "🚀 Setting up TravelEase MERN Stack Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   You can start it with: brew services start mongodb/brew/mongodb-community"
fi

echo "📦 Installing backend dependencies..."
npm install

echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..

echo "🌱 Seeding database with sample hotel data..."
npm run seed

echo "✅ Setup complete!"
echo ""
echo "🎯 To start the application:"
echo "   1. Make sure MongoDB is running"
echo "   2. Run 'npm run dev:full' to start both server and client"
echo "   3. Open http://localhost:3000 in your browser"
echo ""
echo "📝 Don't forget to:"
echo "   - Update your .env file with your MongoDB URI and Amadeus API credentials"
echo "   - Check the README.md for detailed setup instructions"
