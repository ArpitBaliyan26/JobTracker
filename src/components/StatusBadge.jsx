// StatusBadge.jsx – Colored pill for job application status.
// Now uses getStatusMeta() from constants to keep logic centralized.
import React from 'react';
import { getStatusMeta } from '../utils/constants';

function StatusBadge({ status }) {
  const meta = getStatusMeta(status);
  const color = meta.color;

  const style = {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    color: color,
    background: `${color}22`, // ~13% opacity version of the color
    border: `1px solid ${color}44`,
    whiteSpace: 'nowrap',
  };

  // Use the full label (e.g. "Interview Scheduled") from metadata
  return <span style={style}>{meta.label}</span>;
}

export default StatusBadge;
