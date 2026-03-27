// dateUtils.js – Thin wrappers around date-fns so we don't scatter imports everywhere
import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

/**
 * Format a date string to "MMM dd, yyyy" e.g. "Jan 15, 2025"
 * Returns "N/A" if the date is invalid or empty.
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = parseISO(dateStr);
  return isValid(date) ? format(date, 'MMM dd, yyyy') : 'N/A';
}

/**
 * Returns "3 days ago", "2 months ago", etc.
 */
export function timeAgo(dateStr) {
  if (!dateStr) return '';
  const date = parseISO(dateStr);
  return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : '';
}

/**
 * Returns the month label like "Jan 2025" for grouping in the analytics chart.
 */
export function getMonthLabel(dateStr) {
  if (!dateStr) return 'Unknown';
  const date = parseISO(dateStr);
  return isValid(date) ? format(date, 'MMM yyyy') : 'Unknown';
}

/**
 * Returns "YYYY-MM" for sorting/grouping month buckets.
 */
export function getMonthKey(dateStr) {
  if (!dateStr) return '';
  const date = parseISO(dateStr);
  return isValid(date) ? format(date, 'yyyy-MM') : '';
}
