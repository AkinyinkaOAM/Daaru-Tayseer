import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { academicRecordsAPI, studentsAPI } from '../../services/api';

const TYPES = ['assignment', 'classwork', 'activity'];

export default function AcademicRecordsManage() {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const [{ data: recordsData }, { data: studentsData }] = await Promise.all([
        academicRecordsAPI.getAll({ limit: 100 }),
        studentsAPI.getAll({ limit: 200 }),
      ]);
      setRecords(recordsData.data || []);
      setStudents(studentsData.data || []);
    } catch {
      setRecords([]);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    loadData();
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const onSubmit = async (formData) => {
    try {
      await academicRecordsAPI.create(formData);
      reset();
      loadData();
    } catch {
      alert('Failed to save academic record');
    }
  };

  const removeRecord = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await academicRecordsAPI.delete(id);
      loadData();
    } catch {
      alert('Failed to delete record');
    }
  };

  return (
    <>
      <h4 className="fw-bold mb-3">Assignments, Classwork, and Activities</h4>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h6 className="fw-bold mb-3">Create Record</h6>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-2">
              <div className="col-md-4">
                <select className="form-select" {...register('student', { required: true })}>
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.firstName} {student.lastName} ({student.admissionNumber})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <select className="form-select" {...register('type', { required: true })}>
                  <option value="">Record Type</option>
                  {TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-5">
                <input className="form-control" placeholder="Title" {...register('title', { required: true })} />
              </div>
              <div className="col-md-4">
                <input className="form-control" placeholder="Subject" {...register('subject')} />
              </div>
              <div className="col-md-4">
                <input className="form-control" placeholder="Term" {...register('term')} />
              </div>
              <div className="col-md-4">
                <input className="form-control" placeholder="Session (e.g. 2025/2026)" {...register('session')} />
              </div>
              <div className="col-12">
                <textarea className="form-control" rows="3" placeholder="Description" {...register('description')} />
              </div>
              <div className="col-12">
                <button className="btn btn-success rounded-pill" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {loading ? (
        <p className="text-muted">Loading records...</p>
      ) : records.length === 0 ? (
        <p className="text-muted">No records yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white rounded shadow-sm">
            <thead className="table-success">
              <tr>
                <th>Student</th>
                <th>Type</th>
                <th>Title</th>
                <th>Subject</th>
                <th>Term</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record._id}>
                  <td>{record.student?.firstName} {record.student?.lastName}</td>
                  <td className="text-capitalize">{record.type}</td>
                  <td>{record.title}</td>
                  <td>{record.subject || '—'}</td>
                  <td>{record.term || '—'}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => removeRecord(record._id)}>
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
