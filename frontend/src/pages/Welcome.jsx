import React from 'react';
import { ShieldCheck, Activity, Brain } from 'lucide-react';
import './Welcome.css';

export default function Welcome({ onContinue }) {
  return (
    <div className="welcome-shell">
      <div className="welcome-card">
        <div className="welcome-pill">
          <ShieldCheck size={16} /> Cognitive Firewall Suite
        </div>

        <h1>Trading Discipline Terminal</h1>

        <p className="welcome-lead">
          Welcome to your behavioral risk cockpit. This app helps you enforce trading discipline,
          quantify emotional risk, and understand how decisions impact your equity curve.
        </p>

        <div className="welcome-grid">
          <Feature
            icon={<Activity size={18} />}
            title="Execution Hygiene"
            desc="Track daily limits, impulsivity, and revenge-risk in real time."
          />
          <Feature
            icon={<Brain size={18} />}
            title="Behavioral Insights"
            desc="Measure plan adherence, detect cognitive drift, and surface tilt warnings."
          />
          <Feature
            icon={<ShieldCheck size={18} />}
            title="Positive Friction"
            desc="Guided pre-trade checks before execution to protect your edge."
          />
        </div>

        <div className="welcome-actions">
          <button className="welcome-btn primary" onClick={onContinue}>
            Proceed to Login
          </button>
          <a className="welcome-btn ghost" href="#learn-more">
            Learn More
          </a>
        </div>

        <div id="learn-more" className="welcome-detail">
          <h3>What this software does</h3>
          <ul>
            <li>Monitors your trades to highlight emotional and impulsive patterns.</li>
            <li>Quantifies discipline, revenge risk, and system integrity.</li>
            <li>Shows how deviations from your plan affect PnL and win rate.</li>
          </ul>
          <p className="welcome-footnote">
            This is an analytics and coaching tool only. It does not place live trades or connect to broker accounts.
          </p>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="welcome-feature">
      <div className="welcome-icon">{icon}</div>
      <div>
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
    </div>
  );
}