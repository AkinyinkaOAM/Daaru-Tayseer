import { useState, useEffect } from 'react';
import { galleryAPI } from '../services/api';
import { FaImage, FaSpinner } from 'react-icons/fa';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await galleryAPI.getAll();
        setImages(data.data || []);
      } catch {
        // If the backend is not connected, show placeholder
        setError('Gallery is being updated. Check back soon!');
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <>
      <section className="bg-success text-white py-5">
        <div className="container text-center">
          <h1 className="fw-bold">School Gallery</h1>
          <p className="fs-5 mt-2 opacity-90">
            Moments captured from our school community
          </p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          {loading && (
            <div className="text-center py-5">
              <FaSpinner className="text-success fa-spin" size={32} />
              <p className="text-muted mt-2">Loading gallery...</p>
            </div>
          )}

          {!loading && error && images.length === 0 && (
            <div className="text-center py-5">
              <FaImage size={64} className="text-muted mb-3" />
              <h5 className="text-muted">No Images Yet</h5>
              <p className="text-muted">{error}</p>
            </div>
          )}

          {!loading && images.length > 0 && (
            <div className="row g-4">
              {images.map((img) => (
                <div className="col-md-4 col-sm-6" key={img._id || img.public_id}>
                  <div className="card border-0 shadow-sm h-100 overflow-hidden">
                    <img
                      src={img.imageUrl}
                      alt={img.title || 'Gallery image'}
                      className="card-img-top"
                      style={{ height: '220px', objectFit: 'cover' }}
                    />
                    {img.title && (
                      <div className="card-body py-2">
                        <p className="card-text small mb-0">{img.title}</p>
                      </div>
                    )}
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

