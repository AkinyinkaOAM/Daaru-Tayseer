import { useEffect, useState } from 'react';
import { auditLogsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AuditLogs() {
  const { isSuperAdmin, loading: authLoading } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const { data } = await auditLogsAPI.getAll({ limit: 150 });
      setLogs(data.data || []);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isSuperAdmin) return;
    loadLogs();
  }, [isSuperAdmin]);

  if (authLoading) return <p className="text-muted">Checking access...</p>;
  if (!isSuperAdmin) return <p className="text-danger">You do not have permission to access this page.</p>;

  return (
    <>
      <h4 className="fw-bold mb-3">Audit Logs</h4>
      {loading ? (
        <p className="text-muted">Loading logs...</p>
      ) : logs.length === 0 ? (
        <p className="text-muted">No audit records yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white rounded shadow-sm">
            <thead className="table-success">
              <tr>
                <th>Time</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Target User</th>
                <th>Changes</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                  <td>{log.actor?.name || log.actor?.email || '—'}</td>
                  <td><span className="badge bg-dark">{log.action}</span></td>
                  <td>{log.targetUser?.email || log.targetUser?.name || '—'}</td>
                  <td>
                    <pre className="mb-0 small" style={{ whiteSpace: 'pre-wrap' }}>
                      {JSON.stringify(log.changes || {}, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
