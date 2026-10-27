import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentsAPI, adminAPI } from '../../services/api';
import { FaSchool, FaSpinner } from 'react-icons/fa';

export default function Classes() {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [teachersByGrade, setTeachersByGrade] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      setLoading(true);
      try {
        const [{ data: gradeData }, { data: teacherData }] = await Promise.all([
          studentsAPI.getGradeStats(),
          adminAPI.getAll({ role: 'admin', limit: 200 }),
        ]);
        if (!isActive) return;
        setGrades(gradeData.data?.grades || []);
        const map = {};
        (teacherData.data || []).forEach((t) => {
          if (t.assignedGrade) map[t.assignedGrade] = t.name;
        });
        setTeachersByGrade(map);
      } catch {
        if (isActive) { setGrades([]); setTeachersByGrade({}); }
      } finally {
        if (isActive) setLoading(false);
      }
    };

    load();
    return () => { isActive = false; };
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">
          <FaSchool className="me-2 text-success" />
          Classes ({grades.length})
        </h4>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <FaSpinner className="text-success fa-spin" size={32} />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white rounded shadow-sm">
            <thead className="table-success">
              <tr>
                <th>#</th>
                <th>Class</th>
                <th>Students</th>
                <th>Teacher</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g, i) => (
                <tr
                  key={g.grade}
                  role="button"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/admin/classes/${encodeURIComponent(g.grade)}`)}
                >
                  <td className="text-muted">{i + 1}</td>
                  <td className="fw-medium">{g.grade}</td>
                  <td>{g.studentCount}</td>
                  <td>{teachersByGrade[g.grade] || <span className="text-muted">Not assigned</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
