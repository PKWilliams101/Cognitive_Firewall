// backend/routes/marketRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios'); 

// Secure proxy route for Forex, Metals, and CFDs
router.get('/live-price', async (req, res) => {
    try {
        // The frontend sends the symbol (e.g., 'EUR/USD' or 'XAU/USD')
        const symbol = req.query.symbol; 
        
        // Example using Twelve Data API (Great for Forex & Metals)
        const apiKey = process.env.MARKET_API_KEY; // Hidden in your .env file
        const apiUrl = `https://api.twelvedata.com/price?symbol=${symbol}&apikey=${apiKey}`;
        
        // Backend makes the secure call
        const response = await axios.get(apiUrl);
        
        // Extract the price from the API response
        const currentPrice = response.data.price;
        
        // Send the live price back to the React UI
        res.status(200).json({ symbol: symbol, price: currentPrice });

    } catch (error) {
        console.error("Market API Proxy Error:", error);
        res.status(500).json({ message: "Failed to fetch live market data" });
    }
});

module.exports = router;