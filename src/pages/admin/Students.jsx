import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { studentsAPI } from '../../services/api';
import { FaSearch, FaTrash, FaSpinner } from 'react-icons/fa';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await studentsAPI.getAll({ search, page, limit });
      setStudents(data.data || []);
      setTotal(data.pagination?.total || 0);
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchStudents();
    }
  }, [fetchStudents]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete student "${name}"? This cannot be undone.`)) return;
    try {
      await studentsAPI.delete(id);
      fetchStudents();
    } catch {
      alert('Failed to delete student');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h4 className="fw-bold mb-0">All Students</h4>
        <Link to="/admin/students/create" className="btn btn-success btn-sm rounded-pill">
          + Create Student
        </Link>
      </div>

      {/* Search */}
      <div className="input-group mb-3">
        <span className="input-group-text bg-white"><FaSearch className="text-muted" /></span>
        <input
          type="text"
          className="form-control"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {loading ? (
        <div className="text-center py-5">
          <FaSpinner className="text-success fa-spin" size={32} />
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p>No students found.</p>
          <Link to="/admin/students/create" className="btn btn-success btn-sm rounded-pill">
            Create First Student
          </Link>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover align-middle bg-white rounded shadow-sm">
              <thead className="table-success">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Admission</th>
                  <th>Parent</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s._id}>
                    <td className="text-muted">{(page - 1) * limit + i + 1}</td>
                    <td className="fw-medium">{s.firstName && s.lastName ? `${s.firstName} ${s.lastName}` : s.name || '—'}</td>
                    <td>{s.grade || s.studentClass || '—'}</td>
                    <td>{s.admissionNumber || '—'}</td>
                    <td>{s.parentName || '—'}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-danger me-1"
                        title="Delete"
                        onClick={() => handleDelete(s._id, s.firstName && s.lastName ? `${s.firstName} ${s.lastName}` : s.name)}
                      >
                        <FaTrash size={12} />
                      </button>
                      <span className="text-muted small">(edit via backend)</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center gap-1 mt-3">
              <button
                className="btn btn-sm btn-outline-success"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <span className="btn btn-sm btn-success disabled">
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-sm btn-outline-success"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}

          <p className="text-muted small mt-2">
            Total: <strong>{total}</strong> student(s)
          </p>
        </>
      )}
    </>
  );
}

