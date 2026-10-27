import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/useAuth';
import { FaChalkboardTeacher, FaSpinner } from 'react-icons/fa';

export default function Teachers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadTeachers = async () => {
      setLoading(true);
      try {
        const { data } = await adminAPI.getAll({ role: 'admin', limit: 200 });
        if (isActive) setTeachers(data.data || []);
      } catch {
        if (isActive) setTeachers([]);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadTeachers();
    return () => { isActive = false; };
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h4 className="fw-bold mb-0">
          <FaChalkboardTeacher className="me-2 text-success" />
          Teachers ({teachers.length})
        </h4>
        {['super_admin', 'super_super_admin'].includes(user?.role) && (
          <a href="/admin/admins" className="btn btn-success btn-sm rounded-pill">
            + Create Teacher
          </a>
        )}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <FaSpinner className="text-success fa-spin" size={32} />
        </div>
      ) : teachers.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p>No teachers found.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white rounded shadow-sm">
            <thead className="table-success">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Assigned Class</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t, i) => (
                <tr
                  key={t.id || t._id}
                  role="button"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/admin/teachers/${t.id || t._id}`)}
                >
                  <td className="text-muted">{i + 1}</td>
                  <td className="fw-medium">{t.name || '—'}</td>
                  <td>{t.email}</td>
                  <td>{t.assignedGrade || <span className="text-muted">Not assigned</span>}</td>
                  <td className="text-muted">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
