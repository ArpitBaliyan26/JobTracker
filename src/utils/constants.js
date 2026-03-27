// constants.js – Central place for all dropdown/filter options used across the app

// ── Full 6-stage job pipeline ────────────────────────────────────────────
// Each status has a dedicated date field that the UI should display/require.
// Rejection can occur at any stage.
export const STATUS_OPTIONS = [
  { value: 'To Apply',          label: 'To Apply',            color: 'var(--accent)',  dateField: 'deadlineToApply',  dateLabel: 'Application Deadline' },
  { value: 'Applied',           label: 'Applied',              color: 'var(--info)',    dateField: 'appliedDate',      dateLabel: 'Applied Date' },
  { value: 'Interview',         label: 'Interview Scheduled',  color: 'var(--warning)', dateField: 'interviewDate',    dateLabel: 'Interview Date' },
  { value: 'Waiting',           label: 'Waiting for Result',   color: 'var(--teal)',    dateField: 'resultDate',       dateLabel: 'Expected Result Date' },
  { value: 'Offer',             label: 'Offer Received',        color: 'var(--success)', dateField: 'offerDate',        dateLabel: 'Offer Date' },
  { value: 'Rejected',          label: 'Rejected',              color: 'var(--danger)',  dateField: 'rejectionDate',    dateLabel: 'Rejection Date' },
];

// Priority options for sorting/tagging
export const PRIORITY_OPTIONS = [
  { value: 'High',   label: '🔴 High',   order: 1 },
  { value: 'Medium', label: '🟡 Medium', order: 2 },
  { value: 'Low',    label: '🟢 Low',    order: 3 },
];

export const PLATFORM_OPTIONS = [
  'LinkedIn',
  'Indeed',
  'Naukri',
  'Glassdoor',
  'Company Website',
  'Referral',
  'Internshala',
  'AngelList',
  'Other',
];

export const SORT_OPTIONS = [
  { value: 'appliedDate_desc',  label: 'Date Applied (Newest)' },
  { value: 'appliedDate_asc',   label: 'Date Applied (Oldest)' },
  { value: 'deadline_asc',      label: 'Deadline (Nearest first)' },
  { value: 'priority_asc',      label: 'Priority (High → Low)' },
  { value: 'salary_desc',       label: 'Salary (High → Low)' },
  { value: 'salary_asc',        label: 'Salary (Low → High)' },
  { value: 'company_asc',       label: 'Company (A → Z)' },
  { value: 'company_desc',      label: 'Company (Z → A)' },
];

// Pipeline tab definitions – maps to STATUS_OPTIONS values
export const PIPELINE_TABS = [
  { label: 'All',               value: 'All' },
  { label: 'To Apply',          value: 'To Apply' },
  { label: 'Applied',           value: 'Applied' },
  { label: 'Interviewing',      value: 'Interview' },
  { label: 'Waiting',           value: 'Waiting' },
  { label: 'Offer Received',    value: 'Offer' },
  { label: 'Rejected',          value: 'Rejected' },
];

/**
 * getStatusMeta(statusValue)
 * Returns the full metadata object for a given status value.
 * Used in JobCard to pick the correct date field to display.
 */
export function getStatusMeta(statusValue) {
  return STATUS_OPTIONS.find((s) => s.value === statusValue) || STATUS_OPTIONS[1];
}

/**
 * getPriorityOrder(priority)
 * Returns a numeric order for sorting. Unknown → 99 (sorts last).
 */
export function getPriorityOrder(priority) {
  const found = PRIORITY_OPTIONS.find((p) => p.value === priority);
  return found ? found.order : 99;
}
