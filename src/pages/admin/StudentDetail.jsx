import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { studentsAPI } from '../../services/api';
import { FaSpinner } from 'react-icons/fa';
import ReportSheet from '../../components/ReportSheet';

const SESSIONS = ['2024/2025', '2025/2026', '2026/2027'];
const TERMS = ['First Term', 'Second Term', 'Third Term'];

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(SESSIONS[SESSIONS.length - 1]);
  const [term, setTerm] = useState(TERMS[0]);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      setLoading(true);
      try {
        const { data } = await studentsAPI.getById(id);
        if (isActive) setStudent(data.data?.student || null);
      } catch {
        if (isActive) setStudent(null);
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

  if (!student) {
    return (
      <div className="text-center py-5 text-muted">
        <p>Student not found.</p>
        <button className="btn btn-outline-success btn-sm rounded-pill" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h4 className="fw-bold mb-0">{student.firstName} {student.lastName}</h4>
        <button className="btn btn-outline-success btn-sm rounded-pill" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">Student Information</h6>
              <div className="row g-2 small">
                <div className="col-6"><strong>Admission Number:</strong></div>
                <div className="col-6">{student.admissionNumber}</div>
                <div className="col-6"><strong>Class:</strong></div>
                <div className="col-6">{student.grade}</div>
                <div className="col-6"><strong>Gender:</strong></div>
                <div className="col-6 text-capitalize">{student.gender || '—'}</div>
                <div className="col-6"><strong>Date of Birth:</strong></div>
                <div className="col-6">{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : '—'}</div>
                <div className="col-6"><strong>Status:</strong></div>
                <div className="col-6 text-capitalize">{student.status}</div>
                <div className="col-6"><strong>Enrolled:</strong></div>
                <div className="col-6">{student.createdAt ? new Date(student.createdAt).toLocaleDateString() : '—'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">Parent / Guardian</h6>
              <div className="row g-2 small">
                <div className="col-6"><strong>Name:</strong></div>
                <div className="col-6">{student.parentName || '—'}</div>
                <div className="col-6"><strong>Email:</strong></div>
                <div className="col-6">{student.parentEmail || '—'}</div>
                <div className="col-6"><strong>Phone:</strong></div>
                <div className="col-6">{student.parentPhone || '—'}</div>
                <div className="col-6"><strong>Address:</strong></div>
                <div className="col-6">{student.parentAddress || '—'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">Fees</h6>
              <div className="row g-2 small">
                <div className="col-6"><strong>Fee Paid:</strong></div>
                <div className="col-6">{Number(student.feePaid || 0).toLocaleString()}</div>
                <div className="col-6"><strong>Fee Balance:</strong></div>
                <div className="col-6">{Number(student.feeBalance || 0).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">Subjects ({student.courses?.length || 0})</h6>
              {student.courses?.length ? (
                <ul className="small mb-0">
                  {student.courses.map((c) => (
                    <li key={c._id}>{c.name} <span className="text-muted">({c.category})</span></li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted small mb-0">No subjects assigned.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <h6 className="fw-bold mb-0">Report Card</h6>
            <div className="d-flex gap-2">
              <select className="form-select form-select-sm" value={session} onChange={(e) => setSession(e.target.value)}>
                {SESSIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className="form-select form-select-sm" value={term} onChange={(e) => setTerm(e.target.value)}>
                {TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <ReportSheet student={student} courses={student.courses} session={session} term={term} editable={false} />
        </div>
      </div>
    </>
  );
}
