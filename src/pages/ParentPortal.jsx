import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { portalAPI } from '../services/api';

export default function ParentPortal() {
  const { user, logout } = useAuth();
  const [data, setData] = useState({ wards: [], announcements: [] });
  const [loading, setLoading] = useState(true);

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
          {data.wards.map((entry) => (
            <div className="col-12" key={entry.ward._id}>
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
                    <h5 className="fw-bold mb-0">{entry.ward.firstName} {entry.ward.lastName}</h5>
                    <span className="badge bg-success">{entry.ward.grade}</span>
                  </div>
                  <div className="row g-3 small">
                    <div className="col-md-3"><strong>Scores:</strong> {entry.scores.length}</div>
                    <div className="col-md-3"><strong>Assignments:</strong> {entry.assignments.length}</div>
                    <div className="col-md-3"><strong>Classwork:</strong> {entry.classworks.length}</div>
                    <div className="col-md-3"><strong>Activities:</strong> {entry.activities.length}</div>
                    <div className="col-md-6"><strong>Fee Paid:</strong> {Number(entry.feeSummary?.paidAmount || 0).toLocaleString()}</div>
                    <div className="col-md-6"><strong>Fee Balance:</strong> {Number(entry.feeSummary?.balance || 0).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}

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
