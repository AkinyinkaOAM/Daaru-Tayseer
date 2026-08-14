import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaTachometerAlt, FaUserGraduate, FaPlusCircle,
  FaStar, FaUsersCog, FaSignOutAlt, FaBars, FaTimes, FaRegNewspaper, FaDownload, FaEnvelopeOpenText, FaTasks, FaMoneyBillWave, FaTable, FaHistory,
} from 'react-icons/fa';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt />, roles: ['admin', 'super_admin', 'super_super_admin'] },
  { label: 'Create Student', path: '/admin/students/create', icon: <FaPlusCircle />, roles: ['admin', 'super_admin', 'super_super_admin'] },
  { label: 'All Students', path: '/admin/students', icon: <FaUserGraduate />, roles: ['admin', 'super_admin', 'super_super_admin'] },
  { label: 'Upload Scores', path: '/admin/scores', icon: <FaStar />, roles: ['admin', 'super_admin', 'super_super_admin'] },
  { label: 'Admissions', path: '/admin/admissions', icon: <FaUserGraduate />, roles: ['admin', 'super_admin', 'super_super_admin'] },
  { label: 'News & Events', path: '/admin/news-events', icon: <FaRegNewspaper />, roles: ['admin', 'super_admin', 'super_super_admin'] },
  { label: 'Downloads', path: '/admin/downloads', icon: <FaDownload />, roles: ['admin', 'super_admin', 'super_super_admin'] },
  { label: 'Academic Records', path: '/admin/academic-records', icon: <FaTasks />, roles: ['admin', 'super_admin', 'super_super_admin'] },
  { label: 'Payments', path: '/admin/payments', icon: <FaMoneyBillWave />, roles: ['admin', 'super_admin', 'super_super_admin'] },
  { label: 'Broadsheet', path: '/admin/broadsheet', icon: <FaTable />, roles: ['admin', 'super_admin', 'super_super_admin'] },
  { label: 'Contact Messages', path: '/admin/contact-messages', icon: <FaEnvelopeOpenText />, roles: ['admin', 'super_admin', 'super_super_admin'] },
  { label: 'Users', path: '/admin/users', icon: <FaUsersCog />, roles: ['super_admin', 'super_super_admin'] },
  { label: 'Audit Logs', path: '/admin/audit-logs', icon: <FaHistory />, roles: ['super_admin', 'super_super_admin'] },
  { label: 'Manage Admins', path: '/admin/admins', icon: <FaUsersCog />, roles: ['super_admin', 'super_super_admin'] },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const visibleItems = SIDEBAR_ITEMS.filter(
    (item) => item.roles.includes(user?.role) || item.roles.includes('admin')
  );

  return (
    <div className="d-flex min-vh-100" style={{ paddingTop: '56px' }}>
      {/* Mobile toggle */}
      <button
        className="btn btn-dark position-fixed d-lg-none"
        style={{ top: '64px', left: '8px', zIndex: 1050 }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`bg-dark text-white flex-shrink-0 p-3 ${sidebarOpen ? 'd-block' : 'd-none'} d-lg-block`}
        style={{ width: '250px', minHeight: 'calc(100vh - 56px)' }}
      >
        <h6 className="text-white-50 small text-uppercase mb-3 px-2">
          <span className="arabic-text">دار تيسير</span> Admin
        </h6>
        <hr className="border-secondary" />
        <ul className="nav nav-pills flex-column gap-1">
          {visibleItems.map((item) => (
            <li className="nav-item" key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? 'active bg-success' : ''}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <span className="me-2">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
          <li className="nav-item mt-3">
            <button
              className="nav-link text-white-50 btn btn-link text-start w-100"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </button>
          </li>
        </ul>
        <hr className="border-secondary" />
        <p className="text-white-50 small px-2 mb-0">
          Logged in as: <strong>{user?.email}</strong>
          <br />
          Role: <span className="text-capitalize">{user?.role?.replace(/_/g, ' ')}</span>
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 bg-light p-3 p-md-4 d-flex flex-column" style={{ overflowX: 'auto' }}>
        <div className="flex-grow-1">
          <Outlet />
        </div>
        <p className="small text-muted mt-4 mb-0">Powered by: Dev-OAMs</p>
      </div>
    </div>
  );
}

