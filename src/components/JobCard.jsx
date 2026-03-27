// JobCard.jsx – Displays a single job application as a card.
// FIX: Shows the relevant date for each status stage (not always "Applied Date").
// FIX: Shows priority badge on the card.
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/ApplicationContext';
import { toast } from 'react-toastify';
import StatusBadge from './StatusBadge';
import { formatDate } from '../utils/dateUtils';
import { getStatusMeta } from '../utils/constants';
import { getCompanyLogo } from '../utils/helpers';
import './JobCard.css';

// Priority badge colors
const PRIORITY_COLORS = {
  High:   { bg: '#ef444422', text: '#ef4444', border: '#ef444444' },
  Medium: { bg: '#f59e0b22', text: '#f59e0b', border: '#f59e0b44' },
  Low:    { bg: '#10b98122', text: '#10b981', border: '#10b98144' },
};

function JobCard({ application }) {
  const { deleteApplication, toggleBookmark } = useAppContext();

  const {
    id, company, role, location, salary, platform, status, priority,
    appliedDate, deadlineToApply, interviewDate, resultDate,
    offerDate, rejectionDate, notes, bookmarked,
  } = application;

  const logoUrl = getCompanyLogo(company);
  console.log(`[JobCard] Loading logo for "${company}" -> ${logoUrl}`);

  const handleDelete = () => {
    if (window.confirm(`Delete application for ${role} at ${company}?`)) {
      deleteApplication(id);
      toast.error('Application deleted');
    }
  };

  const handleBookmark = () => {
    toggleBookmark(id);
    toast.success(bookmarked ? 'Removed from bookmarks' : 'Bookmarked! ⭐');
  };

  // ── Dynamic date display ───────────────────────────────────────────────
  // Instead of always showing "Applied Date", we pick the relevant date
  // for the current pipeline stage using the STATUS_OPTIONS metadata.
  const statusMeta = getStatusMeta(status);
  const dateFieldMap = {
    deadlineToApply, appliedDate, interviewDate, resultDate, offerDate, rejectionDate,
  };
  const relevantDate = dateFieldMap[statusMeta.dateField];
  const relevantDateLabel = statusMeta.dateLabel;

  const priorityStyle = priority ? PRIORITY_COLORS[priority] : null;

  return (
    <div className="job-card">
      <button
        className="bookmark-btn"
        onClick={handleBookmark}
        title={bookmarked ? 'Remove bookmark' : 'Bookmark this job'}
        aria-label="Toggle bookmark"
      >
        {bookmarked ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Header: logo + role + company */}
      <div className="job-card-header">
        <div className="company-logo-wrapper">
          <img
            className="company-logo"
            src={logoUrl}
            alt={company}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-logo.svg';
            }}
          />
        </div>
        <div className="job-card-title">
          <h3 className="job-role">{role}</h3>
          <span className="job-company">{company}</span>
        </div>
      </div>

      {/* Meta info row (Location & Salary) */}
      <div className="job-card-meta-list">
        {location && (
          <span className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            {location}
          </span>
        )}
        {salary && (
          <span className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            {isNaN(Number(salary)) ? salary : `$${Number(salary).toLocaleString()}`}
          </span>
        )}
        {platform && (
          <span className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            {platform}
          </span>
        )}
      </div>

      {/* Badges Row */}
      <div className="job-card-badges">
        <StatusBadge status={status} />
        {priority && priorityStyle && (
          <span className="priority-badge" style={{ color: priorityStyle.text }}>
            {priority} Priority
          </span>
        )}
      </div>

      {/* Notes preview */}
      {notes && <div className="job-card-notes">{notes}</div>}

      {/* Footer: Date + Actions */}
      <div className="job-card-footer">
        <div className="card-actions">
          <Link to={`/applications/${id}/edit`} className="action-link">Edit</Link>
          <span className="action-divider">•</span>
          <button className="action-link text-danger" onClick={handleDelete}>Delete</button>
        </div>
        <span className="card-date">
          {relevantDate ? `${relevantDateLabel.split(' ')[0]}: ${formatDate(relevantDate)}` : 'No Date'}
        </span>
      </div>
    </div>
  );
}

export default JobCard;
