import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/useAuth';

const ROLES = [
  { value: 'admin', label: 'Teacher' },
  { value: 'parent', label: 'Parent' },
  { value: 'student', label: 'Student' },
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'super_super_admin', label: 'Super Super Admin' },
];

export default function UsersManage() {
  const { user, isSuperAdmin, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('create');
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const loadUsers = async ({ showLoading = true } = {}) => {
    if (showLoading) setLoading(true);
    try {
      const { data } = await adminAPI.getAll({ limit: 200 });
      setUsers(data.data || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isSuperAdmin) return undefined;
    void loadUsers({ showLoading: false });
    return undefined;
  }, [isSuperAdmin]);

  if (authLoading) return <p className="text-muted">Checking access...</p>;
  if (!isSuperAdmin) return <p className="text-danger">You do not have permission to access this page.</p>;

  const availableRoles = ROLES.filter((role) => (
    role.value !== 'super_super_admin' || user?.role === 'super_super_admin'
  ));

  const onCreate = async (formData) => {
    setSuccess('');
    setServerError('');
    try {
      await adminAPI.create(formData);
      reset();
      setSuccess(`Invitation sent to ${formData.email}. The user must change their temporary password after signing in.`);
      setActiveTab('list');
      await loadUsers();
    } catch (error) {
      setServerError(error.response?.data?.message || 'Failed to create user');
    }
  };

  const onRoleChange = async (id, role) => {
    try {
      await adminAPI.update(id, { role });
      await loadUsers();
    } catch {
      alert('Failed to update role');
    }
  };

  const onStatusToggle = async (id, isActive) => {
    try {
      await adminAPI.update(id, { isActive: !isActive });
      await loadUsers();
    } catch {
      alert('Failed to update user status');
    }
  };

  const onDelete = async (id, email) => {
    if (!window.confirm(`Permanently delete user "${email}"? This cannot be undone.`)) return;
    const password = window.prompt('Enter your password to confirm this deletion:');
    if (!password) return;
    try {
      await adminAPI.delete(id, password);
      await loadUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <>
      <h4 className="fw-bold mb-3">User Management</h4>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item"><button className={`nav-link ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')} type="button">Create New User</button></li>
        <li className="nav-item"><button className={`nav-link ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')} type="button">All Users ({users.length})</button></li>
      </ul>

      {activeTab === 'create' && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3">Create New User</h6>
            <p className="text-muted small">A random temporary password will be generated and sent by email. The user must change it after the first sign-in.</p>
            {success && <div className="alert alert-success py-2 small">{success}</div>}
            {serverError && <div className="alert alert-danger py-2 small">{serverError}</div>}
            <form onSubmit={handleSubmit(onCreate)} noValidate>
              <div className="row g-2">
                <div className="col-md-4"><input className={`form-control ${errors.name ? 'is-invalid' : ''}`} placeholder="Full name" {...register('name', { required: 'Name is required' })} />{errors.name && <div className="invalid-feedback">{errors.name.message}</div>}</div>
                <div className="col-md-4"><input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="Email address" {...register('email', { required: 'Email is required' })} />{errors.email && <div className="invalid-feedback">{errors.email.message}</div>}</div>
                <div className="col-md-2"><select className={`form-select ${errors.role ? 'is-invalid' : ''}`} {...register('role', { required: 'Role is required' })}><option value="">Assign role</option>{availableRoles.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}</select>{errors.role && <div className="invalid-feedback">{errors.role.message}</div>}</div>
                <div className="col-md-2"><button className="btn btn-success w-100" disabled={isSubmitting}>{isSubmitting ? '...' : 'Create'}</button></div>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'list' && (loading ? <p className="text-muted">Loading users...</p> : (
        <div className="table-responsive">
          {success && <div className="alert alert-success py-2 small">{success}</div>}
          <table className="table table-hover align-middle bg-white rounded shadow-sm">
            <thead className="table-success"><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{users.map((listedUser) => <tr key={listedUser.id || listedUser._id}>
              <td>{listedUser.name}</td><td>{listedUser.email}</td>
              <td><select className="form-select form-select-sm" value={listedUser.role} onChange={(event) => onRoleChange(listedUser.id || listedUser._id, event.target.value)} style={{ width: '190px' }}>{availableRoles.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}</select></td>
              <td><span className={`badge ${listedUser.isActive ? 'bg-success' : 'bg-secondary'}`}>{listedUser.isActive ? 'Active' : 'Inactive'}</span></td>
              <td>
                <button className="btn btn-sm btn-outline-success me-1" onClick={() => onStatusToggle(listedUser.id || listedUser._id, listedUser.isActive)}>{listedUser.isActive ? 'Deactivate' : 'Activate'}</button>
                {user?.role === 'super_super_admin' && (listedUser.id || listedUser._id) !== user.id && (listedUser.id || listedUser._id) !== user._id && <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(listedUser.id || listedUser._id, listedUser.email)}>Delete</button>}
              </td>
            </tr>)}</tbody>
          </table>
        </div>
      ))}
    </>
  );
}
