import { useState, useEffect } from 'react';
import { studentsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FaUserGraduate, FaChalkboardTeacher, FaStar, FaSchool } from 'react-icons/fa';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ students: 0, teachers: 0, classes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await studentsAPI.getAll({ limit: 1 });
        setStats({
          students: data.pagination?.total || 0,
          teachers: 0,
          classes: 0,
        });
      } catch {
        // Backend not connected — show placeholder
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Students', value: stats.students, icon: <FaUserGraduate size={28} />, color: 'bg-primary' },
    { label: 'Teachers', value: stats.teachers, icon: <FaChalkboardTeacher size={28} />, color: 'bg-success' },
    { label: 'Classes', value: stats.classes, icon: <FaSchool size={28} />, color: 'bg-warning' },
    { label: 'Terms / Year', value: 3, icon: <FaStar size={28} />, color: 'bg-info' },
  ];

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Dashboard</h4>
        <span className="text-muted small">
          Welcome, {user?.email}
        </span>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status" />
        </div>
      ) : (
        <div className="row g-3 mb-4">
          {cards.map((card, i) => (
            <div className="col-md-3 col-sm-6" key={i}>
              <div className={`card border-0 text-white ${card.color} shadow-sm`}>
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h2 className="fw-bold mb-0">{card.value}</h2>
                    <p className="small opacity-75 mb-0">{card.label}</p>
                  </div>
                  <div className="opacity-50">{card.icon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h6 className="fw-bold mb-3">Quick Actions</h6>
          <div className="d-flex flex-wrap gap-2">
            <a href="/admin/students/create" className="btn btn-success btn-sm rounded-pill">
              ➕ Create New Student
            </a>
            <a href="/admin/students" className="btn btn-outline-success btn-sm rounded-pill">
              📋 View All Students
            </a>
            <a href="/admin/scores" className="btn btn-outline-success btn-sm rounded-pill">
              ⭐ Upload Scores
            </a>
            <a href="/admin/admissions" className="btn btn-outline-success btn-sm rounded-pill">
              📝 Admissions
            </a>
            <a href="/admin/news-events" className="btn btn-outline-success btn-sm rounded-pill">
              📰 News & Events
            </a>
            <a href="/admin/downloads" className="btn btn-outline-success btn-sm rounded-pill">
              📥 Downloads
            </a>
            <a href="/admin/contact-messages" className="btn btn-outline-success btn-sm rounded-pill">
              ✉️ Contact Messages
            </a>
            <a href="/admin/academic-records" className="btn btn-outline-success btn-sm rounded-pill">
              📚 Academic Records
            </a>
            <a href="/admin/payments" className="btn btn-outline-success btn-sm rounded-pill">
              💳 Payment History
            </a>
            <a href="/admin/broadsheet" className="btn btn-outline-success btn-sm rounded-pill">
              📊 Broadsheet
            </a>
            {['super_admin', 'super_super_admin'].includes(user?.role) && (
              <a href="/admin/admins" className="btn btn-outline-success btn-sm rounded-pill">
                👥 Manage Admins
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

