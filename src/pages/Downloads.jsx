import { useEffect, useState } from 'react';
import { downloadsAPI } from '../services/api';

export default function Downloads() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const { data } = await downloadsAPI.getPublic({ limit: 50 });
        setDocs(data.data || []);
      } catch {
        setDocs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, []);

  return (
    <>
      <section className="hero-surface text-white py-5">
        <div className="container">
          <h1 className="fw-bold mb-2">Downloads</h1>
          <p className="mb-0">Admission forms, handbooks, timetables, and school calendar.</p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          {loading ? (
            <p className="text-muted mb-0">Loading resources...</p>
          ) : docs.length === 0 ? (
            <p className="text-muted mb-0">No downloadable resources are available yet.</p>
          ) : (
            <div className="row g-3">
              {docs.map((doc) => (
                <div className="col-md-6" key={doc._id}>
                  <div className="card border-0 shadow-sm">
                    <div className="card-body d-flex justify-content-between align-items-center gap-2">
                      <div>
                        <p className="fw-medium mb-1">{doc.title}</p>
                        {doc.description && <p className="text-muted small mb-0">{doc.description}</p>}
                      </div>
                      <a className="btn btn-outline-success btn-sm rounded-pill" href={doc.fileUrl} target="_blank" rel="noreferrer">
                        Download
                      </a>
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
