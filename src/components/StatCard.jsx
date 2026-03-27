// StatCard.jsx – Small card showing a single dashboard metric (Total, Interviews, etc.)
import React from 'react';

const cardStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  padding: '20px 24px',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  cursor: 'default',
};

const iconStyle = (color) => ({
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  background: `${color}22`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '22px',
  flexShrink: 0,
});

function StatCard({ label, value, icon, color = '#6366f1', sublabel }) {
  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={iconStyle(color)}>{icon}</div>
      <div>
        <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{label}</div>
        {sublabel && (
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{sublabel}</div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
