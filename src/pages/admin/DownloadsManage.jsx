import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { downloadsAPI } from '../../services/api';

export default function DownloadsManage() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(false);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const loadDownloads = async () => {
    setLoading(true);
    try {
      const { data } = await downloadsAPI.getAdmin({ limit: 100 });
      setDownloads(data.data || []);
    } catch {
      setDownloads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDownloads();
  }, []);

  const onSubmit = async (formData) => {
    try {
      await downloadsAPI.create({
        ...formData,
        isPublished: formData.isPublished === 'true',
      });
      reset();
      loadDownloads();
    } catch {
      alert('Failed to create download');
    }
  };

  const onUploadFile = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = form.elements.namedItem('file');
    const titleInput = form.elements.namedItem('title');
    const categoryInput = form.elements.namedItem('category');
    const descriptionInput = form.elements.namedItem('description');
    const publishInput = form.elements.namedItem('isPublished');

    const file = fileInput?.files?.[0];
    if (!file || !titleInput?.value) {
      alert('Please provide a title and select a file.');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('title', titleInput.value);
    uploadFormData.append('category', categoryInput?.value || 'other');
    uploadFormData.append('description', descriptionInput?.value || '');
    uploadFormData.append('isPublished', publishInput?.value || 'true');

    setUploadingFile(true);
    try {
      await downloadsAPI.upload(uploadFormData);
      form.reset();
      loadDownloads();
    } catch {
      alert('Failed to upload file resource');
    } finally {
      setUploadingFile(false);
    }
  };

  const removeDownload = async (id) => {
    if (!window.confirm('Delete this download resource?')) return;
    try {
      await downloadsAPI.delete(id);
      loadDownloads();
    } catch {
      alert('Failed to delete resource');
    }
  };

  return (
    <>
      <h4 className="fw-bold mb-3">Downloads Management</h4>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h6 className="fw-bold mb-3">Upload Download Resource (URL)</h6>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-2">
              <div className="col-md-4">
                <input className="form-control" placeholder="Title" {...register('title', { required: true })} />
              </div>
              <div className="col-md-4">
                <select className="form-select" {...register('category')}>
                  <option value="admission">Admission</option>
                  <option value="calendar">Calendar</option>
                  <option value="handbook">Handbook</option>
                  <option value="timetable">Timetable</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="col-md-4">
                <select className="form-select" {...register('isPublished')}>
                  <option value="true">Published</option>
                  <option value="false">Draft</option>
                </select>
              </div>
              <div className="col-12">
                <input className="form-control" placeholder="File URL" {...register('fileUrl', { required: true })} />
              </div>
              <div className="col-12">
                <textarea className="form-control" rows="2" placeholder="Description" {...register('description')} />
              </div>
              <div className="col-12">
                <button className="btn btn-success rounded-pill" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h6 className="fw-bold mb-3">Upload Download Resource (File)</h6>
          <form onSubmit={onUploadFile}>
            <div className="row g-2">
              <div className="col-md-4">
                <input name="title" className="form-control" placeholder="Title" required />
              </div>
              <div className="col-md-3">
                <select name="category" className="form-select">
                  <option value="admission">Admission</option>
                  <option value="calendar">Calendar</option>
                  <option value="handbook">Handbook</option>
                  <option value="timetable">Timetable</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="col-md-3">
                <select name="isPublished" className="form-select">
                  <option value="true">Published</option>
                  <option value="false">Draft</option>
                </select>
              </div>
              <div className="col-md-2">
                <input name="file" type="file" className="form-control" required />
              </div>
              <div className="col-12">
                <textarea name="description" className="form-control" rows="2" placeholder="Description" />
              </div>
              <div className="col-12">
                <button className="btn btn-success rounded-pill" disabled={uploadingFile}>
                  {uploadingFile ? 'Uploading...' : 'Upload File'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {loading ? (
        <p className="text-muted">Loading resources...</p>
      ) : downloads.length === 0 ? (
        <p className="text-muted">No resources yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white rounded shadow-sm">
            <thead className="table-success">
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {downloads.map((item) => (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td className="text-capitalize">{item.category}</td>
                  <td>
                    <span className={`badge ${item.isPublished ? 'bg-success' : 'bg-secondary'}`}>
                      {item.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <a href={item.fileUrl} target="_blank" rel="noreferrer" className="small">Open</a>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => removeDownload(item._id)}>
                      Delete
                    </button>
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
