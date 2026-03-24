const Trade = require('../Models/Trade');
const User = require('../Models/User');
const metricsService = require('../Services/metricsService');

exports.getUserMetrics = async (req, res) => {
    try {
       console.log("🔥🔥🔥 THE NEW ENGINE IS ACTUALLY FIRING! 🔥🔥🔥");
        
        
        const { userId } = req.params;

        // 1️⃣ Fetch all trades for this user
        const trades = await Trade.find({ userId });

        // 2️⃣ Fetch user profile
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 3️⃣ THE FIX: Run our new Centralised Calculation Engine!
        // This generates the chartData, netPnl, winRate, and all behavioural stats securely.
        const metrics = metricsService.generateUserMetrics(user, trades);

        // 4️⃣ Return the complete, secure payload to React
        res.status(200).json(metrics);

    } catch (error) {
        console.error("Metrics Error:", error);
        res.status(500).json({
            message: "Error calculating metrics",
            error: error.message
        });
    }
};