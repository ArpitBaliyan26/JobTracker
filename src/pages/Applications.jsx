// Applications.jsx – Main list page with search, filter, sort, and pipeline tabs.
// FIX: Added priority and deadline sort options.
// FIX: Bookmarks tab now filters to show ONLY bookmarked applications.
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context/ApplicationContext';
import JobCard from '../components/JobCard';
import EmptyState from '../components/EmptyState';
import { getPriorityOrder, PLATFORM_OPTIONS } from '../utils/constants';
import './Applications.css';

function Applications() {
  const { applications } = useAppContext();
  const location = useLocation();

  // Check if we arrived here via the Bookmarks sidebar link
  const isBookmarksView = new URLSearchParams(location.search).get('tab') === 'bookmarks';

  const [searchInput, setSearchInput]   = useState('');
  const [searchQuery, setSearchQuery]   = useState('');
  const [activeTab, setActiveTab]       = useState('All');
  const [filters, setFilters]           = useState({ status: '', platform: '', location: '' });
  const [sortBy, setSortBy]             = useState('appliedDate_desc');

  // Debounce the search input directly using useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ── Derive visible list (useMemo = only recompute when dependencies change) ──
  const visibleApps = useMemo(() => {
    let list = [...applications];

    // ── BUG FIX: Bookmarks view shows ONLY bookmarked jobs ──────────────
    if (isBookmarksView) {
      return list.filter((a) => a.bookmarked);
    }

    // 1. Pipeline tab filter
    if (activeTab !== 'All') {
      list = list.filter((a) => a.status === activeTab);
    }

    // 2. Dropdown filters
    if (filters.status)   list = list.filter((a) => a.status   === filters.status);
    if (filters.platform) list = list.filter((a) => a.platform === filters.platform);
    if (filters.location) {
      list = list.filter((a) =>
        a.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // 3. Search (debounced) – match company or role
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.company.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q)
      );
    }

    // 4. Sort — includes Priority, Deadline, and null-safe date handling
    list.sort((a, b) => {
      // Helper: safely parse a date string; returns null if empty/invalid
      const safeDate = (str) => (str && str.trim() ? new Date(str) : null);

      switch (sortBy) {
        case 'appliedDate_desc': {
          const da = safeDate(a.appliedDate);
          const db = safeDate(b.appliedDate);
          // Null dates sort to the END in descending (newest-first) view
          if (!da && !db) return 0;
          if (!da) return 1;  // a is null → goes after b
          if (!db) return -1; // b is null → goes after a
          return db - da;
        }
        case 'appliedDate_asc': {
          const da = safeDate(a.appliedDate);
          const db = safeDate(b.appliedDate);
          // Null dates sort to the END in ascending (oldest-first) view
          if (!da && !db) return 0;
          if (!da) return 1;
          if (!db) return -1;
          return da - db;
        }
        case 'priority_asc': {
          const diff = getPriorityOrder(a.priority) - getPriorityOrder(b.priority);
          if (diff !== 0) return diff;
          const da = safeDate(a.appliedDate);
          const db = safeDate(b.appliedDate);
          if (!da && !db) return 0;
          if (!da) return 1;
          if (!db) return -1;
          return db - da;
        }
        case 'priority_desc': {
          const diff = getPriorityOrder(b.priority) - getPriorityOrder(a.priority);
          if (diff !== 0) return diff;
          const da2 = safeDate(a.appliedDate);
          const db2 = safeDate(b.appliedDate);
          if (!da2 && !db2) return 0;
          if (!da2) return 1;
          if (!db2) return -1;
          return db2 - da2;
        }
        case 'deadline_asc': {
          const SENTINEL = new Date('9999-12-31');
          const da = safeDate(a.deadlineToApply) || SENTINEL;
          const db = safeDate(b.deadlineToApply) || SENTINEL;
          return da - db;
        }
        case 'deadline_desc': {
          const da = safeDate(a.deadlineToApply);
          const db = safeDate(b.deadlineToApply);
          if (!da && !db) return 0;
          if (!da) return 1;
          if (!db) return -1;
          return db - da;
        }
        case 'salary_desc':
          return Number(b.salary || 0) - Number(a.salary || 0);
        case 'salary_asc':
          return Number(a.salary || 0) - Number(b.salary || 0);
        case 'company_asc':
          return (a.company || '').localeCompare(b.company || '');
        case 'company_desc':
          return (b.company || '').localeCompare(a.company || '');
        default:
          return 0;
      }
    });

    return list;
  }, [applications, activeTab, filters, searchQuery, sortBy, isBookmarksView]);

  // ── Bookmarks view renders a simpler layout ───────────────────────────
  if (isBookmarksView) {
    return (
      <div className="applications-page">
        <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: 'var(--text-primary)' }}>
          ⭐ Bookmarked Applications
        </h2>
        {visibleApps.length === 0 ? (
          <EmptyState
            icon="🔖"
            title="No bookmarked jobs yet"
            message="Click the ☆ star on any job card to bookmark it and it will appear here."
            actionLabel="View All Applications"
            actionTo="/applications"
          />
        ) : (
          <div className="jobs-grid">
            {visibleApps.map((app) => (
              <JobCard key={app.id} application={app} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="applications-page">
      {/* ── Top Header Row (Search + Filters + Sort) ── */}
      <div className="apps-header-row">
        <div className="search-container">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input-sleek"
            placeholder="Search by role or company..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="filter-dropdowns">
          <div className="select-wrapper">
            <svg className="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            <select
              className="sleek-select"
              value={filters.platform}
              onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
            >
              <option value="">All Platforms</option>
              {PLATFORM_OPTIONS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="select-wrapper">
            <select
              className="sleek-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="appliedDate_desc">Applied Date (Newest → Oldest)</option>
              <option value="appliedDate_asc">Applied Date (Oldest → Newest)</option>
              <option value="deadline_asc">Deadline (Earliest → Latest)</option>
              <option value="deadline_desc">Deadline (Latest → Earliest)</option>
              <option value="salary_desc">Salary (High → Low)</option>
              <option value="salary_asc">Salary (Low → High)</option>
              <option value="priority_asc">Priority (High → Low)</option>
              <option value="priority_desc">Priority (Low → High)</option>
              <option value="company_asc">Company (A → Z)</option>
              <option value="company_desc">Company (Z → A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Status Text Tabs ── */}
      <div className="pipeline-tabs-text">
        <button
          className={activeTab === 'All' ? 'active tab-btn' : 'tab-btn'}
          onClick={() => setActiveTab('All')}
        >
          All ({applications.length})
        </button>
        {['To Apply', 'Applied', 'Interview', 'Waiting', 'Offer', 'Rejected'].map((status) => {
          const count = applications.filter((a) => a.status === status).length;
          return (
            <button
              key={status}
              className={activeTab === status ? 'active tab-btn' : 'tab-btn'}
              onClick={() => setActiveTab(status)}
            >
              {status} ({count})
            </button>
          );
        })}
      </div>

      {/* Card grid or empty state */}
      {visibleApps.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No applications found"
          message="Try changing your filters, search query, or add a new application."
        />
      ) : (
        <div className="jobs-grid">
          {visibleApps.map((app) => (
            <JobCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Applications;
