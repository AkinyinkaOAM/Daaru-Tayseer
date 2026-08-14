import { useEffect, useState } from 'react';
import { admissionsAPI } from '../../services/api';

const STATUS_OPTIONS = ['pending', 'accepted', 'rejected'];

export default function AdmissionsManage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const { data } = await admissionsAPI.getAll({ limit: 100 });
      setApplications(data.data || []);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await admissionsAPI.updateStatus(id, status);
      loadApplications();
    } catch {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await admissionsAPI.delete(id);
      loadApplications();
    } catch {
      alert('Failed to delete application');
    }
  };

  return (
    <>
      <h4 className="fw-bold mb-3">Admissions Management</h4>
      {loading ? (
        <p className="text-muted">Loading applications...</p>
      ) : applications.length === 0 ? (
        <p className="text-muted">No applications yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white rounded shadow-sm">
            <thead className="table-success">
              <tr>
                <th>Student</th>
                <th>Parent</th>
                <th>Class</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((item) => (
                <tr key={item._id}>
                  <td>{item.firstName} {item.lastName}</td>
                  <td>{item.parentName}</td>
                  <td>{item.gradeApplied}</td>
                  <td>
                    <div>{item.email}</div>
                    <div className="small text-muted">{item.phone}</div>
                  </td>
                  <td>
                    <span className="badge bg-success text-capitalize">{item.status}</span>
                  </td>
                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      <select
                        className="form-select form-select-sm"
                        defaultValue={item.status}
                        onChange={(e) => handleStatus(item._id, e.target.value)}
                        style={{ width: '130px' }}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item._id)}>
                        Delete
                      </button>
                    </div>
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
