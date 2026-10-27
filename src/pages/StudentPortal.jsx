import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { portalAPI } from '../services/api';
import { useForm } from 'react-hook-form';
import ReportSheet from "../components/ReportSheet";
import { FaBook, FaClipboardList, FaSchool, FaUserGraduate } from 'react-icons/fa';

const SESSIONS = ['2024/2025', '2025/2026', '2026/2027'];
const TERMS = ['First Term', 'Second Term', 'Third Term'];

export default function StudentPortal() {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [session, setSession] = useState(SESSIONS[SESSIONS.length - 1]);
  const [term, setTerm] = useState(TERMS[0]);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const load = async () => {
      try {
        const { data: response } = await portalAPI.getStudentSummary();
        setData(response.data);
        reset({
          firstName: response.data?.student?.firstName || '',
          lastName: response.data?.student?.lastName || '',
          parentPhone: response.data?.student?.parentPhone || '',
          parentAddress: response.data?.student?.parentAddress || '',
        });
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [reset]);

  if (loading) {
    return <div className="container py-5 text-center">Loading portal...</div>;
  }

  const student = data?.student;
  const courses = data?.courses || [];
  const testResults = data?.testResults || [];
  const examsResults = data?.examsResults || [];
  const assignments = data?.assignments || [];
  const classworks = data?.classworks || [];
  const activities = data?.activities || [];
  const paymentHistory = data?.paymentHistory || [];

  const updateProfile = async (formData) => {
    try {
      await portalAPI.updateStudentProfile(formData);
      const { data: response } = await portalAPI.getStudentSummary();
      setData(response.data);
    } catch {
      alert('Failed to update profile');
    }
  };

  const uploadProfile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      await portalAPI.uploadStudentProfileImage(formData);
      const { data: response } = await portalAPI.getStudentSummary();
      setData(response.data);
    } catch {
      alert('Failed to upload profile image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-1">Student Portal</h3>
          <p className="text-muted mb-0">Welcome, {user?.name || user?.email}</p>
        </div>
        <button className="btn btn-outline-success btn-sm" onClick={logout}>Logout</button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 text-success"><FaUserGraduate /> <strong>Student</strong></div>
              <h5 className="mt-3 mb-1">{student?.fullName || '—'}</h5>
              <p className="small text-muted mb-0">Admission: {student?.admissionNumber || '—'}</p>
              {student?.profileImageUrl && (
                <img src={student.profileImageUrl} alt="Profile" className="img-thumbnail mt-3" style={{ width: '90px', height: '90px', objectFit: 'cover' }} />
              )}
              <div className="mt-2">
                <label className="form-label small mb-1">Profile Picture</label>
                <input type="file" className="form-control form-control-sm" accept="image/*" onChange={uploadProfile} disabled={uploading} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 text-success"><FaSchool /> <strong>Class</strong></div>
              <h5 className="mt-3 mb-1">{student?.grade || '—'}</h5>
              <p className="small text-muted mb-0">Status: {student?.status || '—'}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 text-success"><FaBook /> <strong>Courses</strong></div>
              <h5 className="mt-3 mb-1">{courses.length}</h5>
              <p className="small text-muted mb-0">Registered subjects</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 text-success"><FaClipboardList /> <strong>Results</strong></div>
              <h5 className="mt-3 mb-1">{testResults.length + examsResults.length}</h5>
              <p className="small text-muted mb-0">Tests and exams</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">My Courses</h5>
              {courses.length === 0 ? <p className="text-muted">No courses registered yet.</p> : (
                <ul className="list-group list-group-flush">
                  {courses.map((course) => (
                    <li key={course._id} className="list-group-item px-0">
                      <div className="d-flex justify-content-between">
                        <strong>{course.name}</strong>
                        <span className="text-muted small">{course.code}</span>
                      </div>
                      <div className="text-muted small">{course.category}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Latest Results</h5>
              {testResults.length === 0 && examsResults.length === 0 ? <p className="text-muted">No results uploaded yet.</p> : (
                <div className="table-responsive">
                  <table className="table table-sm align-middle">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Term</th>
                        <th>Test</th>
                        <th>Exam</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...testResults, ...examsResults].slice(0, 8).map((item) => (
                        <tr key={item._id}>
                          <td>{item.subject}</td>
                          <td>{item.term}</td>
                          <td>{item.continuousAssessment ?? 0}</td>
                          <td>{item.examScore ?? 0}</td>
                          <td>{item.total ?? 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Edit Profile</h5>
              <form onSubmit={handleSubmit(updateProfile)}>
                <div className="row g-2">
                  <div className="col-md-6"><input className="form-control form-control-sm" placeholder="First name" {...register('firstName')} /></div>
                  <div className="col-md-6"><input className="form-control form-control-sm" placeholder="Last name" {...register('lastName')} /></div>
                  <div className="col-md-6"><input className="form-control form-control-sm" placeholder="Parent phone" {...register('parentPhone')} /></div>
                  <div className="col-md-6"><input className="form-control form-control-sm" placeholder="Parent address" {...register('parentAddress')} /></div>
                </div>
                <button className="btn btn-success btn-sm rounded-pill mt-3">Save Profile</button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Payment History</h5>
              {paymentHistory.length === 0 ? <p className="text-muted mb-0">No payment history yet.</p> : (
                <ul className="list-group list-group-flush">
                  {paymentHistory.slice(0, 8).map((item) => (
                    <li key={item._id} className="list-group-item px-0 d-flex justify-content-between">
                      <span>{item.term} ({item.session})</span>
                      <strong>{Number(item.amount || 0).toLocaleString()}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100"><div className="card-body"><h6 className="fw-bold">Assignments</h6><p className="text-muted mb-0">{assignments.length} available</p></div></div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100"><div className="card-body"><h6 className="fw-bold">Classwork</h6><p className="text-muted mb-0">{classworks.length} records</p></div></div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100"><div className="card-body"><h6 className="fw-bold">Class Activities</h6><p className="text-muted mb-0">{activities.length} activities</p></div></div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <h5 className="fw-bold mb-0">My Report Sheet</h5>
            <div className="d-flex gap-2">
              <select className="form-select form-select-sm" value={session} onChange={(e) => setSession(e.target.value)}>
                {SESSIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className="form-select form-select-sm" value={term} onChange={(e) => setTerm(e.target.value)}>
                {TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          {student ? (
            <ReportSheet student={student} courses={courses} session={session} term={term} editable={false} />
          ) : (
            <p className="text-muted mb-0">Student profile not found.</p>
          )}
        </div>
      </div>

      <p className="small text-muted mt-4 mb-0">Powered by: Dev-OAMs</p>
    </div>
  );
}
