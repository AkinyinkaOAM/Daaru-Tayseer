import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { newsEventsAPI } from '../../services/api';

export default function NewsEventsManage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const loadItems = async () => {
    setLoading(true);
    try {
      const { data } = await newsEventsAPI.getAdmin({ limit: 100 });
      setItems(data.data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const onSubmit = async (formData) => {
    try {
      await newsEventsAPI.create({
        ...formData,
        isPublished: formData.isPublished === 'true',
      });
      reset();
      loadItems();
    } catch {
      alert('Failed to create update');
    }
  };

  const togglePublish = async (item) => {
    try {
      await newsEventsAPI.update(item._id, { isPublished: !item.isPublished });
      loadItems();
    } catch {
      alert('Failed to update publish status');
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm('Delete this update?')) return;
    try {
      await newsEventsAPI.delete(id);
      loadItems();
    } catch {
      alert('Failed to delete update');
    }
  };

  return (
    <>
      <h4 className="fw-bold mb-3">News and Events Management</h4>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h6 className="fw-bold mb-3">Publish Update</h6>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-2">
              <div className="col-md-5">
                <input className="form-control" placeholder="Title" {...register('title', { required: true })} />
              </div>
              <div className="col-md-3">
                <select className="form-select" {...register('category')}>
                  <option value="news">News</option>
                  <option value="event">Event</option>
                  <option value="holiday">Holiday</option>
                </select>
              </div>
              <div className="col-md-4">
                <select className="form-select" {...register('isPublished')}>
                  <option value="true">Published</option>
                  <option value="false">Draft</option>
                </select>
              </div>
              <div className="col-12">
                <input className="form-control" placeholder="Summary" {...register('summary')} />
              </div>
              <div className="col-12">
                <textarea className="form-control" rows="3" placeholder="Content" {...register('content', { required: true })} />
              </div>
              <div className="col-12">
                <button className="btn btn-success rounded-pill" disabled={isSubmitting}>
                  {isSubmitting ? 'Publishing...' : 'Publish'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {loading ? (
        <p className="text-muted">Loading updates...</p>
      ) : items.length === 0 ? (
        <p className="text-muted">No updates yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white rounded shadow-sm">
            <thead className="table-success">
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="fw-medium">{item.title}</div>
                    <div className="small text-muted">{item.summary || 'No summary'}</div>
                  </td>
                  <td className="text-capitalize">{item.category}</td>
                  <td>
                    <span className={`badge ${item.isPublished ? 'bg-success' : 'bg-secondary'}`}>
                      {item.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-success" onClick={() => togglePublish(item)}>
                        {item.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(item._id)}>
                        Delete
                      </button>
                    </div>
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
