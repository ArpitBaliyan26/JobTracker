// validationSchema.js – Validation rules for the application form.
//
// Design philosophy:
//   ERROR (blocks submit) → logically impossible date orders
//   WARNING (allows submit) → future dates, past deadlines
//
// This makes the form realistic for both tracking AND planning.
import * as yup from 'yup';

// Parse a date string to a Date, or return null if empty/invalid
function parseDate(val) {
  if (!val || val.trim() === '') return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

// Today as a YYYY-MM-DD string for reliable comparisons (avoids timezone issues)
const todayStr = new Date().toISOString().split('T')[0];

// ── Separate warnings function (called from the form, NOT from yup) ──────
// Returns an object like { appliedDate: 'warning message', ... }
export function getDateWarnings(formValues) {
  const warnings = {};
  const { status, appliedDate, deadlineToApply, offerDate, rejectionDate, interviewDate } = formValues;

  // Warning: Applied date is STRICTLY in the future (today is fine)
  if (appliedDate && appliedDate > todayStr) {
    warnings.appliedDate = 'Applied date is in the future — are you sure?';
  }

  // Warning: Deadline has already passed
  if (deadlineToApply && deadlineToApply < todayStr) {
    warnings.deadlineToApply = 'This deadline has already passed';
  }

  // Warning: Offer date in the future (you can't have received an offer tomorrow)
  if (status === 'Offer' && offerDate && offerDate > todayStr) {
    warnings.offerDate = 'Offer date is in the future — has this actually been received?';
  }

  // Warning: Rejection date in the future
  if (status === 'Rejected' && rejectionDate && rejectionDate > todayStr) {
    warnings.rejectionDate = 'Rejection date is in the future';
  }

  // Warning: Interview date in the future is fine (scheduled for later) — no warning needed

  return warnings;
}

// ── Main yup schema ──────────────────────────────────────────────────────
// Only contains HARD ERRORS that block submission.
export const applicationSchema = yup.object({

  // ── Basic required text fields ─────────────────────────────────────────
  company:  yup.string().trim().required('Company name is required'),
  role:     yup.string().trim().required('Job role is required'),
  location: yup.string().trim().required('Location is required'),
  platform: yup.string().required('Please select a platform'),
  status:   yup.string().required('Status is required'),

  priority: yup.string().optional(),

  salary: yup
    .number()
    .typeError('Salary must be a number')
    .min(0, 'Salary cannot be negative')
    .optional()
    .nullable()
    .transform((val, orig) => (orig === '' ? null : val)),

  notes:    yup.string().optional(),
  bookmarked: yup.boolean(),

  // ── Date fields ────────────────────────────────────────────────────────

  // Deadline: required only for "To Apply"
  deadlineToApply: yup.string()
    .nullable()
    .test('deadline-rules', '', function (val) {
      const { status } = this.parent;
      if (status === 'To Apply' && !val) {
        return this.createError({ message: 'Application deadline is required for "To Apply"' });
      }
      // No hard error for past deadlines — that's a WARNING (handled separately)
      return true;
    }),

  // Applied Date: required for all statuses except "To Apply"
  // Future dates are allowed (WARNING only, not blocking)
  appliedDate: yup.string()
    .nullable()
    .test('applied-date-rules', '', function (val) {
      const { status } = this.parent;
      const requiresApplied = ['Applied', 'Interview', 'Waiting', 'Offer', 'Rejected'];
      if (requiresApplied.includes(status) && !val) {
        return this.createError({ message: 'Applied date is required for this status' });
      }
      // Future dates are NOT an error — only a warning (see getDateWarnings)
      return true;
    }),

  // Interview Date: required for Interview & Waiting
  // ERROR if before applied date
  interviewDate: yup.string()
    .nullable()
    .test('interview-date-rules', '', function (val) {
      const { status, appliedDate } = this.parent;
      if (['Interview', 'Waiting'].includes(status) && !val) {
        return this.createError({ message: 'Interview date is required for this status' });
      }
      // Hard error: interview cannot be before applied date
      if (val && appliedDate) {
        const applied = parseDate(appliedDate);
        const interview = parseDate(val);
        if (applied && interview && interview < applied) {
          return this.createError({ message: 'Interview date cannot be before Applied date' });
        }
      }
      return true;
    }),

  // Result Date: required for Waiting; must be ≥ interview date
  resultDate: yup.string()
    .nullable()
    .test('result-date-rules', '', function (val) {
      const { status, interviewDate } = this.parent;
      if (status === 'Waiting' && !val) {
        return this.createError({ message: 'Expected result date is required' });
      }
      if (val && interviewDate) {
        const interview = parseDate(interviewDate);
        const result = parseDate(val);
        if (interview && result && result < interview) {
          return this.createError({ message: 'Result date cannot be before Interview date' });
        }
      }
      return true;
    }),

  // Offer Date: required for Offer; ERROR if before interview date
  offerDate: yup.string()
    .nullable()
    .test('offer-date-rules', '', function (val) {
      const { status, interviewDate, appliedDate } = this.parent;
      if (status === 'Offer' && !val) {
        return this.createError({ message: 'Offer date is required' });
      }
      // Must be ≥ interview date (if present)
      if (val && interviewDate) {
        const interview = parseDate(interviewDate);
        const offer = parseDate(val);
        if (interview && offer && offer < interview) {
          return this.createError({ message: 'Offer date cannot be before Interview date' });
        }
      }
      // Must be ≥ applied date
      if (val && appliedDate) {
        const applied = parseDate(appliedDate);
        const offer = parseDate(val);
        if (applied && offer && offer < applied) {
          return this.createError({ message: 'Offer date cannot be before Applied date' });
        }
      }
      return true;
    }),

  // Rejection Date: required for Rejected; must be ≥ applied date
  rejectionDate: yup.string()
    .nullable()
    .test('rejection-date-rules', '', function (val) {
      const { status, appliedDate } = this.parent;
      if (status === 'Rejected' && !val) {
        return this.createError({ message: 'Rejection date is required' });
      }
      if (val && appliedDate) {
        const applied = parseDate(appliedDate);
        const rejection = parseDate(val);
        if (applied && rejection && rejection < applied) {
          return this.createError({ message: 'Rejection date cannot be before Applied date' });
        }
      }
      return true;
    }),
});

