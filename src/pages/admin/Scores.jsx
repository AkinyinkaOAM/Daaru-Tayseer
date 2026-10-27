import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useAuth } from '../../context/useAuth';
import { studentsAPI, scoresAPI } from '../../services/api';
import { FaSearch, FaCheckCircle, FaSpinner, FaArrowLeft } from 'react-icons/fa';

const SESSIONS = ['2023/2024', '2024/2025', '2025/2026'];
const TERMS = ['First Term', 'Second Term', 'Third Term'];
const ASSESSMENT_TYPES = [
  { value: 'ca', label: 'CA Test', max: 30, field: 'continuousAssessment' },
  { value: 'exam', label: 'Exam', max: 70, field: 'examScore' },
];

export default function Scores() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [classSearch, setClassSearch] = useState('');

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(false);

  const [scoreValues, setScoreValues] = useState({});
  const [loadingScores, setLoadingScores] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // { type: 'success' | 'danger', message }
  const [serverError, setServerError] = useState('');

  const { register, control } = useForm();
  const session = useWatch({ control, name: 'session' });
  const term = useWatch({ control, name: 'term' });
  const assessmentType = useWatch({ control, name: 'assessmentType' });
  const typeConfig = ASSESSMENT_TYPES.find((t) => t.value === assessmentType);

  // Load the students in the teacher's assigned class
  useEffect(() => {
    let isActive = true;
    (async () => {
      if (!user?.assignedGrade) {
        setLoadingStudents(false);
        return;
      }
      setLoadingStudents(true);
      try {
        const { data } = await studentsAPI.getAll({ grade: user.assignedGrade, limit: 100 });
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
  }, [user?.assignedGrade]);

  const selectStudent = async (id) => {
    setLoadingStudent(true);
    setSubmitResult(null);
    setServerError('');
    setScoreValues({});
    try {
      const { data } = await studentsAPI.getById(id);
      setSelectedStudent(data.data.student);
    } catch {
      setServerError('Failed to load student details.');
    } finally {
      setLoadingStudent(false);
    }
  };

  const backToClassList = ({ keepResult = false } = {}) => {
    setSelectedStudent(null);
    setScoreValues({});
    setServerError('');
    if (!keepResult) setSubmitResult(null);
  };

  // Auto-dismiss the save result message after a few seconds
  useEffect(() => {
    if (!submitResult) return undefined;
    const timer = setTimeout(() => setSubmitResult(null), 4000);
    return () => clearTimeout(timer);
  }, [submitResult]);

  // Prefill existing scores once student + term + session + assessment type are all chosen
  useEffect(() => {
    if (!selectedStudent || !term || !session || !typeConfig) return undefined;

    let isActive = true;
    (async () => {
      setLoadingScores(true);
      const courses = selectedStudent.courses || [];
      try {
        const { data } = await scoresAPI.getByStudent(selectedStudent._id, term, session);
        const existingScores = data.data?.scores || [];
        const map = {};
        courses.forEach((course) => {
          const existing = existingScores.find(
            (s) => s.subject.toLowerCase() === course.name.toLowerCase()
          );
          map[course._id] = existing ? String(existing[typeConfig.field] ?? '') : '';
        });
        if (isActive) setScoreValues(map);
      } catch {
        if (isActive) {
          const map = {};
          courses.forEach((course) => { map[course._id] = ''; });
          setScoreValues(map);
        }
      } finally {
        if (isActive) setLoadingScores(false);
      }
    })();

    return () => {
      isActive = false;
    };
  }, [selectedStudent, term, session, typeConfig]);

  const handleValueChange = (courseId, value) => {
    setScoreValues((prev) => ({ ...prev, [courseId]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !term || !session || !typeConfig) return;

    setSubmitting(true);
    setServerError('');
    try {
      const scores = (selectedStudent.courses || []).map((course) => ({
        student: selectedStudent._id,
        subject: course.name,
        grade: selectedStudent.grade,
        term,
        session,
        [typeConfig.field]: Number(scoreValues[course._id]) || 0,
      }));
      const { data } = await scoresAPI.upload({ scores });
      const results = data.data?.results || { created: [], failed: [] };

      if (results.failed.length > 0) {
        setSubmitResult({
          type: 'danger',
          message: `${results.failed.length} of ${scores.length} score(s) failed to save. Please review and try again.`,
        });
      } else {
        setSubmitResult({
          type: 'success',
          message: `${typeConfig.label} scores saved successfully for ${selectedStudent.fullName}.`,
        });
        backToClassList({ keepResult: true });
      }
    } catch (err) {
      setSubmitResult({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to upload scores.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user?.assignedGrade) {
    return (
      <>
        <h4 className="fw-bold mb-3">Upload Scores</h4>
        <div className="alert alert-warning small">
          You have not been assigned a class yet. Contact a Super Admin to get a class assigned to you.
        </div>
      </>
    );
  }

  // Student details + score entry form
  if (selectedStudent) {
    const courses = selectedStudent.courses || [];
    const readyToEnterScores = Boolean(term && session && typeConfig);

    return (
      <>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">Upload Scores</h4>
          <button className="btn btn-outline-success btn-sm rounded-pill" onClick={backToClassList}>
            <FaArrowLeft className="me-1" /> Back to Class List
          </button>
        </div>

        <div className="card border-0 shadow-sm mb-3">
          <div className="card-body">
            <h6 className="fw-bold mb-2">Student Details</h6>
            <div className="row small">
              <div className="col-md-4"><strong>Name:</strong> {selectedStudent.fullName}</div>
              <div className="col-md-4"><strong>Admission No:</strong> {selectedStudent.admissionNumber}</div>
              <div className="col-md-4"><strong>Class:</strong> {selectedStudent.grade}</div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-3">
          <div className="card-body">
            <div className="row g-2">
              <div className="col-md-4">
                <label className="form-label small fw-bold">Session <span className="text-danger">*</span></label>
                <select {...register('session')} defaultValue="" className="form-select">
                  <option value="">Select session</option>
                  {SESSIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold">Term <span className="text-danger">*</span></label>
                <select {...register('term')} defaultValue="" className="form-select">
                  <option value="">Select term</option>
                  {TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold">Assessment Type <span className="text-danger">*</span></label>
                <select {...register('assessmentType')} defaultValue="" className="form-select">
                  <option value="">Select type</option>
                  {ASSESSMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {submitResult && (
          <div className={`alert alert-${submitResult.type} py-2 small`}>
            {submitResult.type === 'success' && <FaCheckCircle className="me-1" />}
            {submitResult.message}
          </div>
        )}

        {readyToEnterScores && (
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              {serverError && <div className="alert alert-danger py-2 small">{serverError}</div>}

              {loadingScores ? (
                <div className="text-center py-4">
                  <FaSpinner className="text-success fa-spin" size={24} />
                </div>
              ) : courses.length === 0 ? (
                <p className="text-muted small mb-0">No courses have been assigned to this student's class yet.</p>
              ) : (
                <form onSubmit={onSubmit}>
                  <div className="table-responsive">
                    <table className="table table-bordered align-middle">
                      <thead className="table-success">
                        <tr>
                          <th style={{ minWidth: '200px' }}>Course</th>
                          <th style={{ width: '140px' }}>{typeConfig.label} /{typeConfig.max}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map((course) => (
                          <tr key={course._id}>
                            <td className="fw-medium small">{course.name}</td>
                            <td>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                min="0"
                                max={typeConfig.max}
                                placeholder={`0-${typeConfig.max}`}
                                value={scoreValues[course._id] ?? ''}
                                onChange={(e) => handleValueChange(course._id, e.target.value)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button type="submit" className="btn btn-success rounded-pill px-4" disabled={submitting}>
                    {submitting ? 'Saving...' : `Save ${typeConfig.label} Scores`}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  // Class list
  const filteredStudents = students.filter((s) =>
    s.fullName?.toLowerCase().includes(classSearch.toLowerCase()) ||
    s.admissionNumber?.toLowerCase().includes(classSearch.toLowerCase())
  );

  return (
    <>
      <h4 className="fw-bold mb-3">Upload Scores</h4>
      <p className="text-muted small">Class: <strong>{user.assignedGrade}</strong></p>

      {submitResult && (
        <div className={`alert alert-${submitResult.type} py-2 small`}>
          {submitResult.type === 'success' && <FaCheckCircle className="me-1" />}
          {submitResult.message}
        </div>
      )}

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

      {loadingStudents || loadingStudent ? (
        <div className="text-center py-5">
          <FaSpinner className="text-success fa-spin" size={32} />
        </div>
      ) : filteredStudents.length === 0 ? (
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
      )}
    </>
  );
}


