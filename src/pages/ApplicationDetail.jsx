// ApplicationDetail.jsx – Read-only view of a single job application
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/ApplicationContext';
import { toast } from 'react-toastify';
import StatusBadge from '../components/StatusBadge';
import { formatDate, timeAgo } from '../utils/dateUtils';

function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications, deleteApplication } = useAppContext();

  const app = applications.find((a) => a.id === id);

  if (!app) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
        <div style={{ fontSize: '48px' }}>🔍</div>
        <h2>Application not found</h2>
        <Link to="/applications" style={{ color: 'var(--accent)', marginTop: '16px', display: 'inline-block' }}>
          ← Back to Applications
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm(`Delete this application?`)) {
      deleteApplication(id);
      toast.error('Application deleted');
      navigate('/applications');
    }
  };

// Reusable display field component
const Field = ({ label, value, icon }) => (
  <div style={{ marginBottom: '20px' }}>
    <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '4px' }}>
      {icon} {label}
    </div>
    <div style={{ fontSize: '14px', color: value ? 'var(--text-primary)' : 'var(--text-muted)' }}>
      {value || '—'}
    </div>
  </div>
);

  return (
    <div style={{ maxWidth: '680px' }}>
      {/* Back link */}
      <Link to="/applications" style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '20px' }}>
        ← Back to Applications
      </Link>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
              {app.role}
            </h1>
            <div style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>{app.company}</div>
            <div style={{ marginTop: '8px' }}><StatusBadge status={app.status} /></div>
          </div>
          {app.bookmarked && <span style={{ fontSize: '24px' }}>⭐</span>}
        </div>

        {/* Two-column grid of fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
          <Field label="Location"      icon="📍" value={app.location} />
          <Field label="Salary"        icon="💰" value={app.salary ? `₹${Number(app.salary).toLocaleString()}` : null} />
          <Field label="Platform"      icon="🔗" value={app.platform} />
          <Field label="Applied Date"  icon="📅" value={`${formatDate(app.appliedDate)} (${timeAgo(app.appliedDate)})`} />
          <Field label="Interview Date" icon="🗓️" value={app.interviewDate ? formatDate(app.interviewDate) : null} />
        </div>

        {/* Notes */}
        {app.notes && (
          <div style={{ marginTop: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '8px' }}>
              📝 Notes
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.7 }}>{app.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
          <Link
            to={`/applications/${id}/edit`}
            style={{ padding: '9px 22px', background: 'var(--accent)', color: 'white', borderRadius: '8px', fontWeight: '600', fontSize: '13px', textDecoration: 'none' }}
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            style={{ padding: '9px 22px', background: 'none', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetail;
