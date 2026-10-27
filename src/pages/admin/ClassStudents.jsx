import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { studentsAPI } from '../../services/api';
import { FaSpinner } from 'react-icons/fa';

export default function ClassStudents() {
  const { grade } = useParams();
  const navigate = useNavigate();
  const decodedGrade = decodeURIComponent(grade);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      setLoading(true);
      try {
        const { data } = await studentsAPI.getAll({ grade: decodedGrade, limit: 200 });
        if (isActive) setStudents(data.data || []);
      } catch {
        if (isActive) setStudents([]);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    load();
    return () => { isActive = false; };
  }, [decodedGrade]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h4 className="fw-bold mb-0">{decodedGrade} ({students.length})</h4>
        <button className="btn btn-outline-success btn-sm rounded-pill" onClick={() => navigate('/admin/classes')}>
          ← Back to Classes
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <FaSpinner className="text-success fa-spin" size={32} />
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p>No students in this class yet.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white rounded shadow-sm">
            <thead className="table-success">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Admission</th>
                <th>Parent</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s._id}>
                  <td className="text-muted">{i + 1}</td>
                  <td>
                    <Link to={`/admin/students/${s._id}`} className="fw-medium text-decoration-none">
                      {s.firstName} {s.lastName}
                    </Link>
                  </td>
                  <td>{s.admissionNumber}</td>
                  <td>{s.parentName || '—'}</td>
                  <td className="text-capitalize">{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
