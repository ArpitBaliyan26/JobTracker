// FilterPanel.jsx – Dropdowns for filtering by status, platform, and location
import React from 'react';
import { STATUS_OPTIONS, PLATFORM_OPTIONS } from '../utils/constants';

const panelStyle = {
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap',
  alignItems: 'center',
};

const selectStyle = {
  padding: '9px 14px',
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-primary)',
  fontSize: '13px',
  outline: 'none',
  cursor: 'pointer',
  minWidth: '140px',
};

function FilterPanel({ filters, onChange }) {
  // Generic handler: calls parent's onChange with updated filter key
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div style={panelStyle}>
      {/* Status filter */}
      <select
        style={selectStyle}
        value={filters.status}
        onChange={(e) => handleChange('status', e.target.value)}
        aria-label="Filter by status"
      >
        <option value="">All Statuses</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      {/* Platform filter */}
      <select
        style={selectStyle}
        value={filters.platform}
        onChange={(e) => handleChange('platform', e.target.value)}
        aria-label="Filter by platform"
      >
        <option value="">All Platforms</option>
        {PLATFORM_OPTIONS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {/* Location: free text select populated from existing data */}
      <input
        style={{ ...selectStyle, minWidth: '130px' }}
        type="text"
        placeholder="Location…"
        value={filters.location}
        onChange={(e) => handleChange('location', e.target.value)}
        aria-label="Filter by location"
      />

      {/* Clear filters button – only visible if any filter is set */}
      {(filters.status || filters.platform || filters.location) && (
        <button
          onClick={() => onChange({ status: '', platform: '', location: '' })}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            padding: '9px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
}

export default FilterPanel;
