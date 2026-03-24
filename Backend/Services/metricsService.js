// metricsService.js - The Centralised Calculation Engine

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
const toNumber = v => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const parseDate = v => {
  const d = v ? new Date(v) : null;
  return Number.isFinite(d?.getTime()) ? d : null;
};

exports.generateUserMetrics = (user, trades = []) => {
  const hasTrades = trades.length > 0;

  // --- 1. SEPARATE HISTORICAL VS SESSION DATA ---
  const todayStr = new Date().toDateString();
  const todayTrades = trades.filter(t => 
      parseDate(t.entryTime || t.timestamp)?.toDateString() === todayStr
  );
  const hasTradesToday = todayTrades.length > 0;

  // Default baselines
  let disciplineScore = 100;
  let revengeRisk = 0;
  let impulsivityIndex = 0;
  let dispositionRatio = '0.00';
  let systemIntegrity = 100;
  let netPnl = 0;
  let winRate = 0;
  let chartData = [];

  if (hasTrades) {
    // ==========================================
    // A. ALL-TIME METRICS (Financial & Habits)
    // ==========================================
    netPnl = trades.reduce((acc, curr) => acc + toNumber(curr.pnl), 0);
    const winningTradesAllTime = trades.filter(t => toNumber(t.pnl) > 0);
    winRate = Math.round((winningTradesAllTime.length / trades.length) * 100);

    const losingTradesAllTime = trades.filter(t => toNumber(t.pnl) < 0);
    const avgMinutes = arr => {
      if (!arr.length) return 0;
      const total = arr.reduce((acc, t) => {
        const entry = parseDate(t.entryTime)?.getTime();
        const exit = parseDate(t.exitTime)?.getTime();
        if (!entry || !exit) return acc;
        return acc + Math.max(0, exit - entry);
      }, 0);
      return total / (1000 * 60) / arr.length;
    };
    
    const avgWin = avgMinutes(winningTradesAllTime);
    const avgLoss = avgMinutes(losingTradesAllTime);
    if (avgWin > 0) dispositionRatio = (avgLoss / avgWin).toFixed(2);
    else if (avgLoss > 0) dispositionRatio = avgLoss.toFixed(2);

    const userBalance = Math.max(toNumber(user?.startingBalance) || 1000, 1);
    let cumulativeReturn = 0;
    chartData = trades.map((t, i) => {
      const pct = (toNumber(t.pnl) / userBalance) * 100;
      cumulativeReturn += pct;
      return { name: `Trade ${i + 1}`, growth: Number(cumulativeReturn.toFixed(2)) };
    });

    // ==========================================
    // B. CURRENT SESSION METRICS (Today's Emotions)
    // ==========================================
    if (hasTradesToday) {
      const adherentTrades = todayTrades.filter(t => t.followedPlan).length;
      disciplineScore = clamp(Math.round((adherentTrades / todayTrades.length) * 100), 0, 100);

      const dailyLimit = Math.max(toNumber(user?.plannedDailyLimit) || 3, 1);
      impulsivityIndex = clamp(todayTrades.length / dailyLimit, 0, 10).toFixed(2);

      let heatAccumulation = 0;
      const P = 30;
      const w = 20;
      const chronoToday = [...todayTrades].sort(
        (a, b) => (parseDate(a.entryTime)?.getTime() || 0) - (parseDate(b.entryTime)?.getTime() || 0)
      );

      chronoToday.forEach((trade, i) => {
        const pnl = toNumber(trade.pnl);
        if (pnl < 0) {
          let M = 1;
          if (i > 0) {
            const prev = chronoToday[i - 1];
            const deltaMs = (parseDate(trade.entryTime)?.getTime() || 0) - (parseDate(prev.exitTime)?.getTime() || 0);
            const deltaMins = deltaMs / (1000 * 60);
            if (deltaMins > 0 && deltaMins < 15) M = 2.5;
          }
          const C = trade.followedPlan ? 1 : 0;
          heatAccumulation += P * M - w * C;
        } else {
          heatAccumulation -= 10;
        }
      });

      revengeRisk = clamp(Math.round(heatAccumulation), 0, 100);
      systemIntegrity = Math.round((disciplineScore + (100 - revengeRisk)) / 2);
    } 
  }

  // RETURN THE MASSIVE, SECURE PAYLOAD!
  return {
    hasTrades,
    disciplineScore,
    revengeRisk,
    impulsivityIndex,
    dispositionRatio,
    systemIntegrity,
    netPnl,
    winRate,
    chartData
  };
};