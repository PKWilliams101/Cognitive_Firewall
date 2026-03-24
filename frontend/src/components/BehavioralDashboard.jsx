import React, { useState, useEffect, useMemo } from 'react';
import { Target, Activity, Brain, Shield } from 'lucide-react';
import PageWrapper from './PageWrapper';
import TradeExecutionWizard from './TradeExecutionWizard';

export function BehavioralDashboard({ trades = [], user, refreshData }) {
  const [showWizard, setShowWizard] = useState(false);
  const [revengeRisk, setRevengeRisk] = useState(0);

  const todayTrades = useMemo(() => {
    const todayStr = new Date().toDateString();
    return trades.filter(t =>
      new Date(t.entryTime || t.timestamp).toDateString() === todayStr
    );
  }, [trades]);

  const plannedDailyLimit = Math.max(Number(user?.plannedDailyLimit) || 3, 1);

  const calculateDiscipline = () => {
    if (todayTrades.length === 0) return 100;
    const adherent = todayTrades.filter(t => t.followedPlan).length;
    return Math.round((adherent / todayTrades.length) * 100);
  };

  const impulsivityIndex =
    todayTrades.length === 0 ? 0 : todayTrades.length / plannedDailyLimit;

  useEffect(() => {
    if (todayTrades.length < 2) {
      setRevengeRisk(0);
      return;
    }

    const sorted = [...todayTrades].sort(
      (a, b) =>
        new Date(b.entryTime || b.timestamp) -
        new Date(a.entryTime || a.timestamp)
    );

    const latestTrade = sorted[0];
    const previousTrade = sorted[1];

    if (previousTrade.pnl < 0) {
      const latestEntry = new Date(latestTrade.entryTime || latestTrade.timestamp);
      const prevExit = new Date(previousTrade.exitTime || previousTrade.timestamp);
      const timeDiffMs = latestEntry - prevExit;
      const timeDiffMins = timeDiffMs / (1000 * 60);

      if (Number.isFinite(timeDiffMins) && timeDiffMins < 15) {
        setRevengeRisk(85);
      } else if (Number.isFinite(timeDiffMins)) {
        setRevengeRisk(40);
      } else {
        setRevengeRisk(20); // fallback when timestamps are missing
      }
    } else {
      setRevengeRisk(10);
    }
  }, [todayTrades]);

  const generateStatisticalInsight = () => {
    if (!trades || trades.length < 3) {
      return 'Insufficient telemetry. System requires more execution data to formulate statistical behavioral correlations.';
    }

    const disciplined = trades.filter(t => t.followedPlan);
    const impulsive = trades.filter(t => !t.followedPlan);

    if (impulsive.length === 0) {
      return 'Optimal Behavioral State: You have a 100% plan adherence rate. Your statistical edge is fully protected.';
    }

    const discWins = disciplined.filter(t => t.pnl > 0).length;
    const impWins = impulsive.filter(t => t.pnl > 0).length;

    const discWinRate = disciplined.length > 0 ? (discWins / disciplined.length) * 100 : 0;
    const impWinRate = impulsive.length > 0 ? (impWins / impulsive.length) * 100 : 0;

    const rateDifference = Math.max(0, discWinRate - impWinRate).toFixed(1);
    const impulsiveCapitalLost = impulsive
      .filter(t => t.pnl < 0)
      .reduce((acc, curr) => acc + Math.abs(curr.pnl), 0);

    if (discWinRate > impWinRate && impulsiveCapitalLost > 0) {
      return `Cognitive Deviation Penalty: Bypassing your pre-flight checklist degrades your win rate by ${rateDifference}%. You have leaked $${impulsiveCapitalLost.toFixed(2)} in capital strictly from unverified, impulsive execution.`;
    } else if (impulsiveCapitalLost > 0) {
      return `Warning: High variance in unverified executions. You have leaked $${impulsiveCapitalLost.toFixed(2)} to impulsive trades. Return to strict checklist adherence to stabilize your equity curve.`;
    } else {
      return 'Telemetry monitoring active. Ensure all confluences are checked prior to execution to maintain edge.';
    }
  };

  const isCleanSlate = todayTrades.length === 0;
  const disciplineValue = `${calculateDiscipline()}%`;
  const impulsivityValue = `${impulsivityIndex.toFixed(2)}x`;
  const revengeRiskValue = `${revengeRisk}%`;
  const revengeRiskColor = revengeRisk >= 80 ? '#FF5252' : '#69F0AE';

  return (
    <PageWrapper>
      <DashboardInfoCard />

      <div
        style={{
          background: 'rgba(101, 84, 192, 0.1)',
          border: '1px solid #6554C0',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
        }}
      >
        <div
          style={{
            background: '#6554C0',
            padding: '12px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Brain size={24} color="#FFF" />
        </div>
        <div>
          <h3
            style={{
              margin: '0 0 8px 0',
              color: '#6554C0',
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '900',
            }}
          >
            Algorithmic Insight Engine
          </h3>
          <p
            style={{
              margin: 0,
              color: '#E0E0E0',
              fontSize: '16px',
              lineHeight: '1.5',
              fontWeight: '500',
            }}
          >
            {generateStatisticalInsight()}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => setShowWizard(true)}
          style={{
            padding: '12px 24px',
            background: '#4FC3F7',
            color: '#000',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          + LAUNCH EXECUTION TERMINAL
        </button>
      </div>

      <div style={gridStyle}>
        <MetricCard title="DISCIPLINE" value={disciplineValue} color="#69F0AE" />
        <MetricCard title="IMPULSIVITY" value={impulsivityValue} color="#4FC3F7" />
        <MetricCard title="REVENGE RISK" value={revengeRiskValue} color={revengeRiskColor} />
      </div>

      {isCleanSlate && (
        <p style={{ color: '#A0A0A0', marginTop: '12px' }}>
          No trades yet today. Metrics are in baseline mode.
        </p>
      )}

    {showWizard && (
        <TradeExecutionWizard
          user={user}
          onClose={() => setShowWizard(false)}
          revengeRisk={revengeRisk}
          onTradeSuccess={refreshData} // <-- THIS IS THE MISSING LINK!
        />
      )}
    </PageWrapper>
  );
}

const DashboardInfoCard = () => (
  <div
    style={{
      background: '#1E1E1E',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #333',
      marginBottom: '24px',
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    }}
  >
    <div
      style={{
        background: '#2A2A2A',
        padding: '16px',
        borderRadius: '12px',
      }}
    >
      <Shield size={32} color="#4FC3F7" />
    </div>
    <div>
      <h3
        style={{
          margin: '0 0 8px 0',
          color: '#E0E0E0',
          fontSize: '18px',
        }}
      >
        Cognitive Firewall Active
      </h3>
      <p
        style={{
          margin: 0,
          color: '#A0A0A0',
          fontSize: '14px',
          lineHeight: '1.5',
        }}
      >
        This terminal monitors your execution telemetry to detect emotional tilt and impulsivity. 
        Adhere to your pre-flight checklist. The system will escalate 'Positive Friction' if Revenge Risk exceeds critical thresholds.
      </p>
    </div>
  </div>
);

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' };

const MetricCard = ({ title, value, color }) => (
  <div
    style={{
      background: '#1E1E1E',
      padding: '24px',
      borderRadius: '12px',
      borderBottom: `4px solid ${color}`,
      border: '1px solid #333',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    }}
  >
    <p
      style={{
        fontSize: '12px',
        fontWeight: '800',
        color: '#888',
        margin: '0 0 10px 0',
        letterSpacing: '1px',
      }}
    >
      {title}
    </p>
    <h2
      style={{
        margin: 0,
        fontSize: '36px',
        fontWeight: '900',
        color: '#FFF',
      }}
    >
      {value}
    </h2>
  </div>
);