import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { reportsAPI } from '../../services/api';

export default function Broadsheet() {
  const [result, setResult] = useState(null);
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      term: 'First Term',
      session: '2025/2026',
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { data } = await reportsAPI.getBroadsheet(values);
      setResult(data.data);
      setQuery(values);
    } catch {
      setResult(null);
      setQuery(null);
      alert('Failed to generate broadsheet');
    } finally {
      setLoading(false);
    }
  };

  const exportCsv = () => {
    if (!query) return;
    reportsAPI.exportBroadsheetCsv(query).then(({ data }) => {
      const url = URL.createObjectURL(new Blob([data], { type: 'text/csv;charset=utf-8;' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `broadsheet-${query.grade}-${query.term}-${query.session}.csv`.replace(/\s+/g, '_'));
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }).catch(() => alert('Failed to export CSV'));
  };

  const printAsPdf = () => {
    window.print();
  };

  return (
    <>
      <h4 className="fw-bold mb-3">Broadsheet Generator</h4>
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <form className="row g-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="col-md-4">
              <input className="form-control" placeholder="Class/Grade (e.g. JSS 1)" {...register('grade', { required: true })} />
            </div>
            <div className="col-md-3">
              <select className="form-select" {...register('term', { required: true })}>
                <option value="First Term">First Term</option>
                <option value="Second Term">Second Term</option>
                <option value="Third Term">Third Term</option>
              </select>
            </div>
            <div className="col-md-3">
              <input className="form-control" placeholder="Session" {...register('session', { required: true })} />
            </div>
            <div className="col-md-2">
              <button className="btn btn-success w-100" disabled={loading}>{loading ? '...' : 'Generate'}</button>
            </div>
          </form>
        </div>
      </div>

      {result && (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <h6 className="fw-bold mb-0">Broadsheet Result ({result.totalStudents} students)</h6>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-success btn-sm" onClick={exportCsv}>Export CSV</button>
                <button className="btn btn-outline-dark btn-sm" onClick={printAsPdf}>Print / Save PDF</button>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>Admission</th>
                    <th>Student</th>
                    <th>Average</th>
                    <th>Total</th>
                    <th>Subjects</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row) => (
                    <tr key={row.studentId}>
                      <td>{row.admissionNumber}</td>
                      <td>{row.fullName}</td>
                      <td>{row.average}</td>
                      <td>{row.total}</td>
                      <td>{row.subjects.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
