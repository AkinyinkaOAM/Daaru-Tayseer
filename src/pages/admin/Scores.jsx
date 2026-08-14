import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { studentsAPI, scoresAPI } from '../../services/api';
import { FaSearch, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const SUBJECTS = [
  'Arabic Language', 'Qur\'an (Tajweed)', 'Islamic Studies (Fiqh)',
  'Tawheed', 'Hadith', 'Seerah', 'Arabic Grammar (Nahw)',
  'Mathematics', 'English Language', 'Science',
];

const SESSIONS = ['2023/2024', '2024/2025', '2025/2026'];
const TERMS = [
  { value: 'First Term', label: 'First Term' },
  { value: 'Second Term', label: 'Second Term' },
  { value: 'Third Term', label: 'Third Term' },
];

export default function Scores() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [scores, setScores] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const selectedTerm = watch('term');
  const selectedSession = watch('session');

  // Load students for search
  useEffect(() => {
    if (searchTerm.length < 2) {
      setStudents([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const { data } = await studentsAPI.getAll({ search: searchTerm, limit: 10 });
        setStudents(data.data || []);
      } catch {
        setStudents([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load existing scores when student + term + session selected
  useEffect(() => {
    if (!selectedStudent || !selectedTerm || !selectedSession) return;
    const fetchScores = async () => {
      setLoading(true);
      try {
        const { data } = await scoresAPI.getByStudent(selectedStudent._id, selectedTerm, selectedSession);
        if (data.scores && data.scores.length > 0) {
          const map = {};
          data.scores.forEach((sc) => {
            map[sc.subject] = {
              test: sc.test ?? '',
              exam: sc.exam ?? '',
            };
          });
          setScores(map);
        } else {
          setScores({});
        }
      } catch {
        setScores({});
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, [selectedStudent, selectedTerm, selectedSession]);

  const handleScoreChange = (subject, field, value) => {
    setScores((prev) => ({
      ...prev,
      [subject]: { ...(prev[subject] || {}), [field]: value },
    }));
  };

  const onSubmit = async () => {
    if (!selectedStudent || !selectedTerm || !selectedSession) return;
    setSubmitting(true);
    try {
      const scoresArray = SUBJECTS.map((subject) => {
        const s = scores[subject] || {};
        return {
          student: selectedStudent._id,
          subject,
          term: selectedTerm,
          session: selectedSession,
          continuousAssessment: s.test ? Number(s.test) : 0,
          examScore: s.exam ? Number(s.exam) : 0,
        };
      });
      await scoresAPI.upload({ scores: scoresArray });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload scores');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Upload Scores</h4>
      </div>

      {/* Student Search */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <label className="form-label small fw-bold">Search Student</label>
          <div className="position-relative">
            <FaSearch className="position-absolute text-muted" style={{ top: '12px', left: '14px' }} />
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Type student name (min 2 chars)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {students.length > 0 && (
            <ul className="list-group mt-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {students.map((s) => (
                <li
                  key={s._id}
                  className={`list-group-item list-group-item-action small ${selectedStudent?._id === s._id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedStudent(s);
                    setStudents([]);
                    setSearchTerm(s.name);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {s.name} — <span className="text-muted">{s.studentClass} | {s.session}</span>
                </li>
              ))}
            </ul>
          )}
          {selectedStudent && (
            <div className="mt-2 p-2 bg-light rounded small">
              <strong>Selected:</strong> {selectedStudent.name} ({selectedStudent.studentClass})
            </div>
          )}
        </div>
      </div>

      {/* Term & Session Select */}
      {selectedStudent && (
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-body">
            <div className="row g-2">
              <div className="col-md-4">
                <label className="form-label small fw-bold">Term <span className="text-danger">*</span></label>
                <select
                  {...register('term', { required: 'Term is required' })}
                  className={`form-select ${errors.term ? 'is-invalid' : ''}`}
                >
                  <option value="">Select term</option>
                  {TERMS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold">Session <span className="text-danger">*</span></label>
                <select
                  {...register('session', { required: 'Session is required' })}
                  className={`form-select ${errors.session ? 'is-invalid' : ''}`}
                >
                  <option value="">Select session</option>
                  {SESSIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scores Table */}
      {selectedStudent && selectedTerm && selectedSession && (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            {success && (
              <div className="alert alert-success py-2 small">
                <FaCheckCircle className="me-1" /> Scores saved successfully!
              </div>
            )}

            {loading ? (
              <div className="text-center py-4">
                <FaSpinner className="text-success fa-spin" size={24} />
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="table-responsive">
                  <table className="table table-bordered align-middle">
                    <thead className="table-success">
                      <tr>
                        <th style={{ minWidth: '200px' }}>Subject</th>
                        <th style={{ width: '120px' }}>Test /30</th>
                        <th style={{ width: '120px' }}>Exam /70</th>
                        <th style={{ width: '100px' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SUBJECTS.map((subject) => {
                        const s = scores[subject] || {};
                        const test = Number(s.test) || 0;
                        const exam = Number(s.exam) || 0;
                        const total = test + exam;
                        return (
                          <tr key={subject}>
                            <td className="fw-medium small">{subject}</td>
                            <td>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                min="0"
                                max="30"
                                placeholder="0-30"
                                value={s.test ?? ''}
                                onChange={(e) => handleScoreChange(subject, 'test', e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                min="0"
                                max="70"
                                placeholder="0-70"
                                value={s.exam ?? ''}
                                onChange={(e) => handleScoreChange(subject, 'exam', e.target.value)}
                              />
                            </td>
                            <td className="text-center fw-bold">{total > 0 ? total : '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <button
                  type="submit"
                  className="btn btn-success rounded-pill px-4"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save Scores'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

