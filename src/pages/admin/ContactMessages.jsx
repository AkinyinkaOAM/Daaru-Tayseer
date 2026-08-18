import { useEffect, useState } from 'react';
import { contactAPI } from '../../services/api';

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const { data } = await contactAPI.getAll({ limit: 100 });
      setMessages(data.data || []);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    loadMessages();
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const resolveMessage = async (id) => {
    try {
      await contactAPI.resolve(id);
      loadMessages();
    } catch {
      alert('Failed to resolve message');
    }
  };

  return (
    <>
      <h4 className="fw-bold mb-3">Contact Messages</h4>
      {loading ? (
        <p className="text-muted">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-muted">No messages yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white rounded shadow-sm">
            <thead className="table-success">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.subject}</td>
                  <td className="small text-muted" style={{ maxWidth: '280px' }}>{item.message}</td>
                  <td>
                    <span className={`badge ${item.status === 'resolved' ? 'bg-success' : 'bg-secondary'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {item.status !== 'resolved' && (
                      <button className="btn btn-sm btn-outline-success" onClick={() => resolveMessage(item._id)}>
                        Mark Resolved
                      </button>
                    )}
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
