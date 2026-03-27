// Analytics.jsx – Charts and statistics for the user's job search
import React, { useMemo } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { useAppContext } from '../context/ApplicationContext';
import { getMonthKey, getMonthLabel } from '../utils/dateUtils';
import { STATUS_OPTIONS } from '../utils/constants';
import EmptyState from '../components/EmptyState';

// ── Helper: group applications by month ─────────────────────────────────
function groupByMonth(applications) {
  const map = {};
  applications.forEach((app) => {
    const key = getMonthKey(app.appliedDate);
    if (!key) return;
    if (!map[key]) map[key] = { key, label: getMonthLabel(app.appliedDate), count: 0 };
    map[key].count += 1;
  });
  // Sort chronologically by the key (YYYY-MM)
  return Object.values(map).sort((a, b) => a.key.localeCompare(b.key));
}

const cardStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  padding: '28px',
  marginBottom: '20px',
};

const sectionTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: 'var(--text-primary)',
  marginBottom: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const tooltipStyle = {
  contentStyle: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '12px',
  },
};

// ── Custom Legend – balanced horizontal row ──
const CustomLegend = ({ payload }) => {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '12px 24px',
      marginTop: '12px',
      paddingTop: '16px',
      borderTop: '1px solid var(--border-light)',
      width: '100%',
    }}>
      {payload.map((entry, index) => (
        <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color, flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

function Analytics() {
  const { applications } = useAppContext();

  // 1. Data processing
  const total = applications.length;
  // Rates
  const interviewCount = applications.filter(a => ['Interview', 'Waiting', 'Offer', 'Rejected'].includes(a.status)).length;
  const offerCount = applications.filter(a => a.status === 'Offer').length;
  const rejectionCount = applications.filter(a => a.status === 'Rejected').length;

  const interviewRate = total > 0 ? ((interviewCount / total) * 100).toFixed(1) : 0;
  const offerRate = total > 0 ? ((offerCount / total) * 100).toFixed(1) : 0;
  const rejectionRate = total > 0 ? ((rejectionCount / total) * 100).toFixed(1) : 0;

  // Monthly data
  const monthlyData = useMemo(() => groupByMonth(applications), [applications]);

  // Status Pie Data
  const statusData = useMemo(() =>
    STATUS_OPTIONS.map((s) => ({
      name: s.label,
      value: applications.filter((a) => a.status === s.value).length,
      color: s.color,
    })).filter((d) => d.value > 0),
    [applications]
  );

  // Priority Pie Data – softer, modern pastel palette
  const priorityData = useMemo(() => {
    const high = applications.filter(a => a.priority === 'High').length;
    const medium = applications.filter(a => a.priority === 'Medium').length;
    const low = applications.filter(a => a.priority === 'Low').length;
    return [
      { name: 'High', value: high, color: '#f87171' },
      { name: 'Medium', value: medium, color: '#fbbf24' },
      { name: 'Low', value: low, color: '#34d399' }
    ].filter(d => d.value > 0);
  }, [applications]);

  // Platform Progress Data
  const platformData = useMemo(() => {
    const map = {};
    applications.forEach(a => {
      if (!a.platform) return;
      map[a.platform] = (map[a.platform] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [applications]);

  if (applications.length === 0) {
    return (
      <EmptyState
        icon="📊"
        title="No data to analyze yet"
        message="Add some job applications to see your analytics here."
      />
    );
  }

  // --- Reusable card style for the dashboard grid ---
  const panelStyle = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '24px',
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    boxShadow: 'var(--shadow-sm)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };

  const panelTitle = {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '20px',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* ── ROW 1: Stat Cards ──────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {[
          { label: 'Interview Rate', value: `${interviewRate}%`,     color: '#8b5cf6', icon: <path d="M23 6l-9.5 9.5-5-5L1 18"></path> },
          { label: 'Offer Rate',     value: `${offerRate}%`,         color: '#10b981', icon: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path> },
          { label: 'Rejection Rate', value: `${rejectionRate}%`,     color: '#ef4444', icon: <path d="M18 6L6 18M6 6l12 12"></path> },
          { label: 'Total Applications', value: total,               color: '#3b82f6', icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path> },
        ].map((item) => (
          <div key={item.label} style={{ ...panelStyle, padding: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '500' }}>{item.label}</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>{item.value}</div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 {item.icon}
               </svg>
            </div>
          </div>
        ))}
      </div>

      {/* ── ROW 2: Pie Charts Side by Side ──────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        
        {/* Status Breakdown */}
        <div style={panelStyle}>
          <div style={panelTitle}>Status Distribution</div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="45%" outerRadius={85} innerRadius={55} paddingAngle={4} dataKey="value" stroke="none">
                {statusData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend content={<CustomLegend />} verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div style={panelStyle}>
          <div style={panelTitle}>Priority Distribution</div>
          {priorityData.length === 0 ? (
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '260px', color: 'var(--text-muted)', fontSize: '13px' }}>No priority data tagged yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={priorityData} cx="50%" cy="45%" outerRadius={85} innerRadius={0} paddingAngle={2} dataKey="value" stroke="var(--bg-card)" strokeWidth={3}>
                  {priorityData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend content={<CustomLegend />} verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── ROW 3: Monthly Chart & Platform Progress ──────────────────────────────────────────────── */}
      
      <div style={panelStyle}>
        <div style={panelTitle}>Applications Over Time</div>
        {monthlyData.length < 2 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>
            Apply to more jobs across different months to see the historical trend chart.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} allowDecimals={false} axisLine={false} tickLine={false} dx={-10} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="count" name="Applications" stroke="var(--info)" strokeWidth={3} dot={{ fill: 'var(--bg-card)', stroke: 'var(--info)', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: 'var(--info)', stroke: 'var(--bg-card)', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={panelStyle}>
        <div style={panelTitle}>Applications by Platform</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {platformData.length === 0 ? (
             <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No platform data tagged yet</div>
          ) : (() => {
            const totalPlatformApps = platformData.reduce((sum, p) => sum + p.count, 0);
            const maxCount = Math.max(...platformData.map(p => p.count));
            return platformData.map((plat) => {
              const barWidth = Math.round((plat.count / maxCount) * 100);
              const pct = Math.round((plat.count / totalPlatformApps) * 100);
              return (
                <div
                  key={plat.name}
                  title={`${plat.count} application${plat.count !== 1 ? 's' : ''} (${pct}% of total)`}
                  style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'default' }}
                >
                  <div style={{ width: '120px', fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--info)' }} />
                    {plat.name}
                  </div>
                  <div style={{ flex: 1, background: 'var(--bg-secondary)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${barWidth}%`, height: '100%', background: 'var(--info)', borderRadius: '4px', transition: 'width 0.5s ease-out' }} />
                  </div>
                  <div style={{ width: '56px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {plat.count} <span style={{ fontSize: '11px', color: 'var(--text-muted)', opacity: 0.7 }}>({pct}%)</span>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

    </div>
  );
}

export default Analytics;
