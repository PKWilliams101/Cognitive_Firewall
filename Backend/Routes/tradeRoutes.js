const User = require("../Models/User");
const express = require("express");
const router = express.Router();
const Trade = require("../Models/Trade"); 
const metricsService = require("../Services/metricsService");
const { protect } = require('../Middleware/authMiddleware');
// 1. CREATE TRADE
router.post("/", protect, async (req, res) => {
    try {
        const newTrade = new Trade(req.body);
        const savedTrade = await newTrade.save();
        res.status(201).json(savedTrade);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }   
});

// 2. GET TRADES
router.get("/user/:userId", protect, async (req, res) => {
    try {
        console.log("Fetching trades for user:", req.params.userId);
        const trades = await Trade.find({ userId: req.params.userId }).sort({ entryTime: -1 });
        res.json(trades);
    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json({ error: err.message });
    }
});


// 3. GET METRICS (Calculates Revenge Risk, Discipline, etc.)
router.get("/metrics/:userId", protect, async (req, res) => {
    try {
        const { userId } = req.params;
        const trades = await Trade.find({ userId: userId }).sort({ entryTime: 1 }); 
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Run our new Centralised Calculation Engine!
        const metrics = metricsService.generateUserMetrics(user, trades);

        // Send the complete package to React (including chartData and hasTrades)
        res.json(metrics);

    } catch (err) {
        console.error("Metrics Error:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
