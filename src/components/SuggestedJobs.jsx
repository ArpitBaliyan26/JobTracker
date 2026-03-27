// SuggestedJobs.jsx – Fetches product data from dummyjson API via Axios
// and displays them as "suggested job" cards.
// Clicking a card navigates to Add Application with pre-filled data.
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchSuggestedJobs } from '../services/jobService';
import LoadingSpinner from './LoadingSpinner';

function SuggestedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuggestedJobs()
      .then((data) => setJobs(data))
      .catch(() => setError('Could not load suggestions.'))
      .finally(() => setLoading(false));
  }, []);

  // Navigate to Add Application form with pre-filled data
  const handleClick = (job) => {
    toast.info(`Pre-filling form with "${job.role}" at ${job.company}`);
    navigate('/applications/new', {
      state: {
        prefill: {
          company: job.company,
          role: job.role,
          salary: job.salary || '',
        },
      },
    });
  };

  if (loading) return <LoadingSpinner message="Loading suggested jobs…" />;
  if (error) return <p style={{ color: 'var(--danger)', fontSize: '13px' }}>{error}</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
      {jobs.map((job) => (
        <div
          key={job.id}
          onClick={() => handleClick(job)}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            e.currentTarget.style.borderColor = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          <img
            src={job.thumbnail}
            alt={job.role}
            style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px' }}
          />
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', lineHeight: 1.3 }}>
            {job.role}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{job.company}</div>
          <div style={{ fontSize: '11px', color: 'var(--success)' }}>₹{job.salary}/yr</div>
          <div style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 500, marginTop: '4px' }}>
            Click to apply →
          </div>
        </div>
      ))}
    </div>
  );
}

export default SuggestedJobs;

