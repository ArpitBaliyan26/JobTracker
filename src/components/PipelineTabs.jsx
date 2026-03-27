// PipelineTabs.jsx – Horizontal tab bar showing all 6 pipeline stages.
// Updated to use the new PIPELINE_TABS from constants.
import React from 'react';
import { PIPELINE_TABS } from '../utils/constants';
import { useAppContext } from '../context/ApplicationContext';

function PipelineTabs({ activeTab, onTabChange }) {
  const { applications } = useAppContext();

  // Count applications for each tab value
  const getCount = (tabValue) => {
    if (tabValue === 'All') return applications.length;
    return applications.filter((a) => a.status === tabValue).length;
  };

  return (
    <div style={{
      display: 'flex',
      gap: '2px',
      borderBottom: '1px solid var(--border)',
      marginBottom: '24px',
      overflowX: 'auto',
      paddingBottom: '0',
    }}>
      {PIPELINE_TABS.map((tab) => {
        const isActive = activeTab === tab.value;
        const count = getCount(tab.value);
        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            aria-label={`${tab.label} tab`}
            style={{
              padding: '10px 16px',
              background: 'none',
              border: 'none',
              borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: isActive ? '600' : '400',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '-1px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {tab.label}
            <span style={{
              background: isActive ? 'var(--accent)' : 'var(--bg-hover)',
              color: isActive ? 'white' : 'var(--text-muted)',
              fontSize: '10px',
              fontWeight: '600',
              padding: '1px 6px',
              borderRadius: '10px',
            }}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default PipelineTabs;
