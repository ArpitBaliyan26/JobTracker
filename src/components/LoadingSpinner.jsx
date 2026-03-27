// LoadingSpinner.jsx – Simple centered spinner for async states
import React from 'react';

const overlayStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px',
  gap: '16px',
};

const spinnerStyle = {
  width: '40px',
  height: '40px',
  border: '3px solid var(--border)',
  borderTop: '3px solid var(--accent)',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
};

// Inject the keyframe animation once via a style tag approach
const keyframes = `
@keyframes spin {
  to { transform: rotate(360deg); }
}
`;

function LoadingSpinner({ message = 'Loading…' }) {
  return (
    <>
      <style>{keyframes}</style>
      <div style={overlayStyle}>
        <div style={spinnerStyle} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{message}</p>
      </div>
    </>
  );
}

export default LoadingSpinner;
