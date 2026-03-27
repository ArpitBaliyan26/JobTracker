// SearchBar.jsx – Simple search input; the debounce is handled by the parent
import React from 'react';

const wrapStyle = {
  position: 'relative',
  flex: 1,
  minWidth: '220px',
};

const iconStyle = {
  position: 'absolute',
  left: '14px',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '16px',
  pointerEvents: 'none',
};

const inputStyle = {
  width: '100%',
  padding: '10px 16px 10px 42px',
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-primary)',
  fontSize: '13.5px',
  outline: 'none',
  transition: 'border-color 0.2s',
};

function SearchBar({ value, onChange, placeholder = 'Search by company or role…' }) {
  return (
    <div style={wrapStyle}>
      <span style={iconStyle}>🔍</span>
      <input
        type="text"
        style={inputStyle}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
      />
    </div>
  );
}

export default SearchBar;
