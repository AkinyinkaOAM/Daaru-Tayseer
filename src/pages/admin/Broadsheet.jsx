import { useEffect, useState, Fragment } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { reportsAPI, scoresAPI, studentsAPI, authAPI } from '../../services/api';
import { useAuth } from '../../context/useAuth';
import './Broadsheet.css';

export default function Broadsheet() {
  const { user } = useAuth();
  const isTeacher = user?.role === 'admin';

  // classes -> options (session/term) -> grid (scores)
  const [step, setStep] = useState(isTeacher ? 'options' : 'classes');
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(!isTeacher);

  const [selectedGrade, setSelectedGrade] = useState(isTeacher ? user?.assignedGrade || '' : '');
  const [options, setOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [result, setResult] = useState(null);
  const [loadingGrid, setLoadingGrid] = useState(false);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedScores, setEditedScores] = useState({});
  const [subjectFilter, setSubjectFilter] = useState('all');

  useEffect(() => {
    if (isTeacher) return;
    let isActive = true;

    const load = async () => {
      setLoadingClasses(true);
      try {
        const { data } = await studentsAPI.getGradeStats();
        if (isActive) setClasses(data.data?.grades || []);
      } catch {
        if (isActive) setClasses([]);
      } finally {
        if (isActive) setLoadingClasses(false);
      }
    };

    load();
    return () => { isActive = false; };
  }, [isTeacher]);

  const loadOptions = async (grade) => {
    setLoadingOptions(true);
    setOptions([]);
    try {
      const { data } = await reportsAPI.getBroadsheetOptions({ grade });
      setOptions(data.data?.options || []);
    } catch {
      setOptions([]);
    } finally {
      setLoadingOptions(false);
    }
  };

  // Teachers skip class selection and land directly on their own class's options.
  useEffect(() => {
    if (!isTeacher || !user?.assignedGrade) return;

    const init = () => {
      setSelectedGrade(user.assignedGrade);
      loadOptions(user.assignedGrade);
    };

    init();
  }, [isTeacher, user?.assignedGrade]);

  const selectClass = (grade) => {
    setSelectedGrade(grade);
    setResult(null);
    setStep('options');
    loadOptions(grade);
  };

  const loadGrid = async (grade, term, session) => {
    setLoadingGrid(true);
    try {
      const { data } = await reportsAPI.getBroadsheet({ grade, term, session });
      setResult(data.data);
    } catch {
      setResult(null);
      alert('Failed to load broadsheet.');
    } finally {
      setLoadingGrid(false);
    }
  };

  const selectOption = (opt) => {
    setEditing(false);
    setEditedScores({});
    setSubjectFilter('all');
    setStep('grid');
    loadGrid(selectedGrade, opt.term, opt.session);
  };

  const backToClasses = () => {
    setStep('classes');
    setSelectedGrade('');
    setOptions([]);
    setResult(null);
  };

  const backToOptions = () => {
    setStep('options');
    setResult(null);
    setEditing(false);
    setEditedScores({});
  };

  const startEditing = async () => {
    const password = window.prompt('Enter your password to enable editing:');
    if (!password) return;
    try {
      await authAPI.verifyPassword(password);
      setEditing(true);
      setEditedScores({});
    } catch {
      alert('Incorrect password. Editing was not enabled.');
    }
  };

  const cancelEditing = () => {
    setEditing(false);
    setEditedScores({});
  };

  const handleCellChange = (studentId, subject, field, value) => {
    setEditedScores((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subject]: { ...prev[studentId]?.[subject], [field]: value },
      },
    }));
  };

  const saveChanges = async () => {
    if (!result) return;
    const scores = [];
    Object.entries(editedScores).forEach(([studentId, subjects]) => {
      const row = result.rows.find((r) => String(r.studentId) === studentId);
      Object.entries(subjects).forEach(([subject, val]) => {
        const original = row?.subjects.find((s) => s.subject === subject);
        scores.push({
          student: studentId,
          subject,
          term: result.term,
          session: result.session,
          grade: result.grade,
          continuousAssessment: Number(val.ca ?? original?.test ?? 0),
          examScore: Number(val.exam ?? original?.exam ?? 0),
        });
      });
    });

    if (!scores.length) {
      setEditing(false);
      return;
    }

    setSaving(true);
    try {
      const { data } = await scoresAPI.upload({ scores });
      const failed = data?.data?.results?.failed || [];
      if (failed.length) {
        alert(`${failed.length} score(s) failed to save. Please check the values and try again.`);
      }
      await loadGrid(result.grade, result.term, result.session);
      setEditing(false);
      setEditedScores({});
    } catch {
      alert('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const exportCsv = () => {
    if (!result) return;
    const params = { grade: result.grade, term: result.term, session: result.session };
    reportsAPI.exportBroadsheetCsv(params).then(({ data }) => {
      const url = URL.createObjectURL(new Blob([data], { type: 'text/csv;charset=utf-8;' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `broadsheet-${params.grade}-${params.term}-${params.session}.csv`.replace(/\s+/g, '_'));
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }).catch(() => alert('Failed to export CSV'));
  };

  return (
    <>
      <h4 className="fw-bold mb-3">Broadsheet</h4>

      {step === 'classes' && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            {loadingClasses ? (
              <div className="text-center py-5"><FaSpinner className="text-success fa-spin" size={32} /></div>
            ) : classes.length === 0 ? (
              <p className="text-muted p-4 mb-0">No classes found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-success">
                    <tr>
                      <th>#</th>
                      <th>Class</th>
                      <th>Students</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((c, i) => (
                      <tr key={c.grade} role="button" style={{ cursor: 'pointer' }} onClick={() => selectClass(c.grade)}>
                        <td className="text-muted">{i + 1}</td>
                        <td className="fw-medium">{c.grade}</td>
                        <td>{c.studentCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 'options' && (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <h6 className="fw-bold mb-0">{selectedGrade} &mdash; select session &amp; term</h6>
              {!isTeacher && (
                <button className="btn btn-outline-success btn-sm rounded-pill" onClick={backToClasses}>← Back to Classes</button>
              )}
            </div>
            {loadingOptions ? (
              <div className="text-center py-5"><FaSpinner className="text-success fa-spin" size={32} /></div>
            ) : options.length === 0 ? (
              <p className="text-muted mb-0">No sessions/terms found for this class yet.</p>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                {options.map((opt) => (
                  <button
                    key={`${opt.session}-${opt.term}`}
                    className="btn btn-outline-success"
                    onClick={() => selectOption(opt)}
                  >
                    {opt.term} · {opt.session}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {step === 'grid' && (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
              <div>
                <div className="fw-bold">Class: {selectedGrade}</div>
                {result && (
                  <>
                    <div className="text-muted">Session: {result.session}</div>
                    <div className="text-muted">Term: {result.term}</div>
                  </>
                )}
              </div>
              <div className="d-flex gap-2 flex-wrap">
                <button className="btn btn-outline-success btn-sm rounded-pill" onClick={backToOptions} disabled={saving}>← Back</button>
                {result && !editing && (
                  <>
                    <button className="btn btn-warning btn-sm" onClick={startEditing}>Edit</button>
                    <button className="btn btn-outline-success btn-sm" onClick={exportCsv}>Export CSV</button>
                    <button className="btn btn-outline-dark btn-sm" onClick={() => window.print()}>Print / Save PDF</button>
                  </>
                )}
                {editing && (
                  <button className="btn btn-outline-secondary btn-sm" onClick={cancelEditing} disabled={saving}>Cancel</button>
                )}
              </div>
            </div>

            {result && result.subjectColumns.length > 0 && (
              <div className="mb-3" style={{ maxWidth: 260 }}>
                <label className="form-label small fw-medium mb-1">Subject</label>
                <select
                  className="form-select form-select-sm"
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                >
                  <option value="all">All Subjects</option>
                  {result.subjectColumns.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            )}

            {loadingGrid ? (
              <div className="text-center py-5"><FaSpinner className="text-success fa-spin" size={32} /></div>
            ) : !result || result.rows.length === 0 ? (
              <p className="text-muted mb-0">No students found for this class.</p>
            ) : (
              <>
                <div className="broadsheet-table-wrapper">
                  <table className="table table-bordered table-sm broadsheet-table mb-0">
                    <thead className="table-success">
                      <tr>
                        <th className="sticky-col sticky-sn" rowSpan={2}>S/N</th>
                        <th className="sticky-col sticky-name" rowSpan={2}>Student</th>
                        {result.subjectColumns
                          .filter((subject) => subjectFilter === 'all' || subject === subjectFilter)
                          .map((subject) => (
                            <th key={subject} colSpan={3} className="text-center">{subject}</th>
                          ))}
                        <th rowSpan={2} className="text-center">Grand Total</th>
                        <th rowSpan={2} className="text-center">Average</th>
                        <th rowSpan={2} className="text-center">Position</th>
                      </tr>
                      <tr>
                        {result.subjectColumns
                          .filter((subject) => subjectFilter === 'all' || subject === subjectFilter)
                          .map((subject) => (
                            <Fragment key={subject}>
                              <th className="text-center small">CA</th>
                              <th className="text-center small">Exam</th>
                              <th className="text-center small">Total</th>
                            </Fragment>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((row, index) => (
                        <tr key={row.studentId}>
                          <td className="sticky-col sticky-sn">{index + 1}</td>
                          <td className="sticky-col sticky-name">{row.fullName}</td>
                          {row.subjects
                            .filter((subj) => subjectFilter === 'all' || subj.subject === subjectFilter)
                            .map((subj) => {
                              const edited = editedScores[row.studentId]?.[subj.subject];
                              const ca = edited?.ca ?? subj.test;
                              const exam = edited?.exam ?? subj.exam;
                              const total = editing ? Number(ca || 0) + Number(exam || 0) : subj.total;
                              return (
                                <Fragment key={subj.subject}>
                                  <td className="text-center">
                                    {editing ? (
                                      <input
                                        type="number"
                                        min={0}
                                        max={30}
                                        className="form-control form-control-sm broadsheet-input"
                                        value={ca}
                                        onChange={(e) => handleCellChange(row.studentId, subj.subject, 'ca', e.target.value)}
                                      />
                                    ) : ca}
                                  </td>
                                  <td className="text-center">
                                    {editing ? (
                                      <input
                                        type="number"
                                        min={0}
                                        max={70}
                                        className="form-control form-control-sm broadsheet-input"
                                        value={exam}
                                        onChange={(e) => handleCellChange(row.studentId, subj.subject, 'exam', e.target.value)}
                                      />
                                    ) : exam}
                                  </td>
                                  <td className="text-center fw-medium">{total}</td>
                                </Fragment>
                              );
                            })}
                          <td className="text-center fw-bold">{row.total}</td>
                          <td className="text-center">{row.average}</td>
                          <td className="text-center">{row.position ?? '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {editing && (
                  <div className="text-center mt-4">
                    <button className="btn btn-success btn-lg px-5" onClick={saveChanges} disabled={saving}>
                      {saving ? 'Saving…' : 'SAVE ALL SCORES'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
