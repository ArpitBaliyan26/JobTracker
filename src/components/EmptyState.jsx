// EmptyState.jsx – Friendly message shown when a list has no items
import React from 'react';
import { Link } from 'react-router-dom';

function EmptyState({ icon = '📭', title = 'Nothing here yet', message, actionLabel, actionTo }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 24px',
      textAlign: 'center',
      gap: '16px',
    }}>
      <div style={{ fontSize: '56px' }}>{icon}</div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>{title}</h3>
      {message && (
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '320px', lineHeight: 1.6 }}>
          {message}
        </p>
      )}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          style={{
            marginTop: '8px',
            padding: '10px 24px',
            background: 'var(--accent)',
            color: 'white',
            borderRadius: 'var(--radius-sm)',
            fontWeight: '600',
            fontSize: '13.5px',
            textDecoration: 'none',
            transition: 'background 0.2s',
          }}
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;
