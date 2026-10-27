import { useEffect, useState } from 'react';
import { studentsAPI } from '../../services/api';
import { useAuth } from '../../context/useAuth';
import ReportSheet from '../../components/ReportSheet';
import { FaSearch, FaSpinner, FaArrowLeft } from 'react-icons/fa';

const CLASSES = [
  'الروضة Kindergarten',
  'التمهيدي Preparatory',
  'الحضانة Nursery',
  'Arobiyyah 1 الفصل الأول',
  'Arobiyyah 2 الفصل الثانى',
  'Arobiyyah 3 الفصل الثالث',
  'Class Four الفصل الرابعة',
];

const SESSIONS = ['2024/2025', '2025/2026', '2026/2027'];
const TERMS = ['First Term', 'Second Term', 'Third Term'];

export default function ReportCards() {
  const { user } = useAuth();
  const isTeacher = user?.role === 'admin';
  const canViewAllClasses = ['super_admin', 'super_super_admin'].includes(user?.role);

  const [grade, setGrade] = useState(isTeacher ? user?.assignedGrade || '' : '');
  const [classSearch, setClassSearch] = useState('');
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(false);

  const [session, setSession] = useState(SESSIONS[SESSIONS.length - 1]);
  const [term, setTerm] = useState(TERMS[0]);

  // List every student in the chosen class as soon as a class is known
  useEffect(() => {
    let isActive = true;
    (async () => {
      if (!grade) {
        setStudents([]);
        return;
      }
      setLoadingStudents(true);
      try {
        const { data } = await studentsAPI.getAll({ grade, limit: 100 });
        if (isActive) setStudents(data.data || []);
      } catch {
        if (isActive) setStudents([]);
      } finally {
        if (isActive) setLoadingStudents(false);
      }
    })();

    return () => {
      isActive = false;
    };
  }, [grade]);

  const selectStudent = async (id) => {
    setLoadingStudent(true);
    try {
      const { data } = await studentsAPI.getById(id);
      setSelectedStudent(data.data.student);
    } catch {
      setSelectedStudent(null);
    } finally {
      setLoadingStudent(false);
    }
  };

  if (isTeacher && !user?.assignedGrade) {
    return (
      <div className="alert alert-warning">
        You have not been assigned to a class yet. Contact a Super Admin to assign your class.
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Report Cards</h4>
      </div>

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-2 align-items-end">
            {canViewAllClasses && (
              <div className="col-md-4">
                <label className="form-label small fw-bold">Class</label>
                <select
                  className="form-select"
                  value={grade}
                  onChange={(e) => { setGrade(e.target.value); setSelectedStudent(null); }}
                >
                  <option value="">Select a class</option>
                  {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}
            {isTeacher && (
              <div className="col-md-4">
                <label className="form-label small fw-bold">Class</label>
                <input className="form-control" value={user?.assignedGrade || ''} disabled />
              </div>
            )}
            <div className="col-md-4">
              <label className="form-label small fw-bold">Session</label>
              <select className="form-select" value={session} onChange={(e) => setSession(e.target.value)}>
                {SESSIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold">Term</label>
              <select className="form-select" value={term} onChange={(e) => setTerm(e.target.value)}>
                {TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {selectedStudent ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <button
              className="btn btn-outline-success btn-sm rounded-pill mb-3"
              onClick={() => setSelectedStudent(null)}
            >
              <FaArrowLeft className="me-1" /> Back to Class List
            </button>

            {loadingStudent ? (
              <div className="text-center py-4">
                <FaSpinner className="text-success fa-spin" size={24} />
              </div>
            ) : (
              <ReportSheet
                student={selectedStudent}
                courses={selectedStudent.courses}
                session={session}
                term={term}
                editable={isTeacher}
              />
            )}
          </div>
        </div>
      ) : !grade ? (
        <p className="text-muted text-center py-5">Select a class to see its students.</p>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="input-group mb-3">
              <span className="input-group-text bg-white"><FaSearch className="text-muted" /></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search students in this class..."
                value={classSearch}
                onChange={(e) => setClassSearch(e.target.value)}
              />
            </div>

            {loadingStudents ? (
              <div className="text-center py-5">
                <FaSpinner className="text-success fa-spin" size={32} />
              </div>
            ) : (
              (() => {
                const filteredStudents = students.filter((s) =>
                  s.fullName?.toLowerCase().includes(classSearch.toLowerCase()) ||
                  s.admissionNumber?.toLowerCase().includes(classSearch.toLowerCase())
                );

                return filteredStudents.length === 0 ? (
                  <p className="text-muted text-center py-5">No students found in this class.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle bg-white rounded shadow-sm">
                      <thead className="table-success">
                        <tr>
                          <th>Name</th>
                          <th>Admission No.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((s) => (
                          <tr key={s._id} style={{ cursor: 'pointer' }} onClick={() => selectStudent(s._id)}>
                            <td>{s.fullName}</td>
                            <td>{s.admissionNumber}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}
    </>
  );
}

