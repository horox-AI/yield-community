#!/bin/bash

# Install required dependencies
npm install --save dotenv mongoose

echo "Dependencies installed. You can now run the populate script with:"
echo "node scripts/populateRealEstatePosts.js"
echo ""
echo "Make sure your MONGO_URI is set in your .env file!" 