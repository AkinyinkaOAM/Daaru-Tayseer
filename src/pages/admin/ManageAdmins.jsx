import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/useAuth';
import { FaUserShield, FaTrash, FaCheckCircle, FaEnvelope } from 'react-icons/fa';

const ROLES = [
  { value: 'admin', label: 'Teacher' },
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'super_super_admin', label: 'Super Super Admin' },
];

const CLASSES = [
  'الروضة Kindergarten',
  'التمهيدي Preparatory',
  'الحضانة Nursery',
  'Arobiyyah 1 الفصل الأول',
  'Arobiyyah 2 الفصل الثانى',
  'Arobiyyah 3 الفصل الثالث',
  'Class Four الفصل الرابعة',
];

// Manage Admins is staff-only: parents/students never appear here, and a
// super_admin viewer may only see/manage admin (teacher) accounts.
const STAFF_ROLES = ['admin', 'super_admin', 'super_super_admin'];
const filterVisibleAdmins = (list, viewerRole) => {
  const staffOnly = list.filter((u) => STAFF_ROLES.includes(u.role));
  return viewerRole === 'super_admin'
    ? staffOnly.filter((u) => u.role === 'admin')
    : staffOnly;
};

export default function ManageAdmins() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm();
  const selectedRole = useWatch({ control, name: 'role' });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getAll();
      setAdmins(filterVisibleAdmins(data.data || [], user?.role));
    } catch {
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const token = localStorage.getItem('token');
    if (!token) return undefined;

    const loadAdmins = async () => {
      setLoading(true);
      try {
        const { data } = await adminAPI.getAll();
        if (isMounted) setAdmins(filterVisibleAdmins(data.data || [], user?.role));
      } catch {
        if (isMounted) setAdmins([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAdmins();

    return () => {
      isMounted = false;
    };
  }, [user?.role]);

  const onSubmit = async (formData) => {
    try {
      await adminAPI.create(formData);
      setSuccess(`Admin "${formData.email}" created successfully!`);
      reset();
      fetchAdmins();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create admin');
    }
  };

  const handleDelete = async (id, email) => {
    if (!window.confirm(`Permanently delete admin "${email}"? This cannot be undone.`)) return;
    const password = window.prompt('Enter your password to confirm this deletion:');
    if (!password) return;
    try {
      await adminAPI.delete(id, password);
      fetchAdmins();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete admin');
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await adminAPI.updateRole(id, role);
      fetchAdmins();
    } catch {
      alert('Failed to update role');
    }
  };

  const handleGradeChange = async (id, assignedGrade) => {
    try {
      await adminAPI.update(id, { assignedGrade });
      fetchAdmins();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update assigned class');
    }
  };

  const handleResendInvitation = async (id, email) => {
    if (!window.confirm(`Send a new temporary password to "${email}"?`)) return;
    try {
      await adminAPI.resendInvitation(id);
      setSuccess(`A new temporary password was sent to ${email}.`);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resend invitation');
    }
  };

  const canManageRoles = user?.role === 'super_super_admin';
  const canManageGrade = ['super_admin', 'super_super_admin'].includes(user?.role);

  // A class can only be assigned to one teacher at a time.
  const assignedGrades = new Set(
    admins.filter((a) => a.role === 'admin' && a.assignedGrade).map((a) => a.assignedGrade)
  );
  const availableClassesForCreate = CLASSES.filter((c) => !assignedGrades.has(c));
  const availableClassesForRow = (currentGrade) =>
    CLASSES.filter((c) => !assignedGrades.has(c) || c === currentGrade);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Manage Admins</h4>
      </div>

      {/* Create Admin Form */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h6 className="fw-bold mb-3">
            <FaUserShield className="me-1 text-success" />
            Create New Admin
          </h6>

          {success && (
            <div className="alert alert-success py-2 small">
              <FaCheckCircle className="me-1" /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="row g-2">
              <div className="col-md-4">
                <input
                  {...register('name', { required: 'Name is required' })}
                  className={`form-control form-control-sm ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="Full name"
                />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>
              <div className="col-md-4">
                <input
                  {...register('email', { required: 'Email is required' })}
                  className={`form-control form-control-sm ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Email"
                  type="email"
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>
              <div className="col-md-6">
                <select
                  {...register('role', { required: 'Role is required' })}
                  className={`form-select form-select-sm ${errors.role ? 'is-invalid' : ''}`}
                >
                  <option value="">Select role</option>
                  {ROLES.map((r) => {
                    // super_admin can only create admin/teacher accounts; only
                    // super_super_admin can create other super_super_admins.
                    if (r.value === 'super_super_admin' && !canManageRoles) return null;
                    if (r.value === 'super_admin' && user?.role !== 'super_super_admin') return null;
                    return <option key={r.value} value={r.value}>{r.label}</option>;
                  })}
                </select>
                {errors.role && <div className="invalid-feedback">{errors.role.message}</div>}
              </div>
              {selectedRole === 'admin' && (
                <div className="col-md-6">
                  <select
                    {...register('assignedGrade', { required: 'Assigned class is required for a teacher' })}
                    className={`form-select form-select-sm ${errors.assignedGrade ? 'is-invalid' : ''}`}
                  >
                    <option value="">Select assigned class</option>
                    {availableClassesForCreate.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.assignedGrade && <div className="invalid-feedback">{errors.assignedGrade.message}</div>}
                  {availableClassesForCreate.length === 0 && (
                    <div className="form-text text-warning">All classes already have a teacher assigned.</div>
                  )}
                </div>
              )}
              <div className="col-md-2">
                <button
                  type="submit"
                  className="btn btn-success btn-sm w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '...' : 'Create'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Admins List */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h6 className="fw-bold mb-3">All Admins ({admins.length})</h6>
          {loading ? (
            <div className="text-center py-3"><div className="spinner-border spinner-border-sm text-success" /></div>
          ) : admins.length === 0 ? (
            <p className="text-muted small">No admins found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle small">
                <thead className="table-success">
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                    {canManageRoles && <th>Change Role</th>}
                    {canManageGrade && <th>Assigned Class</th>}
                    <th>Created</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((a) => (
                    <tr key={a._id}>
                      <td className="fw-medium">{a.email}</td>
                      <td>
                        <span className="badge bg-success text-capitalize">
                          {a.role?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      {canManageRoles && (
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={a.role}
                            onChange={(e) => handleRoleChange(a._id, e.target.value)}
                            style={{ width: 'auto' }}
                          >
                            {ROLES.filter(r => r.value !== 'super_super_admin').map((r) => (
                              <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                          </select>
                        </td>
                      )}
                      {canManageGrade && (
                        <td>
                          {a.role === 'admin' ? (
                            <select
                              className="form-select form-select-sm"
                              value={a.assignedGrade || ''}
                              onChange={(e) => handleGradeChange(a._id, e.target.value)}
                              style={{ width: 'auto' }}
                            >
                              <option value="">Not assigned</option>
                              {availableClassesForRow(a.assignedGrade).map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                      )}
                      <td className="text-muted">
                        {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="text-center">
                        {canManageRoles && (a.id || a._id) !== user?.id && (a.id || a._id) !== user?._id && (
                          <>
                            <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleResendInvitation(a.id || a._id, a.email)} title="Resend invitation"><FaEnvelope size={12} /></button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(a.id || a._id, a.email)} title="Delete admin"><FaTrash size={12} /></button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

