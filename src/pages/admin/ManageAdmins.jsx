import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FaUserShield, FaTrash, FaCheckCircle } from 'react-icons/fa';

const ROLES = [
  { value: 'admin', label: 'Admin / Teacher' },
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'super_super_admin', label: 'Super Super Admin' },
];

export default function ManageAdmins() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getAll();
      setAdmins(data.data || []);
    } catch {
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchAdmins();
    }
  }, []);

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
    if (!window.confirm(`Remove admin "${email}"?`)) return;
    try {
      await adminAPI.delete(id);
      fetchAdmins();
    } catch {
      alert('Failed to delete admin');
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

  const canManageRoles = user?.role === 'super_super_admin';

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
                  {...register('email', { required: 'Email is required' })}
                  className={`form-control form-control-sm ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Email"
                  type="email"
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>
              <div className="col-md-3">
                <input
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
                  className={`form-control form-control-sm ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Password"
                  type="password"
                />
                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
              </div>
              <div className="col-md-3">
                <select
                  {...register('role', { required: 'Role is required' })}
                  className={`form-select form-select-sm ${errors.role ? 'is-invalid' : ''}`}
                >
                  <option value="">Select role</option>
                  {ROLES.map((r) => {
                    // Only super_super_admin can create other super_super_admins
                    if (r.value === 'super_super_admin' && !canManageRoles) return null;
                    return <option key={r.value} value={r.value}>{r.label}</option>;
                  })}
                </select>
                {errors.role && <div className="invalid-feedback">{errors.role.message}</div>}
              </div>
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
                      <td className="text-muted">
                        {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="text-center">
                        {a._id !== user?._id && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(a._id, a.email)}
                            title="Delete admin"
                          >
                            <FaTrash size={12} />
                          </button>
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

