import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ROLES = [
  { value: 'admin', label: 'Teacher/Admin' },
  { value: 'parent', label: 'Parent' },
  { value: 'student', label: 'Student' },
  { value: 'super_admin', label: 'Super Admin' },
];

export default function UsersManage() {
  const { isSuperAdmin, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

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
    if (!isSuperAdmin) return;
    queueMicrotask(() => {
      loadUsers({ showLoading: false });
    });
  }, [isSuperAdmin]);

  if (authLoading) {
    return <p className="text-muted">Checking access...</p>;
  }

  if (!isSuperAdmin) {
    return <p className="text-danger">You do not have permission to access this page.</p>;
  }

  const onCreate = async (formData) => {
    try {
      await adminAPI.create(formData);
      reset();
      loadUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create user');
    }
  };

  const onRoleChange = async (id, role) => {
    try {
      await adminAPI.update(id, { role });
      loadUsers();
    } catch {
      alert('Failed to update role');
    }
  };

  const onStatusToggle = async (id, isActive) => {
    try {
      await adminAPI.update(id, { isActive: !isActive });
      loadUsers();
    } catch {
      alert('Failed to update user status');
    }
  };

  return (
    <>
      <h4 className="fw-bold mb-3">User Management</h4>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h6 className="fw-bold mb-3">Create User</h6>
          <form onSubmit={handleSubmit(onCreate)}>
            <div className="row g-2">
              <div className="col-md-3"><input className="form-control" placeholder="Full name" {...register('name', { required: true })} /></div>
              <div className="col-md-3"><input type="email" className="form-control" placeholder="Email" {...register('email', { required: true })} /></div>
              <div className="col-md-2"><input type="password" className="form-control" placeholder="Password" {...register('password', { required: true })} /></div>
              <div className="col-md-2">
                <select className="form-select" {...register('role', { required: true })}>
                  {ROLES.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
                </select>
              </div>
              <div className="col-md-2"><button className="btn btn-success w-100" disabled={isSubmitting}>{isSubmitting ? '...' : 'Create'}</button></div>
            </div>
          </form>
        </div>
      </div>

      {loading ? (
        <p className="text-muted">Loading users...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white rounded shadow-sm">
            <thead className="table-success">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id || user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={user.role}
                      onChange={(event) => onRoleChange(user.id || user._id, event.target.value)}
                      style={{ width: '170px' }}
                    >
                      {ROLES.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
                    </select>
                  </td>
                  <td>
                    <span className={`badge ${user.isActive ? 'bg-success' : 'bg-secondary'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-success" onClick={() => onStatusToggle(user.id || user._id, user.isActive)}>
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
