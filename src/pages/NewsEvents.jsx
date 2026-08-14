import { useEffect, useState } from 'react';
import { newsEventsAPI } from '../services/api';

export default function NewsEvents() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await newsEventsAPI.getPublic({ limit: 20 });
        setItems(data.data || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <>
      <section className="hero-surface text-white py-5">
        <div className="container">
          <h1 className="fw-bold mb-2">News and Events</h1>
          <p className="mb-0">Latest school updates, upcoming events, and notices.</p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          {loading ? (
            <p className="text-muted mb-0">Loading updates...</p>
          ) : items.length === 0 ? (
            <p className="text-muted mb-0">No updates have been published yet.</p>
          ) : (
            <div className="row g-3">
              {items.map((item) => (
                <div className="col-12" key={item._id}>
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between flex-wrap gap-2 mb-2">
                        <h5 className="fw-bold mb-0">{item.title}</h5>
                        <span className="badge bg-success text-capitalize">{item.category}</span>
                      </div>
                      {item.summary && <p className="text-muted mb-2">{item.summary}</p>}
                      <p className="mb-0 text-muted small">{item.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
