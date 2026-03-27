// Dashboard.jsx – Main overview page: stats, charts, bookmarks, suggested jobs
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAppContext } from '../context/ApplicationContext';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import SuggestedJobs from '../components/SuggestedJobs';
import EmptyState from '../components/EmptyState';
import { formatDate } from '../utils/dateUtils';
import { STATUS_OPTIONS } from '../utils/constants';
import './Dashboard.css';

// ── Custom Legend – matches Analytics layout ──
const CustomLegend = ({ payload }) => (
  <div style={{
    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',
    gap: '12px 24px', marginTop: '12px', paddingTop: '16px',
    borderTop: '1px solid var(--border-light)', width: '100%',
  }}>
    {payload.map((entry, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color, flexShrink: 0 }} />
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>{entry.value}</span>
      </div>
    ))}
  </div>
);

function Dashboard() {
  const { applications } = useAppContext();

  // ── Compute stats ─────────────────────────────────────────────────────
  const total = applications.length;
  const interviews = applications.filter((a) => a.status === 'Interview').length;
  const offers = applications.filter((a) => a.status === 'Offer').length;
  const rejections = applications.filter((a) => a.status === 'Rejected').length;
  const bookmarked = applications.filter((a) => a.bookmarked);

  // ── Build pie chart data ───────────────────────────────────────────────
  const pieData = STATUS_OPTIONS.map((s) => ({
    name: s.label,
    value: applications.filter((a) => a.status === s.value).length,
    color: s.color,
  })).filter((d) => d.value > 0); // hide slices with 0

  return (
    <div className="dashboard-page">
      {/* ── Stat Cards ───────────────────────────────────────────────── */}
      <div className="stats-grid">
        <StatCard label="Total Applications" value={total} icon="📋" color="#6366f1" />
        <StatCard label="Interviewing" value={interviews} icon="🗣️" color="#f59e0b" />
        <StatCard label="Offers Received" value={offers} icon="🎉" color="#10b981" sublabel="Congrats!" />
        <StatCard label="Rejected" value={rejections} icon="❌" color="#ef4444" />
      </div>

      {/* ── Charts row ───────────────────────────────────────────────── */}
      <div className="dashboard-charts">
        {/* Pie Chart – status distribution */}
        <div className="chart-card">
          <div className="section-title"><span>🥧</span> Status Distribution</div>
          {pieData.length === 0 ? (
            <EmptyState icon="📊" title="No data yet" message="Add some applications to see the chart." />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="40%"
                  innerRadius={55}
                  outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                />
                <Legend content={<CustomLegend />} verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent activity feed */}
        <div className="chart-card">
          <div className="section-title"><span>📅</span> Recent Applications</div>
          {applications.length === 0 ? (
            <EmptyState icon="📭" title="No applications yet" />
          ) : (
            <div>
              {applications.slice(0, 5).map((app) => (
                <div key={app.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {app.role}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{app.company} · {formatDate(app.appliedDate)}</div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom row: bookmarks + suggested jobs ──────────────────── */}
      <div className="dashboard-bottom">
        {/* Bookmarked jobs */}
        <div className="bookmarks-card">
          <div className="section-title"><span>⭐</span> Bookmarked Jobs</div>
          {bookmarked.length === 0 ? (
            <EmptyState icon="🔖" title="No bookmarks" message="Star a job card to pin it here." />
          ) : (
            bookmarked.map((app) => (
              <div key={app.id} className="bookmark-item">
                <div className="bookmark-info">
                  <div className="bookmark-role">{app.role}</div>
                  <div className="bookmark-company">{app.company}</div>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))
          )}
        </div>

        {/* Suggested jobs from API */}
        <div className="chart-card">
          <div className="section-title"><span>💡</span> Suggested Jobs <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 400 }}>(via API)</span></div>
          <SuggestedJobs />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
