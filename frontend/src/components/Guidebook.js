import React from 'react';
import { X, Target, Brain, Activity, Shield, PieChart } from 'lucide-react';

export default function Guidebook({ onClose }) {
  const overlayStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' };
  const modalStyle = { background: 'white', width: '100%', maxWidth: '500px', borderRadius: '24px', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', animation: 'fadeIn 0.2s ease-out' };
  const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' };
  const contentStyle = { marginBottom: '24px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px' }; // Added scroll for extra content
  const footerStyle = { textAlign: 'right', marginTop: '16px' };
  const closeBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px' };
  const ackBtnStyle = { background: '#0F172A', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', width: '100%' };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#EFF6FF', padding: '8px', borderRadius: '8px' }}>
              <Shield size={24} color="#3B82F6" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>Operator's Manual</h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>Cognitive Firewall System Protocols</p>
            </div>
          </div>
          <button onClick={onClose} style={closeBtnStyle}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          
          <Section 
            icon={<Target size={20} color="#10B981" />} 
            title="Strategy Adherence" 
            metric="Starts at 100%"
            desc="Your daily discipline score. You start at 100% every midnight. You lose points if you skip your pre-trade checklist or risk too much capital on a single trade."
          />

          <Section 
            icon={<Brain size={20} color="#EF4444" />} 
            title="Revenge Risk" 
            metric="Starts at 0%"
            desc="Your emotional temperature gauge. It spikes if you start rapid-firing trades right after taking a loss. If it gets too high, the firewall locks you out to force a cool-down."
          />

          <Section 
            icon={<Activity size={20} color="#3B82F6" />} 
            title="Impulsivity Index" 
            metric="Target: < 1.0x"
            desc="Your overtrading alert. It compares the trades you actually took against your daily limit. If your limit is 3 and you take 6, you hit 2.0x—a massive red flag for impulsivity."
          />
          
          <Section 
            icon={<PieChart size={20} color="#8B5CF6" />} 
            title="Disposition Ratio" 
            metric="Target: < 1.0"
            desc="The 'hope versus fear' tracker. It measures if you are cutting your winning trades too early out of fear, while holding onto your losing trades for way too long out of hope."
          />
        </div>
        
        <div style={footerStyle}>
          <button onClick={onClose} style={ackBtnStyle}>I Understand</button>
        </div>

      </div>
    </div>
  );
}

// Sub-component for clean layout
const Section = ({ icon, title, metric, desc }) => (
  <div style={{ marginBottom: '20px', padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {icon}
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1E293B' }}>{title}</h3>
      </div>
      <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', background: '#E2E8F0', padding: '2px 8px', borderRadius: '10px', whiteSpace: 'nowrap' }}>
        {metric}
      </span>
    </div>
    <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', color: '#475569' }}>{desc}</p>
  </div>
);