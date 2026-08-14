import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { paymentsAPI, reportsAPI, studentsAPI } from '../../services/api';

export default function PaymentsManage() {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportFilters, setExportFilters] = useState({
    grade: '',
    term: '',
    session: '',
    paymentMethod: '',
    fromDate: '',
    toDate: '',
  });
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const loadData = async ({ showLoading = true } = {}) => {
    if (showLoading) setLoading(true);
    try {
      const [{ data: paymentsData }, { data: studentsData }] = await Promise.all([
        paymentsAPI.getAll({ limit: 100 }),
        studentsAPI.getAll({ limit: 200 }),
      ]);
      setPayments(paymentsData.data || []);
      setStudents(studentsData.data || []);
    } catch {
      setPayments([]);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      loadData({ showLoading: false });
    });
  }, []);

  const onSubmit = async (formData) => {
    try {
      await paymentsAPI.create({
        ...formData,
        amount: Number(formData.amount || 0),
      });
      reset();
      loadData();
    } catch {
      alert('Failed to save payment');
    }
  };

  const exportCsv = () => {
    if (!payments.length) return;
    reportsAPI.exportPaymentsCsv(exportFilters).then(({ data }) => {
      const url = URL.createObjectURL(new Blob([data], { type: 'text/csv;charset=utf-8;' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'payment-history.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }).catch(() => alert('Failed to export payments CSV'));
  };

  const downloadReceipt = async (id) => {
    try {
      const { data } = await paymentsAPI.getReceipt(id);
      const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payment-receipt-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download receipt');
    }
  };

  const printAsPdf = () => {
    window.print();
  };

  return (
    <>
      <h4 className="fw-bold mb-3">Payment History Management</h4>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h6 className="fw-bold mb-3">Add Payment Record</h6>
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
                <input type="number" step="0.01" className="form-control" placeholder="Amount" {...register('amount', { required: true })} />
              </div>
              <div className="col-md-3">
                <select className="form-select" {...register('paymentMethod')}>
                  <option value="cash">Cash</option>
                  <option value="transfer">Transfer</option>
                  <option value="card">Card</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="col-md-2">
                <input className="form-control" placeholder="Term" {...register('term')} />
              </div>
              <div className="col-md-6">
                <input className="form-control" placeholder="Session" {...register('session')} />
              </div>
              <div className="col-md-6">
                <input className="form-control" placeholder="Reference" {...register('reference')} />
              </div>
              <div className="col-12">
                <textarea rows="2" className="form-control" placeholder="Note" {...register('note')} />
              </div>
              <div className="col-12">
                <button className="btn btn-success rounded-pill" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Payment'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="d-flex gap-2 mb-3">
        <button className="btn btn-outline-success btn-sm" onClick={exportCsv} disabled={!payments.length}>Export CSV</button>
        <button className="btn btn-outline-dark btn-sm" onClick={printAsPdf} disabled={!payments.length}>Print / Save PDF</button>
      </div>

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body p-3">
          <h6 className="fw-bold mb-2">CSV Export Filters</h6>
          <div className="row g-2">
            <div className="col-md-2">
              <input
                className="form-control form-control-sm"
                placeholder="Grade"
                value={exportFilters.grade}
                onChange={(event) => setExportFilters((prev) => ({ ...prev, grade: event.target.value }))}
              />
            </div>
            <div className="col-md-2">
              <input
                className="form-control form-control-sm"
                placeholder="Term"
                value={exportFilters.term}
                onChange={(event) => setExportFilters((prev) => ({ ...prev, term: event.target.value }))}
              />
            </div>
            <div className="col-md-2">
              <input
                className="form-control form-control-sm"
                placeholder="Session"
                value={exportFilters.session}
                onChange={(event) => setExportFilters((prev) => ({ ...prev, session: event.target.value }))}
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select form-select-sm"
                value={exportFilters.paymentMethod}
                onChange={(event) => setExportFilters((prev) => ({ ...prev, paymentMethod: event.target.value }))}
              >
                <option value="">All methods</option>
                <option value="cash">Cash</option>
                <option value="transfer">Transfer</option>
                <option value="card">Card</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control form-control-sm"
                value={exportFilters.fromDate}
                onChange={(event) => setExportFilters((prev) => ({ ...prev, fromDate: event.target.value }))}
              />
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control form-control-sm"
                value={exportFilters.toDate}
                onChange={(event) => setExportFilters((prev) => ({ ...prev, toDate: event.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-muted">Loading payments...</p>
      ) : payments.length === 0 ? (
        <p className="text-muted">No payment records yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white rounded shadow-sm">
            <thead className="table-success">
              <tr>
                <th>Student</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Term</th>
                <th>Session</th>
                <th>Date</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.student?.firstName} {payment.student?.lastName}</td>
                  <td>{Number(payment.amount || 0).toLocaleString()}</td>
                  <td className="text-capitalize">{payment.paymentMethod}</td>
                  <td>{payment.term || '—'}</td>
                  <td>{payment.session || '—'}</td>
                  <td>{new Date(payment.paymentDate || payment.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-success" onClick={() => downloadReceipt(payment._id)}>
                      Download
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
