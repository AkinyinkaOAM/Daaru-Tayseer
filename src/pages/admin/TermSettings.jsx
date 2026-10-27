import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { settingsAPI } from '../../services/api';
import { useAuth } from '../../context/useAuth';
import { TERMS } from '../../utils/constants';
import { FaCheckCircle, FaSpinner, FaStar } from 'react-icons/fa';

export default function TermSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const canEdit = ['super_admin', 'super_super_admin'].includes(user?.role);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data } = await settingsAPI.get();
      setSettings(data.data?.settings || null);
      reset({
        currentTerm: data.data?.settings?.currentTerm,
        currentSession: data.data?.settings?.currentSession,
      });
    } catch {
      setSettings(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (formData) => {
    setServerError('');
    try {
      const { data } = await settingsAPI.update(formData);
      setSettings(data.data?.settings || null);
      setSuccess('Term/Session updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to update settings');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <FaSpinner className="text-success fa-spin" size={32} />
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">
          <FaStar className="me-2 text-success" />
          Term / Year
        </h4>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h6 className="fw-bold mb-3">Current Term</h6>
          <div className="row g-3 small">
            <div className="col-md-6"><strong>Term:</strong> {settings?.currentTerm || '—'}</div>
            <div className="col-md-6"><strong>Session/Year:</strong> {settings?.currentSession || '—'}</div>
          </div>
        </div>
      </div>

      {canEdit && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3">Update Current Term / Year</h6>

            {success && (
              <div className="alert alert-success py-2 small">
                <FaCheckCircle className="me-1" /> {success}
              </div>
            )}
            {serverError && <div className="alert alert-danger py-2 small">{serverError}</div>}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="row g-2">
                <div className="col-md-5">
                  <label className="form-label small fw-bold">Term</label>
                  <select {...register('currentTerm')} className="form-select form-select-sm">
                    {TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="col-md-5">
                  <label className="form-label small fw-bold">Session/Year</label>
                  <input
                    {...register('currentSession')}
                    className="form-control form-control-sm"
                    placeholder="e.g. 2025/2026"
                  />
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  <button type="submit" className="btn btn-success btn-sm w-100" disabled={isSubmitting}>
                    {isSubmitting ? '...' : 'Save'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
