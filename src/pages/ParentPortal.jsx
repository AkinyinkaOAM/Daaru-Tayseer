import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { portalAPI } from '../services/api';
import ReportSheet from '../components/ReportSheet';

const SESSIONS = ['2024/2025', '2025/2026', '2026/2027'];
const TERMS = ['First Term', 'Second Term', 'Third Term'];

export default function ParentPortal() {
  const { user, logout } = useAuth();
  const [data, setData] = useState({ wards: [], announcements: [] });
  const [loading, setLoading] = useState(true);
  const [selectedWardId, setSelectedWardId] = useState(null);
  const [session, setSession] = useState(SESSIONS[SESSIONS.length - 1]);
  const [term, setTerm] = useState(TERMS[0]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: response } = await portalAPI.getParentSummary();
        setData(response.data || { wards: [], announcements: [] });
      } catch {
        setData({ wards: [], announcements: [] });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const selectedWard = data.wards.find((entry) => entry.ward._id === selectedWardId);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Parent Portal</h3>
          <p className="text-muted mb-0">Welcome, {user?.name || user?.email}</p>
        </div>
        <button className="btn btn-outline-success btn-sm" onClick={logout}>Logout</button>
      </div>

      {loading ? (
        <p className="text-muted">Loading parent portal...</p>
      ) : data.wards.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <p className="mb-0 text-muted">No wards are linked to this parent account yet.</p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">My Children ({data.wards.length})</h5>
                <div className="list-group">
                  {data.wards.map((entry) => (
                    <button
                      key={entry.ward._id}
                      type="button"
                      className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedWardId === entry.ward._id ? 'active' : ''}`}
                      onClick={() => setSelectedWardId(entry.ward._id === selectedWardId ? null : entry.ward._id)}
                    >
                      {entry.ward.firstName} {entry.ward.lastName}
                      <span className={`badge rounded-pill ${selectedWardId === entry.ward._id ? 'bg-light text-success' : 'bg-success'}`}>
                        {entry.ward.grade}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            {!selectedWard ? (
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4 d-flex align-items-center justify-content-center text-muted">
                  Select a child from the list to view their information.
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
                    <h5 className="fw-bold mb-0">{selectedWard.ward.firstName} {selectedWard.ward.lastName}</h5>
                    <span className="badge bg-success">{selectedWard.ward.grade}</span>
                  </div>
                  <div className="row g-2 small mb-3">
                    <div className="col-6"><strong>Admission Number:</strong></div>
                    <div className="col-6">{selectedWard.ward.admissionNumber}</div>
                    <div className="col-6"><strong>Status:</strong></div>
                    <div className="col-6 text-capitalize">{selectedWard.ward.status}</div>
                  </div>
                  <div className="row g-3 small">
                    <div className="col-md-3"><strong>Scores:</strong> {selectedWard.scores.length}</div>
                    <div className="col-md-3"><strong>Assignments:</strong> {selectedWard.assignments.length}</div>
                    <div className="col-md-3"><strong>Classwork:</strong> {selectedWard.classworks.length}</div>
                    <div className="col-md-3"><strong>Activities:</strong> {selectedWard.activities.length}</div>
                    <div className="col-md-6"><strong>Fee Paid:</strong> {Number(selectedWard.feeSummary?.paidAmount || 0).toLocaleString()}</div>
                    <div className="col-md-6"><strong>Fee Balance:</strong> {Number(selectedWard.feeSummary?.balance || 0).toLocaleString()}</div>
                  </div>

                  <hr className="my-4" />

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
                  <ReportSheet
                    student={selectedWard.ward}
                    courses={selectedWard.ward.courses}
                    session={session}
                    term={term}
                    editable={false}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">General Announcements</h5>
                {data.announcements.length === 0 ? (
                  <p className="text-muted mb-0">No announcements yet.</p>
                ) : (
                  <ul className="mb-0 text-muted">
                    {data.announcements.map((item) => (
                      <li key={item._id}>{item.title}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="small text-muted mt-4 mb-0">Powered by: Dev-OAMs</p>
    </div>
  );
}

