import React from 'react';
import { Target, Activity, Brain, TrendingUp, ShieldCheck, AlertTriangle, DollarSign, Percent } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import PageWrapper from './PageWrapper';

// Helper for the insight text
const toNumber = v => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

// We now pass in the 'metrics' object that we fetched from the backend API!
export default function BehaviouralFeedbackPanel({ user, trades = [], metrics = {} }) {
  console.log("X-RAY TRADES:", trades);
  console.log("X-RAY METRICS:", metrics);
  // 1. Extract the pre-calculated math from the secure backend payload
  const {
    hasTrades = false,
    disciplineScore = 100,
    revengeRisk = 0,
    impulsivityIndex = 0,
    dispositionRatio = '0.00',
    systemIntegrity = 100,
    netPnl = 0,
    winRate = 0,
    chartData = []
  } = metrics || {};

  // 2.UI visual logic 
  const isOptimal = systemIntegrity >= 70;
  const integrityColor = isOptimal ? 'var(--primary)' : 'var(--danger)';
  const integrityLabel = isOptimal ? 'SYSTEM INTEGRITY: OPERATIONAL' : 'SYSTEM INTEGRITY: COMPROMISED';

  const generateStatisticalInsight = () => {
    if (!hasTrades || trades.length < 3) {
      return 'Insufficient telemetry. System requires more execution data to formulate statistical behavioral correlations.';
    }
    const disciplined = trades.filter(t => t.followedPlan);
    const impulsive = trades.filter(t => !t.followedPlan);
    if (impulsive.length === 0) {
      return 'Optimal Behavioral State: You have a 100% plan adherence rate. Your statistical edge is fully protected.';
    }

    const discWins = disciplined.filter(t => toNumber(t.pnl) > 0).length;
    const impWins = impulsive.filter(t => toNumber(t.pnl) > 0).length;
    const discWinRate = disciplined.length ? (discWins / disciplined.length) * 100 : 0;
    const impWinRate = impulsive.length ? (impWins / impulsive.length) * 100 : 0;
    const rateDifference = Math.max(0, discWinRate - impWinRate).toFixed(1);
    const impulsiveCapitalLost = impulsive
      .filter(t => toNumber(t.pnl) < 0)
      .reduce((acc, curr) => acc + Math.abs(toNumber(curr.pnl)), 0);

    if (discWinRate > impWinRate && impulsiveCapitalLost > 0) {
      return `Cognitive Deviation Penalty: Bypassing your pre-flight checklist degrades your win rate by ${rateDifference}%. You have leaked $${impulsiveCapitalLost.toFixed(2)} in capital strictly from unverified, impulsive execution.`;
    } else if (impulsiveCapitalLost > 0) {
      return `Warning: High variance in unverified executions. You have leaked $${impulsiveCapitalLost.toFixed(2)} to impulsive trades. Return to strict checklist adherence to stabilize your equity curve.`;
    }
    return 'Telemetry monitoring active. Ensure all confluences are checked prior to execution to maintain edge.';
  };

  return (
    <PageWrapper>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* HEADER SECTION */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 8px 0' }}>
            Good Afternoon, {user?.username || 'Trader'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: integrityColor }}></div>
            <span>System Operational • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* HERO BANNER - SYSTEM INTEGRITY */}
        <div className="card" style={{ 
          background: isOptimal ? 'rgba(54, 179, 126, 0.1)' : 'rgba(255, 86, 48, 0.1)', 
          border: `1px solid ${integrityColor}`, 
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: integrityColor, color: 'white', padding: '12px', borderRadius: '12px' }}>
              {isOptimal ? <ShieldCheck size={32} /> : <AlertTriangle size={32} />}
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '900', margin: 0, color: integrityColor, letterSpacing: '1px' }}>{integrityLabel}</h2>
              <p style={{ margin: '4px 0 0 0', color: 'var(--text-main)', fontSize: '14px', fontWeight: '500' }}>
                {isOptimal ? "Cognitive state optimal. Execution protocols active." : "High emotional risk detected. Immediate pause recommended."}
              </p>
            </div>
          </div>
          <div style={{ fontSize: '48px', fontWeight: '900', color: integrityColor }}>{systemIntegrity}%</div>
        </div>

        {/* ALGORITHMIC INSIGHTS ENGINE */}
        <div style={{ background: 'rgba(101, 84, 192, 0.1)', border: '1px solid #6554C0', padding: '20px', borderRadius: '12px', marginBottom: '32px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ background: '#6554C0', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '48px' }}>
            <Brain size={24} color="#FFF" />
          </div>
          <div>
            <h3 style={{ margin: '0 0 8px 0', color: '#6554C0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '900' }}>Algorithmic Insight Engine</h3>
            <p style={{ margin: 0, color: '#000000', fontSize: '16px', lineHeight: '1.5', fontWeight: '500' }}>
              {generateStatisticalInsight()}
            </p>
          </div>
        </div>

        {/* METRICS GRID (Top Row - Behavioral) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '24px' }}>
          <MetricCard title="DISCIPLINE SCORE" value={`${disciplineScore}%`} sub="Plan adherence rate" icon={<Target size={18} />} color="var(--primary)" />
          <MetricCard title="IMPULSIVITY INDEX" value={`${impulsivityIndex}x`} sub="Daily limit utilization" icon={<Activity size={18} />} color="#0052CC" />
          <MetricCard title="REVENGE RISK" value={`${revengeRisk}%`} sub="Tilt probability" icon={<Brain size={18} />} color={revengeRisk > 50 ? "var(--danger)" : "var(--warning)"} />
          <MetricCard title="DISPOSITION RATIO" value={dispositionRatio} sub="Avg Win / Avg Loss" icon={<TrendingUp size={18} />} color="#6554C0" />
        </div>

        {/* EXTRA INFO GRID (Bottom Row - Financial) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '32px' }}>
          <MetricCard title="NET PROFIT / LOSS" value={`$${netPnl.toFixed(2)}`} sub="Total Equity outcome" icon={<DollarSign size={18} />} color={netPnl >= 0 ? "var(--primary)" : "var(--danger)"} />
          <MetricCard title="WIN RATE" value={`${winRate}%`} sub="Overall trade success" icon={<Percent size={18} />} color="#0052CC" />
        </div>

        {/* BOTTOM SECTION: CHART & LIST */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          
          {/* Equity Curve Chart (Percentage Growth) */}
          <div className="card" style={{ minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
              <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={16} color="var(--text-muted)" /> NET RETURN (%)
              </span>
            </div>
            <div style={{ flexGrow: 1, width: '100%', height: '280px' }}>
              {!hasTrades ? (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data to plot.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{fontSize: 12, fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} />
                    <YAxis 
                      domain={['auto', 'auto']} 
                      tick={{fontSize: 12, fill: 'var(--text-muted)'}} 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={(value) => `${value}%`} 
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow)' }} 
                      formatter={(value) => [`${value}%`, 'Net Return']} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="growth" 
                      stroke="#0052CC" 
                      strokeWidth={4} 
                      dot={{ r: 4, strokeWidth: 2 }} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Recent Activity List */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', maxHeight: '400px', overflowY: 'auto' }}>
            <div className="card-header">
              <span className="card-title">RECENT ACTIVITY</span>
              <span style={{ fontSize: '11px', fontWeight: '700', background: 'var(--background)', color: 'var(--text-main)', padding: '4px 8px', borderRadius: '6px' }}>{trades.length} Entries</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {!hasTrades ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0', fontStyle: 'italic', fontSize: '14px' }}>No recent trades.</div>
              ) : (
                trades.slice().reverse().slice(0, 5).map((t, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: i === 4 ? 'none' : '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ 
                        fontSize: '10px', fontWeight: '800', 
                        background: t.direction === 'buy' || t.direction === 'Long' ? '#ECFDF5' : '#FEF2F2', 
                        color: t.direction === 'buy' || t.direction === 'Long' ? '#059669' : '#DC2626',
                        padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' 
                      }}>
                        {t.direction}
                      </span>
                      <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>{t.instrument}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontWeight: '800', fontSize: '14px', color: t.pnl > 0 ? 'var(--primary)' : 'var(--danger)' }}>
                        {t.pnl > 0 ? '+' : ''}${t.pnl}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}

// Sub-component for consistent cards
const MetricCard = ({ title, value, sub, icon, color }) => (
  <div className="card" style={{ borderBottom: `4px solid ${color}`, display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
      <div style={{ color: color }}>{icon}</div>
      <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px' }}>{title}</span>
    </div>
    <div className="big-metric" style={{ fontSize: '32px', color: 'var(--text-main)' }}>{value}</div>
    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: 'auto' }}>{sub}</div>
  </div>
);