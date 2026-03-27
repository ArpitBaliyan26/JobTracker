// ApplicationForm.jsx – Add/Edit form with real-time validation.
//
// Key react-hook-form configuration explained (important for viva):
//   mode: 'onBlur'        → validate a field as soon as the user leaves it
//   reValidateMode: 'onChange' → once an error has appeared, re-check it on
//                               every keystroke / change so the error clears
//                               the moment the user fixes it
//
// trigger() is called manually for cross-field dependencies:
//   - When appliedDate changes → re-validate interviewDate & rejectionDate
//   - When interviewDate changes → re-validate resultDate & offerDate
//   - When status changes → re-validate all visible date fields
//
// All validation RULES live in ../utils/validationSchema.js
import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppContext } from '../context/ApplicationContext';
import { applicationSchema, getDateWarnings } from '../utils/validationSchema';
import { STATUS_OPTIONS, PLATFORM_OPTIONS, PRIORITY_OPTIONS } from '../utils/constants';
import './ApplicationForm.css';

// ── Which date fields to render for each status ──────────────────────────
// Only the relevant fields are shown. Validation rules handle what's required.
const STATUS_DATE_FIELDS = {
  'To Apply':  [{ name: 'deadlineToApply', label: 'Application Deadline *' }],
  'Applied':   [{ name: 'appliedDate',     label: 'Applied Date *' }],
  'Interview': [
    { name: 'appliedDate',   label: 'Applied Date *' },
    { name: 'interviewDate', label: 'Interview Date *' },
  ],
  'Waiting': [
    { name: 'appliedDate',   label: 'Applied Date *' },
    { name: 'interviewDate', label: 'Interview Date *' },
    { name: 'resultDate',    label: 'Expected Result Date *' },
  ],
  'Offer': [
    { name: 'appliedDate', label: 'Applied Date *' },
    { name: 'offerDate',   label: 'Offer Date *' },
  ],
  'Rejected': [
    { name: 'appliedDate',   label: 'Applied Date *' },
    { name: 'rejectionDate', label: 'Rejection Date *' },
  ],
};

// ── Cross-field dependency map ────────────────────────────────────────────
// When field X changes, we must re-validate field Y because Y's rule reads X.
// Example: interviewDate rule reads appliedDate → when appliedDate changes,
//          re-validate interviewDate to clear/show its error immediately.
const TRIGGER_DEPENDENTS = {
  appliedDate:     ['interviewDate', 'rejectionDate'],
  interviewDate:   ['resultDate', 'offerDate'],
  deadlineToApply: [],
  resultDate:      [],
  offerDate:       [],
  rejectionDate:   [],
};

function ApplicationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications, addApplication, updateApplication } = useAppContext();

  const existingApp   = id ? applications.find((a) => a.id === id) : null;
  const isEditing     = Boolean(existingApp);
  const existingStatus = existingApp?.status || null;

  // Read pre-fill data from Suggested Jobs (passed via navigate state)
  const location = useLocation();
  const prefill = location.state?.prefill || {};

  const {
    register,
    handleSubmit,
    reset,
    control,
    trigger,   // ← manually fire validation on specific fields
    formState: { errors, isSubmitting },
  } = useForm({
    // ── Validation timing ─────────────────────────────────────────────
    // mode: 'onBlur'         → validates when user leaves a field
    // reValidateMode: 'onChange' → once error appears, clears it on each change
    mode: 'onBlur',
    reValidateMode: 'onChange',

    resolver: yupResolver(applicationSchema, { context: { existingStatus } }),

    defaultValues: {
      company: prefill.company || '',
      role: prefill.role || '',
      location: '',
      salary: prefill.salary || '',
      platform: '',
      priority: 'Medium',
      status: 'Applied',
      deadlineToApply: '',
      appliedDate: new Date().toISOString().split('T')[0], // default to today
      interviewDate: '',
      resultDate: '',
      offerDate: '',
      rejectionDate: '',
      notes: '',
      bookmarked: false,
    },
  });

  // Watch status and appliedDate so we can react to their changes
  const currentStatus = useWatch({ control, name: 'status' });

  // Populate form when in edit mode
  useEffect(() => {
    if (existingApp) {
      reset(existingApp);
    }
  }, [existingApp, reset]);

  // ── Re-validate all date fields when status changes ───────────────────
  // Reason: the REQUIRED rule for each date field depends on `status`.
  // When the user switches status, the old errors should clear and new
  // required-field errors should appear for the newly visible fields.
  useEffect(() => {
    if (!currentStatus) return;
    const fieldsForStatus = STATUS_DATE_FIELDS[currentStatus] || [];
    const fieldNames = fieldsForStatus.map((f) => f.name);
    // Small timeout lets React finish re-rendering the new fields before triggering
    const timer = setTimeout(() => {
      if (fieldNames.length > 0) {
        trigger(fieldNames);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [currentStatus, trigger]);

  const onSubmit = (data) => {
    const payload = { ...data, salary: data.salary ? String(data.salary) : '' };
    if (isEditing) {
      updateApplication(id, payload);
      toast.success('Application updated ✅');
    } else {
      addApplication(payload);
      toast.success('Application added 🚀');
    }
    navigate('/applications');
  };

  const fieldClass  = (name) => `form-input  ${errors[name] ? 'error' : ''}`;
  const selectClass = (name) => `form-select ${errors[name] ? 'error' : ''}`;

  const errorCount  = Object.keys(errors).length;
  const dateFields  = STATUS_DATE_FIELDS[currentStatus] || STATUS_DATE_FIELDS['Applied'];

  // ── Compute live warnings (non-blocking) ──────────────────────────────
  const allValues = useWatch({ control });
  const dateWarnings = getDateWarnings(allValues || {});

  // ── Helper: build onChange handler for date inputs ────────────────────
  // react-hook-form's register() handles onChange internally. We wrap it so
  // that AFTER the form library processes the change, we also call trigger()
  // on any fields that depend on this one.
  const makeDateField = (fieldName, rhfRegister) => ({
    ...rhfRegister,
    onChange: async (e) => {
      // Let react-hook-form update its state first
      await rhfRegister.onChange(e);
      // Then immediately re-validate any dependent fields
      const dependents = TRIGGER_DEPENDENTS[fieldName] || [];
      if (dependents.length > 0) {
        trigger(dependents);
      }
    },
  });

  return (
    <div className="form-page">
      <div className="form-card">
        <h2 className="form-title">
          {isEditing ? '✏️ Edit Application' : '＋ Add New Application'}
        </h2>

        {/* Error count banner – shown after submit attempt */}
        {errorCount > 0 && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '13px',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            ⚠️ Please fix {errorCount} error{errorCount > 1 ? 's' : ''} before submitting.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-grid">

            {/* Company */}
            <div className="form-group">
              <label className="form-label">Company *</label>
              <input {...register('company')} className={fieldClass('company')} placeholder="e.g. Google" />
              {errors.company && <span className="form-error">{errors.company.message}</span>}
            </div>

            {/* Role */}
            <div className="form-group">
              <label className="form-label">Job Role *</label>
              <input {...register('role')} className={fieldClass('role')} placeholder="e.g. Frontend Developer" />
              {errors.role && <span className="form-error">{errors.role.message}</span>}
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input {...register('location')} className={fieldClass('location')} placeholder="e.g. Remote / Bangalore" />
              {errors.location && <span className="form-error">{errors.location.message}</span>}
            </div>

            {/* Salary */}
            <div className="form-group">
              <label className="form-label">Annual Salary (₹)</label>
              <input
                {...register('salary')}
                type="number"
                min="0"
                className={fieldClass('salary')}
                placeholder="e.g. 120000"
              />
              {errors.salary && <span className="form-error">{errors.salary.message}</span>}
            </div>

            {/* Platform */}
            <div className="form-group">
              <label className="form-label">Platform *</label>
              <select {...register('platform')} className={selectClass('platform')}>
                <option value="">Select platform</option>
                {PLATFORM_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              {errors.platform && <span className="form-error">{errors.platform.message}</span>}
            </div>

            {/* Priority */}
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select {...register('priority')} className={selectClass('priority')}>
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            {/* Status – changing this re-triggers date field validation (see useEffect above) */}
            <div className="form-group full-width">
              <label className="form-label">Status *</label>
              <select {...register('status')} className={selectClass('status')}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              {errors.status
                ? <span className="form-error">{errors.status.message}</span>
                : <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Pipeline: To Apply → Applied → Interview → Waiting → Offer / Rejected
                  </span>
              }
            </div>

            {/* ── Conditional date fields ──────────────────────────────────
                Only fields relevant to the selected status are rendered.
                Each date input uses makeDateField() so that changing it
                automatically triggers validation of its dependent fields.   */}
            {dateFields.map(({ name, label }) => (
              <div className="form-group" key={name}>
                <label className="form-label">{label}</label>
                <input
                  {...makeDateField(name, register(name))}
                  type="date"
                  className={fieldClass(name)}
                />
                {errors[name] && (
                  <span className="form-error">{errors[name].message}</span>
                )}
                {!errors[name] && dateWarnings[name] && (
                  <span className="form-warning">{dateWarnings[name]}</span>
                )}
              </div>
            ))}

            {/* Notes */}
            <div className="form-group full-width">
              <label className="form-label">Notes</label>
              <textarea
                {...register('notes')}
                className="form-textarea"
                placeholder="Any notes about this application…"
              />
            </div>

            {/* Bookmark */}
            <div className="form-group full-width">
              <label className="form-checkbox-row">
                <input {...register('bookmarked')} type="checkbox" />
                <span style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>
                  ⭐ Bookmark this application (pin it to the dashboard)
                </span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isEditing ? 'Save Changes' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplicationForm;
