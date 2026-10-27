import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { adminAPI, studentsAPI } from '../../services/api';
import { FaSpinner, FaUserGraduate } from 'react-icons/fa';

export default function TeacherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      setLoading(true);
      try {
        const { data } = await adminAPI.getById(id);
        const loadedTeacher = data.data?.user || null;
        if (isActive) setTeacher(loadedTeacher);

        if (loadedTeacher?.assignedGrade) {
          const { data: studentData } = await studentsAPI.getAll({ grade: loadedTeacher.assignedGrade, limit: 200 });
          if (isActive) setStudents(studentData.data || []);
        } else if (isActive) {
          setStudents([]);
        }
      } catch {
        if (isActive) { setTeacher(null); setStudents([]); }
      } finally {
        if (isActive) setLoading(false);
      }
    };

    load();
    return () => { isActive = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <FaSpinner className="text-success fa-spin" size={32} />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="text-center py-5 text-muted">
        <p>Teacher not found.</p>
        <button className="btn btn-outline-success btn-sm rounded-pill" onClick={() => navigate('/admin/teachers')}>
          ← Back to Teachers
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h4 className="fw-bold mb-0">Teacher Profile</h4>
        <button className="btn btn-outline-success btn-sm rounded-pill" onClick={() => navigate('/admin/teachers')}>
          ← Back to Teachers
        </button>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="row g-3 small">
            <div className="col-md-4"><strong>Name:</strong> {teacher.name}</div>
            <div className="col-md-4"><strong>Email:</strong> {teacher.email}</div>
            <div className="col-md-4"><strong>Phone:</strong> {teacher.phone || '—'}</div>
            <div className="col-md-4"><strong>Assigned Class:</strong> {teacher.assignedGrade || 'Not assigned'}</div>
            <div className="col-md-4"><strong>Status:</strong> {teacher.isActive ? 'Active' : 'Inactive'}</div>
            <div className="col-md-4"><strong>Joined:</strong> {teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString() : '—'}</div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h6 className="fw-bold mb-3">
            <FaUserGraduate className="me-1 text-success" />
            Students in {teacher.assignedGrade || 'this class'} ({students.length})
          </h6>
          {!teacher.assignedGrade ? (
            <p className="text-muted small mb-0">This teacher is not assigned to a class yet.</p>
          ) : students.length === 0 ? (
            <p className="text-muted small mb-0">No students in this class yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle small">
                <thead className="table-success">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Admission</th>
                    <th>Parent</th>
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
